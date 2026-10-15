import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  MapPin, 
  Radio, 
  Navigation, 
  Eye, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Compass, 
  Send,
  Plane,
  ChevronRight,
  Lock
} from 'lucide-react';

interface SectorPoint {
  id: string;
  name: string;
  zone: 'Lagos' | 'Abuja' | 'Niger Delta';
  type: 'HQ Command' | 'Drone Corridor' | 'Tactical Dispatch' | 'Maritime Escort';
  coordinates: string;
  readiness: 'Active 24/7' | 'On Station' | 'Patrol Sweep';
  coverage: string;
  description: string;
}

export const OperationsMapPage: React.FC = () => {
  const { navigate, openAiChatWithPrompt } = useApp();
  const [selectedZone, setSelectedZone] = useState<'All' | 'Lagos' | 'Abuja' | 'Niger Delta'>('All');
  const [selectedSector, setSelectedSector] = useState<string>('sec-vi');
  const [showDronePaths, setShowDronePaths] = useState(true);

  const sectors: SectorPoint[] = [
    {
      id: 'sec-vi',
      name: 'Victoria Island Central Command & Monitoring HQ',
      zone: 'Lagos',
      type: 'HQ Command',
      coordinates: '6.4281° N, 3.4219° E',
      readiness: 'Active 24/7',
      coverage: 'Victoria Island, Ikoyi, Oniru, Lekki Phase 1',
      description: 'Central operations room with 24/7 multi-screen video wall, redundant satellite telemetry, and direct radio dispatch to motorized tactical units.'
    },
    {
      id: 'sec-lekki',
      name: 'Lekki Free Zone & Coastal Industrial Easement',
      zone: 'Lagos',
      type: 'Drone Corridor',
      coordinates: '6.4350° N, 3.9620° E',
      readiness: 'Patrol Sweep',
      coverage: 'Refinery easements, industrial docks, FTZ warehouses',
      description: 'Scheduled long-endurance VTOL drone reconnaissance monitoring perimeter fences and logistics corridors with FLIR thermal night optics.'
    },
    {
      id: 'sec-apapa',
      name: 'Apapa Port & Marine Littoral Corridor',
      zone: 'Lagos',
      type: 'Maritime Escort',
      coordinates: '6.4474° N, 3.3667° E',
      readiness: 'On Station',
      coverage: 'Tin Can Island, Apapa Quays, Commercial Anchorages',
      description: 'Armed escort patrol craft and waterside static security teams operating in joint coordination with Nigerian Navy and NIMASA detachments.'
    },
    {
      id: 'sec-abuja-cbd',
      name: 'Abuja Diplomatic Zone & Central Business District',
      zone: 'Abuja',
      type: 'Tactical Dispatch',
      coordinates: '9.0765° N, 7.3986° E',
      readiness: 'Active 24/7',
      coverage: 'Maitama, Asokoro, Central Area, Airport Expressway',
      description: 'Rapid response tactical intervention squads, B6/B7 armored executive escort convoys, and VIP protocol tarmac transfers at NAIA airport.'
    },
    {
      id: 'sec-ph-onne',
      name: 'Onne Deepwater Port & Trans-Amadi Hub',
      zone: 'Niger Delta',
      type: 'Maritime Escort',
      coordinates: '4.7173° N, 7.1541° E',
      readiness: 'Active 24/7',
      coverage: 'Onne Oil & Gas Free Zone, Trans-Amadi Industrial Complex',
      description: 'Specialist oilfield and port facility protection adhering to ISPS Code standards, escort vessel management, and pipeline easement surveillance.'
    },
    {
      id: 'sec-delta-pipe',
      name: 'Escravos & Western Delta Pipeline Right-of-Way',
      zone: 'Niger Delta',
      type: 'Drone Corridor',
      coordinates: '5.5833° N, 5.1667° E',
      readiness: 'Patrol Sweep',
      coverage: 'Crude trunklines, flow stations, riverine terminals',
      description: 'Distributed Acoustic Sensing (DAS) fiber-optic ground sensors combined with autonomous drone sweeps to prevent hot-tapping and illegal bunkering.'
    }
  ];

  const filteredSectors = selectedZone === 'All' 
    ? sectors 
    : sectors.filter(s => s.zone === selectedZone);

  const activeSectorData = sectors.find(s => s.id === selectedSector) || sectors[0];

  return (
    <div className="py-12 bg-slate-950 text-slate-100 min-h-screen space-y-10">
      
      {/* Title & Directive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Navigation className="w-4 h-4" />
          <span>Geospatial Tactical Deployments</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
          SafeNet Operational Command Sectors
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Explore SafeNet's synchronized deployment grid across Nigeria: 24/7 Command Monitoring Centers, drone reconnaissance flight corridors, and rapid tactical dispatch staging areas in Lagos, Abuja, and the Niger Delta.
        </p>
      </div>

      {/* Main Operations Canvas and Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          {/* Map Display & Sector Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Zone Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {(['All', 'Lagos', 'Abuja', 'Niger Delta'] as const).map(zone => (
                  <button
                    key={zone}
                    onClick={() => setSelectedZone(zone)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                      selectedZone === zone
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDronePaths}
                    onChange={(e) => setShowDronePaths(e.target.checked)}
                    className="accent-amber-400 rounded"
                  />
                  <span>Drone Corridor Overlay</span>
                </label>
              </div>
            </div>

            {/* Simulated Tactical Map Canvas */}
            <div className="relative aspect-[16/9] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-6 flex flex-col justify-between">
              
              {/* Radar Grid Graphic */}
              <div className="absolute inset-0 bg-security-grid opacity-30 pointer-events-none" />
              <div className="absolute right-8 top-8 w-44 h-44 rounded-full border border-amber-400/20 radar-sweep pointer-events-none opacity-40" />
              
              {/* Overlay Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                    Command Telemetry Active · Real-Time Grid
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  WGS84 Nigeria Geodetic Projection
                </div>
              </div>

              {/* Interactive Sector Nodes */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto py-4">
                {filteredSectors.map(sector => {
                  const isSelected = sector.id === selectedSector;
                  return (
                    <button
                      key={sector.id}
                      onClick={() => setSelectedSector(sector.id)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400/20 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/50'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-mono">{sector.zone}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          sector.readiness === 'Active 24/7' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`} />
                      </div>
                      <div className="font-bold text-xs line-clamp-1">{sector.name}</div>
                      <div className="text-[10px] text-amber-400 font-mono mt-0.5">{sector.type}</div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Canvas Telemetry Strip */}
              <div className="relative z-10 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                <div>Active Unit: <span className="text-white font-bold">{activeSectorData.name}</span></div>
                <div>Coordinates: <span className="text-amber-400">{activeSectorData.coordinates}</span></div>
              </div>
            </div>

            {/* Tactical Sector Details Card */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-display font-bold text-white">{activeSectorData.name}</h3>
                  <div className="text-xs text-amber-400 font-mono">{activeSectorData.type} · {activeSectorData.zone} Region</div>
                </div>
                <span className="px-3 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold">
                  {activeSectorData.readiness}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeSectorData.description}
              </p>

              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-white">Covered Operational Perimeters: </span>
                <span>{activeSectorData.coverage}</span>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Operational Readiness & Dispatch (4 cols) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                  Regional Command Directory
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Direct contact protocols for SafeNet regional tactical supervisors.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Lagos Main Directorate</span>
                    <span className="text-emerald-400 font-mono text-[10px]">HQ LIVE</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">Victoria Island Operational Station</div>
                  <div className="text-amber-400 font-mono text-[11px]">+234 813 129 6054</div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Abuja FCT Tactical Desk</span>
                    <span className="text-emerald-400 font-mono text-[10px]">ESCORT UNIT</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">Diplomatic Zone & VIP Convoy Logistics</div>
                  <div className="text-amber-400 font-mono text-[11px]">+234 813 129 6054</div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Port Harcourt Coastal Base</span>
                    <span className="text-emerald-400 font-mono text-[10px]">ISPS MARITIME</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">Trans-Amadi & Onne Port Operations</div>
                  <div className="text-amber-400 font-mono text-[11px]">+234 813 129 6054</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  openAiChatWithPrompt(`I am reviewing SafeNet's operational deployment in ${activeSectorData.name} (${activeSectorData.zone}). How would SafeNet coordinate physical security, CCTV feeds, and rapid mobile intervention for a facility in this corridor?`);
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Query Sector With Sentinel AI</span>
              </button>

              <button
                onClick={() => navigate('/request-quote')}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Request Deployment in this Sector</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
