<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';

definePageMeta({ middleware: 'auth' });

const auth = useAuthStore();
const cart = useCartStore();
const api = useApi();

useSeoMeta({ title: 'Commande — PULSE' });

onMounted(() => cart.fetch());

const form = reactive({
  fullName: auth.user?.displayName || '',
  street: '',
  city: '',
  zip: '',
  country: 'France',
});

const submitting = ref(false);
const error = ref('');
const order = ref<any>(null);

const shipping = computed(() => (cart.subtotalCents > 9900 || cart.subtotalCents === 0 ? 0 : 490));
const total = computed(() => cart.subtotalCents + shipping.value);

async function submit() {
  if (cart.cart.items.length === 0) return;
  submitting.value = true;
  error.value = '';
  try {
    const res = await api.post<{ order: any }>('/orders/checkout', { address: form });
    order.value = res.order;
    await cart.fetch();
  } catch (e: any) {
    error.value = e?.data?.error?.message || 'Erreur lors de la commande';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section v-if="!order" class="container-pulse py-16 grid lg:grid-cols-3 gap-10">
    <form class="lg:col-span-2 space-y-5" @submit.prevent="submit">
      <h1 class="text-4xl font-bold">Validation</h1>
      <div class="glass-strong p-6 space-y-5">
        <h3 class="font-semibold">Adresse de livraison</h3>
        <div>
          <label class="label">Nom complet</label>
          <input v-model="form.fullName" required class="input" />
        </div>
        <div>
          <label class="label">Adresse</label>
          <input v-model="form.street" required class="input" placeholder="12 rue Pulse" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Code postal</label>
            <input v-model="form.zip" required class="input" />
          </div>
          <div>
            <label class="label">Ville</label>
            <input v-model="form.city" required class="input" />
          </div>
        </div>
        <div>
          <label class="label">Pays</label>
          <input v-model="form.country" required class="input" />
        </div>
      </div>

      <div class="glass-strong p-6 space-y-3">
        <h3 class="font-semibold">Paiement</h3>
        <p class="text-sm text-white/50">
          Simulation : aucune carte n'est requise pour cette démo. Ta commande est validée
          directement à l'envoi du formulaire.
        </p>
        <div class="grid grid-cols-3 gap-2 text-center text-xs text-white/50">
          <div class="glass p-3">VISA</div>
          <div class="glass p-3">MASTERCARD</div>
          <div class="glass p-3">PAYPAL</div>
        </div>
      </div>

      <p v-if="error" class="text-sm text-rose-400">{{ error }}</p>

      <button type="submit" class="btn-primary w-full" :disabled="submitting || cart.cart.items.length === 0">
        {{ submitting ? 'Validation…' : `Payer ${formatPrice(total)}` }}
      </button>
    </form>

    <aside class="glass-strong p-6 h-fit sticky top-24 space-y-4">
      <h3 class="font-semibold text-lg">Ta commande</h3>
      <div class="space-y-3">
        <div v-for="item in cart.cart.items" :key="item._id" class="flex items-center gap-3 text-sm">
          <div class="h-10 w-10 rounded-lg bg-white/5 grid place-items-center text-xs font-mono">
            ×{{ item.quantity }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="truncate">{{ item.snapshot.name }}</div>
            <div class="text-xs text-white/40">{{ item.snapshot.variantName }}</div>
          </div>
          <span class="font-mono text-cyan-300">
            {{ formatPrice(item.snapshot.priceCents * item.quantity) }}
          </span>
        </div>
      </div>
      <div class="border-t border-white/10 pt-4 space-y-1 text-sm">
        <div class="flex justify-between"><span class="text-white/60">Sous-total</span><span>{{ formatPrice(cart.subtotalCents) }}</span></div>
        <div class="flex justify-between"><span class="text-white/60">Livraison</span><span>{{ shipping === 0 ? 'Offerte' : formatPrice(shipping) }}</span></div>
      </div>
      <div class="border-t border-white/10 pt-4 flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span class="gradient-text">{{ formatPrice(total) }}</span>
      </div>
    </aside>
  </section>

  <section v-else class="container-pulse py-24">
    <div class="glass-strong relative overflow-hidden p-12 text-center max-w-2xl mx-auto">
      <div class="absolute inset-0 bg-aurora opacity-30" />
      <div class="relative">
        <div
          class="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center text-4xl text-ink-950 font-bold"
        >
          ✓
        </div>
        <h1 class="mt-6 text-4xl font-bold">Commande validée</h1>
        <p class="mt-3 text-white/70">
          Référence <span class="font-mono text-cyan-300">{{ order.reference }}</span>
        </p>
        <p class="mt-2 text-white/50">Tu reçois un email de confirmation dans quelques minutes.</p>
        <div class="mt-8 flex justify-center gap-3 flex-wrap">
          <NuxtLink to="/app/orders" class="btn-primary">Voir mes commandes</NuxtLink>
          <NuxtLink to="/" class="btn-ghost">Retour à l'accueil</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
