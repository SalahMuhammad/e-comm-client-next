import '@/styles/loaders/dots/pulsing-dots.css';

export default function PulsingDots({ 
  size = 'md', 
  color = '#e74c3c', 
  className = '' 
}) {
  const sizeClasses = {
    sm: 'pulsing-dots-sm',
    md: 'pulsing-dots-md',
    lg: 'pulsing-dots-lg'
  };

  return (
    <div className={`pulsing-dots ${sizeClasses[size]} ${className}`}>
      <div className="dot" style={{ backgroundColor: color }} />
      <div className="dot" style={{ backgroundColor: color }} />
      <div className="dot" style={{ backgroundColor: color }} />
    </div>
  );
}