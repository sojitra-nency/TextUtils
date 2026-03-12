
export default function Tile({ icon, label, onClick, color, active, disabled }) {
    return (
        <button
            className={`tu-tile tu-tile--${color}${active ? ' tu-tile--active' : ''}`}
            onClick={onClick}
            disabled={disabled || false}
            title={label}
        >
            <span className="tu-tile-icon">{icon}</span>
            <span className="tu-tile-label">{label}</span>
        </button>
    )
}
