from fastapi import APIRouter, HTTPException
import numpy as np

from backend.app.schemas.quantum import (
    QAOASimulationRequest,
    QAOASimulationResponse,
    QUBOMatrixRequest,
    QUBOMatrixResponse,
    QuantumExperimentRequest,
)
from benchmarks.bhopal_generator import generate_bhopal_instance
from quantum.qubo import build_qubo_matrix, qubo_to_ising
from quantum.qaoa import run_qaoa
from quantum.small_instance_experiment import run_small_instance_experiment

router = APIRouter()


@router.post("/quantum/qaoa/simulate", response_model=QAOASimulationResponse)
def simulate_qaoa_circuit(req: QAOASimulationRequest):
    """Simulate a pure NumPy exact statevector QAOA circuit on a VRP instance."""
    try:
        problem = generate_bhopal_instance(
            n_customers=req.n_customers,
            n_vehicles=1,
            capacity=100.0,
            seed=req.seed,
        )
        Q, n_cust, n_pos = build_qubo_matrix(problem, n_customers=req.n_customers)

        res = run_qaoa(
            Q=Q,
            n_cust=n_cust,
            n_pos=n_pos,
            n_layers=req.n_layers,
            seed=req.seed,
            max_iterations=req.max_iterations,
            backend="statevector",
        )

        return QAOASimulationResponse(
            algorithm=res.algorithm,
            n_qubits=res.n_qubits,
            circuit_depth=res.circuit_depth or (req.n_layers * 2),
            best_energy=round(res.best_energy, 4),
            expectation_value=res.expectation_value,
            approximation_ratio=res.approximation_ratio,
            ground_state_fidelity=res.ground_state_fidelity,
            optimal_gammas=res.optimal_gammas,
            optimal_betas=res.optimal_betas,
            permutation=res.permutation,
            feasible=res.feasible,
            runtime_ms=round(res.runtime_ms, 2),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QAOA simulation error: {e}")


@router.post("/quantum/qubo/matrix", response_model=QUBOMatrixResponse)
def generate_qubo_matrix(req: QUBOMatrixRequest):
    """Generate QUBO matrix and Ising Hamiltonian formulation for a small instance."""
    try:
        problem = generate_bhopal_instance(
            n_customers=req.n_customers,
            n_vehicles=1,
            capacity=100.0,
            seed=42,
        )
        Q, n_cust, n_pos = build_qubo_matrix(
            problem,
            n_customers=req.n_customers,
            penalty_capacity=req.penalty_capacity,
            penalty_assignment=req.penalty_assignment,
        )
        J, h, offset = qubo_to_ising(Q)

        return QUBOMatrixResponse(
            n_customers=n_cust,
            n_variables=int(Q.shape[0]),
            qubo_shape=list(Q.shape),
            qubo_matrix=Q.round(4).tolist(),
            ising_offset=round(float(offset), 4),
            ising_h=h.round(4).tolist(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QUBO generation error: {e}")


@router.post("/quantum/experiment")
def run_quantum_vs_classical_experiment(req: QuantumExperimentRequest):
    """Benchmark Exact Brute-Force vs. QAOA Statevector vs. Adaptive D-QPSO."""
    try:
        results = run_small_instance_experiment(
            n_customers=req.n_customers,
            seed=req.seed,
            n_qaoa_layers=req.n_qaoa_layers,
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Experiment runner error: {e}")
