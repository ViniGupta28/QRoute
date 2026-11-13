from typing import List
from pydantic import BaseModel, Field

class BenchmarkRunRequest(BaseModel):
    dataset: str = Field("Bhopal_VRP_Benchmark_100", json_schema_extra={"example": "Bhopal_VRP_Benchmark_100"})
    instance: str = Field("Peak_Hour_Scenario", json_schema_extra={"example": "Peak_Hour_Scenario"})
    algorithms: List[str] = Field(default_factory=lambda: ["PSO", "GA", "ACO", "QPSO", "Adaptive D-QPSO"])
    population_size: int = Field(50, json_schema_extra={"example": 50})
    iterations: int = Field(100, json_schema_extra={"example": 100})
    seed: int = Field(42, json_schema_extra={"example": 42})

class AlgorithmBenchmarkResult(BaseModel):
    name: str
    mean: float
    std: float
    runtime_ms: float

class BenchmarkResponse(BaseModel):
    benchmark_id: str
    dataset: str
    instance: str
    algorithms: List[AlgorithmBenchmarkResult]
