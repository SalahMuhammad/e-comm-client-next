import '@/styles/loaders/skeleton-loader.css';

export default function SkeletonLoader({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  className = '' 
}) {
  return (
    <div 
      className={`skeleton-loader ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`text-skeleton ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLoader 
          key={i}
          height="16px"
          width={i === lines - 1 ? '60%' : '100%'}
          className="text-skeleton-line"
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`card-skeleton ${className}`}>
      <SkeletonLoader height="200px" className="card-skeleton-image" />
      <div className="card-skeleton-content">
        <SkeletonLoader height="24px" width="70%" />
        <SkeletonLoader height="16px" width="100%" />
        <SkeletonLoader height="16px" width="80%" />
      </div>
    </div>
  );
}