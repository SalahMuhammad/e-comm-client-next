import '@/styles/loaders/text/transparent-fill-text.css';

export default function TransparentFillText({ text = "Loading...", className = '', color = "rgba(255, 255, 255, 0.3)", backgroundColor = "rgba(255, 255, 255, 0.8)" }) {
  return <div style={{ 
        '--stroke-color': color, 
        '--before-bg': backgroundColor 
      }}className={`loading-text-5 ${className}`}>{text}</div>;
}