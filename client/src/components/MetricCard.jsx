import { useState, useEffect, useRef } from 'react';

function AnimatedValue({ value }) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === value) return;
    prevValue.current = value;

    // Parse numeric part
    const numMatch = String(value).match(/^([\d,.]+)/);
    if (!numMatch) {
      setDisplay(value);
      return;
    }

    const suffix = String(value).replace(numMatch[1], '');
    const target = parseFloat(numMatch[1].replace(/,/g, ''));
    const start = performance.now();
    const duration = 800;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(`${current.toLocaleString()}${suffix}`);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{display}</>;
}

export default function MetricCard({ icon: Icon, label, value, sub, color = '#38bdf8' }) {
  return (
    <div className="glass glass-highlight glass-hover p-5 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div
          className="p-2.5 rounded-xl"
          style={{ background: `${color}14`, border: `1px solid ${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <div className="text-3xl font-bold tracking-tight mb-1" style={{ color }}>
        <AnimatedValue value={value} />
      </div>
      <div className="text-sm text-slate-400 font-medium">{label}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}
