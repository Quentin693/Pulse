<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';

const auth = useAuthStore();
const cart = useCartStore();

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/features', label: 'Fonctionnalités' },
  { to: '/shop', label: 'Boutique' },
  { to: '/about', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
];

const route = useRoute();
const open = ref(false);
watch(() => route.fullPath, () => (open.value = false));
</script>

<template>
  <header class="sticky top-0 z-50">
    <div class="absolute inset-0 -z-10 backdrop-blur-xl bg-ink-950/70 border-b border-white/5" />
    <div class="container-pulse flex h-16 items-center justify-between">
      <NuxtLink to="/" class="group">
        <PulseLogo />
      </NuxtLink>

      <nav class="hidden lg:flex items-center gap-1">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors relative"
          :class="{ 'text-white': route.path === l.to }"
        >
          {{ l.label }}
          <span
            v-if="route.path === l.to"
            class="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
          />
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <NuxtLink to="/cart" class="relative btn-ghost !rounded-full !px-3 !py-2.5" aria-label="Panier">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M6 7h12l-1.5 11a2 2 0 01-2 1.7H9.5a2 2 0 01-2-1.7L6 7z" />
            <path d="M9 7V5a3 3 0 016 0v2" />
          </svg>
          <span
            v-if="cart.count > 0"
            class="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-ink-950"
          >
            {{ cart.count }}
          </span>
        </NuxtLink>

        <template v-if="auth.isLogged">
          <NuxtLink to="/app/dashboard" class="btn-primary hidden md:inline-flex">
            Mon espace
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="hidden md:inline-flex btn-ghost">Connexion</NuxtLink>
          <NuxtLink to="/register" class="btn-primary">
            Rejoindre
          </NuxtLink>
        </template>

        <button
          class="lg:hidden btn-ghost !rounded-full !px-3 !py-2.5"
          aria-label="Menu"
          @click="open = !open"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path v-if="!open" d="M4 7h16M4 12h16M4 17h16" />
            <path v-else d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>

    <Transition name="page">
      <div
        v-if="open"
        class="lg:hidden border-b border-white/5 bg-ink-950/95 backdrop-blur-xl"
      >
        <nav class="container-pulse py-4 grid gap-1">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="px-3 py-2.5 rounded-xl text-sm text-white/80 hover:bg-white/5"
          >{{ l.label }}</NuxtLink>
          <NuxtLink
            v-if="!auth.isLogged"
            to="/login"
            class="px-3 py-2.5 rounded-xl text-sm text-white/80 hover:bg-white/5"
          >Connexion</NuxtLink>
          <NuxtLink
            v-else
            to="/app/dashboard"
            class="px-3 py-2.5 rounded-xl text-sm text-white/80 hover:bg-white/5"
          >Mon espace</NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>
