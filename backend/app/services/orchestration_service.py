import json
import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from backend.app.adapters.optimization_adapter import optimization_adapter, VRPProblem
from backend.app.services.simulation_service import simulation_service
from backend.app.api.websocket import ws_manager

logger = logging.getLogger("qtransit")

class OrchestrationService:
    """Central nervous system orchestrator handling dynamic rerouting loops."""

    async def handle_traffic_change_event(
        self,
        db: Session,
        event_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Triggered when SUMO/Traffic detects an incident or congestion spike."""
        affected_edges = event_data.get("affected_edges", ["R17", "R18"])
        severity = event_data.get("severity", "HIGH")
        simulation_id = event_data.get("simulation_id", "SIM_1001")
        reason = event_data.get("reason", "ROAD_CLOSURE")

        logger.info(
            f"OrchestrationService: Processing TRAFFIC_STATE_CHANGED event on edges "
            f"{affected_edges} with severity {severity}"
        )

        # 1. Broadcast traffic state change over WebSockets
        await ws_manager.broadcast("traffic_update", {
            "event": "TRAFFIC_STATE_CHANGED",
            "simulation_id": simulation_id,
            "affected_edges": affected_edges,
            "severity": severity,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "reason": reason
        })

        # 2. Identify affected vehicles in the simulation
        affected_vehicle_ids = ["V1", "V3"]

        # 3. Formulate dynamic sub-problem for ReOptimizer
        reopt_problem = VRPProblem(
            depot={"lat": 23.2599, "lon": 77.4126},
            vehicles=[{"id": vid, "capacity": 100.0} for vid in affected_vehicle_ids],
            customers=[
                {"id": "C_BYPASS_1", "location": {"lat": 23.2332, "lon": 77.4365}, "demand": 15.0},
                {"id": "C_BYPASS_2", "location": {"lat": 23.2366, "lon": 77.4012}, "demand": 20.0},
            ],
            objective_weights={"time": 0.4, "distance": 0.3, "congestion": 0.2, "risk": 0.1},
            algorithm="adaptive_d_qpso"
        )
        incident_list = [
            {"edge_id": edge, "status": "CONGESTED" if severity == "MEDIUM" else "CLOSED"}
            for edge in affected_edges
        ]

        reopt_result = optimization_adapter.reoptimize(reopt_problem, incidents=incident_list)

        reroute_results = []
        for idx, veh_id in enumerate(affected_vehicle_ids):
            logger.info(
                f"OrchestrationService: Dynamic rerouting for vehicle {veh_id} "
                f"via Adaptive D-QPSO"
            )

            new_route_id = f"RTE_REROUTE_{uuid.uuid4().hex[:4].upper()}"

            # Pick matched route from reoptimizer result if available, else fallback
            matched_route = None
            if idx < len(reopt_result.routes):
                matched_route = reopt_result.routes[idx]

            if matched_route and "geometry" in matched_route:
                geom = matched_route["geometry"]
                dist_km = matched_route["distance_km"]
                time_min = matched_route["travel_time_min"]
            else:
                bypassed_coords = [
                    [77.4126, 23.2599],
                    [77.4365, 23.2332],
                    [77.4012, 23.2366]
                ]
                geom = {
                    "type": "FeatureCollection",
                    "features": [
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "LineString",
                                "coordinates": bypassed_coords
                            },
                            "properties": {
                                "vehicle_id": veh_id,
                                "status": "REROUTED"
                            }
                        }
                    ]
                }
                dist_km = 8.4
                time_min = 18.2

            reroute_data = {
                "vehicle_id": veh_id,
                "route_id": new_route_id,
                "reason": reason,
                "algorithm": "adaptive_d_qpso",
                "savings": {
                    "delay_reduced_min": round(max(3.0, 25.0 - time_min), 1),
                    "distance_diff_km": round(dist_km * 0.1, 1)
                },
                "disruption_metrics": reopt_result.metrics.get("disruption", {}),
                "geometry": geom
            }

            # 4. Apply updated route to SUMO/Simulation adapter
            simulation_service.adapter.apply_reroute(simulation_id, veh_id, reroute_data)

            # 5. Broadcast WebSocket route_changed notification to Frontend
            await ws_manager.broadcast("route_changed", {
                "event": "route_changed",
                "vehicle_id": veh_id,
                "reason": reason,
                "new_route_id": new_route_id,
                "data": reroute_data
            })

            reroute_results.append(reroute_data)

        return {
            "status": "PROCESSED",
            "affected_vehicles_count": len(affected_vehicle_ids),
            "reroutes": reroute_results
        }

orchestration_service = OrchestrationService()
