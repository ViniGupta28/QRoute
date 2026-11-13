// API client — wraps fetch with a timeout so dead backends don't hang the UI.
// Falls back to mock data if the Python server isn't running (handy for frontend-only dev).
// Set VITE_API_URL in .env to override base (e.g. staging or prod backend).

const isNative = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform();
const defaultBase = isNative ? 'http://10.0.2.2:8000/api/v1' : '/api/v1';
const API_BASE_URL = import.meta.env.VITE_API_URL || defaultBase;
const REQUEST_TIMEOUT_MS = 3000;

// 3s is tight but feels instant. If backend is slow, user sees mock data anyway.
async function apiFetch(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal,
      ...options
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    return { success: true, data: json, isLive: true };
  } catch (err) {
    clearTimeout(timeoutId);
    return { success: false, error: err.message, isLive: false };
  }
}

function resolveBhopalCoordinates(place) {
  if (place && typeof place === 'object' && place.lat !== undefined && place.lon !== undefined) {
    return place;
  }
  const str = String(place || '').toLowerCase();
  if (str.includes('new market')) return { lat: 23.2366, lon: 77.4012 };
  if (str.includes('mp nagar')) return { lat: 23.2332, lon: 77.4365 };
  if (str.includes('rani kamlapati') || str.includes('habibganj')) return { lat: 23.2180, lon: 77.4400 };
  if (str.includes('hamidia')) return { lat: 23.2599, lon: 77.4126 };
  if (str.includes('station') || str.includes('junction')) return { lat: 23.2678, lon: 77.4145 };
  if (str.includes('aiims')) return { lat: 23.2065, lon: 77.4580 };
  if (str.includes('bairagarh')) return { lat: 23.2750, lon: 77.3500 };
  if (str.includes('kolar')) return { lat: 23.1850, lon: 77.4200 };
  return { lat: 23.2323, lon: 77.4326 }; // Board Office Square default
}

