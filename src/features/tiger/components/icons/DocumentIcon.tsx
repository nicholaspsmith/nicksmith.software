export interface DocumentIconProps {
  color?: string;
  label?: string;
}

/**
 * Simple document-style icon placeholder
 * Used for portfolio app icons until custom icons are added
 */
export function DocumentIcon({ color = '#4ca1e4', label }: DocumentIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Document body */}
      <path
        d="M10 4C10 2.89543 10.8954 2 12 2H30L38 10V44C38 45.1046 37.1046 46 36 46H12C10.8954 46 10 45.1046 10 44V4Z"
        fill="white"
        stroke="#666"
        strokeWidth="1"
      />
      {/* Folded corner */}
      <path d="M30 2V10H38" fill="#e0e0e0" stroke="#666" strokeWidth="1" />
      {/* Color accent bar */}
      <rect x="14" y="14" width="20" height="4" rx="1" fill={color} />
      {/* Text lines placeholder */}
      <rect x="14" y="22" width="20" height="2" rx="1" fill="#ccc" />
      <rect x="14" y="28" width="16" height="2" rx="1" fill="#ccc" />
      <rect x="14" y="34" width="18" height="2" rx="1" fill="#ccc" />
      {/* Label abbreviation */}
      {label && (
        <text
          x="24"
          y="42"
          textAnchor="middle"
          fontSize="8"
          fontWeight="bold"
          fill={color}
        >
          {label}
        </text>
      )}
    </svg>
  );
}
