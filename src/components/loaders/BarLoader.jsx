import '@/styles/loaders/bar-loader.css';

export default function BarLoader({ 
  width = 200, 
  height = 4, 
  color = '#3498db', 
  className = '' 
}) {
  return (
    <div 
      className={`bar-loader ${className}`}
      style={{ width, height, backgroundColor: `${color}20` }}
    >
      <div 
        className="bar-loader-fill"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}