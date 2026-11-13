import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Radio, 
  Phone, 
  Navigation, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Camera, 
  MapPin, 
  Zap, 
  Flame, 
  Crosshair, 
  Clock, 
  ChevronRight,
  Info,
  Check
} from 'lucide-react';

export default function EmergencyResponseScreen({ onBack, onNavigateToMap, onStartNavigation }) {
  const [preemptionRequested, setPreemptionRequested] = useState(false);
  const [activeHelpline, setActiveHelpline] = useState(null);
  const [evDispatched, setEvDispatched] = useState(false);

  const helplines = [
    { number: '108', label: 'Ambulance Care', icon: AlertTriangle, bg: '#FEE2E2', color: '#DC2626' },
    { number: '112', label: 'Police Rapid SOS', icon: ShieldAlert, bg: '#DBEAFE', color: '#2563EB' },
    { number: '101', label: 'Fire Control', icon: Flame, bg: '#FFEDD5', color: '#EA580C' },
    { number: '0755-2777100', label: 'Traffic Control', icon: Crosshair, bg: '#DCFCE7', color: '#059669' }
  ];

  const traumaCenters = [
    {
      id: 'aiims',
      name: 'AIIMS Bhopal Trauma Center',
      tag: 'APEX TRAUMA HUB • 24/7 ER Ready',
      sub: 'Saket Nagar • Level 1 Emergency Specialty',
      eta: '~7 min',
      dist: '3.8 km',
      perk1: '14 Emergency Beds Open',
      perk2: 'Direct VIP Road Corridor',
      phone: '0755-2672317'
    },
    {
      id: 'hamidia',
      name: 'Hamidia Hospital Super Speciality',
      tag: 'GOVERNMENT APEX • Green Corridor Linked',
      sub: 'Royal Market Road • Rapid Trauma Hub',
      eta: '~11 min',
      dist: '5.2 km',
      perk1: 'ICU Available',
      perk2: 'Blood Bank Onsite',
      phone: '0755-4096000'
    },
    {
      id: 'bansal',
      name: 'Bansal Hospital Shahpura',
      tag: 'CARDIAC & NEURO ER • Shahpura Lake Side',
      sub: 'Chuna Bhatti Road • Emergency Ward',
      eta: '~9 min',
      dist: '4.1 km',
      perk1: 'Cath Lab Active',
      perk2: 'Rapid Triage',
      phone: '0755-4086000'
    }
  ];

  return (
    <div className="screen-content" style={{ paddingBottom: '24px' }}>
      {/* Sub-Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
        <button 
          onClick={onBack}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'white',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Back to Dashboard"
        >
          <ArrowLeft size={18} color="#0F172A" />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
              Emergency Response
            </h2>
            <span style={{ fontSize: '14px' }}>🚨</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
            Green Corridors &amp; Priority Transit Telemetry
          </div>
        </div>

        <div style={{
          background: '#FEE2E2',
          color: '#DC2626',
          fontSize: '11px',
          fontWeight: '800',
          padding: '4px 10px',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#DC2626' }}></span>
          <span>SOS</span>
        </div>
      </div>

      {/* Subheader Status Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#F1F5F9',
          borderRadius: '999px',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: '700',
          color: '#0F172A'
        }}>
          <CheckCircle2 size={13} color="#00B368" />
          <span>Bhopal Smart City 112 Integrated</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: '#DCFCE7',
          borderRadius: '999px',
          padding: '4px 8px',
          fontSize: '10px',
          fontWeight: '800',
          color: '#166534'
        }}>
          <span className="pulse-dot" style={{ width: '6px', height: '6px', background: '#00B368' }} />
          <span>LIVE TELEMETRY</span>
        </div>
      </div>

      {/* Dynamic Green Corridor Alert Card */}
      <div style={{
        background: 'linear-gradient(180deg, #FFF1F2 0%, #FFE4E6 100%)',
        border: '1px solid #FECDD3',
        borderRadius: '20px',
        padding: '16px',
        boxShadow: '0 4px 16px rgba(225, 29, 72, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#E11D48',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={14} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#9F1239', letterSpacing: '0.4px' }}>
              INSTANT CLEARANCE
            </span>
          </div>

          <span style={{
            background: '#E11D48',
            color: 'white',
            fontSize: '10px',
            fontWeight: '800',
            padding: '2px 8px',
            borderRadius: '999px'
          }}>
            PRIORITY 0
          </span>
        </div>

        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#881337', marginBottom: '6px' }}>
          Dynamic Green Corridor
        </h3>
        <p style={{ fontSize: '12px', color: '#9F1239', lineHeight: '1.45', marginBottom: '14px' }}>
          Instantly clear 8+ intelligent traffic junctions along critical routes for authorized medical emergencies, patient transfer, or urgent response transit.
        </p>

        {/* Request Preemption Subcard */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '14px',
          padding: '12px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#DCFCE7',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Radio size={16} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>
                Request Signal Preemption
              </div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>
                Automated ITS greenwave clearance
              </div>
            </div>
          </div>

          <button
            onClick={() => setPreemptionRequested(!preemptionRequested)}
            style={{
              background: preemptionRequested ? '#059669' : '#015C3B',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 6px rgba(1, 92, 59, 0.25)'
            }}
          >
            {preemptionRequested ? <Check size={14} /> : null}
            <span>{preemptionRequested ? 'Requested' : '▶ Request'}</span>
          </button>
        </div>
      </div>

      {/* Direct Rapid Response Helplines */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569', letterSpacing: '0.4px' }}>
            DIRECT RAPID RESPONSE HELPLINES
          </span>
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#00B368' }}>
            Toll Free 24x7
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {helplines.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={idx}
                href={`tel:${item.number}`}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Connecting to ${item.label} (${item.number})...`);
                }}
                className="card"
                style={{
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: item.bg,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#0F172A', lineHeight: '1.1' }}>
                    {item.number}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                    {item.label}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Active Green Corridor Telemetry */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
              Active Green Corridor Telemetry
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Live adaptive wave • Hamidia &amp; AIIMS to MP Nagar
            </div>
          </div>
          <span style={{
            background: '#DCFCE7',
            color: '#166534',
            fontSize: '10px',
            fontWeight: '800',
            padding: '2px 8px',
            borderRadius: '999px'
          }}>
            ● PREEMPTING
          </span>
        </div>

        <div className="card" style={{ padding: '14px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
              <span style={{ color: '#00B368' }}>▲</span>
              <span>VIP Road to MP Nagar Zone-1</span>
            </div>
            <span style={{
              background: '#EFF6FF',
              color: '#2563EB',
              fontSize: '10px',
              fontWeight: '800',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              ITS Sync 99.4%
            </span>
          </div>

          {/* Signal Matrix Row */}
          <div style={{
            background: 'white',
            borderRadius: '10px',
            padding: '8px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={14} color="#00B368" />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#334155' }}>
                Signal Preemption Matrix: <span style={{ color: '#059669' }}>Wave Synchronized</span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00B368' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00B368' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00B368' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00B368' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CBD5E1' }} />
            </div>
          </div>

          {/* 3 Telemetry Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '12px' }}>
            <div style={{ background: 'white', padding: '8px 4px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A' }}>8</div>
              <div style={{ fontSize: '9px', fontWeight: '700', color: '#64748B' }}>Junctions Preempted</div>
            </div>
            <div style={{ background: 'white', padding: '8px 4px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#00B368' }}>-14m</div>
              <div style={{ fontSize: '9px', fontWeight: '700', color: '#64748B' }}>Time Saved</div>
            </div>
            <div style={{ background: 'white', padding: '8px 4px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '13px', fontWeight: '900', color: '#059669', paddingTop: '3px' }}>PRIORITY</div>
              <div style={{ fontSize: '9px', fontWeight: '700', color: '#64748B' }}>Corridor Clear</div>
            </div>
          </div>

          {/* Corridor Progress Bar */}
          <div>
            <div style={{ width: '100%', height: '6px', borderRadius: '999px', background: '#E2E8F0', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{ width: '65%', height: '100%', background: '#015C3B', borderRadius: '999px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B', fontWeight: '600' }}>
              <span>Hamidia Trauma</span>
              <span style={{ color: '#015C3B', fontWeight: '800' }}>Current: Roshanpura Sq.</span>
              <span>AIIMS Bhopal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Designated Trauma Centers */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
              Designated Trauma Centers
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Real-time bed availability &amp; green route guidance
            </div>
          </div>
          <button 
            onClick={onNavigateToMap}
            style={{ background: 'none', border: 'none', color: '#00B368', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
          >
            View Map
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {traumaCenters.map((hub) => (
            <div key={hub.id} className="card" style={{ padding: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span style={{
                  background: '#EFF6FF',
                  color: '#1E40AF',
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  {hub.tag}
                </span>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '15px', fontWeight: '900', color: '#0F172A' }}>{hub.eta}</span>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>{hub.dist}</div>
                </div>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '2px' }}>
                {hub.name}
              </h4>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '10px' }}>
                {hub.sub}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{
                  background: '#DCFCE7',
                  color: '#166534',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  ✓ {hub.perk1}
                </span>
                <span style={{
                  background: '#F1F5F9',
                  color: '#334155',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  {hub.perk2}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={onStartNavigation}
                  className="btn-primary-green"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Navigation size={14} />
                  <span>Navigate Priority Route</span>
                </button>

                <a
                  href={`tel:${hub.phone}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Calling ${hub.name} at ${hub.phone}...`);
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0F172A',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Phone size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citizen Rapid Transit Assist */}
      <div>
        <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '2px' }}>
          Citizen Rapid Transit Assist
        </div>
        <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '10px' }}>
          Help clear the way &amp; access electric recovery services
        </div>

        {/* Card 1: Report Obstruction */}
        <div className="card" style={{ padding: '14px', marginBottom: '10px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={16} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                Report Medical Route Obstruction
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.4' }}>
                Spotted a traffic jam, illegal parking, or breakdown blocking an active green corridor?
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => alert('Camera photo capture opened for incident report')}
              style={{
                flex: 1,
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Camera size={13} />
              <span>Photo / Quick Report</span>
            </button>

            <button
              onClick={() => alert('GPS tag captured: Lat 23.2332, Lng 77.4343')}
              style={{
                flex: 1,
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <MapPin size={13} />
              <span>GPS Tag</span>
            </button>
          </div>
        </div>

        {/* Card 2: EV Mobile Emergency Booster */}
        <div className="card" style={{ padding: '14px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#DCFCE7',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Zap size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                  EV Mobile Emergency Booster
                </div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>
                  60 kW Direct DC Boost • Bhopal Citywide
                </div>
              </div>
            </div>

            <span style={{
              background: '#00B368',
              color: 'white',
              fontSize: '10px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              15 Min Dispatch
            </span>
          </div>

          <p style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.4', marginBottom: '12px' }}>
            On-demand DC Fast Charge van for critical EV transit, patient carriers, and stranded emergency commuters.
          </p>

          <button
            onClick={() => {
              setEvDispatched(true);
              alert('Emergency EV Booster van dispatched to your current location (ETA 14 mins).');
            }}
            style={{
              width: '100%',
              background: evDispatched ? '#059669' : '#F1F5F9',
              color: evDispatched ? 'white' : '#0F172A',
              border: '1px solid #CBD5E1',
              borderRadius: '10px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Zap size={14} />
            <span>{evDispatched ? '✓ Mobile Fast Charger Dispatched' : 'Dispatch Mobile Fast Charger'}</span>
          </button>
        </div>
      </div>

      {/* Statutory Footer Disclaimer */}
      <div style={{
        background: '#F8FAFC',
        borderRadius: '14px',
        padding: '12px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-start',
        fontSize: '10px',
        color: '#64748B',
        lineHeight: '1.4'
      }}>
        <ShieldAlert size={16} color="#00B368" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          Managed via Bhopal Smart City Development Corporation Ltd (BSCDCL) Intelligent Traffic Management System (ITMS). Unauthorized misuse of green preemption is subject to penalties under the Motor Vehicles Act.
        </span>
      </div>
    </div>
  );
}
