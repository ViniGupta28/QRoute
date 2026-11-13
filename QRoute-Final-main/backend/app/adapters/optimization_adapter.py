import math
import random
import time
from typing import List, Dict, Any, Optional
import numpy as np

from optimization.config import OptimizationConfig, ObjectiveWeights
from optimization.problem import VRPProblem as CoreVRPProblem
from optimization.entities import (
    Customer as CoreCustomer,
    Vehicle as CoreVehicle,
    VehicleState,
)
from optimization.adaptive_qpso import AdaptiveQPSO
from optimization.qpso import QPSO
from optimization.reoptimization import ReOptimizer
from optimization.baselines import (
    DijkstraBaseline,
    AStarBaseline,
    PSOOptimizer,
    GAOptimizer,
    ACOOptimizer,
)
from backend.app.adapters.mapbox_adapter import mapbox_adapter


class VRPProblem:
    """Problem request wrapper bridging the web API payloads with the core optimizer."""
    def __init__(
        self,
        depot: Dict[str, float],
        vehicles: List[Dict[str, Any]],
        customers: List[Dict[str, Any]],
        objective_weights: Dict[str, float],
        algorithm: str = "adaptive_d_qpso",
        population_size: int = 30,
        max_iterations: int = 60,
        random_seed: int = 42,
        use_adaptive_alpha: bool = True,
        use_local_search: bool = True,
        use_repair: bool = True
    ):
        self.depot = depot
        self.vehicles = vehicles
        self.customers = customers
        self.objective_weights = objective_weights
        self.algorithm = algorithm.lower().replace("-", "_").replace(" ", "_")
        self.population_size = population_size
        self.max_iterations = max_iterations
        self.random_seed = random_seed
        self.use_adaptive_alpha = use_adaptive_alpha
        self.use_local_search = use_local_search
        self.use_repair = use_repair


class OptimizationResult:
    """Canonical result object returned by the adapter."""
    def __init__(
        self,
        algorithm: str,
        best_fitness: float,
        runtime_ms: float,
        feasible: bool,
        routes: List[Dict[str, Any]],
        iterations: List[Dict[str, Any]],
        metrics: Dict[str, Any]
    ):
        self.algorithm = algorithm
        self.best_fitness = best_fitness
        self.runtime_ms = runtime_ms
        self.feasible = feasible
        self.routes = routes
        self.iterations = iterations
        self.metrics = metrics


