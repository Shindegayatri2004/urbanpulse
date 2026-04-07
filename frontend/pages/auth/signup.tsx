import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, User, UserPlus } from 'lucide-react';
import { authAPI } from '../../components/api';

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authAPI.signup(form);
      setSuccess(true);
      // Auto-login
      const res = await authAPI.login(form.email, form.password);
      localStorage.setItem('up_token', res.data.access_token);
      localStorage.setItem('up_user', JSON.stringify(res.data.user));
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Sign Up – UrbanPulse</title></Head>
      <div className="min-h-screen bg-[#060b14] cyber-grid flex items-center justify-center px-4">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-blue-600/6 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <span className="font-orbitron text-lg font-bold text-white">
                Urban<span className="text-cyan-400">Pulse</span>
              </span>
            </Link>
            <h1 className="text-2xl font-orbitron font-bold text-white mb-2">CREATE ACCOUNT</h1>
            <p className="text-slate-400 font-rajdhani text-sm">Join the smart city command network</p>
          </div>

          <div className="glass-strong rounded-2xl p-8 border border-cyan-500/20">
            {success ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <p className="text-green-400 font-orbitron font-semibold mb-2">ACCOUNT CREATED</p>
                <p className="text-slate-400 font-rajdhani text-sm">Redirecting to dashboard…</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-rajdhani font-semibold tracking-widest text-slate-400 uppercase mb-2">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Commander Singh"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-[#0a1020] border border-cyan-500/20 rounded-xl pl-11 pr-4 py-3 text-white font-rajdhani text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 hover:border-cyan-500/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-rajdhani font-semibold tracking-widest text-slate-400 uppercase mb-2">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="commander@city.gov"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[#0a1020] border border-cyan-500/20 rounded-xl pl-11 pr-4 py-3 text-white font-rajdhani text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 hover:border-cyan-500/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-rajdhani font-semibold tracking-widest text-slate-400 uppercase mb-2">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Min 6 characters"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-[#0a1020] border border-cyan-500/20 rounded-xl pl-11 pr-4 py-3 text-white font-rajdhani text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 hover:border-cyan-500/40 transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-xs font-rajdhani bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-orbitron font-semibold text-sm tracking-widest rounded-xl hover:shadow-neon-blue transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><UserPlus size={16} /> CREATE ACCOUNT</>
                  )}
                </button>
              </form>
            )}

            {!success && (
              <div className="mt-6 pt-6 border-t border-cyan-500/10 text-center">
                <p className="text-sm text-slate-400 font-rajdhani">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                    Login
                  </Link>
                </p>
              </div>
            )}
          </div>

          <p className="text-center mt-6">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 font-rajdhani transition-colors">
              ← Back to home
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
