import '@/styles/loaders/text/wave-text.css';

export default function WaveText({ text = "Loading...", className = '', color = "white" }) {
  return (
    <div style={{color: color}} className={`loading-text-3 ${className}`}>
      {[...text].map((char, index) => (
        <span key={index} className="char" style={{ animationDelay: `${index * 0.1}s` }}>
          {char}
        </span>
      ))}
    </div>
  );
}