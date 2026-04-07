import { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine
} from 'recharts';
import PageLayout from '../../components/PageLayout';
import { trafficAPI } from '../../components/api';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface PredictResult {
  predicted_vehicles: number;
  congestion_level: string;
  congestion_score: number;
  forecast_24h: { hour: number; vehicles: number; level: string }[];
  model_accuracy: number;
}

const LEVEL_CONFIG = {
  Smooth: { color: '#00ff88', bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.3)', desc: 'Free-flowing traffic. No significant delays expected.' },
  Moderate: { color: '#ffee00', bg: 'rgba(255,238,0,0.1)', border: 'rgba(255,238,0,0.3)', desc: 'Some congestion. Expect minor delays of 5–15 minutes.' },
  Heavy: { color: '#ff8800', bg: 'rgba(255,136,0,0.1)', border: 'rgba(255,136,0,0.3)', desc: 'Significant congestion. Delays of 20–40 minutes likely.' },
  Severe: { color: '#ff2244', bg: 'rgba(255,34,68,0.1)', border: 'rgba(255,34,68,0.3)', desc: 'Gridlock conditions. Severe delays. Consider alternative routes.' },
};

export default function Prediction() {
  const [form, setForm] = useState({ city: 'Mumbai', junction: 1, hour: 9, day: 0, month: 5 });
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await trafficAPI.predict(form);
      setResult(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Prediction failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const levelConf = result ? LEVEL_CONFIG[result.congestion_level as keyof typeof LEVEL_CONFIG] : null;

  return (
    <>
      <Head><title>AI Prediction – UrbanPulse</title></Head>
      <PageLayout title="AI PREDICTION ENGINE" subtitle="LSTM deep learning model · Traffic congestion forecasting">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-cyan-500/15"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Brain size={20} />
              </div>
              <div>
                <h2 className="text-sm font-orbitron font-semibold text-white">CONFIGURE PREDICTION</h2>
                <p className="text-xs text-slate-500 font-rajdhani">Select parameters for AI analysis</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* City */}
              <div>
                <label className="block text-xs font-rajdhani font-semibold tracking-widest text-slate-400 uppercase mb-2">City</label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-[#0a1020] border border-cyan-500/20 rounded-xl px-4 py-3 text-white font-rajdhani text-sm focus:outline-none focus:border-cyan-500/50 hover:border-cyan-500/40 transition-colors"
                >
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Junction */}
              <div>
                <label className="block text-xs font-rajdhani font-semibold tracking-widest text-slate-400 uppercase mb-2">
                  Junction (1–15)
                </label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={form.junction}
                  onChange={(e) => setForm({ ...form, junction: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#0a1020] border border-cyan-500/20 rounded-xl px-4 py-3 text-white font-rajdhani text-sm focus:outline-none focus:border-cyan-500/50 hover:border-cyan-500/40 transition-colors"
                />
              </div>

              {/* Hour slider */}
              <div>
                <label className="block text-xs font-rajdhani font-semibold tracking-widest text-slate-400 uppercase mb-2">
                  Hour: <span className="text-cyan-400">{form.hour}:00</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={23}
                  value={form.hour}
                  onChange={(e) => setForm({ ...form, hour: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-xs text-slate-500 font-rajdhani mt-1">
                  <span>0:00</span><span>6:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
                </div>
              </div>

              {/* Day */}
              <div>
                <label className="block text-xs font-rajdhani font-semibold tracking-widest text-slate-400 uppercase mb-2">Day of Week</label>
                <select
                  value={form.day}
                  onChange={(e) => setForm({ ...form, day: parseInt(e.target.value) })}
                  className="w-full bg-[#0a1020] border border-cyan-500/20 rounded-xl px-4 py-3 text-white font-rajdhani text-sm focus:outline-none focus:border-cyan-500/50 hover:border-cyan-500/40 transition-colors"
                >
                  {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                </select>
              </div>

              {/* Month */}
              <div>
                <label className="block text-xs font-rajdhani font-semibold tracking-widest text-slate-400 uppercase mb-2">Month</label>
                <select
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: parseInt(e.target.value) })}
                  className="w-full bg-[#0a1020] border border-cyan-500/20 rounded-xl px-4 py-3 text-white font-rajdhani text-sm focus:outline-none focus:border-cyan-500/50 hover:border-cyan-500/40 transition-colors"
                >
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </div>

              {error && <p className="text-red-400 text-xs font-rajdhani bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</p>}

              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-orbitron font-semibold text-sm tracking-widest rounded-xl hover:shadow-neon-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ANALYZING...
                  </>
                ) : (
                  <><Zap size={16} /> RUN AI PREDICTION</>
                )}
              </button>
            </div>
          </motion.div>

          {/* Result */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-2xl p-6 border"
                  style={{ borderColor: levelConf?.border }}
                >
                  <h2 className="text-sm font-orbitron font-semibold text-white mb-6 tracking-wide">PREDICTION RESULT</h2>

                  {/* Main result */}
                  <div
                    className="rounded-xl p-6 mb-6 text-center"
                    style={{ background: levelConf?.bg, border: `1px solid ${levelConf?.border}` }}
                  >
                    <p className="text-xs font-rajdhani tracking-widest text-slate-400 uppercase mb-2">Predicted Vehicles</p>
                    <p className="text-6xl font-orbitron font-bold mb-2" style={{ color: levelConf?.color }}>
                      {result.predicted_vehicles.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-400 font-rajdhani mb-4">vehicles per hour</p>

                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full" style={{ background: levelConf?.bg, border: `1px solid ${levelConf?.border}` }}>
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: levelConf?.color }} />
                      <span className="font-orbitron font-bold text-lg" style={{ color: levelConf?.color }}>
                        {result.congestion_level.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-rajdhani mt-4">{levelConf?.desc}</p>
                  </div>

                  {/* Score bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-400 font-rajdhani mb-2">
                      <span>Congestion Score</span>
                      <span style={{ color: levelConf?.color }}>{result.congestion_score}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.congestion_score}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${levelConf?.color}60, ${levelConf?.color})`, boxShadow: `0 0 10px ${levelConf?.color}60` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-rajdhani text-center">
                    Model accuracy: <span className="text-cyan-400">{result.model_accuracy}%</span> · {form.city} Junction {form.junction}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-2xl p-12 border border-cyan-500/10 text-center"
                >
                  <Brain size={48} className="text-cyan-500/30 mx-auto mb-4" />
                  <p className="text-slate-500 font-rajdhani">Configure parameters and run prediction</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 24h forecast chart */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6 border border-cyan-500/15"
              >
                <h3 className="text-sm font-orbitron font-semibold text-white mb-1 tracking-wide">24-HOUR FORECAST</h3>
                <p className="text-xs text-slate-500 font-rajdhani mb-4">Predicted vehicle flow throughout the day</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={result.forecast_24h}>
                    <defs>
                      <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.07)" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="none" tickFormatter={(v) => `${v}h`} />
                    <YAxis tick={{ fontSize: 10 }} stroke="none" />
                    <Tooltip
                      contentStyle={{ background: '#0a1020', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, fontSize: 12 }}
                      labelFormatter={(v) => `${v}:00`}
                    />
                    <ReferenceLine x={form.hour} stroke="#ffee00" strokeDasharray="4 4" label={{ value: 'Now', fill: '#ffee00', fontSize: 10 }} />
                    <Area type="monotone" dataKey="vehicles" stroke="#00d4ff" strokeWidth={2} fill="url(#forecastGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
        </div>
      </PageLayout>
    </>
  );
}
