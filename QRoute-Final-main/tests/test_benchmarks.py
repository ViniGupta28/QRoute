import pytest
import tempfile
from pathlib import Path
from benchmarks.bhopal_generator import generate_bhopal_instance, generate_scalability_suite
from benchmarks.cvrplib_loader import load_cvrplib
from benchmarks.statistics import summary_stats, wilcoxon_pairwise, friedman_test, print_comparison_table
from benchmarks.experiment_runner import compare_algorithms, ExperimentResults
from optimization.config import OptimizationConfig
from optimization.baselines import DijkstraBaseline, AStarBaseline
from optimization.qpso import QPSO
from optimization.adaptive_qpso import AdaptiveQPSO


def test_bhopal_instance_generator():
    problem = generate_bhopal_instance(
        n_customers=10,
        n_vehicles=2,
        capacity=80.0,
        seed=42,
        traffic_scenario="morning_peak",
    )
    assert problem.n_customers == 10
    assert problem.n_vehicles == 2
    assert problem.distance_matrix.shape == (11, 11)
    assert problem.travel_time_matrix.shape == (11, 11)


def test_scalability_suite_generator():
    suite = generate_scalability_suite(sizes=[5, 10], seed_base=100)
    assert len(suite) == 2
    assert suite[0][0] == 5
    assert suite[1][0] == 10


def test_cvrplib_loader(tmp_path):
    vrp_content = """NAME : Test-n5-k2
COMMENT : Test instance
TYPE : CVRP
DIMENSION : 5
CAPACITY : 100
NODE_COORD_SECTION
 1 0 0
 2 10 10
 3 20 20
 4 30 30
 5 40 40
DEMAND_SECTION
 1 0
 2 20
 3 30
 4 25
 5 35
DEPOT_SECTION
 1
 -1
EOF
"""
    vrp_file = tmp_path / "Test-n5-k2.vrp"
    vrp_file.write_text(vrp_content, encoding="utf-8")

    problem = load_cvrplib(vrp_file)
    assert problem.n_customers == 4  # 5 nodes minus depot
    assert problem.vehicles[0].capacity == 100
    assert problem.depot_x == 0.0
    assert problem.depot_y == 0.0


def test_statistics_computation():
    vals = [100.0, 110.0, 90.0, 105.0, 95.0]
    stats = summary_stats(vals, name="test_metric")

    assert stats["name"] == "test_metric"
    assert stats["min"] == 90.0
    assert stats["mean"] == 100.0
    assert stats["max"] == 110.0


def test_compare_algorithms():
    problem = generate_bhopal_instance(n_customers=8, n_vehicles=2, capacity=100.0, seed=42)
    cfg = OptimizationConfig(population_size=10, max_iterations=10, verbose=False)

    results = compare_algorithms(
        optimizer_classes=[DijkstraBaseline, AdaptiveQPSO],
        problem=problem,
        config=cfg,
        n_runs=2,
        problem_name="TestCompare",
        verbose=False,
    )

    assert "Dijkstra" in results or "DijkstraBaseline" in results or len(results) == 2
    for name, exp in results.items():
        assert exp.n_runs == 2
        assert exp.mean_runtime_ms >= 0
