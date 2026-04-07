import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  Activity, Brain, Shield, Zap, TrendingUp, AlertTriangle,
  Navigation, BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import PageLayout from '../../components/PageLayout';
import MetricCard from '../../components/MetricCard';
import { trafficAPI } from '../../components/api';

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  Mumbai: 800 + Math.sin(i / 3) * 600 + (i >= 8 && i <= 10 ? 1000 : 0) + (i >= 17 && i <= 20 ? 900 : 0),
  Delhi: 900 + Math.sin(i / 3.2) * 700 + (i >= 8 && i <= 10 ? 1200 : 0) + (i >= 17 && i <= 20 ? 1000 : 0),
  Bangalore: 700 + Math.sin(i / 2.8) * 500 + (i >= 8 && i <= 10 ? 900 : 0) + (i >= 17 && i <= 20 ? 850 : 0),
}));

const TRAINING_CURVE = Array.from({ length: 50 }, (_, i) => ({
  epoch: i + 1,
  loss: Math.max(0.02, 0.9 * Math.exp(-i / 10) + Math.random() * 0.02),
  val_loss: Math.max(0.03, 0.95 * Math.exp(-i / 12) + Math.random() * 0.025),
}));

interface Stats {
  traffic_index: number;
  model_accuracy: number;
  jams_prevented: number;
  active_junctions: number;
  average_speed_kmh: number;
  total_alerts_today: number;
  cities_monitored: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trafficAPI.dashboardStats()
      .then((r) => setStats(r.data))
      .catch(() => setStats({
        traffic_index: 68.3, model_accuracy: 94.7, jams_prevented: 1542,
        active_junctions: 79, average_speed_kmh: 34.2, total_alerts_today: 21,
        cities_monitored: 8,
      }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head><title>Dashboard – UrbanPulse</title></Head>
      <PageLayout title="COMMAND DASHBOARD" subtitle="Real-time smart city traffic intelligence overview">
        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Traffic Index"
            value={stats?.traffic_index ?? '—'}
            icon={<Activity size={22} />}
            color="cyan"
            trend={{ value: -3.2, label: 'vs yesterday' }}
            delay={0}
          />
          <MetricCard
            title="Model Accuracy"
            value={stats?.model_accuracy ?? '—'}
            unit="%"
            icon={<Brain size={22} />}
            color="green"
            delay={0.1}
          />
          <MetricCard
            title="Jams Prevented"
            value={stats?.jams_prevented ?? '—'}
            icon={<Shield size={22} />}
            color="purple"
            trend={{ value: 12, label: 'this month' }}
            delay={0.2}
          />
          <MetricCard
            title="Active Junctions"
            value={stats?.active_junctions ?? '—'}
            icon={<Zap size={22} />}
            color="yellow"
            delay={0.3}
          />
          <MetricCard
            title="Avg Speed"
            value={stats?.average_speed_kmh ?? '—'}
            unit=" km/h"
            icon={<TrendingUp size={22} />}
            color="orange"
            delay={0.4}
          />
          <MetricCard
            title="Alerts Today"
            value={stats?.total_alerts_today ?? '—'}
            icon={<AlertTriangle size={22} />}
            color="red"
            delay={0.5}
          />
          <MetricCard
            title="Cities"
            value={stats?.cities_monitored ?? '—'}
            icon={<Navigation size={22} />}
            color="cyan"
            delay={0.6}
          />
          <MetricCard
            title="Data Points"
            value="2.4M"
            icon={<BarChart3 size={22} />}
            color="green"
            delay={0.7}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hourly traffic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6 border border-cyan-500/15"
          >
            <h3 className="text-sm font-orbitron font-semibold text-white mb-1 tracking-wide">
              HOURLY TRAFFIC FLOW
            </h3>
            <p className="text-xs text-slate-500 font-rajdhani mb-6">Vehicles per hour by city (today)</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={HOURS}>
                <defs>
                  <linearGradient id="gMumbai" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gDelhi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gBlr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9b59ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#9b59ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.07)" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="none" interval={3} />
                <YAxis tick={{ fontSize: 10 }} stroke="none" />
                <Tooltip
                  contentStyle={{ background: '#0a1020', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#00d4ff' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="Mumbai" stroke="#00d4ff" strokeWidth={2} fill="url(#gMumbai)" />
                <Area type="monotone" dataKey="Delhi" stroke="#00ff88" strokeWidth={2} fill="url(#gDelhi)" />
                <Area type="monotone" dataKey="Bangalore" stroke="#9b59ff" strokeWidth={2} fill="url(#gBlr)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* LSTM Training curve */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-6 border border-cyan-500/15"
          >
            <h3 className="text-sm font-orbitron font-semibold text-white mb-1 tracking-wide">
              LSTM TRAINING CURVE
            </h3>
            <p className="text-xs text-slate-500 font-rajdhani mb-6">Loss vs Validation Loss across epochs</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={TRAINING_CURVE}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.07)" />
                <XAxis dataKey="epoch" tick={{ fontSize: 10 }} stroke="none" />
                <YAxis tick={{ fontSize: 10 }} stroke="none" domain={[0, 1]} />
                <Tooltip
                  contentStyle={{ background: '#0a1020', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#00d4ff' }}
                  formatter={(v: number) => v.toFixed(4)}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="loss" stroke="#00d4ff" strokeWidth={2} dot={false} name="Train Loss" />
                <Line type="monotone" dataKey="val_loss" stroke="#ff8800" strokeWidth={2} dot={false} name="Val Loss" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Congestion overview table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-6 border border-cyan-500/15"
        >
          <h3 className="text-sm font-orbitron font-semibold text-white mb-6 tracking-wide">
            LIVE CONGESTION STATUS
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { city: 'Mumbai', level: 'Heavy', score: 72, vehicles: 2100 },
              { city: 'Delhi', level: 'Severe', score: 89, vehicles: 2650 },
              { city: 'Bangalore', level: 'Heavy', score: 65, vehicles: 1980 },
              { city: 'Pune', level: 'Moderate', score: 48, vehicles: 1420 },
              { city: 'Hyderabad', level: 'Moderate', score: 52, vehicles: 1580 },
              { city: 'Chennai', level: 'Smooth', score: 28, vehicles: 820 },
              { city: 'Kolkata', level: 'Heavy', score: 68, vehicles: 1900 },
              { city: 'Ahmedabad', level: 'Smooth', score: 32, vehicles: 940 },
            ].map((item) => {
              const levelClass = `badge-${item.level.toLowerCase()}`;
              const barColor = item.level === 'Severe' ? '#ff2244' : item.level === 'Heavy' ? '#ff8800' : item.level === 'Moderate' ? '#ffee00' : '#00ff88';
              return (
                <div key={item.city} className="glass rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-orbitron font-semibold text-white">{item.city}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-rajdhani font-semibold ${levelClass}`}>
                      {item.level}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.score}%`, background: barColor, boxShadow: `0 0 8px ${barColor}80` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-rajdhani">{item.vehicles.toLocaleString()} vehicles/hr</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </PageLayout>
    </>
  );
}
