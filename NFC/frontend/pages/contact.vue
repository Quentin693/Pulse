<script setup lang="ts">
useSeoMeta({
  title: 'Contact — PULSE',
  description: 'Une question ? Une idée ? Une collab ? On répond.',
});

const form = reactive({ name: '', email: '', topic: 'general', message: '' });
const submitted = ref(false);
const sending = ref(false);

function submit() {
  sending.value = true;
  setTimeout(() => {
    submitted.value = true;
    sending.value = false;
  }, 700);
}
</script>

<template>
  <section class="container-pulse py-20 grid lg:grid-cols-2 gap-12">
    <div>
      <p class="text-xs uppercase tracking-[0.3em] text-cyan-400">Contact</p>
      <h1 class="mt-3 text-5xl font-bold leading-tight">
        Une <span class="gradient-text">vibration</span> à partager ?
      </h1>
      <p class="mt-6 text-white/70">
        Une idée, une question technique, un partenariat ? On lit chaque message
        et on répond sous 48h.
      </p>

      <div class="mt-10 space-y-4">
        <div class="glass p-4 flex items-center gap-4">
          <div class="h-10 w-10 rounded-xl bg-cyan-400/10 grid place-items-center text-cyan-400">@</div>
          <div>
            <div class="text-xs text-white/40 uppercase tracking-wider">Email</div>
            <div class="font-mono text-sm">hello@pulse.app</div>
          </div>
        </div>
        <div class="glass p-4 flex items-center gap-4">
          <div class="h-10 w-10 rounded-xl bg-violet-400/10 grid place-items-center text-violet-400">⌘</div>
          <div>
            <div class="text-xs text-white/40 uppercase tracking-wider">Studio</div>
            <div class="font-mono text-sm">12 rue Pulse — 75011 Paris</div>
          </div>
        </div>
      </div>
    </div>

    <form
      v-if="!submitted"
      class="glass-strong p-8 space-y-5"
      @submit.prevent="submit"
    >
      <div>
        <label class="label" for="name">Nom</label>
        <input id="name" v-model="form.name" type="text" required class="input" placeholder="Léna" />
      </div>
      <div>
        <label class="label" for="email">Email</label>
        <input id="email" v-model="form.email" type="email" required class="input" placeholder="lena@pulse.app" />
      </div>
      <div>
        <label class="label">Sujet</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="t in [
              { v: 'general', l: 'Général' },
              { v: 'support', l: 'Support' },
              { v: 'partner', l: 'Partenariat' },
            ]"
            :key="t.v"
            type="button"
            class="rounded-xl border px-3 py-2 text-sm transition-colors"
            :class="
              form.topic === t.v
                ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-300'
                : 'border-white/10 text-white/60 hover:bg-white/5'
            "
            @click="form.topic = t.v"
          >
            {{ t.l }}
          </button>
        </div>
      </div>
      <div>
        <label class="label" for="message">Message</label>
        <textarea
          id="message"
          v-model="form.message"
          rows="5"
          required
          class="input"
          placeholder="Dis-nous tout…"
        />
      </div>
      <button :disabled="sending" type="submit" class="btn-primary w-full">
        {{ sending ? 'Envoi…' : 'Envoyer le signal' }}
      </button>
    </form>

    <div v-else class="glass-strong p-12 text-center">
      <div
        class="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center text-3xl text-ink-950"
      >
        ✓
      </div>
      <h3 class="mt-6 text-2xl font-bold">Signal reçu</h3>
      <p class="mt-2 text-white/60">On revient vers toi très vite.</p>
    </div>
  </section>
</template>
