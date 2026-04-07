import { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import PageLayout from '../../components/PageLayout';
import { trafficAPI } from '../../components/api';

interface Analytics {
  hourly: { hour: number; vehicles: number }[];
  top_junctions: { city: string; junction: number; avg_vehicles: number; level: string }[];
  city_distribution: { city: string; junctions: number }[];
}

const LEVEL_COLOR: Record<string, string> = {
  Smooth: '#00ff88', Moderate: '#ffee00', Heavy: '#ff8800', Severe: '#ff2244',
};

const PIE_COLORS = ['#00d4ff', '#00ff88', '#9b59ff', '#ff8800', '#ffee00', '#ff2244', '#00ffea', '#f472b6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-4 py-3 border border-cyan-500/20 text-xs font-rajdhani">
      <p className="text-cyan-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    trafficAPI.analytics()
      .then((r) => setData(r.data))
      .catch(() => {
        setData({
          hourly: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            vehicles: 800 + Math.sin(i / 3) * 500 + (i >= 8 && i <= 10 ? 1200 : 0) + (i >= 17 && i <= 20 ? 1000 : 0),
          })),
          top_junctions: [
            { city: 'Delhi', junction: 7, avg_vehicles: 2450, level: 'Severe' },
            { city: 'Mumbai', junction: 3, avg_vehicles: 2280, level: 'Severe' },
            { city: 'Bangalore', junction: 5, avg_vehicles: 2100, level: 'Heavy' },
            { city: 'Kolkata', junction: 2, avg_vehicles: 1980, level: 'Heavy' },
            { city: 'Pune', junction: 4, avg_vehicles: 1750, level: 'Heavy' },
            { city: 'Hyderabad', junction: 6, avg_vehicles: 1620, level: 'Moderate' },
            { city: 'Chennai', junction: 1, avg_vehicles: 1500, level: 'Moderate' },
            { city: 'Ahmedabad', junction: 3, avg_vehicles: 1200, level: 'Moderate' },
          ],
          city_distribution: [
            { city: 'Mumbai', junctions: 12 }, { city: 'Delhi', junctions: 15 },
            { city: 'Bangalore', junctions: 10 }, { city: 'Pune', junctions: 8 },
            { city: 'Hyderabad', junctions: 9 }, { city: 'Chennai', junctions: 8 },
            { city: 'Kolkata', junctions: 10 }, { city: 'Ahmedabad', junctions: 7 },
          ],
        });
      });
  }, []);

  const hourlyLabeled = data?.hourly.map((h) => ({ ...h, label: `${h.hour}:00` })) || [];

  return (
    <>
      <Head><title>Analytics – UrbanPulse</title></Head>
      <PageLayout title="TRAFFIC ANALYTICS" subtitle="City-wide congestion insights and junction performance analysis">

        {/* Hourly pattern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-cyan-500/15 mb-6"
        >
          <h3 className="text-sm font-orbitron font-semibold text-white mb-1 tracking-wide">HOURLY TRAFFIC PATTERN</h3>
          <p className="text-xs text-slate-500 font-rajdhani mb-5">Average vehicles per hour across all monitored junctions</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={hourlyLabeled}>
              <defs>
                <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.07)" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="none" interval={2} />
              <YAxis tick={{ fontSize: 10 }} stroke="none" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="vehicles" stroke="#00d4ff" strokeWidth={2.5} fill="url(#areaG)" name="Vehicles" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Junction distribution pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 border border-cyan-500/15"
          >
            <h3 className="text-sm font-orbitron font-semibold text-white mb-1 tracking-wide">JUNCTION DISTRIBUTION</h3>
            <p className="text-xs text-slate-500 font-rajdhani mb-4">Monitored junctions per city</p>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={data?.city_distribution || []}
                    dataKey="junctions"
                    nameKey="city"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    strokeWidth={0}
                  >
                    {(data?.city_distribution || []).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#0a1020', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {(data?.city_distribution || []).map((item, i) => (
                  <div key={item.city} className="flex items-center justify-between text-xs font-rajdhani">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-slate-300">{item.city}</span>
                    </div>
                    <span style={{ color: PIE_COLORS[i % PIE_COLORS.length] }}>{item.junctions}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Congestion by city bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-cyan-500/15"
          >
            <h3 className="text-sm font-orbitron font-semibold text-white mb-1 tracking-wide">AVG CONGESTION BY CITY</h3>
            <p className="text-xs text-slate-500 font-rajdhani mb-4">Average vehicle count across peak hours</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={data?.top_junctions.map((j) => ({ city: j.city, vehicles: j.avg_vehicles })) || []}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.07)" />
                <XAxis dataKey="city" tick={{ fontSize: 9 }} stroke="none" />
                <YAxis tick={{ fontSize: 10 }} stroke="none" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="vehicles" name="Vehicles" radius={[4, 4, 0, 0]}>
                  {(data?.top_junctions || []).map((entry, i) => (
                    <Cell key={i} fill={LEVEL_COLOR[entry.level] || '#00d4ff'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Top congested junctions table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-cyan-500/15"
        >
          <h3 className="text-sm font-orbitron font-semibold text-white mb-1 tracking-wide">TOP CONGESTED JUNCTIONS</h3>
          <p className="text-xs text-slate-500 font-rajdhani mb-5">Ranked by average peak-hour vehicle count</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-rajdhani">
              <thead>
                <tr className="border-b border-cyan-500/10">
                  <th className="text-left py-2 px-3 text-xs text-slate-400 tracking-widest uppercase">#</th>
                  <th className="text-left py-2 px-3 text-xs text-slate-400 tracking-widest uppercase">City</th>
                  <th className="text-left py-2 px-3 text-xs text-slate-400 tracking-widest uppercase">Junction</th>
                  <th className="text-left py-2 px-3 text-xs text-slate-400 tracking-widest uppercase">Avg Vehicles</th>
                  <th className="text-left py-2 px-3 text-xs text-slate-400 tracking-widest uppercase">Level</th>
                  <th className="text-left py-2 px-3 text-xs text-slate-400 tracking-widest uppercase">Load</th>
                </tr>
              </thead>
              <tbody>
                {(data?.top_junctions || []).map((j, i) => {
                  const color = LEVEL_COLOR[j.level] || '#00d4ff';
                  const pct = (j.avg_vehicles / 3000) * 100;
                  return (
                    <tr key={i} className="border-b border-white/5 hover:bg-cyan-500/5 transition-colors">
                      <td className="py-3 px-3 text-slate-400 font-orbitron text-xs">{String(i + 1).padStart(2, '0')}</td>
                      <td className="py-3 px-3 text-white font-semibold">{j.city}</td>
                      <td className="py-3 px-3 text-slate-300">Junction {j.junction}</td>
                      <td className="py-3 px-3 text-white font-orbitron text-sm">{j.avg_vehicles.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>
                          {j.level}
                        </span>
                      </td>
                      <td className="py-3 px-3 w-32">
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </PageLayout>
    </>
  );
}