export const QRouteAPI = {
  // 1. System Health Check
  async getHealth() {
    const res = await apiFetch('/health');
    if (res.success) return res;
    return {
      success: true,
      isLive: false,
      data: {
        status: 'client-offline-mode',
        components: { database: 'local', optimization: 'local-client', sumo: 'simulated', traffic: 'live-cache' }
      }
    };
  },

  // 2. Location Search (Bhopal Hubs)
  async searchLocations(query = 'Board Office') {
    const res = await apiFetch(`/locations/search?q=${encodeURIComponent(query)}`);
    if (res.success) return res.data;
    // Fallback Bhopal places
    const defaultPlaces = [
      { name: 'Board Office Square', latitude: 23.2323, longitude: 77.4326, type: 'junction' },
      { name: 'MP Nagar Zone 1', latitude: 23.2332, longitude: 77.4365, type: 'commercial_hub' },
      { name: 'New Market', latitude: 23.2366, longitude: 77.4012, type: 'market' },
      { name: 'Hamidia Hospital', latitude: 23.2599, longitude: 77.4126, type: 'hospital' },
      { name: 'AIIMS Bhopal Trauma Hub', latitude: 23.2065, longitude: 77.4580, type: 'hospital' },
      { name: 'Bhopal Junction Railway Station', latitude: 23.2678, longitude: 77.4145, type: 'transit_hub' }
    ];
    return defaultPlaces.filter(p => p.name.toLowerCase().includes(query.toLowerCase())) || defaultPlaces;
  },

  // 3. Plan Trip Route
  async planRoute(payload) {
    const originCoord = resolveBhopalCoordinates(payload.origin || payload.origin_name);
    const destCoord = resolveBhopalCoordinates(payload.destination || payload.destination_name || 'Rani Kamlapati');
    const reqBody = {
      origin: originCoord,
      destination: destCoord,
      mode: payload.mode || 'car',
      objective: payload.preference || payload.objective || 'balanced'
    };
    const res = await apiFetch('/trips/route', {
      method: 'POST',
      body: JSON.stringify(reqBody)
    });
    if (res.success && res.data) {
      const d = res.data;
      const dist = d.summary?.distance_km || 7.4;
      const time = d.summary?.travel_time_min || 24;
      return {
        success: true,
        isLive: true,
        data: {
          route_id: d.route_id,
          duration_minutes: time,
          distance_km: dist,
          eta: `${Math.round(time)} min`,
          eco_carbon_saved_kg: Math.round(Number(dist) * 0.18 * 10) / 10,
          mode: payload.mode || 'car',
          geometry: d.geometry
        }
      };
    }
    return {
      success: true,
      isLive: false,
      data: {
        route_id: `ROU_${Date.now()}`,
        duration_minutes: 24,
        distance_km: 7.4,
        eta: '24 min',
        eco_carbon_saved_kg: 1.8,
        mode: payload.mode || 'car'
      }
    };
  },

  // 4. EV Charging Stations
  async getEVStations() {
    const res = await apiFetch('/ev/charging-stations');
    if (res.success) return res.data;
    return [
      {
        id: 'EV_CS_01',
        name: 'Bhopal Smart City Fast Charger',
        location: { lat: 23.2340, lon: 77.4350 },
        power_kw: 60.0,
        connectors: ['CCS2', 'Type2'],
        available_ports: 3,
        total_ports: 4
      },
      {
        id: 'EV_CS_02',
        name: 'MP Nagar EV Charging Hub',
        location: { lat: 23.2310, lon: 77.4380 },
        power_kw: 120.0,
        connectors: ['CCS2'],
        available_ports: 2,
        total_ports: 2
      },
      {
        id: 'EV_CS_03',
        name: 'Bhopal Junction EV Station',
        location: { lat: 23.2680, lon: 77.4140 },
        power_kw: 50.0,
        connectors: ['CCS2', 'Bharat DC-001'],
        available_ports: 4,
        total_ports: 4
      }
    ];
  },

  // 5. EV Route & Physics-based Battery Prediction
  async calculateEVRoute(payload) {
    const res = await apiFetch('/ev/route', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.success) return res;
    return {
      success: true,
      isLive: false,
      data: {
        total_distance_km: 14.8,
        estimated_travel_time_min: 28,
        initial_soc_percent: payload.battery_soc || 68,
        final_soc_percent: Math.max(10, (payload.battery_soc || 68) - 18),
        charging_needed: false,
        recommended_charging_hub: null
      }
    };
  },

  // 6. Public Transit Routes & Stops (GTFS)
  async getTransitRoutes() {
    const res = await apiFetch('/transit/routes');
    if (res.success) return res.data;
    return [
      { route_id: 'TR_01', name: 'Bhopal BRTS Trunk 1', origin: 'Habibganj', destination: 'Bairagarh', type: 'BRTS' },
      { route_id: 'TR_02', name: 'City Bus Circular 2', origin: 'Board Office', destination: 'Karond', type: 'BUS' }
    ];
  },

  async getTransitStops() {
    const res = await apiFetch('/transit/stops');
    if (res.success) return res.data;
    return [
      { stop_id: 'ST_01', name: 'Board Office Square BRTS', lat: 23.2323, lon: 77.4326 },
      { stop_id: 'ST_02', name: 'MP Nagar BRTS', lat: 23.2332, lon: 77.4365 },
      { stop_id: 'ST_03', name: 'Roshanpura Square', lat: 23.2389, lon: 77.4089 }
    ];
  },

  // 7. Live Traffic & Congestion
  async getCurrentTraffic() {
    const res = await apiFetch('/traffic/current');
    if (res.success) return res.data;
    return [
      { edge_id: 'R17', speed_kmh: 42.5, congestion_level: 'LOW', updated_at: new Date().toISOString() },
      { edge_id: 'VIP_ROAD', speed_kmh: 52.0, congestion_level: 'FREE_FLOW', updated_at: new Date().toISOString() },
      { edge_id: 'MP_NAGAR_MAIN', speed_kmh: 21.0, congestion_level: 'MODERATE', updated_at: new Date().toISOString() }
    ];
  },

  // 8. Traffic Incidents & Reporting
  async getIncidents() {
    const res = await apiFetch('/incidents');
    if (res.success) return res.data;
    return [
      {
        id: 'INC_01',
        edge_id: 'HO_CHOPRA_CHOWK',
        incident_type: 'ROAD_CONSTRUCTION',
        severity: 'MEDIUM',
        description: 'Road resurfacing work on right 2 lanes',
        reported_at: new Date().toISOString()
      }
    ];
  },

  async reportIncident(payload) {
    const res = await apiFetch('/incidents', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.success) return res;
    return {
      success: true,
      isLive: false,
      data: {
        id: `INC_${Date.now()}`,
        status: 'SUBMITTED_LOCAL',
        ...payload
      }
    };
  },

  // 9. Delivery Fleet Optimization (Adaptive D-QPSO Engine)
  async submitOptimization(payload) {
    const numVehicles = Math.max(1, Math.min(5, payload.num_vehicles || 3));
    const vehicleCapacity = payload.vehicle_capacity || 100.0;
    const reqBody = payload.depot ? payload : {
      depot: { lat: 23.2323, lon: 77.4326 }, // Board Office Square Central Hub
      vehicles: Array.from({ length: numVehicles }, (_, i) => ({
        id: `V${i + 1}`,
        vehicle_code: `VAN-10${i + 1}`,
        capacity: vehicleCapacity
      })),
      customers: [
        { id: "C1", name: "New Market Commercial Hub", location: { lat: 23.2366, lon: 77.4012 }, demand: 18.0, service_time_sec: 300 },
        { id: "C2", name: "MP Nagar Zone-2", location: { lat: 23.2332, lon: 77.4365 }, demand: 24.0, service_time_sec: 300 },
        { id: "C3", name: "Kolar Road Retailers", location: { lat: 23.1850, lon: 77.4200 }, demand: 15.0, service_time_sec: 300 },
        { id: "C4", name: "AIIMS Bhopal Logistics Gate", location: { lat: 23.2065, lon: 77.4580 }, demand: 31.0, service_time_sec: 300 },
        { id: "C5", name: "Bairagarh Wholesale Market", location: { lat: 23.2750, lon: 77.3500 }, demand: 12.0, service_time_sec: 300 },
        { id: "C6", name: "Gulmohar Colony Store", location: { lat: 23.2100, lon: 77.4450 }, demand: 16.0, service_time_sec: 300 },
        { id: "C7", name: "TT Nagar Stadium Hub", location: { lat: 23.2420, lon: 77.4050 }, demand: 14.0, service_time_sec: 300 },
        { id: "C8", name: "Bhopal Station Logistics", location: { lat: 23.2678, lon: 77.4145 }, demand: 20.0, service_time_sec: 300 }
      ],
      objective: { time: 0.4, distance: 0.3, congestion: 0.3 },
      algorithm: payload.algorithm || "adaptive_d_qpso",
      population_size: 20,
      max_iterations: 30
    };

    const res = await apiFetch('/optimization/delivery', {
      method: 'POST',
      body: JSON.stringify(reqBody)
    });

    if (res.success && res.data?.optimization_id) {
      const optId = res.data.optimization_id;
      // Brief wait for solver completion
      await new Promise(r => setTimeout(r, 600));
      const statusRes = await apiFetch(`/optimization/${optId}`);
      if (statusRes.success && statusRes.data) {
        const s = statusRes.data;
        const totalDist = s.summary?.total_distance_km || 32.4;
        const totalTime = s.summary?.total_time_min || 78;
        const co2Saved = s.summary?.co2_saved_kg || Math.round(totalDist * 0.18 * 10) / 10;
        return {
          success: true,
          isLive: true,
          data: {
            optimization_id: optId,
            status: s.status,
            total_distance_km: totalDist,
            total_time_min: totalTime,
            co2_saved_kg: co2Saved,
            vehicles: s.vehicles || []
          }
        };
      }
      return res;
    }
    return {
      success: true,
      isLive: false,
      data: {
        optimization_id: `OPT_LOCAL_${Date.now()}`,
        status: 'COMPLETED_CLIENT_SIDE',
        total_distance_km: 32.4,
        total_time_min: 78,
        co2_saved_kg: 38.4
      }
    };
  },

  async getOptimizationStatus(optId) {
    const res = await apiFetch(`/optimization/${optId}`);
    if (res.success) return res;
    return {
      success: true,
      isLive: false,
      data: {
        id: optId,
        status: 'COMPLETED',
        total_distance_km: 32.4,
        total_time_min: 78,
        co2_saved_kg: 9.6
      }
    };
  }
};

export default QRouteAPI;
