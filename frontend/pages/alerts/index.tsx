import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, RefreshCw } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import { trafficAPI } from '../../components/api';

interface Alert {
  id: number;
  type: string;
  city: string;
  location: string;
  severity: string;
  time: string;
  icon: string;
}

const SEV_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  High: { color: '#ff2244', bg: 'rgba(255,34,68,0.08)', border: 'rgba(255,34,68,0.25)' },
  Medium: { color: '#ff8800', bg: 'rgba(255,136,0,0.08)', border: 'rgba(255,136,0,0.25)' },
  Low: { color: '#ffee00', bg: 'rgba(255,238,0,0.08)', border: 'rgba(255,238,0,0.25)' },
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    setLoading(true);
    trafficAPI.alerts()
      .then((r) => setAlerts(r.data.alerts))
      .catch(() => setAlerts([
        { id: 1, type: 'Accident', city: 'Mumbai', location: 'Western Express Highway', severity: 'High', time: '10 min ago', icon: '🚨' },
        { id: 2, type: 'Heavy Rainfall', city: 'Mumbai', location: 'Andheri Junction', severity: 'Medium', time: '25 min ago', icon: '🌧️' },
        { id: 3, type: 'Road Construction', city: 'Delhi', location: 'NH-48 Gurugram Entry', severity: 'Low', time: '1 hr ago', icon: '🚧' },
        { id: 4, type: 'Signal Failure', city: 'Bangalore', location: 'Silk Board Junction', severity: 'High', time: '15 min ago', icon: '🚦' },
        { id: 5, type: 'VIP Movement', city: 'Delhi', location: 'Rajpath Avenue', severity: 'Medium', time: '45 min ago', icon: '🚔' },
        { id: 6, type: 'Accident', city: 'Pune', location: 'Swargate Circle', severity: 'High', time: '5 min ago', icon: '🚨' },
        { id: 7, type: 'Road Construction', city: 'Hyderabad', location: 'HITEC City Flyover', severity: 'Low', time: '3 hr ago', icon: '🚧' },
        { id: 8, type: 'Signal Failure', city: 'Chennai', location: 'Anna Salai–Mount Road', severity: 'Medium', time: '30 min ago', icon: '🚦' },
      ]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAlerts(); }, []);

  const allTypes = ['All', ...Array.from(new Set(alerts.map((a) => a.type)))];
  const visible = alerts.filter(
    (a) => !dismissed.includes(a.id) && (filter === 'All' || a.type === filter)
  );

  const counts = { High: 0, Medium: 0, Low: 0 };
  alerts.filter((a) => !dismissed.includes(a.id)).forEach((a) => {
    counts[a.severity as keyof typeof counts] = (counts[a.severity as keyof typeof counts] || 0) + 1;
  });

  return (
    <>
      <Head><title>Alerts – UrbanPulse</title></Head>
      <PageLayout title="TRAFFIC ALERTS" subtitle="Real-time incident monitoring across all smart cities">

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(SEV_CONFIG).map(([sev, cfg]) => (
            <motion.div
              key={sev}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4 border text-center"
              style={{ borderColor: cfg.border, background: cfg.bg }}
            >
              <p className="text-3xl font-orbitron font-bold" style={{ color: cfg.color }}>{counts[sev as keyof typeof counts]}</p>
              <p className="text-xs font-rajdhani font-semibold tracking-widest mt-1" style={{ color: cfg.color }}>{sev.toUpperCase()} SEVERITY</p>
            </motion.div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            {allTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-rajdhani font-semibold tracking-wider transition-all ${
                  filter === type
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
                    : 'glass border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <button
            onClick={fetchAlerts}
            className="flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-cyan-500/20 text-xs text-cyan-400 hover:border-cyan-500/40 transition-all"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Alert cards */}
        <div className="space-y-3">
          <AnimatePresence>
            {visible.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl p-16 border border-cyan-500/10 text-center"
              >
                <Bell size={48} className="text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 font-rajdhani">No active alerts</p>
              </motion.div>
            ) : (
              visible.map((alert, i) => {
                const cfg = SEV_CONFIG[alert.severity] || SEV_CONFIG.Low;
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="relative glass rounded-2xl p-5 border flex items-start gap-4 group"
                    style={{ borderColor: cfg.border, background: cfg.bg }}
                  >
                    {/* Severity indicator */}
                    <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: cfg.color }} />

                    {/* Icon */}
                    <div className="text-2xl flex-shrink-0">{alert.icon}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-orbitron font-semibold text-white">{alert.type}</p>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-rajdhani font-semibold"
                              style={{ color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}30` }}
                            >
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 font-rajdhani">{alert.location}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-500 font-rajdhani">{alert.city}</span>
                            <span className="text-xs text-slate-600">·</span>
                            <span className="text-xs text-slate-500 font-rajdhani">{alert.time}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setDismissed((d) => [...d, alert.id])}
                          className="text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 mt-0.5"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Pulse for High severity */}
                    {alert.severity === 'High' && (
                      <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: cfg.color }} />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: cfg.color }} />
                      </span>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </PageLayout>
    </>
  );
}
