const env = require('./config/env');
const { connectDB, disconnectDB } = require('./config/db');
const User = require('./models/User');
const NFCBracelet = require('./models/NFCBracelet');
const Activity = require('./models/Activity');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Content = require('./models/Content');

const products = [
  {
    name: 'PULSE Core',
    slug: 'pulse-core',
    tagline: "Le bracelet NFC fitness essentiel",
    description:
      "Le bracelet PULSE Core combine élégance minimaliste et puce NFC haute performance. Suivez vos séances, partagez votre profil sportif d'un simple tap, et restez connecté à vos objectifs.",
    highlights: [
      'Puce NFC chiffrée',
      'Étanche IP68',
      'Autonomie illimitée',
      'Compatible iOS & Android',
    ],
    images: ['/images/pulse-core-1.jpg', '/images/pulse-core-2.jpg'],
    basePriceCents: 4900,
    featured: true,
    category: 'bracelet',
    variants: [
      { name: 'Cyan', color: 'cyan', sku: 'CORE-CYAN', priceCents: 4900, stock: 120 },
      { name: 'Violet', color: 'violet', sku: 'CORE-VIO', priceCents: 4900, stock: 90 },
      { name: 'Onyx', color: 'black', sku: 'CORE-ONYX', priceCents: 4900, stock: 150 },
    ],
  },
  {
    name: 'PULSE Pro',
    slug: 'pulse-pro',
    tagline: 'Pour les athlètes connectés',
    description:
      "PULSE Pro pousse l'expérience plus loin : matériaux premium, NFC longue portée, mode workout dynamique et personnalisation avancée du tap.",
    highlights: [
      'NFC longue portée',
      'Bracelet titane recyclé',
      'Mode workout',
      'Pages publiques personnalisées',
    ],
    images: ['/images/pulse-pro-1.jpg'],
    basePriceCents: 8900,
    featured: true,
    category: 'bracelet',
    variants: [
      { name: 'Titane', color: 'silver', sku: 'PRO-TI', priceCents: 8900, stock: 60 },
      { name: 'Carbon', color: 'black', sku: 'PRO-CARB', priceCents: 9900, stock: 40 },
    ],
  },
  {
    name: 'PULSE Edge',
    slug: 'pulse-edge',
    tagline: 'Édition limitée néon',
    description:
      "Une édition collector lumineuse, gravée au laser, livrée avec un set de stickers NFC supplémentaires pour multiplier les usages au quotidien.",
    highlights: [
      'Édition limitée 500 pièces',
      'LED néon discrète',
      '2 stickers NFC offerts',
      'Numérotée à la main',
    ],
    images: ['/images/pulse-edge-1.jpg'],
    basePriceCents: 12900,
    featured: false,
    category: 'bracelet',
    variants: [
      { name: 'Aurora', color: 'aurora', sku: 'EDGE-AUR', priceCents: 12900, stock: 30 },
    ],
  },
];

