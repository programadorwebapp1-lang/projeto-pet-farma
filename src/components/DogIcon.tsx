// Ícone SVG de cachorro estilizado
export default function DogIcon({ size = 28, color = "#A8E6CF", className = "" }) {
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
      <ellipse cx="8" cy="10" rx="3" ry="4" fill={color} />
      <ellipse cx="20" cy="10" rx="3" ry="4" fill={color} />
    </svg>
  );
}
