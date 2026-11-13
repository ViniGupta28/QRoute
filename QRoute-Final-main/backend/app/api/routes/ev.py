import math
from fastapi import APIRouter
from typing import Dict, Any, List

from backend.app.adapters.mapbox_adapter import mapbox_adapter

router = APIRouter()

BHOPAL_CHARGING_STATIONS = [
    {
        "id": "EV_CS_01",
        "name": "Bhopal Smart City Fast Charger",
        "location": {"lat": 23.2340, "lon": 77.4350},
        "power_kw": 60.0,
        "connectors": ["CCS2", "Type2"],
        "available_ports": 3,
        "total_ports": 4,
    },
    {
        "id": "EV_CS_02",
        "name": "MP Nagar EV Charging Hub",
        "location": {"lat": 23.2310, "lon": 77.4380},
        "power_kw": 120.0,
        "connectors": ["CCS2"],
        "available_ports": 2,
        "total_ports": 2,
    },
    {
        "id": "EV_CS_03",
        "name": "Bhopal Junction EV Station",
        "location": {"lat": 23.2680, "lon": 77.4140},
        "power_kw": 50.0,
        "connectors": ["CCS2", "Bharat DC-001"],
        "available_ports": 4,
        "total_ports": 4,
    },
]


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0)**2
    return 2.0 * R * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))


@router.get("/ev/charging-stations")
def get_charging_stations():
    return BHOPAL_CHARGING_STATIONS


@router.post("/ev/route")
def calculate_ev_route(req: Dict[str, Any]):
    """Physics-based Electric Vehicle routing with state-of-charge tracking and charging hub recommendation."""
    battery_capacity_kwh = float(req.get("battery_capacity_kwh", 40.0))
    initial_soc = float(req.get("battery_soc", 80.0))
    payload_kg = float(req.get("payload_kg", 200.0))

    # Origin and destination coordinates
    orig = req.get("origin", {"lat": 23.2599, "lon": 77.4126})
    dest = req.get("destination", {"lat": 23.2366, "lon": 77.4012})

    waypoints = [
        [orig["lon"], orig["lat"]],
        [77.4350, 23.2340],  # Bhopal Smart City Hub
        [dest["lon"], dest["lat"]],
    ]

    geom_data = mapbox_adapter.get_route_geometry(waypoints)
    distance_km = geom_data["distance_km"] or 8.5
    duration_min = geom_data["duration_min"] or 18.0

    # Physics-based consumption: Base rate 0.16 kWh/km + weight factor (0.015 kWh/km per 100kg)
    consumption_rate = 0.16 + (payload_kg / 100.0) * 0.015
    energy_kwh = round(distance_km * consumption_rate, 2)

    initial_kwh = (initial_soc / 100.0) * battery_capacity_kwh
    remaining_kwh = max(0.0, initial_kwh - energy_kwh)
    arrival_soc = round((remaining_kwh / battery_capacity_kwh) * 100.0, 1)

    charging_needed = arrival_soc < 20.0
    recommended_station = None
    charging_time_min = 0.0

    if charging_needed:
        # Find nearest charging station to destination or midpoint
        nearest = min(
            BHOPAL_CHARGING_STATIONS,
            key=lambda s: _haversine_km(dest["lat"], dest["lon"], s["location"]["lat"], s["location"]["lon"])
        )
        recommended_station = nearest
        # CC-CV curve charging estimate: 20% to 80% with power taper
        energy_to_charge = battery_capacity_kwh * 0.6
        charging_time_min = round((energy_to_charge / nearest["power_kw"]) * 60.0 * 1.15, 1)

    return {
        "status": "FEASIBLE" if arrival_soc > 10.0 else "WARNING_LOW_BATTERY",
        "mode": "ev",
        "battery_capacity_kwh": battery_capacity_kwh,
        "battery_soc_initial": initial_soc,
        "battery_soc_arrival": arrival_soc,
        "energy_kwh_consumed": energy_kwh,
        "distance_km": distance_km,
        "duration_min": duration_min,
        "charging_stops_required": 1 if charging_needed else 0,
        "recommended_station": recommended_station,
        "charging_time_estimate_min": charging_time_min,
        "geometry": {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": geom_data["geometry"],
                    "properties": {
                        "mode": "ev",
                        "battery_soc_arrival": arrival_soc,
                    }
                }
            ]
        }
    }
