import pytest
import numpy as np
from benchmarks.bhopal_generator import generate_bhopal_instance
from quantum.qubo import (
    build_qubo_matrix,
    qubo_to_ising,
    build_basis_energies,
    qubo_energy,
    decode_qubo_solution,
    brute_force_qubo,
)
from quantum.qaoa import run_qaoa, QAOAResult
from quantum.small_instance_experiment import run_small_instance_experiment


def test_qubo_matrix_construction():
    problem = generate_bhopal_instance(n_customers=4, n_vehicles=1, capacity=100.0, seed=42)
    Q, n_cust, n_pos = build_qubo_matrix(problem, n_customers=3)
    
    assert n_cust == 3
    assert n_pos == 3
    assert Q.shape == (9, 9)
    assert np.allclose(Q, Q.T), "QUBO matrix must be symmetric"


def test_qubo_to_ising_conversion():
    Q = np.array([
        [2.0, -1.0],
        [-1.0, 3.0]
    ])
    J, h, offset = qubo_to_ising(Q)
    assert J.shape == (2, 2)
    assert h.shape == (2,)
    assert isinstance(offset, float)

    # Test energy consistency x_i = (1 - s_i) / 2
    # s = [+1, +1] -> x = [0, 0] -> E_qubo = 0
    s1 = np.array([1.0, 1.0])
    e_ising1 = float(s1 @ J @ s1 + h @ s1 + offset)
    assert np.isclose(e_ising1, 0.0)


def test_basis_energies_and_brute_force():
    Q = np.array([
        [1.0, -2.0],
        [-2.0, 1.0]
    ])
    bit_matrix, energies = build_basis_energies(Q, 2)
    assert bit_matrix.shape == (4, 2)
    assert len(energies) == 4

    best_x, min_e = brute_force_qubo(Q, 2)
    assert min_e == np.min(energies)
    assert np.all(best_x == bit_matrix[np.argmin(energies)])


def test_decode_qubo_solution():
    # Valid 2-customer permutation: pos 0 -> cust 1, pos 1 -> cust 0
    x_valid = np.array([0, 1, 1, 0])  # cust 0: pos 1; cust 1: pos 0
    perm = decode_qubo_solution(x_valid, n_cust=2, n_pos=2)
    assert perm == [1, 0]

    # Invalid assignment: two customers at pos 0
    x_invalid = np.array([1, 0, 1, 0])
    perm_inv = decode_qubo_solution(x_invalid, n_cust=2, n_pos=2)
    assert perm_inv == []


def test_qaoa_statevector_execution():
    problem = generate_bhopal_instance(n_customers=3, n_vehicles=1, capacity=100.0, seed=42)
    Q, n_cust, n_pos = build_qubo_matrix(problem, n_customers=2)
    
    res = run_qaoa(Q, n_cust=2, n_pos=2, n_layers=1, seed=42, max_iterations=20, backend="statevector")
    
    assert isinstance(res, QAOAResult)
    assert res.algorithm == "qaoa_statevector"
    assert res.n_qubits == 4
    assert res.runtime_ms > 0
    assert res.approximation_ratio is not None


def test_qaoa_simulated_annealing_fallback():
    # Force annealing backend
    Q = np.eye(4)
    res = run_qaoa(Q, n_cust=2, n_pos=2, seed=42, backend="annealing")
    assert res.algorithm == "simulated_annealing_fallback"


def test_small_instance_experiment_runner():
    res = run_small_instance_experiment(n_customers=3, seed=42, n_qaoa_layers=1)
    assert "n_customers" in res
    assert "n_qubo_variables" in res
    assert "brute_force" in res
    assert "qaoa" in res
    assert "adaptive_d_qpso" in res
