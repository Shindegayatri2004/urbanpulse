import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  color?: 'cyan' | 'green' | 'yellow' | 'orange' | 'red' | 'purple';
  trend?: { value: number; label: string };
  delay?: number;
}

const colorMap = {
  cyan: {
    icon: 'text-cyan-400',
    glow: 'shadow-[0_0_20px_rgba(0,212,255,0.2)]',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/10',
    value: 'text-cyan-300',
  },
  green: {
    icon: 'text-green-400',
    glow: 'shadow-[0_0_20px_rgba(0,255,136,0.2)]',
    border: 'border-green-500/20',
    bg: 'bg-green-500/10',
    value: 'text-green-300',
  },
  yellow: {
    icon: 'text-yellow-400',
    glow: 'shadow-[0_0_20px_rgba(255,238,0,0.2)]',
    border: 'border-yellow-500/20',
    bg: 'bg-yellow-500/10',
    value: 'text-yellow-300',
  },
  orange: {
    icon: 'text-orange-400',
    glow: 'shadow-[0_0_20px_rgba(255,136,0,0.2)]',
    border: 'border-orange-500/20',
    bg: 'bg-orange-500/10',
    value: 'text-orange-300',
  },
  red: {
    icon: 'text-red-400',
    glow: 'shadow-[0_0_20px_rgba(255,34,68,0.2)]',
    border: 'border-red-500/20',
    bg: 'bg-red-500/10',
    value: 'text-red-300',
  },
  purple: {
    icon: 'text-purple-400',
    glow: 'shadow-[0_0_20px_rgba(155,89,255,0.2)]',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/10',
    value: 'text-purple-300',
  },
};

export default function MetricCard({
  title,
  value,
  unit,
  icon,
  color = 'cyan',
  trend,
  delay = 0,
}: MetricCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative glass rounded-2xl p-5 border ${c.border} ${c.glow} hover:scale-[1.02] transition-all duration-300 group overflow-hidden`}
    >
      {/* Background glow */}
      <div className={`absolute inset-0 ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />

      {/* Corner accent */}
      <div className={`absolute top-0 right-0 w-16 h-16 ${c.bg} rounded-bl-full opacity-30`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-rajdhani font-semibold tracking-widest text-slate-400 uppercase mb-2">
            {title}
          </p>
          <div className="flex items-end gap-1">
            <span className={`text-3xl font-orbitron font-bold ${c.value}`}>{value}</span>
            {unit && <span className="text-sm text-slate-500 mb-1 font-rajdhani">{unit}</span>}
          </div>
          {trend && (
            <p className={`text-xs mt-1 font-rajdhani ${trend.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${c.bg} ${c.icon}`}>{icon}</div>
      </div>
    </motion.div>
  );
}
