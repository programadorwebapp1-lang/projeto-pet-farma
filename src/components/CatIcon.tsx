// Ícone SVG de gato estilizado
export default function CatIcon({ size = 28, color = "#DFF6FF", className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="14" cy="18" rx="8" ry="7" fill={color} />
      <polygon points="6,12 10,4 12,12" fill={color} />
      <polygon points="22,12 18,4 16,12" fill={color} />
    </svg>
  );
}