const content = [
  {
    key: 'home.hero',
    type: 'hero',
    title: 'Ton corps. Ton signal.',
    subtitle:
      'PULSE est le bracelet NFC qui transforme chaque mouvement en signature numérique. Suivi, partage, identité : un seul tap.',
    body: '',
    items: [],
    order: 0,
  },
  {
    key: 'home.features',
    type: 'feature',
    title: 'Une expérience fluide',
    subtitle: 'Pensé pour les athlètes connectés.',
    items: [
      {
        icon: 'pulse',
        title: 'Suivi instantané',
        text: 'Tape ton bracelet pour démarrer ou clôturer une séance et synchroniser tes performances.',
      },
      {
        icon: 'share',
        title: 'Profil partageable',
        text: 'Une page publique ultra-design où ton entourage suit ta progression sportive.',
      },
      {
        icon: 'lock',
        title: 'Sécurité native',
        text: 'NFC chiffré, données privées par défaut, contrôle total sur ce que tu partages.',
      },
      {
        icon: 'spark',
        title: 'Contenu personnalisé',
        text: 'Débloque des programmes, audios et défis exclusifs selon ton profil.',
      },
    ],
    order: 1,
  },
  {
    key: 'home.faq',
    type: 'faq',
    title: 'Questions fréquentes',
    subtitle: 'Tout ce que tu te demandes sur PULSE.',
    items: [
      {
        q: 'Comment fonctionne le bracelet NFC ?',
        a: "Chaque PULSE intègre une puce NFC unique. Approche-le d'un téléphone compatible (iOS 14+ ou Android) pour ouvrir ta page personnalisée.",
      },
      {
        q: 'Mes données sont-elles privées ?',
        a: 'Oui. Tu choisis ce que tu rends public depuis ton espace SaaS. Tes activités sont chiffrées en base.',
      },
      {
        q: 'Puis-je associer plusieurs bracelets ?',
        a: 'Bien sûr — la version Pro permet plusieurs objets NFC reliés à un même profil avec des modes différents.',
      },
      {
        q: 'Puis-je changer la destination du tap ?',
        a: 'Oui, dans le SaaS tu peux choisir le mode profil, workout ou une URL personnalisée.',
      },
    ],
    order: 2,
  },
  {
    key: 'home.testimonials',
    type: 'testimonial',
    title: 'Ils vivent PULSE',
    subtitle: 'Témoignages de la communauté.',
    items: [
      {
        name: 'Léna, ultra-trail',
        role: 'Coach running',
        quote:
          'Je tape mon PULSE avant chaque séance — mes athlètes voient ma progression en temps réel.',
      },
      {
        name: 'Marko, crossfit',
        role: 'Athlète',
        quote:
          'Le mode workout est devenu mon rituel. Mon profil public motive toute la box.',
      },
      {
        name: 'Sofia, yoga',
        role: 'Prof certifiée',
        quote:
          "PULSE m'a permis de partager ma routine matinale en un seul tap, sans appli compliquée.",
      },
    ],
    order: 3,
  },
];

async function seed() {
  await connectDB(env.mongoUri);
  console.log('[seed] connected');

  await Promise.all([
    Product.deleteMany({}),
    Content.deleteMany({}),
  ]);

  await Product.insertMany(products);
  await Content.insertMany(content);
  console.log(`[seed] inserted ${products.length} products, ${content.length} contents`);

  const demoEmail = 'demo@pulse.app';
  let demo = await User.findOne({ email: demoEmail });
  if (!demo) {
    demo = new User({
      email: demoEmail,
      handle: 'demo',
      displayName: 'Demo Athlete',
      bio: 'Coureur amateur, amateur de yoga et de bons cafés.',
      location: 'Paris, FR',
      sports: ['running', 'yoga', 'hiit'],
      goals: ['Marathon sub 4h', '3 séances par semaine'],
      socials: { instagram: '@demo.pulse', strava: 'demo-pulse', website: '' },
    });
    await demo.setPassword('demo1234');
    await demo.save();
    await Cart.create({ user: demo._id, items: [] });

    await NFCBracelet.create({
      owner: demo._id,
      tagId: 'DEMO123',
      nickname: 'Mon PULSE Core',
      color: 'cyan',
      edition: 'Core',
      mode: 'profile',
    });

    const now = Date.now();
    const samples = [
      { type: 'running', title: 'Footing matinal', durationMin: 42, distanceKm: 7.8, calories: 520, intensity: 'medium' },
      { type: 'yoga', title: 'Yoga flow', durationMin: 30, distanceKm: 0, calories: 180, intensity: 'low' },
      { type: 'hiit', title: 'HIIT 20min', durationMin: 22, distanceKm: 0, calories: 340, intensity: 'high' },
      { type: 'cycling', title: 'Sortie vélo', durationMin: 75, distanceKm: 28.4, calories: 720, intensity: 'medium' },
      { type: 'strength', title: 'Push day', durationMin: 55, distanceKm: 0, calories: 410, intensity: 'high' },
    ];
    await Activity.insertMany(
      samples.map((s, i) => ({
        ...s,
        user: demo._id,
        performedAt: new Date(now - i * 24 * 60 * 60 * 1000),
      }))
    );

    console.log('[seed] demo user demo@pulse.app / demo1234 with NFC tag DEMO123');
  } else {
    console.log('[seed] demo user already exists');
  }

  await disconnectDB();
  console.log('[seed] done');
}

seed().catch((err) => {
  console.error('[seed] fatal', err);
  process.exit(1);
});
