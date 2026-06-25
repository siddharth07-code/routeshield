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
        {value}
      </div>
      <div className="text-sm text-slate-400 font-medium">{label}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}
