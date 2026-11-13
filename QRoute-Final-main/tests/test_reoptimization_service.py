import pytest
from backend.app.adapters.optimization_adapter import optimization_adapter, VRPProblem
from backend.app.services.orchestration_service import orchestration_service
from backend.app.services.benchmark_service import benchmark_service
from backend.app.schemas.benchmark import BenchmarkRunRequest
from backend.app.db.session import SessionLocal

def test_optimization_adapter_reoptimize():
    problem = VRPProblem(
        depot={"lat": 23.2599, "lon": 77.4126},
        vehicles=[
            {"id": "V1", "capacity": 100.0},
            {"id": "V2", "capacity": 100.0}
        ],
        customers=[
            {"id": "C1", "location": {"lat": 23.2332, "lon": 77.4365}, "demand": 15.0},
            {"id": "C2", "location": {"lat": 23.2366, "lon": 77.4012}, "demand": 20.0},
            {"id": "C3", "location": {"lat": 23.2180, "lon": 77.4400}, "demand": 25.0}
        ],
        objective_weights={"time": 0.4, "distance": 0.3, "congestion": 0.2, "risk": 0.1},
        algorithm="adaptive_d_qpso",
        population_size=15,
        max_iterations=20
    )

    incidents = [{"edge_id": "R17", "status": "CLOSED"}]
    res = optimization_adapter.reoptimize(problem, incidents=incidents)

    assert res.algorithm == "adaptive_d_qpso_reopt"
    assert res.runtime_ms > 0
    assert len(res.routes) > 0
    assert "disruption" in res.metrics


def test_orchestration_service_traffic_event():
    import asyncio
    async def _run():
        db = SessionLocal()
        try:
            event = {
                "affected_edges": ["R17", "R18"],
                "severity": "HIGH",
                "simulation_id": "SIM_TEST_101",
                "reason": "ACCIDENT_CLOSURE"
            }
            out = await orchestration_service.handle_traffic_change_event(db, event)
            assert out["status"] == "PROCESSED"
            assert out["affected_vehicles_count"] == 2
            assert len(out["reroutes"]) == 2
            assert out["reroutes"][0]["algorithm"] == "adaptive_d_qpso"
            assert "savings" in out["reroutes"][0]
            assert "geometry" in out["reroutes"][0]
        finally:
            db.close()
    asyncio.run(_run())


def test_benchmark_service_real_runner():
    db = SessionLocal()
    try:
        req = BenchmarkRunRequest(
            dataset="Bhopal_Real_Corridors",
            instance="Morning_Rush",
            algorithms=["Adaptive D-QPSO", "QPSO"],
            population_size=12,
            iterations=15,
            seed=42
        )
        res = benchmark_service.run_benchmark(db, req)
        assert res.benchmark_id.startswith("BENCH_")
        assert len(res.algorithms) == 2
        for algo_res in res.algorithms:
            assert algo_res.mean > 0
            assert algo_res.runtime_ms > 0
    finally:
        db.close()
