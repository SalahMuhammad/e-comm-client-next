import '@/styles/loaders/dots/bouncing-dots.css';

export default function BouncingDots({ 
  size = 'md', 
  color = '#3498db', 
  className = '' 
}) {
  const sizeClasses = {
    sm: 'bouncing-dots-sm',
    md: 'bouncing-dots-md',
    lg: 'bouncing-dots-lg'
  };

  return (
    <div className={`bouncing-dots ${sizeClasses[size]} ${className}`}>
      <div className="dot" style={{ backgroundColor: color }} />
      <div className="dot" style={{ backgroundColor: color }} />
      <div className="dot" style={{ backgroundColor: color }} />
    </div>
  );
}
