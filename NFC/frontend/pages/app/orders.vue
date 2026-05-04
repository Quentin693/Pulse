<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'app' });
useSeoMeta({ title: 'Commandes — PULSE' });

const api = useApi();
const { data: orders } = await useAsyncData('my-orders', async () => {
  try {
    const r = await api.get<{ items: any[] }>('/orders');
    return r.items;
  } catch {
    return [];
  }
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">Mes commandes</h1>
      <p class="text-white/60">Historique de tes commandes PULSE.</p>
    </div>

    <div v-if="orders && orders.length" class="space-y-3">
      <article
        v-for="o in orders"
        :key="o._id"
        class="glass p-5"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="font-mono text-sm text-cyan-300">{{ o.reference }}</div>
            <div class="text-xs text-white/50">{{ formatDate(o.createdAt) }}</div>
          </div>
          <span class="chip" :class="o.status === 'paid' ? 'border-cyan-400/40 text-cyan-300' : ''">
            {{ o.status }}
          </span>
          <div class="font-semibold gradient-text">
            {{ formatPrice(o.totalCents, o.currency) }}
          </div>
        </div>
        <div class="mt-4 grid gap-2">
          <div
            v-for="(it, i) in o.items"
            :key="i"
            class="flex items-center justify-between text-sm"
          >
            <span class="text-white/70">×{{ it.quantity }} {{ it.name }} <span class="text-white/40">({{ it.variantName }})</span></span>
            <span class="font-mono text-white/60">{{ formatPrice(it.priceCents * it.quantity, o.currency) }}</span>
          </div>
        </div>
      </article>
    </div>
    <div v-else class="glass p-12 text-center text-white/60">
      Aucune commande.
      <NuxtLink to="/shop" class="text-cyan-300">Voir la boutique</NuxtLink>
    </div>
  </div>
</template>
