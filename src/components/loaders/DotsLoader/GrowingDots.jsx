import '@/styles/loaders/dots/growing-dots.css';

export default function GrowingDots({ 
  size = 'md', 
  color = '#2ecc71', 
  className = '' 
}) {
  const sizeClasses = {
    sm: 'growing-dots-sm',
    md: 'growing-dots-md',
    lg: 'growing-dots-lg'
  };

  return (
    <div className={`growing-dots ${sizeClasses[size]} ${className}`}>
      <div className="dot" style={{ backgroundColor: color }} />
      <div className="dot" style={{ backgroundColor: color }} />
      <div className="dot" style={{ backgroundColor: color }} />
    </div>
  );
}
