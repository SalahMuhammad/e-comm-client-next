import '@/styles/loaders/text/fill-text.css';

export default function FillText({ text = "Please wait...", className = '', color = "white", backgroundColor = "rgba(255, 255, 255, 0.3)" }) {
  return <div style={{ 
        '--text-color': color, 
        '--before-bg': backgroundColor 
      }} className={`loading-text-4 ${className}`}>{text}</div>;
}
