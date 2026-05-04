<script setup lang="ts">
const api = useApi();

const { data: products, pending } = await useAsyncData('shop-list', async () => {
  try {
    const r = await api.get<{ items: any[] }>('/products');
    return r.items;
  } catch {
    return [];
  }
});

useSeoMeta({ title: 'Boutique — PULSE', description: 'Tous les bracelets PULSE.' });
</script>

<template>
  <section class="container-pulse py-16">
    <div class="flex items-end justify-between gap-6 flex-wrap">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-cyan-400">Boutique</p>
        <h1 class="mt-3 text-5xl font-bold">Choisis ton signal</h1>
      </div>
      <p class="text-white/60 max-w-md text-sm">
        Tous nos bracelets sont fabriqués à Paris, livrés sous 48h, et garantis 2 ans.
      </p>
    </div>

    <div v-if="pending" class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 3" :key="i" class="glass h-72 animate-pulse" />
    </div>

    <div v-else-if="products && products.length" class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ProductCard v-for="p in products" :key="p._id" :product="p" />
    </div>

    <div v-else class="mt-12 glass p-12 text-center text-white/60">
      Aucun produit. Lance <code class="font-mono text-cyan-300">npm run seed</code> côté backend.
    </div>
  </section>
</template>
