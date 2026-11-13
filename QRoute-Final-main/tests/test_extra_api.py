import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_analytics_endpoints():
    r1 = client.get("/api/v1/analytics/comparison?baseline=BASE_001&optimized=OPT_1024")
    assert r1.status_code == 200
    assert "travel_time" in r1.json()

    r2 = client.get("/api/v1/analytics/traffic")
    assert r2.status_code == 200
    assert "average_speed" in r2.json()

    r3 = client.get("/api/v1/analytics/simulation")
    assert r3.status_code == 200
    assert r3.json()["total_vehicles"] == 50

    r4 = client.get("/api/v1/analytics/optimization")
    assert r4.status_code == 200
    assert r4.json()["feasibility_rate"] == 1.0


def test_incidents_endpoints():
    r1 = client.get("/api/v1/incidents")
    assert r1.status_code == 200
    assert isinstance(r1.json(), list)

    payload = {
        "type": "ROAD_CLOSURE",
        "affected_edges": ["R17", "R18"],
        "severity": "HIGH",
        "description": "Accident on main link"
    }
    r2 = client.post("/api/v1/incidents", json=payload)
    assert r2.status_code == 200
    data = r2.json()
    assert data["type"] == "ROAD_CLOSURE"
    inc_id = data["id"]

    r3 = client.delete(f"/api/v1/incidents/{inc_id}")
    assert r3.status_code == 200
    assert r3.json()["status"] in ["RESOLVED", "NOT_FOUND"]


def test_ev_endpoints():
    r1 = client.get("/api/v1/ev/charging-stations")
    assert r1.status_code == 200
    stations = r1.json()
    assert len(stations) >= 1
    assert stations[0]["id"] == "EV_CS_01"

    r2 = client.post("/api/v1/ev/route", json={"battery_soc": 85.0})
    assert r2.status_code == 200
    assert r2.json()["status"] == "FEASIBLE"
    assert r2.json()["mode"] == "ev"


def test_transit_endpoints():
    r1 = client.get("/api/v1/transit/routes")
    assert r1.status_code == 200
    routes = r1.json()
    assert len(routes) >= 1
    assert routes[0]["route_id"] == "TR_01"

    r2 = client.get("/api/v1/transit/stops")
    assert r2.status_code == 200
    stops = r2.json()
    assert len(stops) >= 1
    assert stops[0]["stop_id"] == "ST_01"


def test_benchmarks_api_endpoint():
    payload = {
        "dataset": "Bhopal_VRP_Benchmark_100",
        "instance": "Peak_Hour_Scenario",
        "algorithms": ["Adaptive D-QPSO", "QPSO"],
        "population_size": 20,
        "iterations": 20,
        "seed": 42
    }
    r1 = client.post("/api/v1/benchmarks/run", json=payload)
    assert r1.status_code == 200
    assert "benchmark_id" in r1.json()

    r2 = client.get("/api/v1/benchmarks/BM_88392")
    assert r2.status_code == 200
    assert "benchmark_id" in r2.json()


def test_demo_api_endpoints():
    r1 = client.get("/api/v1/demo/scenarios")
    assert r1.status_code == 200
    scenarios = r1.json()
    assert len(scenarios) >= 1

    r2 = client.post("/api/v1/demo/reset")
    assert r2.status_code == 200
    assert r2.json()["status"] == "SUCCESS"
