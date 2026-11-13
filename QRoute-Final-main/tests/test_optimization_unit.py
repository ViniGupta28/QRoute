import pytest
import numpy as np
from benchmarks.bhopal_generator import generate_bhopal_instance
from optimization.config import OptimizationConfig, ObjectiveWeights
from optimization.problem import VRPProblem
from optimization.entities import Customer, Vehicle, VehicleState
from optimization.encoding import random_keys_to_permutation, permutation_to_random_keys, validate_permutation
from optimization.decoder import decode, decode_permutation
from optimization.fitness import calculate_fitness, calculate_fitness_from_keys
from optimization.repair import repair
from optimization.local_search import two_opt, relocate_ls, variable_neighborhood_descent
from optimization.baselines import (
    DijkstraBaseline,
    AStarBaseline,
    PSOOptimizer,
    GAOptimizer,
    ACOOptimizer,
)
from optimization.reoptimization import ReOptimizer


def test_encoding_decoding_roundtrip():
    problem = generate_bhopal_instance(n_customers=6, n_vehicles=2, capacity=100.0, seed=42)
    position = np.array([0.71, 0.12, 0.89, 0.34, 0.53, 0.07])
    
    assert len(position) == 6
    perm = random_keys_to_permutation(position)
    assert validate_permutation(perm, 6)
    
    routes = decode(position, problem)
    assert isinstance(routes, list)
    assert len(routes) == 2


def test_fitness_evaluation():
    problem = generate_bhopal_instance(n_customers=5, n_vehicles=2, capacity=100.0, seed=42)
    weights = ObjectiveWeights()
    position = np.array([0.1, 0.5, 0.3, 0.8, 0.2])
    
    f, routes, unserved = calculate_fitness_from_keys(position, problem, weights)
    assert f > 0
    assert isinstance(routes, list)
    assert isinstance(unserved, list)


def test_repair_operator():
    problem = generate_bhopal_instance(n_customers=6, n_vehicles=2, capacity=20.0, seed=42)
    position = np.array([0.1, 0.2, 0.3, 0.4, 0.5, 0.6])
    routes = decode(position, problem)
    
    repaired_routes, unserved = repair(routes, problem)
    assert isinstance(repaired_routes, list)
    assert isinstance(unserved, list)


def test_local_search_operators():
    problem = generate_bhopal_instance(n_customers=8, n_vehicles=2, capacity=100.0, seed=42)
    position = np.array([0.1, 0.8, 0.3, 0.5, 0.2, 0.7, 0.4, 0.6])
    routes = decode(position, problem)
    
    opt2_routes = two_opt(routes, problem)
    reloc_routes = relocate_ls(routes, problem)
    vnd_routes = variable_neighborhood_descent(routes, problem)

    assert len(opt2_routes) == len(routes)
    assert len(reloc_routes) == len(routes)
    assert len(vnd_routes) == len(routes)


def test_baseline_optimizers():
    problem = generate_bhopal_instance(n_customers=6, n_vehicles=2, capacity=100.0, seed=42)
    cfg = OptimizationConfig(population_size=10, max_iterations=10, verbose=False)

    for solver_cls in [DijkstraBaseline, AStarBaseline, PSOOptimizer, GAOptimizer, ACOOptimizer]:
        solver = solver_cls(problem, cfg)
        res = solver.solve()
        assert res.objective_value > 0
        assert res.status in ["FEASIBLE", "INFEASIBLE"]


def test_reoptimizer_incident_recovery():
    problem = generate_bhopal_instance(n_customers=6, n_vehicles=2, capacity=100.0, seed=42)
    cfg = OptimizationConfig(population_size=10, max_iterations=10, verbose=False)

    vehicle_states = {
        0: VehicleState(vehicle_id=0, current_node=1, current_load=10.0, completed_customers=[0], remaining_customers=[1, 2]),
        1: VehicleState(vehicle_id=1, current_node=4, current_load=15.0, completed_customers=[3], remaining_customers=[4, 5]),
    }

    reopt = ReOptimizer(problem, cfg)
    incidents = [{"edge_id": "0_2", "status": "CLOSED", "severity": "HIGH"}]
    res = reopt.reoptimize(vehicle_states, incidents=incidents, incident_multipliers=[float("inf")])

    assert res.status in ["FEASIBLE", "INFEASIBLE"]
