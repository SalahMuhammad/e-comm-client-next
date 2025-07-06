import '@/styles/loaders/dots/wave-dots.css';

export default function WaveDots({ 
  size = 'md', 
  color = '#9b59b6', 
  className = '' 
}) {
  const sizeClasses = {
    sm: 'wave-dots-sm',
    md: 'wave-dots-md',
    lg: 'wave-dots-lg'
  };

  return (
    <div className={`wave-dots ${sizeClasses[size]} ${className}`}>
      <div className="dot" style={{ backgroundColor: color }} />
      <div className="dot" style={{ backgroundColor: color }} />
      <div className="dot" style={{ backgroundColor: color }} />
    </div>
  );
}