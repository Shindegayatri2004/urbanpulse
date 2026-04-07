import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Map, RefreshCw, Info } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import { trafficAPI } from '../../components/api';

interface CityTraffic {
  name: string;
  lat: number;
  lng: number;
  vehicles: number;
  level: string;
  score: number;
}

const LEVEL_COLOR = {
  Smooth: '#00ff88',
  Moderate: '#ffee00',
  Heavy: '#ff8800',
  Severe: '#ff2244',
};

export default function LiveMap() {
  const mapRef = useRef<any>(null);
  const [cities, setCities] = useState<CityTraffic[]>([]);
  const [selected, setSelected] = useState<CityTraffic | null>(null);
  const [loading, setLoading] = useState(true);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [routeResult, setRouteResult] = useState<any>(null);

  const fetchTraffic = () => {
    setLoading(true);
    trafficAPI.liveTraffic()
      .then((r) => setCities(r.data.cities))
      .catch(() => {
        setCities([
          { name: 'Mumbai', lat: 19.076, lng: 72.877, vehicles: 2100, level: 'Heavy', score: 72 },
          { name: 'Delhi', lat: 28.613, lng: 77.209, vehicles: 2650, level: 'Severe', score: 89 },
          { name: 'Bangalore', lat: 12.971, lng: 77.594, vehicles: 1980, level: 'Heavy', score: 65 },
          { name: 'Pune', lat: 18.520, lng: 73.856, vehicles: 1420, level: 'Moderate', score: 48 },
          { name: 'Hyderabad', lat: 17.385, lng: 78.486, vehicles: 1580, level: 'Moderate', score: 52 },
          { name: 'Chennai', lat: 13.083, lng: 80.270, vehicles: 820, level: 'Smooth', score: 28 },
          { name: 'Kolkata', lat: 22.572, lng: 88.363, vehicles: 1900, level: 'Heavy', score: 68 },
          { name: 'Ahmedabad', lat: 23.023, lng: 72.571, vehicles: 940, level: 'Smooth', score: 32 },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTraffic();
    const interval = setInterval(fetchTraffic, 30000);
    return () => clearInterval(interval);
  }, []);

  // Dynamically load Leaflet on client only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLeafletLoaded(true);
    }
  }, []);

  const simulateRoute = () => {
    if (!routeFrom || !routeTo) return;
    const dist = Math.round(Math.random() * 300 + 50);
    const time = Math.round(dist / 45 * 60);
    setRouteResult({
      from: routeFrom,
      to: routeTo,
      distance: dist,
      time,
      altTime: Math.round(time * 1.3),
      altRoute: `Via NH-${Math.round(Math.random() * 50 + 1)}`,
    });
  };

  return (
    <>
      <Head><title>Live Map – UrbanPulse</title></Head>
      <PageLayout title="LIVE TRAFFIC MAP" subtitle="Real-time congestion heatmap across Indian smart cities">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Map container */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl border border-cyan-500/15 overflow-hidden"
              style={{ height: 520 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/10">
                <div className="flex items-center gap-2">
                  <Map size={16} className="text-cyan-400" />
                  <span className="text-xs font-orbitron font-semibold text-white tracking-wide">INDIA TRAFFIC HEATMAP</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-slate-400 font-rajdhani">LIVE</span>
                  </span>
                  <button onClick={fetchTraffic} className="text-slate-400 hover:text-cyan-400 transition-colors">
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>

              {/* SVG Map of India with city markers */}
              <div className="relative w-full h-full bg-[#060e1a]">
                <svg
                  viewBox="0 0 500 560"
                  className="w-full h-full"
                  style={{ background: 'radial-gradient(ellipse at center, #0a1628 0%, #060b14 100%)' }}
                >
                  {/* Grid */}
                  <defs>
                    <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(0,212,255,0.04)" strokeWidth="0.5" />
                    </pattern>
                    <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="500" height="560" fill="url(#grid)" />

                  {/* India outline (simplified) */}
                  <path
                    d="M 165 40 L 200 35 L 240 30 L 270 38 L 300 32 L 330 45 L 345 70 L 355 100 L 360 130 L 370 155 L 385 175 L 395 200 L 400 225 L 405 250 L 400 275 L 385 295 L 365 315 L 340 340 L 315 365 L 295 390 L 270 415 L 250 445 L 240 470 L 250 490 L 245 510 L 230 500 L 220 480 L 205 455 L 190 430 L 170 405 L 145 380 L 120 355 L 100 325 L 88 300 L 80 270 L 78 240 L 82 210 L 90 185 L 100 160 L 112 138 L 120 115 L 128 90 L 140 68 Z"
                    fill="none"
                    stroke="rgba(0,212,255,0.12)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 165 40 L 200 35 L 240 30 L 270 38 L 300 32 L 330 45 L 345 70 L 355 100 L 360 130 L 370 155 L 385 175 L 395 200 L 400 225 L 405 250 L 400 275 L 385 295 L 365 315 L 340 340 L 315 365 L 295 390 L 270 415 L 250 445 L 240 470 L 250 490 L 245 510 L 230 500 L 220 480 L 205 455 L 190 430 L 170 405 L 145 380 L 120 355 L 100 325 L 88 300 L 80 270 L 78 240 L 82 210 L 90 185 L 100 160 L 112 138 L 120 115 L 128 90 L 140 68 Z"
                    fill="rgba(0,100,180,0.04)"
                  />

                  {/* City markers */}
                  {cities.map((city) => {
                    // Map lat/lng to SVG coords
                    const x = ((city.lng - 68) / (90 - 68)) * 320 + 80;
                    const y = ((35 - city.lat) / (35 - 8)) * 460 + 45;
                    const color = LEVEL_COLOR[city.level as keyof typeof LEVEL_COLOR] || '#00d4ff';
                    const r = 8 + city.score / 12;
                    const isSelected = selected?.name === city.name;

                    return (
                      <g key={city.name} onClick={() => setSelected(city)} style={{ cursor: 'pointer' }}>
                        {/* Outer glow ring */}
                        <circle cx={x} cy={y} r={r * 2.5} fill={color} opacity={0.08} />
                        <circle cx={x} cy={y} r={r * 1.6} fill={color} opacity={0.12}>
                          <animate attributeName="r" values={`${r * 1.4};${r * 2};${r * 1.4}`} dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite" />
                        </circle>
                        {/* Core dot */}
                        <circle cx={x} cy={y} r={r} fill={color} opacity={0.85}
                          stroke={isSelected ? '#fff' : color} strokeWidth={isSelected ? 2 : 0.5}
                          filter={`drop-shadow(0 0 6px ${color})`}
                        />
                        {/* City label */}
                        <text x={x + r + 4} y={y + 4} fontSize="9" fill="#94a3b8" fontFamily="Rajdhani">{city.name}</text>
                      </g>
                    );
                  })}
                </svg>

                {/* Legend overlay */}
                <div className="absolute bottom-4 left-4 glass rounded-xl p-3 border border-cyan-500/15">
                  <p className="text-xs font-rajdhani font-semibold text-slate-400 mb-2 tracking-wider">CONGESTION LEVEL</p>
                  {Object.entries(LEVEL_COLOR).map(([level, color]) => (
                    <div key={level} className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                      <span className="text-xs font-rajdhani text-slate-300">{level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {/* Selected city detail */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-5 border border-cyan-500/15"
            >
              <h3 className="text-xs font-orbitron font-semibold text-white tracking-wide mb-4">
                {selected ? selected.name.toUpperCase() + ' — DETAIL' : 'CLICK A CITY'}
              </h3>
              {selected ? (
                <>
                  <div
                    className="rounded-xl p-4 mb-4 text-center"
                    style={{
                      background: `${LEVEL_COLOR[selected.level as keyof typeof LEVEL_COLOR]}15`,
                      border: `1px solid ${LEVEL_COLOR[selected.level as keyof typeof LEVEL_COLOR]}30`,
                    }}
                  >
                    <p className="text-4xl font-orbitron font-bold"
                      style={{ color: LEVEL_COLOR[selected.level as keyof typeof LEVEL_COLOR] }}>
                      {selected.vehicles.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 font-rajdhani mt-1">vehicles / hr</p>
                    <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full font-rajdhani font-semibold"
                      style={{
                        color: LEVEL_COLOR[selected.level as keyof typeof LEVEL_COLOR],
                        background: `${LEVEL_COLOR[selected.level as keyof typeof LEVEL_COLOR]}15`,
                        border: `1px solid ${LEVEL_COLOR[selected.level as keyof typeof LEVEL_COLOR]}30`,
                      }}
                    >{selected.level}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${selected.score}%`,
                      background: LEVEL_COLOR[selected.level as keyof typeof LEVEL_COLOR],
                    }} />
                  </div>
                  <p className="text-xs text-slate-500 font-rajdhani mt-2 text-right">Congestion: {selected.score}%</p>
                </>
              ) : (
                <div className="text-center py-8">
                  <Info size={32} className="text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-rajdhani">Select a city on the map to view details</p>
                </div>
              )}
            </motion.div>

            {/* City list */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-5 border border-cyan-500/15"
            >
              <h3 className="text-xs font-orbitron font-semibold text-white tracking-wide mb-3">ALL CITIES</h3>
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {cities.map((city) => {
                  const color = LEVEL_COLOR[city.level as keyof typeof LEVEL_COLOR] || '#00d4ff';
                  return (
                    <button
                      key={city.name}
                      onClick={() => setSelected(city)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left ${selected?.name === city.name ? 'bg-cyan-500/10 border border-cyan-500/20' : 'hover:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                        <span className="text-sm text-slate-200 font-rajdhani">{city.name}</span>
                      </div>
                      <span className="text-xs font-rajdhani" style={{ color }}>{city.level}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Route optimization */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-5 border border-cyan-500/15"
            >
              <h3 className="text-xs font-orbitron font-semibold text-white tracking-wide mb-3">ROUTE OPTIMIZER</h3>
              <div className="space-y-2 mb-3">
                <input
                  type="text"
                  placeholder="From (e.g. Kopargaon)"
                  value={routeFrom}
                  onChange={(e) => setRouteFrom(e.target.value)}
                  className="w-full bg-[#0a1020] border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-white font-rajdhani placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
                <input
                  type="text"
                  placeholder="To (e.g. Pune)"
                  value={routeTo}
                  onChange={(e) => setRouteTo(e.target.value)}
                  className="w-full bg-[#0a1020] border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-white font-rajdhani placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  onClick={simulateRoute}
                  className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-orbitron font-semibold tracking-wider rounded-lg hover:shadow-neon-blue transition-all"
                >
                  FIND ROUTE
                </button>
              </div>
              {routeResult && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <div className="glass rounded-lg p-3 border border-green-500/20">
                    <p className="text-xs text-green-400 font-rajdhani font-semibold mb-1">⚡ FASTEST ROUTE</p>
                    <p className="text-xs text-slate-300 font-rajdhani">{routeResult.from} → {routeResult.to}</p>
                    <p className="text-sm font-orbitron text-white mt-1">{routeResult.time} min · {routeResult.distance} km</p>
                  </div>
                  <div className="glass rounded-lg p-3 border border-yellow-500/20">
                    <p className="text-xs text-yellow-400 font-rajdhani font-semibold mb-1">🔄 ALTERNATIVE</p>
                    <p className="text-xs text-slate-300 font-rajdhani">{routeResult.altRoute}</p>
                    <p className="text-sm font-orbitron text-white mt-1">{routeResult.altTime} min · {Math.round(routeResult.distance * 1.15)} km</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
