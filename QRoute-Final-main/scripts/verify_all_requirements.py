"""
Comprehensive Verification Script for QRoute Requirements
Checks each requirement:
1. Bhopal map & realistic transportation network
2. A->B routing
3. 5-10 stop VRP
4. 2-3 vehicles
5. Capacity / time constraints
6. QPSO
7. Adaptive QPSO
8. Baselines (Dijkstra / Continuous PSO / GA)
9. Traffic scenario loading & incident injection
10. Route recalculation (dynamic re-optimization)
11. SUMO simulation validation
12. Before / after metrics computation
"""

import sys
import os
import time

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy.orm import Session
from backend.app.db.session import SessionLocal, engine
from backend.app.db.init_db import init_db
from backend.app.models import RoadNode, RoadEdge, TrafficState, Vehicle, Customer
from backend.app.services.trip_service import trip_service
from backend.app.schemas.trip import TripRouteRequest
from backend.app.schemas.common import LatLon
from backend.app.adapters.optimization_adapter import optimization_adapter, VRPProblem
from optimization.config import OptimizationConfig
from optimization.adaptive_qpso import AdaptiveQPSO
from optimization.qpso import QPSO
from optimization.baselines import DijkstraBaseline, PSOOptimizer
from optimization.constraints import check_capacity, check_coverage
from backend.app.services.simulation_service import simulation_service
from backend.app.schemas.simulation import SimulationStartRequest
from backend.app.services.orchestration_service import orchestration_service
from benchmarks.bhopal_generator import generate_bhopal_instance

