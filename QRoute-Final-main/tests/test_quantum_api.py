from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_qubo_matrix_endpoint():
    payload = {
        "n_customers": 3,
        "penalty_capacity": 500.0,
        "penalty_assignment": 500.0
    }
    response = client.post("/api/v1/quantum/qubo/matrix", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["n_customers"] == 3
    assert data["n_variables"] == 9  # 3x3 for permutation matrix
    assert data["qubo_shape"] == [9, 9]
    assert len(data["qubo_matrix"]) == 9
    assert isinstance(data["ising_offset"], float)
    assert len(data["ising_h"]) == 9


def test_qaoa_simulate_endpoint():
    payload = {
        "n_customers": 2,
        "n_layers": 1,
        "max_iterations": 5,
        "seed": 42
    }
    response = client.post("/api/v1/quantum/qaoa/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm"].lower() == "qaoa_statevector"
    assert data["n_qubits"] == 4
    assert "best_energy" in data
    assert len(data["optimal_gammas"]) == 1
    assert len(data["optimal_betas"]) == 1
    assert data["runtime_ms"] > 0


def test_quantum_experiment_endpoint():
    payload = {
        "n_customers": 3,
        "n_qaoa_layers": 1,
        "seed": 42
    }
    response = client.post("/api/v1/quantum/experiment", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "brute_force" in data
    assert "qaoa" in data
    assert "adaptive_d_qpso" in data
    assert "approximation_ratio" in data["qaoa"]
    assert data["brute_force"]["runtime_ms"] >= 0
    assert data["adaptive_d_qpso"]["objective"] > 0
