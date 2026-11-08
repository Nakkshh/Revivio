import React from 'react'

export function RevivioLogo({
  size = 'md',
  showTagline = false,
  variant = 'full',
  className = '',
}) {
  const sizeMap = {
    sm: { icon: 24, text: 'text-lg', tagline: 'text-[10px]' },
    md: { icon: 32, text: 'text-xl', tagline: 'text-xs' },
    lg: { icon: 40, text: 'text-2xl', tagline: 'text-sm' },
    xl: { icon: 52, text: 'text-3xl', tagline: 'text-base' },
  }

  const { icon, text, tagline } = sizeMap[size] || sizeMap.md

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Renewal SVG Brandmark */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background rounded squircle */}
        <rect
          width="32"
          height="32"
          rx="8"
          className="fill-[#142B3B] dark:fill-[#1C3040]"
        />
        {/* Circular renewal orbit */}
        <circle
          cx="16"
          cy="16"
          r="9"
          stroke="#27C6A5"
          strokeWidth="2.2"
          strokeDasharray="40 14"
          strokeLinecap="round"
        />
        {/* Orbit arrow tip */}
        <path
          d="M21.5 8.5L24 11L21.5 13.5"
          stroke="#27C6A5"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Precision wrench / restoration core */}
        <path
          d="M13.5 18.5L18.5 13.5M17.5 12.5C18 11.5 19.5 11.5 20.5 12.5C21.5 13.5 21.5 15 20.5 15.5L19 17L15 13L16.5 11.5M11.5 20.5C10.5 19.5 10.5 18 11.5 17.5L13 16L17 20L15.5 21.5C14.5 22.5 13 22.5 12 21.5Z"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {variant !== 'icon' && (
        <div className="flex flex-col">
          <span
            className={`font-bold tracking-tight font-sans text-[#142B3B] dark:text-[#F5F8FA] ${text}`}
          >
            REVIVIO
          </span>
          {showTagline && (
            <span
              className={`font-medium tracking-normal text-[#5A6E7F] dark:text-[#9EB2C2] ${tagline}`}
            >
              Bring products back to life.
            </span>
          )}
        </div>
      )}
    </div>
  )
}
