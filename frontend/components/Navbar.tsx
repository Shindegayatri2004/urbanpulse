import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, User, LogOut } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Live Map', href: '/map' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'AI Model', href: '/prediction' },
];

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('up_user');
    if (stored) setUser(JSON.parse(stored));
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem('up_token');
    localStorage.removeItem('up_user');
    setUser(null);
    router.push('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="scan-line" />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
          </div>
          <span className="font-orbitron text-sm font-bold text-white">
            Urban<span className="text-cyan-400">Pulse</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = router.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-rajdhani font-semibold tracking-wider transition-all duration-200 rounded ${
                  active
                    ? 'text-cyan-400 bg-cyan-500/10'
                    : 'text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-sm text-slate-200 font-rajdhani">{user.name}</span>
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-xl border border-cyan-500/20 overflow-hidden"
                  >
                    <Link
                      href="/profile"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                    >
                      <User size={14} /> My Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-1.5 text-sm text-slate-300 hover:text-cyan-400 font-rajdhani font-semibold tracking-wider transition-all"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-1.5 text-sm font-rajdhani font-semibold tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-neon-blue transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-300 hover:text-cyan-400 transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass-strong border-t border-cyan-500/10 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-cyan-400 font-rajdhani font-semibold tracking-wider hover:bg-cyan-500/10 rounded transition-all"
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="flex gap-2 pt-2 border-t border-cyan-500/10">
                  <Link href="/auth/login" className="flex-1 text-center py-2 text-sm text-slate-300 glass rounded-lg" onClick={() => setOpen(false)}>Login</Link>
                  <Link href="/auth/signup" className="flex-1 text-center py-2 text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg" onClick={() => setOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
