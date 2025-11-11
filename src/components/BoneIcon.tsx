// Ícone SVG de ossinho para detalhes decorativos
export default function BoneIcon({ size = 28, color = "#DFF6FF", className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 28 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="5" width="20" height="4" rx="2" fill={color} />
      <circle cx="4" cy="7" r="4" fill={color} />
      <circle cx="24" cy="7" r="4" fill={color} />
    </svg>
  );
}
