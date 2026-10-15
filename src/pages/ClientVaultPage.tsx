import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  Clock, 
  Radio, 
  Camera, 
  Users, 
  AlertTriangle, 
  FileText, 
  Download, 
  Phone, 
  RefreshCw,
  LogOut,
  ChevronRight
} from 'lucide-react';

export const ClientVaultPage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientCode, setClientCode] = useState('SFN-VI-8820');
  const [accessPin, setAccessPin] = useState('4401');
  const [activeTab, setActiveTab] = useState<'roster' | 'incidents' | 'systems' | 'drone_sweeps'>('roster');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientCode.trim() && accessPin.trim()) {
      setIsAuthenticated(true);
      showToast('Client Vault session authenticated. Command link active.');
    }
  };

  const guardRoster = [
    { id: 'GRD-102', name: 'Sgt. John Danjuma', post: 'Main Gate Access Speed Turnstile', shift: 'Day Shift (06:00 - 18:00)', status: 'On Post', lastWand: '12 mins ago (Sector A)' },
    { id: 'GRD-105', name: 'Corp. Ibrahim Musa', post: 'Loading Dock & Courier Screening', shift: 'Day Shift (06:00 - 18:00)', status: 'On Post', lastWand: '18 mins ago (Sector C)' },
    { id: 'GRD-108', name: 'Operative Blessing Okafor', post: 'Executive Concierge Reception', shift: 'Day Shift (07:00 - 19:00)', status: 'On Post', lastWand: '24 mins ago (Lobby West)' },
    { id: 'GRD-111', name: 'Mobile Sup. Segun Adeleke', post: 'Motorized Quick Intervention Unit', shift: '24-Hour Mobile Patrol', status: 'In Transit', lastWand: '08 mins ago (Perimeter Outer)' }
  ];

  const incidentLogs = [
    { id: 'INC-2026-089', time: '14:22 WAT', type: 'Visitor Flagged', details: 'Unscheduled delivery driver failed vehicle credential verification. Driver redirected to secondary holding lane.', resolution: 'Turnstile access denied. Delivery verified with facility manager.' },
    { id: 'INC-2026-088', time: '03:15 WAT', type: 'Perimeter Optical Tripwire', details: 'Zone 4 North wall motion trigger detected by thermal camera. Ground guard dispatched.', resolution: 'Checked in 38 seconds. Verified as stray animal (canine). No breach.' },
    { id: 'INC-2026-087', time: '19:40 WAT', type: 'Access Key Override', details: 'Executive server room door held open longer than 45-second threshold.', resolution: 'IT administrator badge confirmed. Door secured.' }
  ];

  const systemStatus = [
    { name: 'Central AI CCTV Array', status: 'Operational', uptime: '99.98%', nodes: '32 / 32 IP Cameras Online', lastCheck: '2 mins ago' },
    { name: 'Perimeter Laser Beam Tripwires', status: 'Operational', uptime: '100.0%', nodes: '12 Dual Infrared Transmitters', lastCheck: 'Active' },
    { name: 'Biometric Turnstiles & Speed Gates', status: 'Operational', uptime: '100.0%', nodes: '4 Main Gate Lanes Online', lastCheck: 'Synchronized' },
    { name: 'Solar & Double-Conversion UPS Bank', status: 'Optimal', uptime: '100.0%', nodes: '48V Lithium Storage (98% Reserve)', lastCheck: 'Grid Normal' }
  ];

  const droneSweeps = [
    { flightId: 'UAV-FLT-402', timestamp: 'Today, 11:30 WAT', pilot: 'Flight Operative T. Balogun (NCAA Lic. 209)', duration: '24 mins', area: 'Perimeter Boundary & Pipeline Easement (4.2 km)', status: 'Completed', findings: 'All sector lines clear. Zero unauthorized incursions.' },
    { flightId: 'UAV-FLT-401', timestamp: 'Today, 04:15 WAT', pilot: 'Autonomous Scheduled FLIR Sweep', duration: '31 mins', area: 'Night Thermal Facility Envelope', status: 'Completed', findings: 'Thermal signature scan clean. Guard post checkpoints confirmed.' }
  ];

  return (
    <div className="py-12 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Lock className="w-4 h-4" />
              <span>SafeNet Client Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Corporate Retained Client Portal
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure operational telemetry for retained enterprises, multi-storey headquarters, and gated estates.
            </p>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-bold text-white">Apex Commercial Tower (VI)</div>
                <div className="text-[10px] text-emerald-400 font-mono">Contract SLA: Active (Tier-1 Enterprise)</div>
              </div>
              <button
                onClick={() => { setIsAuthenticated(false); showToast('Logged out of Client Vault.'); }}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Vault</span>
              </button>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 mx-auto shadow-lg">
                <KeyRound className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h2 className="text-xl font-display font-bold text-white">
                Client Access Authentication
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your authorized SafeNet Contract Identifier and 4-digit Security PIN issued by your account manager.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Contract Client ID
                </label>
                <input
                  type="text"
                  required
                  value={clientCode}
                  onChange={(e) => setClientCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Security Authorization PIN
                </label>
                <input
                  type="password"
                  required
                  value={accessPin}
                  onChange={(e) => setAccessPin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Access Protected Telemetry</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
              Need assistance or forgot your PIN? Contact the Victoria Island Central Command Desk at <span className="text-amber-400 font-mono">+234 813 129 6054</span>.
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Quick KPI Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Guards on Duty</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-mono font-bold text-white">4 / 4 Active</div>
                <div className="text-[11px] text-emerald-400">100% Post Verification</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>CCTV Uptime</span>
                  <Camera className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-mono font-bold text-white">32 / 32 Live</div>
                <div className="text-[11px] text-slate-400">Command Center Uplink Online</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Perimeter Integrity</span>
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-mono font-bold text-white">Secure</div>
                <div className="text-[11px] text-slate-400">Last Sweep 24 mins ago</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Duty Commander</span>
                  <Phone className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-sm font-bold text-white">Capt. Adeleke (Rtd)</div>
                <div className="text-[11px] text-amber-400 font-mono">+234 813 129 6054</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2 text-xs font-semibold overflow-x-auto">
              {[
                { id: 'roster', label: 'Guard Post Roster & Attendance' },
                { id: 'incidents', label: 'Daily Occurrence Register (DOB)' },
                { id: 'systems', label: 'Physical Security Systems Health' },
                { id: 'drone_sweeps', label: 'Drone Aerial Patrol Sweeps' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: Guard Roster */}
            {activeTab === 'roster' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Active Shift Guard Deployment</h3>
                  <span className="text-xs text-slate-400">RFID Patrol Wand Intervals: 30 Mins</span>
                </div>
                <div className="divide-y divide-slate-800/80">
                  {guardRoster.map(guard => (
                    <div key={guard.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{guard.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">({guard.id})</span>
                        </div>
                        <div className="text-slate-400">{guard.post}</div>
                        <div className="text-[11px] text-slate-500">{guard.shift}</div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {guard.status}
                        </span>
                        <span className="text-[11px] text-slate-400">Last Wand: {guard.lastWand}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Incident Register */}
            {activeTab === 'incidents' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden space-y-4 p-6">
                <h3 className="text-sm font-bold text-white">Daily Occurrence Book (DOB) — Last 24 Hours</h3>
                <div className="space-y-3">
                  {incidentLogs.map(inc => (
                    <div key={inc.id} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-white">
                          <span className="text-amber-400">{inc.time}</span>
                          <span>·</span>
                          <span>{inc.type}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">{inc.id}</span>
                      </div>
                      <p className="text-slate-300">{inc.details}</p>
                      <div className="text-[11px] text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-900/40">
                        Resolution: {inc.resolution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Systems Health */}
            {activeTab === 'systems' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemStatus.map((sys, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-sm">{sys.name}</div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {sys.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-slate-400">
                      <div>Hardware Array: <span className="text-slate-200 font-medium">{sys.nodes}</span></div>
                      <div>System Uptime: <span className="text-emerald-400 font-mono font-bold">{sys.uptime}</span></div>
                      <div>Telemetry Ping: <span className="text-slate-400 font-mono">{sys.lastCheck}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: Drone Sweeps */}
            {activeTab === 'drone_sweeps' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white">Unmanned Aerial Surveillance Flight Logs</h3>
                <div className="space-y-4">
                  {droneSweeps.map(flight => (
                    <div key={flight.flightId} className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-2 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-800">
                        <div className="font-mono font-bold text-amber-400">{flight.flightId} · {flight.timestamp}</div>
                        <div className="text-slate-400">{flight.pilot}</div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-300">
                        <div>Patrol Zone: <span className="text-white font-medium">{flight.area}</span></div>
                        <div>Flight Duration: <span className="text-white font-medium">{flight.duration}</span></div>
                      </div>
                      <div className="p-3 bg-slate-900 rounded border border-slate-800 text-[11px] text-emerald-400">
                        Observations: {flight.findings}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
