import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, LogOut, Activity } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { authAPI } from '../components/api';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try local storage first
    const stored = localStorage.getItem('up_user');
    if (stored) setProfile(JSON.parse(stored));

    // Then fetch from API
    authAPI.me()
      .then((r) => {
        setProfile(r.data);
        localStorage.setItem('up_user', JSON.stringify(r.data));
      })
      .catch(() => {
        if (!stored) router.push('/auth/login');
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem('up_token');
    localStorage.removeItem('up_user');
    router.push('/');
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <>
      <Head><title>Profile – UrbanPulse</title></Head>
      <PageLayout title="USER PROFILE" subtitle="Account information and command access details">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <span className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        ) : profile ? (
          <div className="max-w-2xl mx-auto">
            {/* Avatar card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-8 border border-cyan-500/20 text-center mb-6"
            >
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl font-orbitron font-bold text-white mx-auto shadow-neon-blue">
                  {profile.name[0].toUpperCase()}
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#060b14]" />
              </div>
              <h2 className="text-xl font-orbitron font-bold text-white mb-1">{profile.name}</h2>
              <p className="text-sm text-slate-400 font-rajdhani">Smart City Traffic Commander</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Shield size={12} className="text-cyan-400" />
                <span className="text-xs text-cyan-400 font-rajdhani font-semibold">AUTHORIZED OPERATOR</span>
              </div>
            </motion.div>

            {/* Info cards */}
            <div className="space-y-3 mb-6">
              {[
                { icon: <User size={18} />, label: 'Full Name', value: profile.name },
                { icon: <Mail size={18} />, label: 'Email Address', value: profile.email },
                { icon: <Calendar size={18} />, label: 'Account Created', value: formatDate(profile.created_at) },
                { icon: <Activity size={18} />, label: 'Account ID', value: `#UP-${String(profile.id).padStart(6, '0')}` },
              ].map(({ icon, label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-xl p-4 border border-cyan-500/12 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-rajdhani font-semibold tracking-widest text-slate-500 uppercase">{label}</p>
                    <p className="text-sm text-white font-rajdhani font-semibold mt-0.5 truncate">{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6 border border-cyan-500/15 mb-6"
            >
              <h3 className="text-xs font-orbitron font-semibold text-white tracking-wide mb-4">ACTIVITY OVERVIEW</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Predictions Run', value: '142', color: '#00d4ff' },
                  { label: 'Routes Optimized', value: '28', color: '#00ff88' },
                  { label: 'Alerts Reviewed', value: '89', color: '#ff8800' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-orbitron font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs text-slate-400 font-rajdhani mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Logout */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={logout}
              className="w-full py-3.5 glass border border-red-500/30 text-red-400 font-orbitron font-semibold text-sm tracking-widest rounded-xl hover:bg-red-500/10 hover:border-red-500/50 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={16} /> LOGOUT
            </motion.button>
          </div>
        ) : null}
      </PageLayout>
    </>
  );
}
