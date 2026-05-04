<template>
  <div class="relative aspect-square max-w-md mx-auto">
    <div class="absolute inset-0 grid-bg" />
    <div class="absolute inset-10 rounded-full bg-aurora blur-3xl opacity-60 animate-pulse-slow" />
    <div class="absolute inset-0 grid place-items-center">
      <svg viewBox="0 0 320 320" class="w-full h-full animate-float">
        <defs>
          <linearGradient id="ring1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#5dfaff" stop-opacity="0.9" />
            <stop offset="1" stop-color="#9b6cff" stop-opacity="0.7" />
          </linearGradient>
          <linearGradient id="band" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stop-color="#1c2030" />
            <stop offset="0.5" stop-color="#0f111c" />
            <stop offset="1" stop-color="#1c2030" />
          </linearGradient>
          <radialGradient id="chip" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stop-color="#5dfaff" />
            <stop offset="1" stop-color="#0fb6c0" stop-opacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="160" cy="180" rx="120" ry="34" fill="none" stroke="url(#ring1)" stroke-width="3" stroke-dasharray="6 4" opacity="0.5"/>

        <g transform="translate(40 90)">
          <rect x="0" y="0" width="240" height="120" rx="60" fill="url(#band)" stroke="url(#ring1)" stroke-width="2" />
          <rect x="20" y="20" width="200" height="80" rx="44" fill="#06070d" stroke="rgba(255,255,255,0.05)" />
          <circle cx="120" cy="60" r="40" fill="url(#chip)" />
          <g stroke="#5dfaff" stroke-width="2" stroke-linecap="round" fill="none">
            <path d="M85 60 Q105 35 120 60" />
            <path d="M95 60 Q115 25 135 60" opacity="0.7" />
            <path d="M105 60 Q130 18 150 60" opacity="0.5" />
            <path d="M155 60 Q140 35 120 60" />
          </g>
          <text x="120" y="105" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="JetBrains Mono" font-size="8" letter-spacing="3">PULSE</text>
        </g>

        <circle cx="160" cy="150" r="6" fill="#5dfaff">
          <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  </div>
</template>
