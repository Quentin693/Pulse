<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';

definePageMeta({ middleware: 'auth' });

const auth = useAuthStore();
const cart = useCartStore();

useSeoMeta({ title: 'Panier — PULSE' });

onMounted(() => cart.fetch());

async function setQty(itemId: string, qty: number) {
  if (qty < 1) return cart.removeItem(itemId);
  await cart.updateItem(itemId, qty);
}

const shipping = computed(() => (cart.subtotalCents > 9900 || cart.subtotalCents === 0 ? 0 : 490));
const total = computed(() => cart.subtotalCents + shipping.value);
</script>

<template>
  <section class="container-pulse py-16">
    <h1 class="text-4xl font-bold">Mon panier</h1>
    <p class="mt-2 text-white/60">{{ cart.count }} article{{ cart.count > 1 ? 's' : '' }}</p>

    <div v-if="cart.cart.items.length === 0" class="glass mt-10 p-12 text-center">
      <div class="mx-auto h-16 w-16 rounded-full bg-white/5 grid place-items-center text-3xl">∅</div>
      <p class="mt-4 text-white/60">Ton panier est vide.</p>
      <NuxtLink to="/shop" class="btn-primary mt-6 inline-flex">Aller à la boutique</NuxtLink>
    </div>

    <div v-else class="mt-10 grid gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-3">
        <div
          v-for="item in cart.cart.items"
          :key="item._id"
          class="glass p-4 flex items-center gap-4"
        >
          <div class="h-20 w-20 shrink-0 rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 grid place-items-center">
            <svg viewBox="0 0 64 24" class="w-12">
              <rect x="2" y="6" width="60" height="12" rx="6" fill="#0a0c14" stroke="#5dfaff" stroke-width="1"/>
              <circle cx="32" cy="12" r="4" fill="#5dfaff" opacity="0.7"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold truncate">{{ item.snapshot.name }}</div>
            <div class="text-xs text-white/50">{{ item.snapshot.variantName }}</div>
            <div class="mt-2 flex items-center gap-2">
              <button
                class="h-8 w-8 rounded-full glass hover:bg-white/10"
                @click="setQty(item._id, item.quantity - 1)"
              >−</button>
              <span class="w-8 text-center font-mono">{{ item.quantity }}</span>
              <button
                class="h-8 w-8 rounded-full glass hover:bg-white/10"
                @click="setQty(item._id, item.quantity + 1)"
              >+</button>
            </div>
          </div>
          <div class="text-right">
            <div class="font-mono text-cyan-300">
              {{ formatPrice(item.snapshot.priceCents * item.quantity) }}
            </div>
            <button
              class="mt-2 text-xs text-white/40 hover:text-white/80"
              @click="cart.removeItem(item._id)"
            >Retirer</button>
          </div>
        </div>
      </div>

      <aside class="glass-strong p-6 h-fit sticky top-24 space-y-4">
        <h3 class="font-semibold text-lg">Récapitulatif</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-white/60">Sous-total</span>
            <span class="font-mono">{{ formatPrice(cart.subtotalCents) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-white/60">Livraison</span>
            <span class="font-mono">{{ shipping === 0 ? 'Offerte' : formatPrice(shipping) }}</span>
          </div>
        </div>
        <div class="border-t border-white/10 pt-4 flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span class="gradient-text">{{ formatPrice(total) }}</span>
        </div>
        <NuxtLink to="/checkout" class="btn-primary w-full">
          Valider ma commande
        </NuxtLink>
        <p v-if="cart.subtotalCents < 9900 && cart.subtotalCents > 0" class="text-xs text-white/40 text-center">
          Plus que {{ formatPrice(9900 - cart.subtotalCents) }} pour la livraison gratuite.
        </p>
      </aside>
    </div>
  </section>
</template>
