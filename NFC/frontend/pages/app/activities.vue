<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'app' });
useSeoMeta({ title: 'Activités — PULSE' });

const api = useApi();
const items = ref<any[]>([]);
const loading = ref(false);

const TYPES = [
  { v: 'running', label: 'Running' },
  { v: 'cycling', label: 'Cycling' },
  { v: 'walking', label: 'Walking' },
  { v: 'strength', label: 'Strength' },
  { v: 'yoga', label: 'Yoga' },
  { v: 'hiit', label: 'HIIT' },
  { v: 'swimming', label: 'Swim' },
  { v: 'other', label: 'Autre' },
];

const form = reactive({
  type: 'running',
  title: '',
  durationMin: 30,
  distanceKm: 0,
  calories: 0,
  intensity: 'medium',
  notes: '',
});

async function load() {
  loading.value = true;
  try {
    const r = await api.get<{ items: any[] }>('/activities?limit=100');
    items.value = r.items;
  } finally {
    loading.value = false;
  }
}

const submitting = ref(false);
const error = ref('');
async function create() {
  submitting.value = true;
  error.value = '';
  try {
    await api.post('/activities', { ...form });
    form.title = '';
    form.notes = '';
    await load();
  } catch (e: any) {
    error.value = e?.data?.error?.message || 'Erreur';
  } finally {
    submitting.value = false;
  }
}

async function remove(id: string) {
  if (!confirm('Supprimer cette activité ?')) return;
  await api.del(`/activities/${id}`);
  await load();
}

onMounted(load);
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-end justify-between gap-6 flex-wrap">
      <div>
        <h1 class="text-3xl font-bold">Activités</h1>
        <p class="text-white/60">Log tes séances et suis ta progression.</p>
      </div>
    </div>

    <form class="glass-strong p-6 grid md:grid-cols-6 gap-3" @submit.prevent="create">
      <div class="md:col-span-2">
        <label class="label">Titre</label>
        <input v-model="form.title" required minlength="2" class="input" placeholder="Footing matinal" />
      </div>
      <div>
        <label class="label">Type</label>
        <select v-model="form.type" class="input">
          <option v-for="t in TYPES" :key="t.v" :value="t.v">{{ t.label }}</option>
        </select>
      </div>
      <div>
        <label class="label">Durée (min)</label>
        <input v-model.number="form.durationMin" type="number" min="1" max="600" required class="input" />
      </div>
      <div>
        <label class="label">Distance (km)</label>
        <input v-model.number="form.distanceKm" type="number" step="0.1" min="0" class="input" />
      </div>
      <div>
        <label class="label">Intensité</label>
        <select v-model="form.intensity" class="input">
          <option value="low">Faible</option>
          <option value="medium">Moyenne</option>
          <option value="high">Haute</option>
        </select>
      </div>
      <div class="md:col-span-6">
        <label class="label">Notes</label>
        <input v-model="form.notes" maxlength="500" class="input" placeholder="Sensations, météo…" />
      </div>
      <p v-if="error" class="md:col-span-6 text-sm text-rose-400">{{ error }}</p>
      <button type="submit" class="md:col-span-6 btn-primary" :disabled="submitting">
        {{ submitting ? '…' : 'Ajouter cette séance' }}
      </button>
    </form>

    <div class="grid gap-3">
      <div
        v-for="a in items"
        :key="a._id"
        class="glass p-5 flex items-center gap-4"
      >
        <div
          class="h-12 w-12 rounded-xl grid place-items-center text-white"
          :class="
            a.intensity === 'high'
              ? 'bg-violet-500/30'
              : a.intensity === 'low'
              ? 'bg-cyan-400/20'
              : 'bg-gradient-to-br from-cyan-400/20 to-violet-500/20'
          "
        >
          <IconRender name="pulse" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold truncate">{{ a.title }}</div>
          <div class="text-xs text-white/50 capitalize">
            {{ a.type }} · {{ formatRelative(a.performedAt) }} · intensité {{ a.intensity }}
          </div>
          <p v-if="a.notes" class="mt-1 text-sm text-white/60 truncate">"{{ a.notes }}"</p>
        </div>
        <div class="text-right text-sm font-mono space-y-1 hidden sm:block">
          <div class="text-cyan-300">{{ formatDuration(a.durationMin) }}</div>
          <div v-if="a.distanceKm > 0" class="text-white/50">{{ a.distanceKm }} km</div>
          <div v-if="a.calories > 0" class="text-white/50">{{ a.calories }} kcal</div>
        </div>
        <button
          class="text-white/30 hover:text-rose-400 px-2 py-1"
          aria-label="Supprimer"
          @click="remove(a._id)"
        >×</button>
      </div>
      <div v-if="!loading && items.length === 0" class="glass p-12 text-center text-white/60">
        Aucune activité enregistrée. Ajoute ta première séance ci-dessus.
      </div>
    </div>
  </div>
</template>
