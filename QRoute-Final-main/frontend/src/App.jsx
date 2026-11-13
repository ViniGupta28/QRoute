import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Navigation, 
  Bus, 
  Bell, 
  User, 
  Search,
  Layers,
  Sparkles
} from 'lucide-react';
import { useToast } from './hooks/useToast';
import ToastNotification from './components/ToastNotification';

import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './components/OnboardingScreen';
import HomeScreen from './components/HomeScreen';
import MapScreen from './components/MapScreen';
import PlanTripScreen from './components/PlanTripScreen';
import RouteResultsScreen from './components/RouteResultsScreen';
import PublicTransportScreen from './components/PublicTransportScreen';
import NavigationScreen from './components/NavigationScreen';
import EVPlannerScreen from './components/EVPlannerScreen';
import FleetOptimizationScreen from './components/FleetOptimizationScreen';
import EmergencyResponseScreen from './components/EmergencyResponseScreen';
import AlertsScreen from './components/AlertsScreen';
import ProfileScreen from './components/ProfileScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('splash');
  const [showScreenSwitcher, setShowScreenSwitcher] = useState(false);
  const [activeNavRoute, setActiveNavRoute] = useState(null);
  const { toasts, showToast, dismissToast } = useToast();
  const wsRef = useRef(null);

  const startNavigation = (navData) => {
    if (navData) {
      setActiveNavRoute(navData);
    }
    setCurrentTab('navigate');
  };

  // WebSocket: live updates from backend (traffic, incidents, alerts)
  // Runs ONCE on mount. Toast shows at most one time per session.
  const hasConnectedRef = useRef(false);
  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 2;

    function connect() {
      if (retryCount >= MAX_RETRIES) return; // give up silently
      try {
        const isNative = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform();
        const isLocalBrowser = typeof window !== 'undefined' &&
          ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const wsUrl = import.meta.env.VITE_WS_URL || (
          isNative ? 'ws://10.0.2.2:8000/api/v1/ws' :
          isLocalBrowser ? 'ws://localhost:8000/api/v1/ws' :
          null
        );

        // A static deployment has no same-origin WebSocket server. Production
        // backends can opt in with VITE_WS_URL without causing mixed-content or
        // localhost connection failures in the deployed frontend.
        if (!wsUrl) return;

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          retryCount = 0;
          // Show connected toast only ONCE per session, never again
          if (!hasConnectedRef.current) {
            hasConnectedRef.current = true;
            showToast('🟢 Live traffic feed connected', 'success', 2500);
          }
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'INCIDENT_ALERT') {
              showToast(`🚨 New Incident: ${msg.data?.description || 'Alert received'}`, 'error', 5000);
            } else if (msg.type === 'SYSTEM') {
              showToast(msg.message || 'System update received', 'info');
            }
            // TRAFFIC_UPDATE — silently ignored (no toast spam)
          } catch (_) { /* ignore non-JSON */ }
        };

        ws.onerror = () => { /* silent */ };
        ws.onclose = () => {
          retryCount++;
          if (retryCount < MAX_RETRIES) {
            setTimeout(connect, 6000); // retry silently, no toast
          }
        };
      } catch (_) { /* WebSocket not available */ }
    }

    // Delay connect slightly so splash screen finishes first
    const timer = setTimeout(connect, 1500);

    return () => {
      clearTimeout(timer);
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent retry on intentional close
        wsRef.current.close();
      }
    };
  }, []); // ← empty deps: runs ONCE on mount, never again

  // Full-screen standalone screens (no top/bottom app chrome)
  const isIntroScreen = ['splash', 'onboarding'].includes(currentTab);

  const screens = [
    { id: 'splash', label: '1. Splash Screen (Entry)' },
    { id: 'onboarding', label: '2. Onboarding Guide' },
    { id: 'home', label: '3. Home Dashboard' },
    { id: 'map', label: '4. Explore City Map' },
    { id: 'plan', label: '5. Plan Your Trip' },
    { id: 'route-results', label: '6. Route Results' },
    { id: 'navigate', label: '7. Turn-by-Turn Navigation' },
    { id: 'public-transport', label: '8. Public Transport (Live)' },
    { id: 'ev-planner', label: '9. EV Smart Planner' },
    { id: 'fleet', label: '10. Delivery Optimization' },
    { id: 'emergency-response', label: '11. Emergency Response 🚨' },
    { id: 'alerts', label: '12. Live Alerts & Traffic' },
    { id: 'profile', label: '13. Profile (Tanmay Jain)' }
  ];

  return (
    <div className="app-viewport">
      {/* Universal Mobile App Container (Works seamlessly on ANY smartphone) */}
      <div className="app-container">

        {/* 1. FIXED TOP APP HEADER (Stays permanently pinned on any phone, never scrolls away) */}
        {!isIntroScreen && (
          <header className="app-fixed-header">
            {/* Official Q-ROUTE Logo */}
            <div 
              className="app-header-logo" 
              onClick={() => setCurrentTab('home')}
              title="Q-Route Home"
            >
              <img 
                src="/qroute-logo.png" 
                alt="Q-Route" 
              />
            </div>

            {/* Header Right Actions */}
            <div className="app-header-actions">
              <button 
                className="app-screens-pill-btn"
                onClick={() => setShowScreenSwitcher(!showScreenSwitcher)}
                title="Switch Screens (13 Available)"
              >
                <Layers size={13} color="#006C49" />
                <span>Screens</span>
              </button>

              <button 
                className="app-icon-round-btn" 
                onClick={() => setCurrentTab('map')}
                title="Search Stations & Routes"
              >
                <Search size={16} />
              </button>

              <button 
                className="app-user-avatar-btn" 
                onClick={() => setCurrentTab('profile')}
                title="User Profile (Tanmay Jain)"
              >
                <User size={16} />
              </button>
            </div>
          </header>
        )}

        {/* Floating switch button for intro screens (Splash / Onboarding) */}
        {isIntroScreen && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 60 }}>
            <button
              className="app-screens-pill-btn"
              onClick={() => setShowScreenSwitcher(!showScreenSwitcher)}
              style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              <Layers size={13} color="#006C49" />
              <span>Screens</span>
            </button>
          </div>
        )}

        {/* 2. SCROLLABLE MIDDLE SCREEN CONTENT (Only this container scrolls!) */}
        <main className="app-scroll-body">
          {currentTab === 'splash' && (
            <SplashScreen 
              onComplete={() => setCurrentTab('onboarding')} 
            />
          )}

          {currentTab === 'onboarding' && (
            <OnboardingScreen 
              onFinish={() => setCurrentTab('home')} 
            />
          )}

          {currentTab === 'home' && (
            <HomeScreen 
              onNavigate={(screen) => setCurrentTab(screen)} 
            />
          )}

          {currentTab === 'map' && (
            <MapScreen 
              onNavigate={(screen) => setCurrentTab(screen)} 
              onStartNavigation={startNavigation}
            />
          )}

          {currentTab === 'plan' && (
            <PlanTripScreen 
              onBack={() => setCurrentTab('home')} 
              onShowResults={() => setCurrentTab('route-results')}
              onStartNavigation={startNavigation}
            />
          )}

          {currentTab === 'route-results' && (
            <RouteResultsScreen 
              onBack={() => setCurrentTab('plan')}
              onStartNavigation={startNavigation}
            />
          )}

          {currentTab === 'public-transport' && (
            <PublicTransportScreen 
              onBack={() => setCurrentTab('home')}
              onNavigateToMap={() => setCurrentTab('map')}
              onSelectRoute={() => setCurrentTab('route-results')}
            />
          )}

          {currentTab === 'navigate' && (
            <NavigationScreen 
              onEndRoute={() => setCurrentTab('home')}
              routeData={activeNavRoute}
            />
          )}

          {currentTab === 'ev-planner' && (
            <EVPlannerScreen 
              onBack={() => setCurrentTab('home')}
              onStartNavigation={startNavigation}
              showToast={showToast}
            />
          )}

          {currentTab === 'fleet' && (
            <FleetOptimizationScreen 
              onBack={() => setCurrentTab('home')}
              onNavigate={(screen) => setCurrentTab(screen)}
              showToast={showToast}
            />
          )}

          {currentTab === 'emergency-response' && (
            <EmergencyResponseScreen 
              onBack={() => setCurrentTab('home')}
              onNavigateToMap={() => setCurrentTab('map')}
              onStartNavigation={() => setCurrentTab('navigate')}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertsScreen 
              onNavigate={(screen) => setCurrentTab(screen)}
              showToast={showToast}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileScreen 
              onNavigate={(screen) => setCurrentTab(screen)}
              showToast={showToast}
            />
          )}
        </main>

        {/* 3. FIXED BOTTOM NAVIGATION BAR (Stays permanently pinned, never scrolls away) */}
        {!isIntroScreen && (
          <nav className="app-fixed-tabbar">
            {/* Home Tab */}
            <button 
              className={`tab-btn ${currentTab === 'home' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('home')}
            >
              <Home size={19} />
              <span className="tab-btn-label">Home</span>
            </button>

            {/* Map Tab */}
            <button 
              className={`tab-btn ${currentTab === 'map' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('map')}
            >
              <Navigation size={19} />
              <span className="tab-btn-label">Map</span>
            </button>

            {/* Trips Tab (Active for plan, route-results, public-transport, and navigate) */}
            <button 
              className={`tab-btn ${['plan', 'route-results', 'public-transport', 'navigate'].includes(currentTab) ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('plan')}
            >
              <Bus size={19} />
              <span className="tab-btn-label">Trips</span>
            </button>

            {/* Alerts Tab */}
            <button 
              className={`tab-btn ${currentTab === 'alerts' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('alerts')}
            >
              <div style={{ position: 'relative' }}>
                <Bell size={19} />
               
              </div>
              <span className="tab-btn-label">Alerts</span>
            </button>

            {/* Profile Tab */}
            <button 
              className={`tab-btn ${currentTab === 'profile' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('profile')}
            >
              <User size={19} />
              <span className="tab-btn-label">Profile</span>
            </button>
          </nav>
        )}

        {/* Screens Switcher Overlay Modal (Quick testing for all 13 mobile screens) */}
        {showScreenSwitcher && (
          <div 
            className="screen-switcher-overlay"
            onClick={() => setShowScreenSwitcher(false)}
          >
            <div 
              className="screen-switcher-menu"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748B', letterSpacing: '0.5px' }}>
                  SWITCH MOBILE SCREEN
                </span>
                <span style={{ fontSize: '10px', color: '#006C49', fontWeight: '700' }}>13 SCREENS</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                {screens.map((scr) => (
                  <button
                    key={scr.id}
                    onClick={() => {
                      setCurrentTab(scr.id);
                      setShowScreenSwitcher(false);
                    }}
                    style={{
                      textAlign: 'left',
                      background: currentTab === scr.id ? '#DCFCE7' : 'transparent',
                      color: currentTab === scr.id ? '#015C3B' : '#334155',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      fontSize: '11px',
                      fontWeight: currentTab === scr.id ? '800' : '600',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <span>{scr.label}</span>
                    {currentTab === scr.id && <span style={{ color: '#059669', fontSize: '12px' }}>●</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Global Toast Notification overlay (above everything) */}
        <ToastNotification toasts={toasts} onDismiss={dismissToast} />
      </div>
    </div>
  );
}
