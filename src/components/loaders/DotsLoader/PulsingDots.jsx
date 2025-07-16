import '@/styles/loaders/dots/pulsing-dots.css';

export default function PulsingDots({ 
  size = 'md', 
  color = 'bg-gray-500 dark:bg-gray-300', 
  className = '' 
}) {
  const sizeClasses = {
    sm: 'pulsing-dots-sm',
    md: 'pulsing-dots-md',
    lg: 'pulsing-dots-lg'
  };

  return (
    <div className={`pulsing-dots ${sizeClasses[size]} ${className}`}>
      <div className={`dot ${color}`} />
      <div className={`dot ${color}`}  />
      <div className={`dot ${color}`}  />
    </div>
  );
}