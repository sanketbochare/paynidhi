import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Activity, 
  Lock,
  ArrowUpRight,
  Fingerprint
} from 'lucide-react';

const curvePoints = [40, 55, 48, 70, 85, 90, 80, 95];

const TrustScorePage = () => {
  const score = 742;

  const chartPath = curvePoints
    .map((v, i) => {
      const x = (i / (curvePoints.length - 1)) * 100;
      const y = 100 - v;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[radial-gradient(circle_at_top,_#020617_0,_#020617_35%,_#020617_100%)] dark:text-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-24 md:pb-32 space-y-16 md:space-y-20">
        {/* HEADER ROW */}
        <section className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 md:gap-14 items-center">
          {/* LEFT COPY */}
          <motion.div
            initial={{ opacity: 0, x: -26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/40">
              <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-200">
                PayNidhi Score · Live
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                One score that explains
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-emerald-500 to-violet-500">
                  how lenders see you.
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                PayNidhi turns GST trails, invoice behaviour and anchor quality into a single, dynamic signal
                your partners can price on—without new collateral every time.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] sm:text-xs">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                Behaviour‑first underwriting
              </span>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-100">
                Updated every invoice cycle
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-100">
                Built for MSMEs on credit
              </span>
            </div>
          </motion.div>

          {/* RIGHT GAUGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="relative rounded-[2.5rem] sm:rounded-[3rem] border border-slate-200 bg-white px-6 py-7 sm:px-8 sm:py-8 shadow-[0_30px_100px_rgba(15,23,42,0.12)] overflow-hidden dark:border-white/10 dark:bg-slate-900/70 dark:backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-500/25" />
            <div className="pointer-events-none absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/25" />

            <div className="relative flex flex-col items-center gap-6">
              {/* Gauge */}
              <div className="relative">
                <motion.svg
                  className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90 text-slate-100 dark:text-slate-800"
                  viewBox="0 0 256 256"
                >
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="opacity-60"
                  />
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="40%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray={690}
                    strokeDashoffset={690}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 690 }}
                    animate={{ strokeDashoffset: 690 - (690 * 74) / 100 }}
                    transition={{ duration: 1.1, ease: 'easeOut', delay: 0.25 }}
                  />
                </motion.svg>

                {/* needle */}
                <motion.div
                  initial={{ rotate: -110 }}
                  animate={{ rotate: -110 + (220 * 0.74) }}
                  transition={{ duration: 1.1, ease: 'easeOut', delay: 0.25 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-1 w-20 origin-left rounded-full bg-gradient-to-r from-slate-400 via-emerald-400 to-emerald-500 dark:from-slate-300 dark:via-emerald-300 dark:to-emerald-400" />
                  <div className="absolute h-4 w-4 rounded-full bg-white border border-slate-300 dark:bg-slate-900 dark:border-slate-500" />
                </motion.div>

                {/* centre value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.55, duration: 0.4 }}
                    className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-50"
                  >
                    {score}
                  </motion.span>
                  <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-300">
                    Excellent
                  </span>
                  <span className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    Top 5% in your sector
                  </span>
                </div>
              </div>

              {/* quick stats */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="flex justify-between w-full gap-4 text-xs sm:text-sm"
              >
                <div className="flex-1 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-100">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-200 mb-1">
                    Impact
                  </p>
                  <p className="font-semibold flex items-center gap-1">
                    <TrendingUp size={14} className="text-emerald-600 dark:text-emerald-300" />
                    +12 pts vs last month
                  </p>
                </div>
                <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-50">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 mb-1">
                    Clean cycles
                  </p>
                  <p className="font-semibold">18 on‑time runs</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* SECOND ROW */}
        <section className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 md:gap-14 items-stretch">
          {/* Determinants */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="rounded-[2rem] border border-slate-200 bg-white px-5 py-6 sm:px-6 sm:py-7 space-y-4 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                Trust determinants
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Behaviour, not just balance sheets
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { 
                  label: 'Payment velocity', 
                  val: '98%', 
                  desc: 'Share of invoices paid on or before terms across anchors.',
                  icon: <Activity className="text-sky-500 dark:text-sky-400" />,
                  pill: '+3 pts this cycle'
                },
                { 
                  label: 'GST hygiene', 
                  val: 'Clean', 
                  desc: 'On‑time filings, low mismatches and no gaps in 12 months.',
                  icon: <Zap className="text-amber-500 dark:text-amber-300" />,
                  pill: 'No pending returns'
                },
                { 
                  label: 'Buyer mix', 
                  val: 'Balanced', 
                  desc: 'Revenue spread across anchors with strong internal ratings.',
                  icon: <Fingerprint className="text-indigo-500 dark:text-indigo-300" />,
                  pill: 'Risk diversified'
                }
              ].map((pillar, i) => (
                <motion.div
                  key={pillar.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * i, duration: 0.45 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 flex flex-col gap-3 shadow-sm dark:border-white/10 dark:bg-slate-950/70"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm dark:bg-slate-900">
                        {pillar.icon}
                      </div>
                      <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        {pillar.label}
                      </p>
                    </div>
                    <TrendingUp size={14} className="text-emerald-500 dark:text-emerald-300" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-50">
                    {pillar.val}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                  <span className="inline-flex w-max items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
                    {pillar.pill}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reliability curve – updated, professional, dark-safe */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="rounded-[2rem] border border-slate-200 bg-white text-slate-900 px-5 py-6 sm:px-6 sm:py-7 flex flex-col gap-4 shadow-sm
                       dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50 dark:backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Reliability curve
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Recent movement in your PayNidhi Score
                </p>
              </div>
              <button className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">
                Data room
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="relative w-full h-40 sm:h-48 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden
                            dark:bg-slate-900/80 dark:border-white/10">
              {/* soft glow only in dark */}
              <div className="pointer-events-none hidden dark:block absolute -top-32 left-1/4 h-64 w-64 bg-sky-500/20 blur-3xl" />

              <svg viewBox="0 0 100 100" className="relative w-full h-full">
                <defs>
                  <linearGradient id="curveLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="40%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="curveFillLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(56,189,248,0.18)" />
                    <stop offset="60%" stopColor="rgba(34,197,94,0.10)" />
                    <stop offset="100%" stopColor="rgba(248,250,252,0)" />
                  </linearGradient>
                  <linearGradient id="curveFillDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(56,189,248,0.40)" />
                    <stop offset="60%" stopColor="rgba(34,197,94,0.25)" />
                    <stop offset="100%" stopColor="rgba(15,23,42,0)" />
                  </linearGradient>
                </defs>

                {/* area – light & dark variants */}
                <motion.path
                  d={`${chartPath} L 100 100 L 0 100 Z`}
                  fill="url(#curveFillLight)"
                  className="dark:opacity-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.25 }}
                />
                <motion.path
                  d={`${chartPath} L 100 100 L 0 100 Z`}
                  fill="url(#curveFillDark)"
                  className="opacity-0 dark:opacity-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.25 }}
                />

                {/* horizontal grid lines */}
                {[25, 50, 75].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="100"
                    y2={y}
                    stroke="rgba(148,163,184,0.45)"
                    strokeWidth="0.3"
                    strokeDasharray="2 2"
                    className="dark:stroke-[rgba(51,65,85,0.8)]"
                  />
                ))}

                {/* static faint line */}
                <polyline
                  points={curvePoints
                    .map((v, i) => {
                      const x = (i / (curvePoints.length - 1)) * 100;
                      const y = 100 - v;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="rgba(148,163,184,0.6)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* animated main line */}
                <motion.path
                  d={chartPath}
                  fill="none"
                  stroke="url(#curveLine)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
                />

                {/* points + pulsing latest point */}
                {curvePoints.map((v, i) => {
                  const x = (i / (curvePoints.length - 1)) * 100;
                  const y = 100 - v;
                  const isLast = i === curvePoints.length - 1;
                  return (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isLast ? 2.2 : 1.3}
                        className={isLast ? 'fill-emerald-500' : 'fill-slate-400 dark:fill-slate-200'}
                      />
                      {isLast && (
                        <motion.circle
                          cx={x}
                          cy={y}
                          r={4}
                          fill="rgba(34,197,94,0.30)"
                          initial={{ opacity: 0, r: 0 }}
                          animate={{ opacity: [0, 1, 0], r: [0, 6, 10] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 px-1 mt-2">
              {curvePoints.map((_, i) => (
                <span key={i}>M{i + 1}</span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FOOTER CTA */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
            <Lock className="text-slate-500 dark:text-slate-300" size={28} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50">
            Identity protected.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Your PayNidhi Score is private to you. It is only shared with lenders when you explicitly opt‑in to a
            program, and every access is logged for your records.
          </p>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="bg-slate-900 text-slate-50 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 transition-colors"
          >
            Refresh my live score
          </motion.button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TrustScorePage;