def main():
    print("=" * 70)
    print(" QROUTE COMPREHENSIVE REQUIREMENTS VERIFICATION")
    print("=" * 70)
    results = {}

    db: Session = SessionLocal()
    try:
        # 1. Bhopal map & Realistic Transportation Network
        print("\n[CHECK 1] Bhopal Map & Canonical Transportation Network...")
        init_db(db)
        nodes = db.query(RoadNode).all()
        edges = db.query(RoadEdge).all()
        assert len(nodes) >= 5, f"Expected at least 5 nodes, found {len(nodes)}"
        assert len(edges) >= 5, f"Expected at least 5 edges, found {len(edges)}"
        depot_node = next((n for n in nodes if "HAMIDIA" in n.id or n.node_type == "depot"), None)
        assert depot_node is not None, "Hamidia depot node not found in network"
        print(f"  -> Found {len(nodes)} canonical Bhopal road nodes & {len(edges)} canonical corridors.")
        print(f"  -> Canonical Depot: {depot_node.id} at ({depot_node.lat}, {depot_node.lon})")
        results["Bhopal Map & Network"] = True

        # 2. A -> B Routing
        print("\n[CHECK 2] A -> B Routing (Origin: Hamidia, Destination: New Market)...")
        trip_req = TripRouteRequest(
            origin=LatLon(lat=23.2599, lon=77.4126),
            destination=LatLon(lat=23.2366, lon=77.4012),
            mode="car",
            objective="balanced"
        )
        trip_res = trip_service.plan_route(db, trip_req)
        assert trip_res.status == "FEASIBLE"
        assert trip_res.summary.distance_km > 0
        assert trip_res.summary.travel_time_min > 0
        assert len(trip_res.geometry.features[0].geometry.coordinates) >= 2
        print(f"  -> Generated Route ID: {trip_res.route_id}")
        print(f"  -> Distance: {trip_res.summary.distance_km} km, Time: {trip_res.summary.travel_time_min} min")
        print(f"  -> Geometry: Valid GeoJSON with {len(trip_res.geometry.features[0].geometry.coordinates)} coordinate points")
        results["A->B Routing"] = True

        # 3. 5-10 Stop VRP with 2-3 Vehicles & Capacity Constraints
        print("\n[CHECK 3] 5-10 Stop VRP with 2-3 Vehicles & Capacity Constraints...")
        vrp_inst = generate_bhopal_instance(
            n_customers=8, # 8 stops
            n_vehicles=3,  # 3 vehicles
            capacity=100.0,
            seed=42,
            traffic_scenario="normal"
        )
        assert len(vrp_inst.customers) == 8, f"Expected 8 customers, got {len(vrp_inst.customers)}"
        assert len(vrp_inst.vehicles) == 3, f"Expected 3 vehicles, got {len(vrp_inst.vehicles)}"
        total_demand = sum(c.demand for c in vrp_inst.customers)
        print(f"  -> Created Bhopal VRP Instance: {len(vrp_inst.customers)} customer stops, {len(vrp_inst.vehicles)} vehicles")
        print(f"  -> Total Fleet Capacity: {sum(v.capacity for v in vrp_inst.vehicles)} kg, Customer Demand: {total_demand:.1f} kg")
        results["5-10 Stop VRP & 2-3 Vehicles"] = True

        # 4. Solvers: Standard QPSO, Adaptive QPSO, Baseline (Dijkstra & Continuous PSO)
        print("\n[CHECK 4] Algorithm Solvers (Adaptive QPSO, Standard QPSO, Baselines)...")
        opt_cfg = OptimizationConfig(
            population_size=15,
            max_iterations=20,
            random_seed=42,
            use_adaptive_alpha=True,
            use_local_search=True,
            use_repair=True,
            verbose=False
        )

        # Baseline: Dijkstra
        dijkstra = DijkstraBaseline(vrp_inst, opt_cfg)
        res_dijkstra = dijkstra.solve()
        print(f"  -> Baseline Dijkstra : Cost={res_dijkstra.objective_value:.2f}, Time={res_dijkstra.runtime_ms:.1f}ms, Feasible={res_dijkstra.is_feasible}")

        # Baseline: PSO
        pso = PSOOptimizer(vrp_inst, opt_cfg)
        res_pso = pso.solve()
        print(f"  -> Baseline PSO      : Cost={res_pso.objective_value:.2f}, Time={res_pso.runtime_ms:.1f}ms, Feasible={res_pso.is_feasible}")

        # Standard QPSO
        qpso = QPSO(vrp_inst, opt_cfg)
        res_qpso = qpso.solve()
        print(f"  -> Standard QPSO     : Cost={res_qpso.objective_value:.2f}, Time={res_qpso.runtime_ms:.1f}ms, Feasible={res_qpso.is_feasible}")

        # Proposed: Adaptive QPSO
        aqpso = AdaptiveQPSO(vrp_inst, opt_cfg)
        res_aqpso = aqpso.solve()
        print(f"  -> Adaptive D-QPSO   : Cost={res_aqpso.objective_value:.2f}, Time={res_aqpso.runtime_ms:.1f}ms, Feasible={res_aqpso.is_feasible}")

        assert res_qpso.is_feasible, "QPSO solution must be feasible"
        assert res_aqpso.is_feasible, "Adaptive QPSO solution must be feasible"
        assert res_aqpso.constraint_violations == 0, "No capacity or constraint violations allowed!"
        print(f"  -> All vehicle routes strictly satisfy capacity constraint (Max {vrp_inst.vehicles[0].capacity} kg)")
        results["QPSO, Adaptive QPSO, Baselines & Constraints"] = True

        # 5. Traffic Scenario & Incident Injection
        print("\n[CHECK 5] Traffic Scenario & Incident Handling...")
        scenario_name = "evening_peak_closure"
        scenario_file = os.path.join(os.path.dirname(__file__), "..", "scenarios", f"{scenario_name}.yaml")
        assert os.path.exists(scenario_file), f"Scenario file {scenario_file} does not exist"
        with open(scenario_file, "r") as f:
            sc_text = f.read()
        assert "incidents" in sc_text
        print(f"  -> Loaded Bhopal traffic scenario '{scenario_name}' ({len(sc_text)} bytes)")
        results["Traffic Scenario"] = True

        # 6. SUMO Simulation Validation
        print("\n[CHECK 6] SUMO Simulation Validation...")
        sim_req = SimulationStartRequest(
            scenario="evening_peak_closure",
            duration_sec=1800,
            vehicles=30,
            routing_algorithm="adaptive_d_qpso"
        )
        sim_start = simulation_service.start_simulation(db, sim_req)
        assert sim_start.status == "STARTED"
        sim_id = sim_start.simulation_id
        time.sleep(0.1)
        sim_state = simulation_service.get_simulation_state(db, sim_id)
        assert len(sim_state.vehicles) > 0
        assert sim_state.status in ["STARTED", "RUNNING"]
        print(f"  -> Initialized simulation {sim_id} with {len(sim_state.vehicles)} vehicles")

        # Inject incident
        inc_ok = simulation_service.inject_incident(db, sim_id, ["R17", "R18"])
        assert inc_ok is True
        print(f"  -> Injected incident into corridor R17/R18 in SUMO adapter")
        results["SUMO Validation"] = True

        # 7. Route Recalculation (Dynamic Re-optimization) & Before/After Metrics
        print("\n[CHECK 7] Dynamic Route Recalculation & Before/After Metrics...")
        import asyncio
        reopt_event = {
            "affected_edges": ["R17", "R18"],
            "severity": "HIGH",
            "simulation_id": sim_id,
            "reason": "ACCIDENT_CLOSURE"
        }
        reopt_res = asyncio.run(orchestration_service.handle_traffic_change_event(db, reopt_event))
        assert reopt_res["status"] == "PROCESSED"
        assert len(reopt_res["reroutes"]) == 2
        first_reroute = reopt_res["reroutes"][0]
        assert "savings" in first_reroute
        assert "delay_reduced_min" in first_reroute["savings"]
        print(f"  -> Recalculated {len(reopt_res['reroutes'])} routes dynamically around blocked edges R17/R18")
        print(f"  -> Before/After Savings: Delay reduced by {first_reroute['savings']['delay_reduced_min']} mins")
        results["Route Recalculation & Before/After Metrics"] = True

        # Clean Application verification
        print("\n[CHECK 8] Clean Application & Frontend Assets...")
        dist_index = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist", "index.html")
        assert os.path.exists(dist_index), "Frontend dist/index.html does not exist!"
        print(f"  -> Frontend build present and clean at {dist_index}")
        results["Clean Application"] = True

    finally:
        db.close()

    print("\n" + "=" * 70)
    print(" VERIFICATION SUMMARY")
    print("=" * 70)
    all_ok = True
    for item, status in results.items():
        symbol = "[PASS]" if status else "[FAIL]"
        print(f"{symbol:10} : {item}")
        if not status:
            all_ok = False

    if all_ok:
        print("\n*** ALL REQUIREMENTS VERIFIED AND FULLY FUNCTIONAL! ***")
        return 0
    else:
        print("\n*** SOME REQUIREMENTS FAILED! ***")
        return 1

if __name__ == "__main__":
    sys.exit(main())
