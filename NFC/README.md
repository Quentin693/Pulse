# PULSE — Bracelet NFC Fitness & Lifestyle

> Application fullstack autour d'un bracelet NFC connecté pour le suivi d'activité, le partage de profil sportif et l'accès à du contenu personnalisé.

## Concept

**PULSE** est un bracelet NFC qui permet à l'utilisateur de :

- suivre son activité (séances, distance, durée, calories)
- accéder à un profil ou contenu personnalisé via tap NFC
- partager ses performances et habitudes via une page publique
- débloquer du contenu fitness associé à son bracelet

## Architecture

```
NFC/
├── backend/        API Node.js + Express + MongoDB (Mongoose, JWT)
├── frontend/       Application Nuxt 3 (marketing + e-commerce + SaaS)
└── README.md
```

### Stack technique

| Couche      | Technologies                                                        |
| ----------- | ------------------------------------------------------------------- |
| Backend     | Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Joi, Jest         |
| Frontend    | Nuxt 3, Vue 3, Pinia, Tailwind CSS, GSAP-like animations CSS        |
| Design      | Dark mode, glassmorphism, néons cyan/violet, motion fluide          |

### Authentification

Un seul système d'authentification (JWT) partagé entre le **SaaS** et l'**e-commerce**. Un utilisateur inscrit peut :

- gérer son profil et ses bracelets (SaaS)
- passer commande sur l'e-commerce
- partager une page publique de son activité

## Démarrage rapide

### 1. Backend

```bash
cd backend
cp .env.example .env       # configure MONGO_URI et JWT_SECRET
npm install
npm run seed               # insère produits + contenu marketing
npm run dev                # http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env       # NUXT_PUBLIC_API_BASE=http://localhost:4000/api
npm install
npm run dev                # http://localhost:3000
```

### 3. Routes principales

| Section    | URL                          |
| ---------- | ---------------------------- |
| Marketing  | `/`, `/features`, `/about`, `/contact` |
| E-commerce | `/shop`, `/shop/:slug`, `/cart`, `/checkout` |
| Auth       | `/login`, `/register`        |
| SaaS       | `/app/dashboard`, `/app/profile`, `/app/activities`, `/app/bracelets` |
| Public NFC | `/u/:handle` (page partageable du profil)        |
| Tap NFC    | `/nfc/:tagId` (simulation d'un tap NFC)          |

## Fonctionnalités

### Backend (API REST)

- Inscription / connexion / JWT
- CRUD utilisateur, profil public partageable
- CRUD bracelets NFC associés à un utilisateur
- CRUD activités sportives (course, vélo, muscu, yoga…)
- Catalogue produits + variantes
- Panier & validation de commande
- Contenu marketing dynamique (sections, FAQ, témoignages)
- Middleware de logs, validation Joi, erreurs centralisées
- Tests Jest

### Frontend

- Site marketing responsive et SEO-ready
- E-commerce avec panier persistant (Pinia)
- Espace SaaS : dashboard d'activités, gestion profil, gestion bracelets
- Page publique `/u/:handle` partageable
- Simulation d'un tap NFC `/nfc/:tagId`

## Tests

```bash
cd backend && npm test
```

## Auteur

Projet pédagogique — concept fitness/lifestyle (option 3).
