import React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_logo)">
      <path
        d="M20 80C20 80 25 20 50 20C75 20 80 80 80 80"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35 80C35 80 40 50 50 50C60 50 65 80 65 80"
        stroke="hsl(var(--accent))"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </g>
    <defs>
      <clipPath id="clip0_logo">
        <rect width="100" height="100" rx="12" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
