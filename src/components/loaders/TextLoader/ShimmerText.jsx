import '@/styles/loaders/text/shimmer-text.css';

export default function ShimmerText({ text = "Processing...", className = '', color = "white", backgroundColor = "rgba(255, 255, 255, 0.8)" }) {
  return <div style={{ 
        '--text-color': color, 
        '--before-bg': backgroundColor 
      }} className={`loading-text-2 ${className}`}>{text}</div>;
}