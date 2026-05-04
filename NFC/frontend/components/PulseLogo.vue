<script setup lang="ts">
defineProps<{ size?: number }>();
</script>

<template>
  <div class="flex items-center gap-2">
    <svg
      :width="size || 32"
      :height="size || 32"
      viewBox="0 0 64 64"
      fill="none"
      class="shrink-0"
    >
      <defs>
        <linearGradient id="pulse-grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#5dfaff" />
          <stop offset="1" stop-color="#9b6cff" />
        </linearGradient>
      </defs>
      <path
        d="M6 36 L18 36 L24 18 L34 50 L40 30 L46 36 L58 36"
        stroke="url(#pulse-grad)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </svg>
    <span class="font-mono text-sm font-semibold tracking-[0.3em] text-white">
      PULSE
    </span>
  </div>
</template>
