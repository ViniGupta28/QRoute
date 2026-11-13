from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class QAOASimulationRequest(BaseModel):
    n_customers: int = Field(4, ge=2, le=6, description="Number of customer nodes for quantum circuit (2-6)")
    n_layers: int = Field(2, ge=1, le=5, description="QAOA variational circuit depth p")
    seed: int = Field(42, description="Random seed")
    max_iterations: int = Field(50, description="Classical COBYLA optimizer max iterations")


class QAOASimulationResponse(BaseModel):
    algorithm: str
    n_qubits: int
    circuit_depth: int
    best_energy: float
    expectation_value: Optional[float]
    approximation_ratio: Optional[float]
    ground_state_fidelity: Optional[float]
    optimal_gammas: List[float]
    optimal_betas: List[float]
    permutation: List[int]
    feasible: bool
    runtime_ms: float


class QUBOMatrixRequest(BaseModel):
    n_customers: int = Field(4, ge=2, le=6)
    penalty_capacity: float = Field(10.0)
    penalty_assignment: float = Field(20.0)


class QUBOMatrixResponse(BaseModel):
    n_customers: int
    n_variables: int
    qubo_shape: List[int]
    qubo_matrix: List[List[float]]
    ising_offset: float
    ising_h: List[float]


class QuantumExperimentRequest(BaseModel):
    n_customers: int = Field(4, ge=2, le=5)
    seed: int = Field(42)
    n_qaoa_layers: int = Field(2, ge=1, le=4)
