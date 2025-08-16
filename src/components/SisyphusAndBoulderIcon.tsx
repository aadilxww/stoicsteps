import type { SVGProps } from "react";

export function SisyphusAndBoulderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="24"
      viewBox="0 0 32 24"
      fill="currentColor"
      {...props}
    >
      {/* Sisyphus */}
      <rect x="4" y="8" width="4" height="4" /> {/* Head */}
      <rect x="4" y="12" width="4" height="8" /> {/* Body */}
      <rect x="8" y="12" width="4" height="4" /> {/* Arm */}
      <rect x="0" y="20" width="4" height="4" /> {/* Back Leg */}
      <rect x="4" y="20" width="4" height="4" /> {/* Front Leg */}
      
      {/* Boulder */}
      <rect x="16" y="8" width="4" height="16" />
      <rect x="20" y="4" width="4" height="20" />
      <rect x="24" y="8" width="4" height="16" />
    </svg>
  );
}
