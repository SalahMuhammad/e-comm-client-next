import '@/styles/loaders/text/water-text.css';

export default function WaterFillText({
    text = "WATER",
    className = '',
    size = "8rem",
    color = "#333",
    waterGradient = "linear-gradient(to bottom, #00c6ff 0%, #0072ff 100%)",
    shineGradient = "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)"
}) {
    return (
        <div
            style={{
                '--text-color': color,
                '--water-gradient': waterGradient,
                '--shine-gradient': shineGradient,
                '--font-size': size
            }}
            className={`water-fill-text ${className}`}
            data-text={text}
        >
            {text}
        </div>
    );
}