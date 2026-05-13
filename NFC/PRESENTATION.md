# Plan de soutenance — PULSE

> Durée totale : 35 à 45 minutes  
> Structure imposée par le sujet

---

## 1. Présentation du projet global (5 min)

### Ce qu'il faut dire

**Accroche (30 sec)**
> "PULSE est un bracelet NFC connecté. L'idée : tu poses ton poignet sur un téléphone, ça affiche ton profil sportif, tes stats, tes performances. Derrière, c'est une application fullstack complète — site marketing, e-commerce, espace SaaS et API REST."

**Le concept en 3 axes**
- **NFC** → un tap sur le bracelet redirige vers `/u/:handle` (profil public de l'athlète)
- **SaaS** → l'utilisateur connecté gère son profil, ses bracelets, ses activités sportives
- **E-commerce** → boutique de bracelets avec panier, checkout, commandes

**Stack technique (30 sec)**
| Côté | Technologies |
|------|-------------|
| Backend | Node.js · Express · MongoDB · Mongoose · JWT · bcrypt · Joi |
| Frontend | Nuxt 3 · Vue 3 · Pinia · Tailwind CSS |
| Tests | Jest · Supertest · Vitest · Playwright |
| CI/CD | GitHub Actions |

**Structure du dépôt (15 sec)**
```
NFC/
├── backend/    → API REST (port 4000)
├── frontend/   → App Nuxt 3 (port 3000)
├── QA.md       → Stratégie de tests
└── README.md
```

---

## 2. Frontend (5 min)

### Ce qu'il faut montrer

Ouvrir le navigateur sur `http://localhost:3000` et naviguer dans cet ordre :

1. **Page d'accueil** `/` — présenter le design (dark mode, glassmorphism, néons)
2. **Boutique** `/shop` — catalogue produits dynamique (données depuis l'API)
3. **Page produit** `/shop/pulse-core` — variantes, ajout au panier
4. **Panier** `/cart` — état persistant (Pinia + API)
5. **Espace SaaS** `/app/dashboard` — stats, heatmap activités, bracelets
6. **Profil** `/app/profile` — formulaire avec gestion loading/error
7. **Page publique** `/u/:handle` — profil partageable via tap NFC

### Points à souligner

- **Composants réutilisables** : `ProductCard`, `SiteHeader`, `SiteFooter`, `AppSidebar`, `IconRender`
- **Stores Pinia** : `auth` (session JWT, restore, persist) + `cart` (sync avec l'API)
- **Composable `useApi`** : injection automatique du Bearer token sur toutes les requêtes
- **Middleware `auth`** : protège toutes les routes `/app/*`, redirige vers `/login?redirect=...`
- **Gestion loading/error** : chaque formulaire a un état `loading` + `error` avec message API
- **Routing** : layouts séparés (`default` pour le marketing, `app` pour le SaaS)

---

## 3. Backend (5 min)

### Ce qu'il faut montrer

Ouvrir le dossier `backend/src/` dans l'IDE et parcourir :

1. `server.js` → point d'entrée, connexion MongoDB
2. `app.js` → montage des middlewares et des routes
3. `routes/auth.routes.js` → exemple de route avec validation + auth
4. `controllers/auth.controller.js` → logique register/login
5. `validators/auth.schema.js` → schéma Joi
6. `middlewares/auth.js` → `requireAuth` et `optionalAuth`
7. `middlewares/errorHandler.js` → gestion centralisée des erreurs

### Points à souligner

- **Architecture en couches** : route → middleware → controller → validator → model → service
- **Validation systématique** : Joi sur tous les corps de requête mutants
- **Erreurs centralisées** : `ApiError` + `errorHandler` — toutes les erreurs ont la même forme JSON
- **JWT** : `signUserToken` + `requireAuth` → le token transporte l'`_id` et le `role`
- **9 ressources API** : auth, users, bracelets, activities, products, cart, orders, content, public

---

## 4. Architecture & API (5 min)

### Le schéma à expliquer

```
[Navigateur Nuxt 3]
        │ HTTP JSON + Authorization: Bearer <token>
        ▼
[Express /api]
   ├── auth.routes      → POST /register, POST /login, GET /me
   ├── bracelet.routes  → CRUD + /public/nfc/:tagId/tap
   ├── activity.routes  → CRUD + stats agrégées
   ├── cart.routes      → GET, POST /items, PATCH /items/:id, DELETE
   ├── order.routes     → POST /checkout, GET /
   └── public.routes    → GET /profile/:handle (sans auth)
        │
        ▼
   Middlewares : requireAuth → validate(schema) → controller
        │
        ▼
   [MongoDB via Mongoose]
   User ─── NFCBracelet
   User ─── Activity
   User ─── Cart ─── Order
   Product ──────────────┘
```

### Trajet d'une requête à expliquer en live

> Exemple : **POST /api/cart/items** (ajouter un produit au panier)

1. `cart.routes.js` — route `POST /items` avec `requireAuth` + `validate(cartItemSchema)`
2. `middlewares/auth.js` — vérifie le JWT, charge `req.user`
3. `middlewares/validate.js` — valide le body avec Joi, renvoie 400 si invalide
4. `controllers/cart.controller.js` — trouve le panier, ajoute l'item, recalcule le total
5. `models/Cart.js` — sauvegarde en base
6. Retourne `201 { cart: { items: [...] } }`

### Modèle de données

| Entité | Relations |
|--------|-----------|
| `User` | a des `NFCBracelet[]`, des `Activity[]`, un `Cart`, des `Order[]` |
| `NFCBracelet` | appartient à un `User`, résout un `tagId` |
| `Cart` | appartient à un `User`, contient des items avec snapshot produit |
| `Order` | créée depuis un `Cart`, stocke les items + adresse + montants |
| `Product` | a des `variants[]` (sku, couleur, stock, prix) |

---

## 5. QA / Stratégie de tests (5 min)

### Ce qu'il faut dire

> "J'ai mis en place 4 niveaux de tests, tous automatisés et exécutables via une seule commande."

**Les 4 niveaux**

| Niveau | Outil | Fichiers | Ce que ça teste |
|--------|-------|----------|-----------------|
| Unitaire | Vitest | `tests/unit/` | Fonctions pures (formatPrice, formatDuration…) et rendu composants |
| Intégration backend | Jest + Supertest | `backend/tests/` | Routes HTTP + DB en mémoire |
| Intégration frontend | Vitest + @nuxt/test-utils | `tests/integration/` | Formulaires avec mock API |
| E2E | Playwright | `e2e/` | Parcours utilisateur complet sur vrai navigateur |

**Choix techniques à justifier**

- `mongodb-memory-server` → base MongoDB en mémoire, **isolée par fichier de test**, pas de dépendance externe
- `beforeEach(clear)` → chaque test repart d'une base vide, tests indépendants
- `mockNuxtImport` + `vi.hoisted()` → mock des composables Nuxt sans polluer les autres tests
- GitHub Actions → CI lancée à chaque push sur `main`, 3 jobs en pipeline

**Chiffres à annoncer**
- Backend : **21 tests** — 5 fichiers (auth, cart, bracelet, activity, errors)
- Frontend : **37 tests** — 4 fichiers (useFormat, ProductCard, login, register)
- E2E : **9 scénarios** de bout en bout

---

## 6. Démonstration des tests (5 min)

### Script exact à exécuter

```bash
# Terminal 1 — backend
cd NFC/backend
npm test
# → 21 tests, 5 suites, 0 failed

# Terminal 2 — frontend
cd NFC/frontend
npm test
# → 37 tests, 4 suites, 0 failed
```

### Ce qu'il faut commenter pendant l'exécution

- **Sur les tests backend** : "Chaque suite crée sa propre base MongoDB en mémoire — il n'y a pas de MongoDB installé sur la machine de test, c'est `mongodb-memory-server` qui lance une instance en RAM."
- **Sur le `beforeEach(clear)`** : "Avant chaque test, toutes les collections sont vidées — les tests ne se polluent pas entre eux."
- **Sur les mocks frontend** : "Le store `useAuthStore` est remplacé par un mock Vitest — les tests ne font aucune vraie requête HTTP, ils sont 100% isolés."

---

## 7. Live coding backend (5-7 min)

### Ce que le prof peut demander — prépare ces 3 cas

**Cas A — Ajouter un champ au modèle + validation + test**

Exemple probable : ajouter `notes` (string, max 200 chars) à une commande

```
Fichiers à toucher dans l'ordre :
1. src/models/Order.js          → notes: { type: String, maxlength: 200 }
2. src/validators/order.schema.js → .notes(Joi.string().max(200).optional())
3. backend/tests/cart.test.js   → vérifier que notes est sauvegardé
```

**Cas B — Ajouter un filtre sur un GET**

Exemple probable : `GET /api/activities?type=running`

```js
// Dans activity.controller.js, dans la fonction list() :
const filter = { user: req.user._id };
if (req.query.type) filter.type = req.query.type;
const items = await Activity.find(filter)...
```

Test à ajouter : appel avec `?type=running` ne retourne que des running.

**Cas C — Ajouter une route protégée (ex : DELETE)**

```
1. activity.routes.js  → router.delete('/:id', requireAuth, deleteActivity)
2. activity.controller.js → trouver par _id + user, deleteOne(), retourner 204
3. Tester : 204 si propriétaire, 404 si inconnu, 401 si sans token
```

### Réflexe à avoir pendant le live coding

1. Modifier le **modèle** (si champ nouveau)
2. Modifier le **validator** (si champ dans le body)
3. Modifier le **controller**
4. Modifier ou créer la **route**
5. Écrire ou adapter le **test**
6. Lancer `npm test` pour vérifier

---

## 8. Live coding frontend (5-7 min)

### Ce que le prof peut demander

**Cas A — Connecter le filtre backend côté front**

Si le prof vient d'ajouter `?type=running` au backend, tu dois afficher un `<select>` sur `/app/activities`.

```vue
<!-- pages/app/activities.vue -->
<script setup>
const typeFilter = ref('all')
const { data } = useAsyncData('activities', () =>
  api.get(`/activities${typeFilter.value !== 'all' ? `?type=${typeFilter.value}` : ''}`)
, { watch: [typeFilter] })
</script>

<template>
  <select v-model="typeFilter">
    <option value="all">Tous</option>
    <option value="running">Course</option>
    <option value="cycling">Vélo</option>
  </select>
</template>
```

**Cas B — Nouveau formulaire (pattern à connaître par cœur)**

```vue
<script setup>
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await api.post('/endpoint', { ...form })
    success.value = true
  } catch (e: any) {
    error.value = e?.data?.error?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}
</script>
```

**Points à toujours inclure dans le template**
```vue
<button :disabled="loading">{{ loading ? 'Chargement…' : 'Envoyer' }}</button>
<p v-if="error" class="text-rose-400">{{ error }}</p>
<p v-if="success" class="text-cyan-300">Sauvegardé</p>
```

---

## Réponses aux questions probables du jury

**"Pourquoi Nuxt 3 et pas Vue 3 seul ?"**
> Nuxt apporte le routing basé fichiers, les layouts, les middlewares de navigation, les auto-imports et le SSR — tout ce dont j'avais besoin sans configuration manuelle.

**"Pourquoi stocker le JWT dans localStorage et pas un cookie httpOnly ?"**
> Pour ce projet pédagogique, localStorage simplifie l'implémentation. En production, un cookie httpOnly éviterait les attaques XSS. C'est un risque documenté dans ma stratégie QA.

**"C'est quoi la différence entre `requireAuth` et `optionalAuth` ?"**
> `requireAuth` rejette la requête avec 401 si pas de token valide. `optionalAuth` charge l'utilisateur si un token est présent, mais laisse passer sans erreur s'il n'y en a pas — utilisé sur les routes publiques comme `/u/:handle`.

**"Pourquoi `vi.hoisted()` dans tes tests frontend ?"**
> Vitest histe `vi.mock()` en haut du fichier avant l'exécution. Si je référence une variable `const` déclarée après, elle n'est pas encore initialisée. `vi.hoisted()` exécute la factory avant le hoist, donc la variable est disponible.

**"Ta pipeline CI/CD fait quoi exactement ?"**
> Trois jobs : backend tests → frontend tests → E2E (sur main uniquement). Si les tests backend ou frontend échouent, l'E2E ne se lance pas. Chaque push sur main déclenche la pipeline.

**"Tu as un test E2E qui ne passera jamais en CI car il a besoin d'une vraie DB ?"**
> Oui, le job E2E en CI nécessite `MONGO_URI_TEST` en secret GitHub. En local il fonctionne avec le backend démarré manuellement. C'est un point d'amélioration : passer à une DB de test dédiée en CI.
