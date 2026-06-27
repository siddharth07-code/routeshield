import { useState, useEffect, useRef } from 'react';
import { Satellite, Route, Scan, GitBranch, BarChart3, Zap, ArrowRight, Shield, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Satellite,
    title: 'Satellite Imagery',
    description: 'High-resolution optical and SAR imagery from ISRO satellites.',
    color: '#38bdf8'
  },
  {
    icon: Scan,
    title: 'AI Road Extraction',
    description: 'Occlusion-aware deep learning identifies roads behind trees, shadows, and floodwater.',
    color: '#a78bfa'
  },
  {
    icon: GitBranch,
    title: 'Graph Intelligence',
    description: 'Road intersections become graph nodes; segments become weighted edges for network analysis.',
    color: '#4ade80'
  },
  {
    icon: BarChart3,
    title: 'Criticality Analysis',
    description: 'Betweenness centrality and articulation points identify strategically vital roads.',
    color: '#facc15'
  },
  {
    icon: Zap,
    title: 'Disaster Simulation',
    description: 'Scenario-specific road failure modeling evaluates cascading network impacts.',
    color: '#fb923c'
  },
  {
    icon: Route,
    title: 'Emergency Routing',
    description: 'Vehicle-specific route optimization and ranked road restoration priorities.',
    color: '#f87171'
  }
];

const stats = [
  { value: '12', label: 'Road Segments Monitored' },
  { value: '4', label: 'Disaster Scenarios' },
  { value: '87%', label: 'AI Confidence' },
  { value: '34K', label: 'Population Covered' },
];

function AnimatedCounter({ value, duration = 1500 }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const isPercent = value.includes('%');
    const isK = value.includes('K');
    const numStr = value.replace(/[%K]/g, '');
    const target = parseFloat(numStr);
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(`${current}${isPercent ? '%' : isK ? 'K' : ''}`);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}

export default function LandingPage({ onEnter }) {
  const [exiting, setExiting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 500);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden
      ${exiting ? 'page-exit' : loaded ? 'page-enter' : 'opacity-0'}`}
      style={{ background: 'linear-gradient(180deg, #050816 0%, #0a0e1a 50%, #050816 100%)' }}
    >
      {/* Orbital Rings Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer ring */}
        <div className="absolute w-[600px] h-[600px] orbit-ring-slow" style={{ opacity: 0.15 }}>
          <svg viewBox="0 0 600 600" className="w-full h-full">
            <circle cx="300" cy="300" r="280" fill="none" stroke="url(#ring-grad-1)" strokeWidth="0.5" strokeDasharray="4 8" />
            <circle cx="300" cy="20" r="3" fill="#38bdf8" opacity="0.6" />
            <circle cx="580" cy="300" r="2" fill="#a78bfa" opacity="0.4" />
            <defs>
              <linearGradient id="ring-grad-1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Middle ring */}
        <div className="absolute w-[420px] h-[420px] orbit-ring-reverse" style={{ opacity: 0.2 }}>
          <svg viewBox="0 0 420 420" className="w-full h-full">
            <circle cx="210" cy="210" r="195" fill="none" stroke="url(#ring-grad-2)" strokeWidth="0.5" strokeDasharray="6 6" />
            <circle cx="210" cy="15" r="2.5" fill="#4ade80" opacity="0.7" />
            <circle cx="405" cy="210" r="2" fill="#facc15" opacity="0.5" />
            <defs>
              <linearGradient id="ring-grad-2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#facc15" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Inner ring */}
        <div className="absolute w-[260px] h-[260px] orbit-ring" style={{ opacity: 0.25 }}>
          <svg viewBox="0 0 260 260" className="w-full h-full">
            <circle cx="130" cy="130" r="120" fill="none" stroke="url(#ring-grad-3)" strokeWidth="0.5" />
            <circle cx="130" cy="10" r="2" fill="#fb923c" opacity="0.8" />
            <defs>
              <linearGradient id="ring-grad-3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#f87171" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating particles */}
        {[
          { x: '15%', y: '25%', size: 2, delay: '0s', color: '#38bdf8' },
          { x: '75%', y: '20%', size: 1.5, delay: '1s', color: '#a78bfa' },
          { x: '85%', y: '65%', size: 2, delay: '2s', color: '#4ade80' },
          { x: '10%', y: '70%', size: 1.5, delay: '3s', color: '#facc15' },
          { x: '55%', y: '85%', size: 1, delay: '1.5s', color: '#f87171' },
          { x: '35%', y: '15%', size: 1, delay: '2.5s', color: '#38bdf8' },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full float-particle"
            style={{
              left: p.x, top: p.y,
              width: p.size * 2, height: p.size * 2,
              background: p.color,
              opacity: 0.4,
              animationDelay: p.delay,
              boxShadow: `0 0 8px ${p.color}40`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        {/* ISRO Badge */}
        <div className="stagger-in stagger-1 mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium
            bg-sky-500/10 border border-sky-400/20 text-sky-300 backdrop-blur-sm">
            <Sparkles size={14} />
            ISRO Space Hackathon 2025 · Prototype
          </span>
        </div>

        {/* Central Icon */}
        <div className="stagger-in stagger-2 mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-500/20 to-purple-500/20
            border border-white/10 flex items-center justify-center glow-pulse">
            <Satellite size={36} className="text-sky-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="stagger-in stagger-2 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 gradient-text-hero leading-tight">
          RouteShield AI
        </h1>

        {/* Subtitle */}
        <p className="stagger-in stagger-3 text-lg sm:text-xl text-slate-400 max-w-xl leading-relaxed mb-3 font-light">
          Satellite-to-Response Intelligence for Disaster Mobility
        </p>
        <p className="stagger-in stagger-3 text-sm text-slate-500 max-w-lg leading-relaxed mb-10">
          Uses satellite imagery and road-network graph analysis to identify critical roads,
          simulate disruptions, find emergency routes, and prioritize recovery — in real time.
        </p>

        {/* Stats Row */}
        <div className="stagger-in stagger-4 flex items-center gap-8 sm:gap-12 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-100">
                <AnimatedCounter value={stat.value} duration={1200 + i * 300} />
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="stagger-in stagger-5">
          <button
            onClick={handleEnter}
            className="group relative px-8 py-4 rounded-2xl text-base font-semibold text-white
              bg-gradient-to-r from-sky-500 to-blue-600 cta-glow
              hover:from-sky-400 hover:to-blue-500
              transition-all duration-300 flex items-center gap-3"
          >
            <Shield size={20} />
            Enter Command Center
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-16 w-full max-w-2xl">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className={`stagger-in stagger-${i + 1} glass-subtle p-4 text-left hover:bg-white/5 transition-all duration-300 cursor-default`}
                style={{ borderRadius: 16 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${feat.color}14`, border: `1px solid ${feat.color}20` }}
                  >
                    <Icon size={14} style={{ color: feat.color }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-300">{feat.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050816] to-transparent pointer-events-none" />
    </div>
  );
}
