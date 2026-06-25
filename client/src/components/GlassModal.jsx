import { X } from 'lucide-react';

export default function GlassModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay" onClick={onClose}>
      <div
        className="glass glass-highlight w-full max-w-lg mx-4 p-6 relative fade-slide-in"
        onClick={e => e.stopPropagation()}
        style={{ borderRadius: 24 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 transition-all duration-200"
          >
            <X size={16} className="text-slate-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
