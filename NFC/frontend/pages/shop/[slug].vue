<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';

const route = useRoute();
const api = useApi();
const auth = useAuthStore();
const cart = useCartStore();

const { data: product, error } = useAsyncData(`shop-${route.params.slug}`, async () => {
  try {
    const r = await api.get<{ product: any }>(`/products/${route.params.slug}`);
    return r.product;
  } catch (err: any) {
    throw createError({ statusCode: 404, statusMessage: 'Produit introuvable' });
  }
});

const selectedVariant = ref<any>(product.value?.variants?.[0] || null);
const quantity = ref(1);
const adding = ref(false);
const added = ref(false);

useSeoMeta({
  title: product.value ? `${product.value.name} — PULSE` : 'PULSE',
  description: product.value?.tagline,
});

async function addToCart() {
  if (!auth.isLogged) {
    return navigateTo(`/login?redirect=/shop/${route.params.slug}`);
  }
  if (!selectedVariant.value || !product.value) return;
  adding.value = true;
  try {
    await cart.addItem(product.value._id, selectedVariant.value._id, quantity.value);
    added.value = true;
    setTimeout(() => (added.value = false), 1800);
  } finally {
    adding.value = false;
  }
}
</script>

<template>
  <section v-if="product" class="container-pulse py-16">
    <NuxtLink to="/shop" class="text-sm text-white/50 hover:text-white inline-flex items-center gap-1">
      <span>←</span> Retour à la boutique
    </NuxtLink>

    <div class="mt-8 grid gap-12 lg:grid-cols-2 items-start">
      <div class="glass-strong relative overflow-hidden aspect-square grid place-items-center">
        <div class="absolute inset-0 bg-aurora opacity-30" />
        <div class="absolute inset-0 grid-bg" />
        <svg viewBox="0 0 320 200" class="w-3/4 relative animate-float">
          <defs>
            <linearGradient :id="`pd-${product.slug}`" x1="0" x2="1">
              <stop offset="0" stop-color="#5dfaff" />
              <stop offset="1" stop-color="#9b6cff" />
            </linearGradient>
          </defs>
          <rect x="20" y="60" width="280" height="80" rx="40" fill="#11141f" :stroke="`url(#pd-${product.slug})`" stroke-width="2" />
          <rect x="40" y="80" width="240" height="40" rx="20" fill="#06070d" />
          <circle cx="160" cy="100" r="22" :fill="`url(#pd-${product.slug})`" opacity="0.7" />
          <text x="160" y="105" text-anchor="middle" fill="#06070d" font-family="JetBrains Mono" font-size="10" font-weight="700">PULSE</text>
        </svg>
      </div>

      <div class="space-y-6">
        <div>
          <span class="chip-glow text-[10px]">{{ product.category }}</span>
          <h1 class="mt-3 text-4xl lg:text-5xl font-bold">{{ product.name }}</h1>
          <p class="mt-2 text-white/60">{{ product.tagline }}</p>
        </div>

        <div class="flex items-baseline gap-4">
          <span class="text-3xl font-bold gradient-text">
            {{ formatPrice(selectedVariant?.priceCents || product.basePriceCents, product.currency) }}
          </span>
          <span class="text-xs text-white/40">livraison incluse</span>
        </div>

        <p class="text-white/70 leading-relaxed">{{ product.description }}</p>

        <ul v-if="product.highlights?.length" class="grid gap-2 grid-cols-2">
          <li
            v-for="h in product.highlights"
            :key="h"
            class="flex items-center gap-2 text-sm text-white/70"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
            {{ h }}
          </li>
        </ul>

        <div v-if="product.variants?.length" class="space-y-2">
          <div class="text-xs uppercase tracking-[0.18em] text-white/50">Édition</div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="v in product.variants"
              :key="v._id"
              type="button"
              class="rounded-xl border px-4 py-2.5 text-sm transition-colors"
              :class="
                selectedVariant?._id === v._id
                  ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-300'
                  : 'border-white/10 text-white/70 hover:bg-white/5'
              "
              @click="selectedVariant = v"
            >
              {{ v.name }}
              <span class="ml-2 text-xs text-white/40">
                {{ formatPrice(v.priceCents, product.currency) }}
              </span>
            </button>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="glass flex items-center">
            <button
              class="px-3 py-2 text-white/60 hover:text-white"
              :disabled="quantity <= 1"
              @click="quantity = Math.max(1, quantity - 1)"
            >−</button>
            <span class="px-4 font-mono">{{ quantity }}</span>
            <button
              class="px-3 py-2 text-white/60 hover:text-white"
              :disabled="quantity >= 10"
              @click="quantity = Math.min(10, quantity + 1)"
            >+</button>
          </div>
          <button class="btn-primary flex-1" :disabled="adding" @click="addToCart">
            <span v-if="added">✓ Ajouté au panier</span>
            <span v-else-if="adding">Ajout…</span>
            <span v-else>Ajouter au panier</span>
          </button>
        </div>

        <div class="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
          <div class="text-center">
            <div class="text-xs text-white/40">Livraison</div>
            <div class="text-sm font-semibold mt-1">48h</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-white/40">Garantie</div>
            <div class="text-sm font-semibold mt-1">2 ans</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-white/40">Retours</div>
            <div class="text-sm font-semibold mt-1">30 jours</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
