import { LayoutDashboard, Route, Zap, Ambulance, ListOrdered, Brain, Satellite } from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'intelligence', label: 'Road Intelligence', icon: Satellite },
  { id: 'simulator', label: 'Disruption Simulator', icon: Zap },
  { id: 'emergency', label: 'Emergency Access', icon: Ambulance },
  { id: 'recovery', label: 'Recovery Priority', icon: ListOrdered },
  { id: 'about', label: 'About Model', icon: Brain },
];

export default function Sidebar({ activeSection, onNavigate }) {
  return (
    <aside className="w-64 h-full flex flex-col p-4 flex-shrink-0 relative z-10">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8 mt-2">
        <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-400/20 flex items-center justify-center">
          <Route size={18} className="text-sky-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-100 tracking-tight">RouteShield AI</div>
          <div className="text-[10px] text-slate-500 tracking-wide">ISRO · Satellite Intelligence</div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium
                transition-all duration-200 ease-out text-left
                ${isActive
                  ? 'bg-white/10 text-slate-100 shadow-lg border border-white/10 backdrop-blur-xl'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }
              `}
            >
              <Icon size={18} className={isActive ? 'text-sky-400' : ''} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="glass-subtle p-3 mt-4" style={{ borderRadius: 14 }}>
        <div className="text-[10px] text-slate-500 leading-relaxed">
          Prototype — simulated data for demonstration. Not connected to live satellite feeds.
        </div>
      </div>
    </aside>
  );
}