class OptimizationAdapter:
    """Connects the REST API layer to the core VRP optimization solvers."""

    @staticmethod
    def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        R = 6371.0  # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2.0)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0)**2
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return R * c

    def _select_optimizer_class(self, algo_name: str):
        mapping = {
            "adaptive_d_qpso": AdaptiveQPSO,
            "adaptive_qpso": AdaptiveQPSO,
            "qpso": QPSO,
            "standard_qpso": QPSO,
            "pso": PSOOptimizer,
            "ga": GAOptimizer,
            "aco": ACOOptimizer,
            "dijkstra": DijkstraBaseline,
            "astar": AStarBaseline,
        }
        for key, cls in mapping.items():
            if key in algo_name:
                return cls
        return AdaptiveQPSO

    def build_core_problem(self, problem: VRPProblem) -> CoreVRPProblem:
        """Translate API problem payload into internal VRPProblem instance."""
        n_cust = len(problem.customers)

        # 1. Map API customers to core entities
        cust_entities = []
        for idx, c in enumerate(problem.customers):
            c_lat = c.get("location", {}).get("lat", c.get("lat", 23.23))
            c_lon = c.get("location", {}).get("lon", c.get("lon", 77.43))
            demand = float(c.get("demand", 10.0))
            cust_entities.append(
                CoreCustomer(
                    id=idx,
                    x=c_lat,
                    y=c_lon,
                    demand=demand,
                    service_time=float(c.get("service_time_sec", 300)) / 60.0,
                    time_window_open=float(c.get("time_window_open", 0.0)),
                    time_window_close=float(c.get("time_window_close", float("inf"))),
                    priority=int(c.get("priority", 1)),
                    node_id=idx + 1,
                )
            )

        # 2. Map API vehicles to core entities
        veh_entities = []
        for idx, v in enumerate(problem.vehicles):
            veh_entities.append(
                CoreVehicle(
                    id=idx,
                    capacity=float(v.get("capacity", 100.0)),
                    max_duration=float(v.get("max_duration_min", 0.0)),
                    speed_factor=1.0,
                    available=True,
                )
            )

        # 3. Build Distance and Travel Time Matrices (Depot is index 0)
        n_total = n_cust + 1
        all_coords = [(problem.depot["lat"], problem.depot["lon"])] + [
            (c.x, c.y) for c in cust_entities
        ]

        dist_mat = np.zeros((n_total, n_total))
        for i in range(n_total):
            for j in range(n_total):
                if i != j:
                    dist_mat[i, j] = self._haversine_km(
                        all_coords[i][0], all_coords[i][1],
                        all_coords[j][0], all_coords[j][1]
                    )

        # City speed assumption: 35 km/h
        tt_mat = (dist_mat / 35.0) * 60.0  # minutes

        return CoreVRPProblem(
            problem_type="cvrp",
            customers=cust_entities,
            vehicles=veh_entities,
            depot_id=0,
            depot_x=problem.depot["lat"],
            depot_y=problem.depot["lon"],
            distance_matrix=dist_mat,
            travel_time_matrix=tt_mat,
        )

    def _build_routes_output(
        self,
        problem: VRPProblem,
        solver_result: Any
    ) -> tuple[list[dict[str, Any]], float, float]:
        """Convert solver route assignments into snapped GeoJSON features via Mapbox."""
        routes_output = []
        total_dist_km = 0.0
        total_time_min = 0.0

        for v_idx, v in enumerate(problem.vehicles):
            assigned_indices = solver_result.vehicle_assignments.get(v_idx, [])
            if not assigned_indices:
                continue

            assigned_cids = [
                problem.customers[idx]["id"]
                for idx in assigned_indices
                if idx < len(problem.customers)
            ]

            waypoint_coords = [[problem.depot["lon"], problem.depot["lat"]]]
            for idx in assigned_indices:
                if idx < len(problem.customers):
                    c_info = problem.customers[idx]
                    c_lat = c_info.get("location", {}).get("lat", c_info.get("lat"))
                    c_lon = c_info.get("location", {}).get("lon", c_info.get("lon"))
                    waypoint_coords.append([c_lon, c_lat])
            waypoint_coords.append([problem.depot["lon"], problem.depot["lat"]])

            geom_data = mapbox_adapter.get_route_geometry(waypoint_coords)
            route_dist = geom_data["distance_km"]
            route_time = geom_data["duration_min"]

            total_dist_km += route_dist
            total_time_min += route_time

            routes_output.append({
                "vehicle_id": v["id"],
                "customers": assigned_cids,
                "distance_km": round(route_dist, 2),
                "travel_time_min": round(route_time, 2),
                "geometry": {
                    "type": "FeatureCollection",
                    "features": [
                        {
                            "type": "Feature",
                            "geometry": geom_data["geometry"],
                            "properties": {
                                "vehicle_id": v["id"],
                                "mode": problem.algorithm,
                            }
                        }
                    ]
                }
            })

        return routes_output, total_dist_km, total_time_min

    def solve(self, problem: VRPProblem) -> OptimizationResult:
        """Translates API problem definition into internal VRPProblem and runs optimization solver."""
        t_start = time.perf_counter()

        # 1. Build problem
        vrp_instance = self.build_core_problem(problem)

        # 2. Configure Optimizer & Objective Weights
        config = OptimizationConfig(
            population_size=problem.population_size,
            max_iterations=problem.max_iterations,
            random_seed=problem.random_seed,
            use_adaptive_alpha=problem.use_adaptive_alpha,
            use_local_search=problem.use_local_search,
            use_repair=problem.use_repair,
            verbose=False,
        )

        weights = ObjectiveWeights(
            time=float(problem.objective_weights.get("time", 0.4)),
            distance=float(problem.objective_weights.get("distance", 0.3)),
            congestion=float(problem.objective_weights.get("congestion", 0.2)),
            risk=float(problem.objective_weights.get("risk", 0.1)),
        )

        # 3. Execute solver
        solver_class = self._select_optimizer_class(problem.algorithm)
        solver = solver_class(vrp_instance, config, weights)
        solver_result = solver.solve()

        runtime_ms = (time.perf_counter() - t_start) * 1000.0

        # 4. Extract Iteration History
        iterations = []
        if hasattr(solver_result, "convergence") and solver_result.convergence:
            for it_point in solver_result.convergence:
                iterations.append({
                    "iteration": it_point.iteration,
                    "best_fitness": round(it_point.best_fitness, 4),
                    "mean_fitness": round(it_point.mean_fitness, 4),
                    "diversity": round(it_point.diversity, 4),
                    "alpha": round(it_point.alpha, 4),
                })
        else:
            iterations.append({
                "iteration": 1,
                "best_fitness": round(solver_result.objective_value, 4),
                "mean_fitness": round(solver_result.objective_value * 1.1, 4),
                "diversity": 0.0,
                "alpha": 0.5,
            })

        # 5. Extract Vehicle Routes and Build High-Definition Geometries
        routes_output, total_dist_km, total_time_min = self._build_routes_output(problem, solver_result)

        metrics = {
            "distance": round(total_dist_km or solver_result.distance_km, 2),
            "travel_time": round(total_time_min or solver_result.travel_time_min, 2),
            "congestion_cost": round((total_time_min or solver_result.travel_time_min) * 0.2, 2),
            "penalty": 0.0 if solver_result.is_feasible else 1000.0,
            "vehicles_used": len(routes_output),
            "constraint_violations": solver_result.constraint_violations,
            "reroutes": 0,
            "objective_value": round(solver_result.objective_value, 2),
        }

        return OptimizationResult(
            algorithm=problem.algorithm,
            best_fitness=round(solver_result.objective_value, 2),
            runtime_ms=round(runtime_ms, 2),
            feasible=solver_result.is_feasible,
            routes=routes_output,
            iterations=iterations,
            metrics=metrics,
        )

    def reoptimize(
        self,
        problem: VRPProblem,
        vehicle_states: Optional[Dict[int, VehicleState]] = None,
        incidents: Optional[List[Dict[str, Any]]] = None
    ) -> OptimizationResult:
        """Dynamic re-optimization under live traffic incidents using ReOptimizer."""
        t_start = time.perf_counter()

        vrp_instance = self.build_core_problem(problem)

        config = OptimizationConfig(
            population_size=max(15, problem.population_size // 2),
            max_iterations=max(20, problem.max_iterations // 2),
            random_seed=problem.random_seed,
            use_adaptive_alpha=True,
            use_local_search=True,
            use_repair=True,
            verbose=False,
        )

        weights = ObjectiveWeights(
            time=float(problem.objective_weights.get("time", 0.4)),
            distance=float(problem.objective_weights.get("distance", 0.3)),
            congestion=float(problem.objective_weights.get("congestion", 0.2)),
            risk=float(problem.objective_weights.get("risk", 0.1)),
        )

        # Build default vehicle states if none supplied
        if not vehicle_states:
            vehicle_states = {}
            for v_idx in range(len(problem.vehicles)):
                vehicle_states[v_idx] = VehicleState(
                    vehicle_id=v_idx,
                    current_node=0,
                    completed_customers=[],
                    remaining_customers=list(range(len(problem.customers))),
                    current_time=0.0,
                    current_load=0.0
                )

        reoptimizer = ReOptimizer(vrp_instance, config, weights)
        solver_result = reoptimizer.reoptimize(vehicle_states, incidents=incidents)

        runtime_ms = (time.perf_counter() - t_start) * 1000.0

        routes_output, total_dist_km, total_time_min = self._build_routes_output(problem, solver_result)

        metrics = {
            "distance": round(total_dist_km or solver_result.distance_km, 2),
            "travel_time": round(total_time_min or solver_result.travel_time_min, 2),
            "congestion_cost": round((total_time_min or solver_result.travel_time_min) * 0.2, 2),
            "penalty": 0.0 if solver_result.is_feasible else 1000.0,
            "vehicles_used": len(routes_output),
            "constraint_violations": solver_result.constraint_violations,
            "reroutes": 1,
            "objective_value": round(solver_result.objective_value, 2),
            "disruption": reoptimizer.last_disruption_metrics,
        }

        iterations = [
            {
                "iteration": 1,
                "best_fitness": round(solver_result.objective_value, 4),
                "mean_fitness": round(solver_result.objective_value * 1.05, 4),
                "diversity": 0.1,
                "alpha": 0.4,
            }
        ]

        return OptimizationResult(
            algorithm="adaptive_d_qpso_reopt",
            best_fitness=round(solver_result.objective_value, 2),
            runtime_ms=round(runtime_ms, 2),
            feasible=solver_result.is_feasible,
            routes=routes_output,
            iterations=iterations,
            metrics=metrics,
        )


optimization_adapter = OptimizationAdapter()
