export default function GlassCard({ children, className = '', hover = false, highlight = false, onClick, style }) {
  return (
    <div
      className={`glass ${highlight ? 'glass-highlight' : ''} ${hover ? 'glass-hover cursor-pointer' : ''} transition-all duration-200 ease-out ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
