export default function GlassButton({ children, onClick, variant = 'default', className = '', disabled = false, active = false }) {
  const variants = {
    default: 'bg-white/5 hover:bg-white/10 border-white/10',
    primary: 'bg-sky-500/15 hover:bg-sky-500/25 border-sky-400/20 text-sky-300',
    danger: 'bg-red-500/15 hover:bg-red-500/25 border-red-400/20 text-red-300',
    success: 'bg-green-500/15 hover:bg-green-500/25 border-green-400/20 text-green-300'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2.5 rounded-xl border text-sm font-medium
        backdrop-blur-lg transition-all duration-200 ease-out
        disabled:opacity-40 disabled:cursor-not-allowed
        ${active ? 'bg-white/12 border-white/20 shadow-lg' : variants[variant] || variants.default}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
