<script setup lang="ts">
defineProps<{ product: any }>();
</script>

<template>
  <NuxtLink
    :to="`/shop/${product.slug}`"
    class="glass relative overflow-hidden group block hover:bg-white/[0.06] transition-colors"
  >
    <div class="relative h-56 grid place-items-center bg-gradient-to-br from-ink-800 to-ink-900 overflow-hidden">
      <div class="absolute inset-0 bg-aurora opacity-30 group-hover:opacity-60 transition-opacity" />
      <svg viewBox="0 0 200 120" class="w-3/4 relative">
        <defs>
          <linearGradient :id="`pg-${product.slug}`" x1="0" x2="1">
            <stop offset="0" stop-color="#5dfaff" />
            <stop offset="1" stop-color="#9b6cff" />
          </linearGradient>
        </defs>
        <rect x="10" y="35" width="180" height="50" rx="25" fill="#11141f" :stroke="`url(#pg-${product.slug})`" stroke-width="1.5" />
        <rect x="20" y="45" width="160" height="30" rx="15" fill="#06070d" />
        <circle cx="100" cy="60" r="14" :fill="`url(#pg-${product.slug})`" opacity="0.7" />
      </svg>
      <span v-if="product.featured" class="absolute top-3 left-3 chip-glow text-[10px]">Featured</span>
    </div>

    <div class="p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-semibold text-lg">{{ product.name }}</h3>
          <p class="text-xs text-white/50 mt-0.5">{{ product.tagline }}</p>
        </div>
        <span class="text-cyan-300 font-mono text-sm">
          {{ formatPrice(product.basePriceCents, product.currency) }}
        </span>
      </div>
      <div class="mt-4 flex flex-wrap gap-1.5">
        <span v-for="v in product.variants" :key="v.sku" class="chip text-[10px]">
          {{ v.name }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
