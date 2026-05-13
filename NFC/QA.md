# Stratégie QA — Projet PULSE

## Contexte

PULSE est une application fullstack (Nuxt 3 + Express + MongoDB) permettant le suivi d'activité sportive, la gestion de bracelets NFC et un e-commerce associé. Une démarche QA rigoureuse est nécessaire pour garantir la fiabilité des interactions entre les composants (auth, panier, activités, NFC) et la stabilité des livraisons.

---

## Partie 1 — Types de tests utilisés

### 1.1 Tests unitaires

**Définition :** Testent une unité de code isolée (fonction, composant) sans dépendance externe.

**Présents dans ce projet :**
- `frontend/tests/unit/useFormat.spec.ts` — teste les fonctions `formatPrice`, `formatDuration`, `formatDate`, `formatRelative` indépendamment de tout contexte Vue ou API.
- `frontend/tests/unit/ProductCard.spec.ts` — vérifie le rendu du composant `ProductCard` (props, affichage conditionnel du badge Featured, lien généré).

**Ce qu'ils sécurisent :** la logique métier pure et les composants UI sans effets de bord.

---

### 1.2 Tests d'intégration backend

**Définition :** Testent les interactions entre plusieurs couches (routes → controllers → validators → MongoDB) sur une base de données en mémoire.

**Présents dans ce projet :**
- `backend/tests/auth.test.js` — inscription, login, token, routes protégées.
- `backend/tests/cart.test.js` — ajout au panier, checkout complet, panier vide.
- `backend/tests/activity.test.js` — création et listage d'activités, profil public.
- `backend/tests/bracelet.test.js` — enregistrement NFC, tap, doublons.
- `backend/tests/errors.test.js` — erreurs 404, 401, validation.

**Outil :** Jest + Supertest + mongodb-memory-server (base en mémoire isolée par test).

**Ce qu'ils sécurisent :** les routes API, la logique métier, les middlewares d'auth et de validation, la cohérence des réponses HTTP.

---

### 1.3 Tests d'intégration frontend

**Définition :** Testent le comportement d'un composant/page en simulant les interactions utilisateur et en mockant l'API.

**Présents dans ce projet :**
- `frontend/tests/integration/login.spec.ts` — formulaire de connexion : rendu, erreurs, loading, navigation.
- `frontend/tests/integration/register.spec.ts` — formulaire d'inscription : rendu, succès, erreurs serveur.

**Outil :** Vitest + @nuxt/test-utils (environnement `nuxt`) + `mountSuspended` + `mockNuxtImport`.

**Ce qu'ils sécurisent :** l'affichage des messages d'erreur, la gestion des états de chargement, la navigation post-action.

---

### 1.4 Tests End-to-End (E2E)

**Définition :** Simulent un vrai utilisateur sur l'application complète (frontend + backend + base de données réelle).

**Présents dans ce projet :**
- `frontend/e2e/pulse.spec.ts` — parcours complet : inscription → connexion → dashboard → modification profil → ajout panier → checkout → vérification résultat.

**Outil :** Playwright (Chromium).

**Ce qu'ils sécurisent :** l'intégralité du parcours utilisateur de bout en bout, la cohérence entre frontend et backend sur des données réelles.

---

## Partie 2 — Risques identifiés

| Risque | Probabilité | Impact | Couvert par |
|--------|-------------|--------|-------------|
| Token JWT invalide ou expiré | Haute | Critique | auth.test.js, login.spec.ts |
| Panier désynchronisé (items orphelins) | Moyenne | Élevé | cart.test.js, e2e |
| Inscription avec email déjà utilisé | Haute | Moyen | auth.test.js (409) |
| Route protégée accessible sans token | Haute | Critique | auth.test.js, errors.test.js |
| Checkout sur panier vide | Moyenne | Élevé | cart.test.js |
| Erreur MongoDB (connexion, validation) | Faible | Critique | mongodb-memory-server isole les tests |
| Erreur de validation Joi (champs manquants) | Haute | Moyen | errors.test.js, auth.test.js |
| Doublon de tag NFC | Moyenne | Élevé | bracelet.test.js (409) |
| Appel API échoué côté frontend | Moyenne | Élevé | login.spec.ts, register.spec.ts |
| État de loading non réinitialisé | Faible | Moyen | login.spec.ts |

---

## Partie 3 — Stratégie de tests

### Ce qui est testé

| Zone | Couverture |
|------|-----------|
| Auth backend (register, login, JWT, routes protégées) | Complète |
| Panier & checkout | Complète |
| Activités sportives | Complète |
| Bracelets NFC | Complète |
| Erreurs HTTP (400, 401, 404, 409) | Complète |
| Composant ProductCard | Complète |
| Composable useFormat | Complète |
| Formulaire login (rendu, erreurs, loading) | Complète |
| Formulaire register (rendu, erreurs, succès) | Complète |
| Parcours E2E complet | Couvert |

### Ce qui n'est pas testé (et pourquoi)

| Zone | Raison |
|------|--------|
| Routes admin/content | Pas de logique critique, faible risque |
| Animations CSS (GSAP-like) | Non fonctionnel, pas testable avec Playwright |
| Composants SiteHeader / SiteFooter | Purement visuels, pas de logique |
| Store Pinia cart (actions isolées) | Couvert indirectement via E2E |
| Performance / charge | Hors scope pédagogique |

### Priorités de test

1. **Critique** — Authentification et autorisations (toute faille expose les données utilisateur)
2. **Critique** — Checkout et commandes (toute faille génère des incohérences financières)
3. **Important** — Formulaires frontend (première interaction utilisateur, doit être sans friction)
4. **Important** — Bracelets NFC (fonctionnalité cœur du produit)
5. **Utile** — Activités et profil public (fonctionnalités secondaires)

### Choix techniques

| Choix | Justification |
|-------|---------------|
| Jest + Supertest | Standards Node.js, léger, intégration facile avec Express |
| mongodb-memory-server | Tests isolés sans base de données externe, pas de pollution entre tests |
| `beforeEach(clear)` | Nettoyage garantit l'indépendance de chaque test |
| Vitest + @nuxt/test-utils | Solution officielle Nuxt 3, gère les auto-imports et le contexte SSR |
| `mountSuspended` | Permet de tester des pages Nuxt avec async setup |
| `mockNuxtImport` | Mock propre des composables Nuxt sans toucher aux fichiers sources |
| Playwright + Chromium | Simule un vrai navigateur, rejouable automatiquement |
| GitHub Actions | Intégration continue gratuite, déclenché à chaque push |

---

## Lancer les tests

```bash
# Tests backend
cd NFC/backend && npm test

# Tests frontend (unitaires + intégration)
cd NFC/frontend && npm test

# Tests E2E (nécessite backend + frontend démarrés)
cd NFC/frontend && npm run test:e2e

# Tests E2E avec interface graphique
cd NFC/frontend && npm run test:e2e:ui
```

---

## Pipeline CI/CD

Un workflow GitHub Actions (`.github/workflows/ci.yml`) exécute automatiquement :

1. **Tests backend** — à chaque push/PR sur `main` et `develop`
2. **Tests frontend** — à chaque push/PR sur `main` et `develop`
3. **Tests E2E** — uniquement sur les push sur `main` (après validation des deux jobs précédents)

![CI Badge](https://github.com/VOTRE_ORG/VOTRE_REPO/actions/workflows/ci.yml/badge.svg)
