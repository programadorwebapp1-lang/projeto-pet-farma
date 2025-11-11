// Ícone SVG de patinha para detalhes decorativos
export default function PawIcon({ size = 24, color = "#A8E6CF", className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="7" cy="7.5" rx="2.5" ry="3.5" fill={color} />
      <ellipse cx="17" cy="7.5" rx="2.5" ry="3.5" fill={color} />
      <ellipse cx="5.5" cy="15.5" rx="1.5" ry="2" fill={color} />
      <ellipse cx="18.5" cy="15.5" rx="1.5" ry="2" fill={color} />
      <ellipse cx="12" cy="15" rx="4" ry="5" fill={color} />
    </svg>
  );
}
