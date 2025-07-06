import '@/styles/loaders/spin-loader.css';

export default function SpinLoader({ 
  size = 'md', 
  color = '#3498db', 
  thickness = 2,
  className = '' 
}) {
  const sizeClasses = {
    sm: 'spin-loader-sm',
    md: 'spin-loader-md',
    lg: 'spin-loader-lg'
  };

  return (
    <div 
      className={`spin-loader ${sizeClasses[size]} ${className}`}
      style={{ 
        borderColor: `${color}20`, 
        borderTopColor: color,
        borderWidth: thickness
      }}
    />
  );
}