import { ReactNode } from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function PageLayout({ children, title, subtitle }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#060b14] cyber-grid">
      <Navbar />

      {/* Ambient glow blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <main className="relative pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 pt-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full" />
              <h1 className="text-2xl font-orbitron font-bold text-white tracking-wide">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="text-slate-400 font-rajdhani text-sm ml-4 tracking-wide">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </main>
    </div>
  );
}
