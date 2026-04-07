import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap, Map, BarChart3, Brain, Shield, Activity,
  TrendingUp, Navigation, AlertTriangle, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { trafficAPI } from '../components/api';

const STATS = [
  { label: 'Model Accuracy', value: '94.7', unit: '%', color: '#00d4ff' },
  { label: 'Cities Monitored', value: '8', unit: '+', color: '#00ff88' },
  { label: 'Active Junctions', value: '79', unit: '', color: '#ffee00' },
  { label: 'Traffic Alerts', value: '24', unit: '/day', color: '#ff8800' },
];

const FEATURES = [
  { icon: <Brain size={28} />, title: 'LSTM Deep Learning', desc: 'TensorFlow neural network trained on millions of traffic data points from 8 Indian smart cities.' },
  { icon: <Map size={28} />, title: 'Live Traffic Map', desc: 'Interactive heatmap showing real-time congestion levels across all monitored intersections.' },
  { icon: <Navigation size={28} />, title: 'Route Optimization', desc: 'Smart routing engine suggests fastest paths, avoiding congested corridors automatically.' },
  { icon: <BarChart3 size={28} />, title: 'Advanced Analytics', desc: 'Hourly, daily, and seasonal traffic analytics with city-by-city comparison dashboards.' },
  { icon: <AlertTriangle size={28} />, title: 'Smart Alerts', desc: 'Instant notifications for accidents, road works, signal failures, and weather events.' },
  { icon: <Shield size={28} />, title: 'Secure Platform', desc: 'JWT authentication and encrypted data pipelines securing your city intelligence data.' },
];

const QUICK_LINKS = [
  { label: 'Dashboard', href: '/dashboard', icon: <Activity size={18} />, color: 'from-cyan-500 to-blue-600' },
  { label: 'Live Map', href: '/map', icon: <Map size={18} />, color: 'from-green-500 to-cyan-600' },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 size={18} />, color: 'from-purple-500 to-pink-600' },
  { label: 'AI Prediction', href: '/prediction', icon: <Brain size={18} />, color: 'from-orange-500 to-red-600' },
];

export default function Home() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Head>
        <title>UrbanPulse – Smart City Traffic Command</title>
        <meta name="description" content="AI-powered traffic intelligence for Indian smart cities" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-[#060b14] cyber-grid overflow-hidden">
        <Navbar />

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center pt-16">
          {/* Radial glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[800px] h-[800px] rounded-full bg-cyan-500/5 blur-3xl" />
          </div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-600/8 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-400/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

          {/* Grid lines effect */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-cyan-500/10"
                style={{ left: `${(i + 1) * 16.66}%` }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-cyan-500/30 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-rajdhani font-semibold tracking-widest text-slate-300 uppercase">
                System Online · AI Model Active
              </span>
            </motion.div>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-orbitron font-black text-5xl sm:text-7xl lg:text-8xl leading-none mb-4"
            >
              <span className="text-white">SMART CITY</span>
              <br />
              <span className="neon-text">TRAFFIC</span>{' '}
              <span className="text-white">COMMAND</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto my-6"
            />

            {/* Sub heading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-slate-400 font-rajdhani text-xl sm:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              AI powered traffic intelligence system for Indian smart cities.
              Uses LSTM deep learning to predict congestion and optimize travel routes.
            </motion.p>

            {/* Quick access buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center mb-16"
            >
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${link.color} text-white font-rajdhani font-semibold tracking-wider text-sm hover:scale-105 transition-all duration-200 shadow-lg`}
                >
                  {link.icon}
                  {link.label}
                  <ChevronRight size={14} />
                </Link>
              ))}
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="glass rounded-xl p-4 border border-white/10 text-center"
                >
                  <p
                    className="text-3xl font-orbitron font-bold"
                    style={{ color: s.color, textShadow: `0 0 20px ${s.color}60` }}
                  >
                    {s.value}
                    <span className="text-xl">{s.unit}</span>
                  </p>
                  <p className="text-xs text-slate-400 font-rajdhani tracking-wider mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <span className="text-xs text-slate-400 font-rajdhani tracking-widest">SCROLL</span>
            <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-400 to-transparent" />
          </div>
        </section>

        {/* Features section */}
        <section id="features" className="py-24 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-rajdhani font-semibold tracking-widest text-cyan-400 uppercase mb-3">
              Platform Capabilities
            </p>
            <h2 className="text-4xl font-orbitron font-bold text-white">
              INTELLIGENT <span className="neon-text">FEATURES</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 border border-cyan-500/15 hover:border-cyan-500/35 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:bg-cyan-500/20 transition-all">
                  {feature.icon}
                </div>
                <h3 className="font-orbitron font-semibold text-white mb-2 text-sm tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-slate-400 font-rajdhani text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-12 border border-cyan-500/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5" />
              <div className="relative">
                <Zap size={48} className="text-cyan-400 mx-auto mb-6" />
                <h2 className="text-3xl font-orbitron font-bold text-white mb-4">
                  Ready to Monitor Your City?
                </h2>
                <p className="text-slate-400 font-rajdhani mb-8">
                  Join the smart city revolution. Get started with AI-powered traffic intelligence today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signup" className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-rajdhani font-semibold tracking-wider rounded-xl hover:shadow-neon-blue transition-all">
                    Get Started Free
                  </Link>
                  <Link href="/dashboard" className="px-8 py-3 glass border border-cyan-500/30 text-cyan-400 font-rajdhani font-semibold tracking-wider rounded-xl hover:border-cyan-500/60 transition-all">
                    View Demo
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-cyan-500/10 py-8 px-4 text-center">
          <p className="text-slate-500 font-rajdhani text-sm">
            © 2024 <span className="text-cyan-400">UrbanPulse</span> · Smart City Traffic Command · Built with LSTM AI
          </p>
        </footer>
      </div>
    </>
  );
}
