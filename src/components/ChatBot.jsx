import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send } from 'lucide-react';

/* ══════════════════════════════════════════════════════════
   KNOWLEDGE BASE — MOTEUR DE RÉPONSES
   Chaque catégorie : regex de détection + réponse FR + EN
══════════════════════════════════════════════════════════ */
const KB = [
  /* ── Salutations ── */
  {
    id: 'greeting',
    pattern: /\b(bonjour|salut|hello|hi|hey|coucou|bonsoir|good\s*(morning|evening|afternoon|day)|yo|allo|wesh)\b/i,
    fr: "Bonjour ! Je suis **Mo**, l'assistant de Mohamed Ali Robleh. 👋\n\nComment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur les services, les projets, les tarifs ou la disponibilité.",
    en: "Hello! I'm **Mo**, Mohamed Ali Robleh's assistant. 👋\n\nHow can I help you today? Feel free to ask about services, projects, pricing, or availability.",
  },

  /* ── Qui est Mohamed Ali ── */
  {
    id: 'about',
    pattern: /\b(qui\s*(es|êtes|est)|who\s*(are|is)|à propos|about\s*(you|him)|présent|présente|profile|profil|parcours|background|expérienc|experience|bio|cv|resume|identité)\b/i,
    fr: "Mohamed Ali Robleh est un **développeur web freelance** basé à Ottawa, Canada.\n\n• 🎓 3+ ans d'expérience en développement web\n• 🌍 Travaille avec des clients au Canada et à l'international\n• 💼 Spécialisé en React, PWA, IA & plateformes SaaS\n• 🚀 12+ projets livrés avec succès\n• 🗣️ Bilingue Français / Anglais\n\nSon objectif : créer des expériences digitales premium qui génèrent de vrais résultats.",
    en: "Mohamed Ali Robleh is a **freelance web developer** based in Ottawa, Canada.\n\n• 🎓 3+ years of web development experience\n• 🌍 Works with clients in Canada and internationally\n• 💼 Specialized in React, PWA, AI & SaaS platforms\n• 🚀 12+ successfully delivered projects\n• 🗣️ Bilingual French / English\n\nHis goal: crafting premium digital experiences that generate real results.",
  },

  /* ── Services généraux ── */
  {
    id: 'services',
    pattern: /\b(services?|offre|propos|propose|fait quoi|what\s*do\s*you|spécialit|specialit|compétences?|skill|expertise|domaine|domain|peut\s*faire|can\s*do|travaille|work\s*on)/i,
    fr: "Mohamed Ali propose **9 services premium** :\n\n🖥️ **Sites Web Sur Mesure** — responsive & performants\n📱 **Progressive Web Apps** — installables & offline\n🎨 **Branding & Identité visuelle** — logo, charte graphique\n🏪 **Plateformes & Marketplaces** — multi-rôles & dashboards\n🚚 **Systèmes de livraison & commande** — app client + admin\n🤖 **Intégration IA** — Claude, OpenAI, assistants intelligents\n📅 **Réservation en ligne** — rendez-vous & notifications\n☁️ **Plateformes SaaS** — abonnements & architecture scalable\n🔧 **Maintenance & Support** — mises à jour & optimisation\n\nQuel service vous intéresse ?",
    en: "Mohamed Ali offers **9 premium services**:\n\n🖥️ **Custom Websites** — responsive & performant\n📱 **Progressive Web Apps** — installable & offline\n🎨 **Branding & Visual Identity** — logo, brand guidelines\n🏪 **Platforms & Marketplaces** — multi-role & dashboards\n🚚 **Delivery & Ordering Systems** — customer app + admin\n🤖 **AI Integration** — Claude, OpenAI, smart assistants\n📅 **Online Booking** — appointments & notifications\n☁️ **SaaS Platforms** — subscriptions & scalable architecture\n🔧 **Maintenance & Support** — updates & optimization\n\nWhich service interests you?",
  },

  /* ── Portfolio / Projets ── */
  {
    id: 'portfolio',
    pattern: /\b(projets?|portfolio|réalisations?|work|projects?|créé|réalisé|built|made|show|exemples?|example|voir|references?|voyagevoyage|bocride|campusride|khidma|bulksms|bella|movierent|dwi|baraka)/i,
    fr: "Voici les **réalisations principales** de Mohamed Ali :\n\n🌍 **Voyage Voyage** — Agence de tourisme (Djibouti)\n🏥 **Clinique Al-Baraka** — Réservation médicale en ligne\n🚗 **CampusRide** — Covoiturage PWA (Collège La Cité)\n🚗 **BOCRide** — Covoiturage (Banque du Canada)\n🏆 **Ottawa Blue Stars** — Gestion d'équipe sportive\n🛒 **Khidma** — Marketplace de services à domicile\n📱 **BulkSMS** — Plateforme SaaS de communication\n💻 **DWI** — Djibouti Wellness Initiative\n💇 **Bella Coiffure** — Site vitrine salon de beauté\n🎬 **MovieRent** — Location de films en ligne\n\n👉 Section **Portfolio** pour voir tous les projets !",
    en: "Here are Mohamed Ali's **main projects**:\n\n🌍 **Voyage Voyage** — Tourism agency (Djibouti)\n🏥 **Clinique Al-Baraka** — Online medical booking\n🚗 **CampusRide** — Carpooling PWA (La Cité College)\n🚗 **BOCRide** — Carpooling (Bank of Canada)\n🏆 **Ottawa Blue Stars** — Sports team management\n🛒 **Khidma** — Home services marketplace\n📱 **BulkSMS** — SaaS communication platform\n💻 **DWI** — Djibouti Wellness Initiative\n💇 **Bella Coiffure** — Beauty salon website\n🎬 **MovieRent** — Online film rental\n\n👉 Check the **Portfolio** section for all projects!",
  },

  /* ── Contact ── */
  {
    id: 'contact',
    pattern: /\b(contacts?|email|whatsapp|joindre|reach|messages?|appel|call|phone|téléphone|écrire|write|discuter|discuss|parler|talk|envoyer|send|contacter)/i,
    fr: "Vous pouvez contacter Mohamed Ali de **plusieurs façons** :\n\n📧 **Email** — Mohameda.robleh@gmail.com\n📱 **WhatsApp** — +1 (613) 291-7943\n💼 **LinkedIn** — /in/mohamed-ali-roblehh\n👨‍💻 **GitHub** — /MohamedAliRobleh\n\nOu directement via le **formulaire de contact** du site — il répond généralement sous **24 heures** !",
    en: "You can contact Mohamed Ali in **several ways**:\n\n📧 **Email** — Mohameda.robleh@gmail.com\n📱 **WhatsApp** — +1 (613) 291-7943\n💼 **LinkedIn** — /in/mohamed-ali-roblehh\n👨‍💻 **GitHub** — /MohamedAliRobleh\n\nOr directly through the **contact form** on the site — he usually replies within **24 hours**!",
  },

  /* ── Disponibilité ── */
  {
    id: 'availability',
    pattern: /\b(dispo|disponible|available|libre|occupé|free|busy|actuellement|currently|en\s*ce\s*moment|right\s*now|ouvert|open|accepte|accept|nouveau\s*projet|new\s*project)\b/i,
    fr: "✅ Oui, Mohamed Ali est **disponible** pour de nouveaux projets freelance !\n\nIl travaille actuellement avec quelques clients mais garde de la capacité pour de nouveaux projets. N'hésitez pas à prendre contact dès maintenant pour réserver votre place.\n\n📅 Délai de démarrage estimé : **1 à 2 semaines** selon la complexité.",
    en: "✅ Yes, Mohamed Ali is **available** for new freelance projects!\n\nHe's currently working with a few clients but has capacity for new projects. Don't hesitate to reach out now to reserve your spot.\n\n📅 Estimated start time: **1 to 2 weeks** depending on complexity.",
  },

  /* ── Localisation ── */
  {
    id: 'location',
    pattern: /\b(où|où\s*es|where|location|basé|based|ottawa|canada|ontario|djibouti|remote|télétravail|distance|international|pays|country|ville|city|fuseau|timezone)\b/i,
    fr: "📍 Mohamed Ali est basé à **Ottawa, Ontario, Canada**.\n\nIl travaille **100% en remote** avec des clients à travers :\n🇨🇦 Canada (Ottawa, Montréal, Toronto...)\n🇩🇯 Djibouti & Corne de l'Afrique\n🌍 International — Europe, USA, Moyen-Orient\n\nLe décalage horaire n'est jamais un obstacle — il s'adapte à votre fuseau horaire pour les réunions.",
    en: "📍 Mohamed Ali is based in **Ottawa, Ontario, Canada**.\n\nHe works **100% remotely** with clients across:\n🇨🇦 Canada (Ottawa, Montreal, Toronto...)\n🇩🇯 Djibouti & Horn of Africa\n🌍 International — Europe, USA, Middle East\n\nTime zone is never an obstacle — he adapts to your time zone for meetings.",
  },

  /* ── Tarifs / Prix ── */
  {
    id: 'pricing',
    pattern: /\b(prix|tarifs?|coût|budget|price|cost|rates?|charge|combien|how\s*much|devis|quote|facturer|invoices?|forfait|package|pay|payer|investissement|investment)/i,
    fr: "Les tarifs varient selon la nature et la complexité de chaque projet. 💼\n\nPour obtenir un **devis personnalisé et gratuit**, contactez Mohamed Ali directement :\n\n📱 **WhatsApp** — +1 (613) 291-7943\n📧 **Email** — Mohameda.robleh@gmail.com\n📝 **Formulaire** — Section Contact du site\n\nIl vous répondra dans les **24 heures** avec une estimation claire et détaillée selon vos besoins.",
    en: "Pricing varies depending on the nature and complexity of each project. 💼\n\nTo get a **free personalized quote**, contact Mohamed Ali directly:\n\n📱 **WhatsApp** — +1 (613) 291-7943\n📧 **Email** — Mohameda.robleh@gmail.com\n📝 **Form** — Contact section on the site\n\nHe'll reply within **24 hours** with a clear and detailed estimate based on your needs.",
  },

  /* ── Stack technique ── */
  {
    id: 'stack',
    pattern: /\b(stack|tech|technolog|outil|tool|react|framework|language|utilise|use|bootstrap|vite|node|js|javascript|typescript|supabase|firebase|figma|tailwind|css|html|api)\b/i,
    fr: "Voici le **stack technique** de Mohamed Ali :\n\n⚛️ **Frontend** — React 19, Vite, Bootstrap 5, Tailwind CSS\n🎨 **Animation** — Framer Motion, GSAP\n🗄️ **Backend & BDD** — Node.js, Supabase, Firebase, PostgreSQL\n🤖 **IA** — Claude API (Anthropic), OpenAI GPT-4\n🔐 **Auth** — Supabase Auth, JWT, OAuth\n📦 **DevOps** — Vercel, Netlify, GitHub Actions\n🎯 **Design** — Figma, Adobe XD\n📱 **Mobile** — PWA, React Native (notions)\n\nToujours en veille technologique pour proposer les meilleures solutions !",
    en: "Here's Mohamed Ali's **tech stack**:\n\n⚛️ **Frontend** — React 19, Vite, Bootstrap 5, Tailwind CSS\n🎨 **Animation** — Framer Motion, GSAP\n🗄️ **Backend & DB** — Node.js, Supabase, Firebase, PostgreSQL\n🤖 **AI** — Claude API (Anthropic), OpenAI GPT-4\n🔐 **Auth** — Supabase Auth, JWT, OAuth\n📦 **DevOps** — Vercel, Netlify, GitHub Actions\n🎯 **Design** — Figma, Adobe XD\n📱 **Mobile** — PWA, React Native (basics)\n\nAlways up to date with the latest technologies!",
  },

  /* ── Processus de travail ── */
  {
    id: 'process',
    pattern: /\b(process|processus|comment\s*(travaillez|travaill|work)|étape|step|déroul|workflow|méthode|method|fonctionn|comment\s*ça\s*marche|how\s*does\s*it\s*work|collabor|façon\s*de\s*travail)\b/i,
    fr: "Voici comment Mohamed Ali travaille avec ses clients :\n\n**1️⃣ Découverte** — Appel gratuit pour comprendre votre projet, vos objectifs et votre budget\n**2️⃣ Proposition** — Devis détaillé, planning et spécifications techniques\n**3️⃣ Design** — Maquettes Figma pour validation visuelle\n**4️⃣ Développement** — Code en sprints avec démos régulières\n**5️⃣ Tests & Recette** — QA complet, corrections et optimisation\n**6️⃣ Livraison** — Déploiement + formation à l'utilisation\n**7️⃣ Support** — Suivi post-livraison inclus",
    en: "Here's how Mohamed Ali works with clients:\n\n**1️⃣ Discovery** — Free call to understand your project, goals and budget\n**2️⃣ Proposal** — Detailed quote, timeline and technical specs\n**3️⃣ Design** — Figma mockups for visual validation\n**4️⃣ Development** — Code in sprints with regular demos\n**5️⃣ Testing & QA** — Full quality assurance & optimization\n**6️⃣ Delivery** — Deployment + usage training\n**7️⃣ Support** — Post-delivery follow-up included",
  },

  /* ── Délais ── */
  {
    id: 'timeline',
    pattern: /\b(combien\s*de\s*temps|how\s*long|délai|deadline|durée|duration|quand|when|rapide|fast|urgent|livraison|delivery|semaine|week|mois|month|temps|time)\b/i,
    fr: "Les délais varient selon la complexité du projet :\n\n⚡ **Site vitrine** — 1 à 2 semaines\n📱 **PWA simple** — 2 à 4 semaines\n🏪 **Plateforme / Marketplace** — 6 à 12 semaines\n☁️ **SaaS complet** — 2 à 5 mois\n🎨 **Branding seul** — 1 semaine\n\n⚠️ Pour les projets **urgents**, une majoration peut s'appliquer. Contactez Mohamed Ali pour en discuter !",
    en: "Timelines vary depending on project complexity:\n\n⚡ **Showcase website** — 1 to 2 weeks\n📱 **Simple PWA** — 2 to 4 weeks\n🏪 **Platform / Marketplace** — 6 to 12 weeks\n☁️ **Full SaaS** — 2 to 5 months\n🎨 **Branding only** — 1 week\n\n⚠️ For **urgent** projects, a rush fee may apply. Contact Mohamed Ali to discuss!",
  },

  /* ── Intelligence artificielle ── */
  {
    id: 'ai',
    pattern: /\b(intelligence\s*artificielle|artificial\s*intelligence|\bai\b|\bia\b|chatgpt|openai|claude|anthropic|gpt|llm|machine\s*learning|deep\s*learning|automatisation|automation|chatbot|assistant\s*virtuel|virtual\s*assistant)\b/i,
    fr: "L'**intégration IA** est l'une des spécialités de Mohamed Ali ! 🤖\n\nIl peut intégrer dans votre application :\n\n🧠 **Claude (Anthropic)** — Chatbots avancés, analyse de documents\n💬 **OpenAI GPT-4** — Génération de contenu, assistants\n🔍 **RAG (Retrieval Augmented Generation)** — IA sur vos données\n📊 **Analyse automatique** — Traitement de données & rapports\n🛠️ **Agents IA** — Automatisation de tâches complexes\n\nProjets confidentiels enterprise disponibles sur demande.",
    en: "**AI integration** is one of Mohamed Ali's specialties! 🤖\n\nHe can integrate into your app:\n\n🧠 **Claude (Anthropic)** — Advanced chatbots, document analysis\n💬 **OpenAI GPT-4** — Content generation, assistants\n🔍 **RAG (Retrieval Augmented Generation)** — AI on your data\n📊 **Automated Analysis** — Data processing & reports\n🛠️ **AI Agents** — Complex task automation\n\nConfidential enterprise projects available on request.",
  },

  /* ── PWA ── */
  {
    id: 'pwa',
    pattern: /\b(pwa|progressive\s*web\s*(app)?|application\s*web|app\s*mobile|mobile\s*app|offline|hors\s*ligne|installable|push\s*notification|service\s*worker)\b/i,
    fr: "Les **Progressive Web Apps (PWA)** sont une spécialité ! 📱\n\nAvantages d'une PWA :\n✅ **Installable** sur iOS & Android (sans App Store)\n✅ **Fonctionne hors ligne** grâce au cache\n✅ **Notifications push** natives\n✅ **Chargement ultra-rapide** (Lighthouse 90+)\n✅ **Coût réduit** vs application native\n✅ **Un seul codebase** pour web + mobile\n\nExemples réalisés : BOCRide, CampusRide, Ottawa Blue Stars.",
    en: "**Progressive Web Apps (PWA)** are a specialty! 📱\n\nPWA advantages:\n✅ **Installable** on iOS & Android (no App Store)\n✅ **Works offline** with caching\n✅ **Native push notifications**\n✅ **Ultra-fast loading** (Lighthouse 90+)\n✅ **Lower cost** vs native app\n✅ **Single codebase** for web + mobile\n\nExamples built: BOCRide, CampusRide, Ottawa Blue Stars.",
  },

  /* ── E-commerce ── */
  {
    id: 'ecommerce',
    pattern: /\b(boutique|shop|e-?commerce|woocommerce|shopify|vente\s*en\s*ligne|online\s*store|produit|product|panier|cart|paiement\s*en\s*ligne|stripe|paypal)\b/i,
    fr: "Mohamed Ali peut créer votre **boutique en ligne** sur mesure ! 🛒\n\nSolutions proposées :\n• **E-commerce custom** React + Supabase + Stripe\n• **Intégration Shopify** — personnalisation avancée\n• **WooCommerce** — WordPress e-commerce\n• **Marketplace multi-vendeurs** — comme Khidma\n\nInclus : gestion produits, panier, paiements sécurisés, tableau de bord vendeur et analytics.",
    en: "Mohamed Ali can build your **custom online store**! 🛒\n\nAvailable solutions:\n• **Custom e-commerce** React + Supabase + Stripe\n• **Shopify integration** — advanced customization\n• **WooCommerce** — WordPress e-commerce\n• **Multi-vendor marketplace** — like Khidma\n\nIncluded: product management, cart, secure payments, vendor dashboard and analytics.",
  },

  /* ── Branding & Design ── */
  {
    id: 'branding',
    pattern: /\b(logo|marque|brand(?:ing)?|identité\s*visuelle|visual\s*identity|charte\s*graphique|couleur|color|typographie|typography|design|ui|ux|maquette|mockup|prototype|figma|interface|visuel|visual)\b/i,
    fr: "Mohamed Ali propose des services de **Branding & Design UI/UX** ! 🎨\n\nInclus dans le service branding :\n🎯 **Logo** — Conception originale, formats vectoriels\n🎨 **Palette de couleurs** — Psychologie des couleurs, cohérence visuelle\n✍️ **Typographie** — Sélection et hiérarchie typographique\n📋 **Charte graphique** — Document de référence complet\n🖥️ **Maquettes Figma** — Prototypes interactifs haute fidélité\n📱 **Design responsive** — Mobile-first\n\nChaque projet web inclut une phase design avant le développement.",
    en: "Mohamed Ali offers **Branding & UI/UX Design** services! 🎨\n\nIncluded in branding:\n🎯 **Logo** — Original design, vector formats\n🎨 **Color palette** — Color psychology, visual consistency\n✍️ **Typography** — Selection and typographic hierarchy\n📋 **Brand guidelines** — Complete reference document\n🖥️ **Figma mockups** — High-fidelity interactive prototypes\n📱 **Responsive design** — Mobile-first\n\nEvery web project includes a design phase before development.",
  },

  /* ── Maintenance & Support ── */
  {
    id: 'maintenance',
    pattern: /\b(maintenance|support|bug|mise\s*à\s*jour|update|correction|fix|panne|down|problème|problem|après\s*livraison|after\s*delivery|post\s*launch|suivi|follow\s*up|sav)\b/i,
    fr: "Mohamed Ali assure la **maintenance et le support** de vos applications ! 🔧\n\nService de maintenance mensuel :\n✅ Mises à jour de sécurité\n✅ Corrections de bugs prioritaires\n✅ Optimisation des performances\n✅ Sauvegardes régulières\n✅ Monitoring et alertes\n✅ Rapport mensuel d'activité\n✅ Support par email & WhatsApp\n\nTarif : à partir de **200 $CAD/mois** selon le niveau de service.",
    en: "Mohamed Ali provides **maintenance and support** for your applications! 🔧\n\nMonthly maintenance service:\n✅ Security updates\n✅ Priority bug fixes\n✅ Performance optimization\n✅ Regular backups\n✅ Monitoring and alerts\n✅ Monthly activity report\n✅ Email & WhatsApp support\n\nPricing: from **$200 CAD/month** depending on service level.",
  },

  /* ── Langues parlées ── */
  {
    id: 'languages',
    pattern: /\b(langue|language|français|french|english|anglais|somali|arabe|arabic|parle|speak|bilingue|bilingual|communiqu)\b/i,
    fr: "Mohamed Ali est **multilingue** :\n\n🇫🇷 **Français** — Langue principale, natif\n🇬🇧 **Anglais** — Courant, travaille quotidiennement en anglais\n🇩🇯 **Somali** — Langue maternelle\n🇸🇦 **Arabe** — Notions\n\nIl peut mener votre projet dans la langue de votre choix et livrer votre site en plusieurs langues grâce à i18n.",
    en: "Mohamed Ali is **multilingual**:\n\n🇫🇷 **French** — Main language, fluent\n🇬🇧 **English** — Fluent, works in English daily\n🇩🇯 **Somali** — Mother tongue\n🇸🇦 **Arabic** — Basic knowledge\n\nHe can manage your project in your preferred language and deliver your site in multiple languages using i18n.",
  },

  /* ── SaaS ── */
  {
    id: 'saas',
    pattern: /\b(saas|software\s*as\s*a\s*service|logiciel|abonnement|subscription|multi.?tenant|dashboard|tableau\s*de\s*bord|stripe|facturation|billing|plan|tier)\b/i,
    fr: "Mohamed Ali développe des **plateformes SaaS** complètes ! ☁️\n\nFonctionnalités incluses :\n🔐 **Authentification** — Email, Google, GitHub OAuth\n💳 **Abonnements** — Stripe, plans Free/Pro/Enterprise\n👥 **Multi-tenant** — Isolation des données par client\n📊 **Dashboard** — Analytics, KPIs, rapports\n📧 **Emails transactionnels** — Brevo, Resend\n🔗 **API REST** — Documentation et webhooks\n📈 **Scalabilité** — Architecture cloud-native\n\nExemple réalisé : **BulkSMS** — plateforme SMS multi-entreprises.",
    en: "Mohamed Ali builds complete **SaaS platforms**! ☁️\n\nIncluded features:\n🔐 **Authentication** — Email, Google, GitHub OAuth\n💳 **Subscriptions** — Stripe, Free/Pro/Enterprise plans\n👥 **Multi-tenant** — Data isolation per client\n📊 **Dashboard** — Analytics, KPIs, reports\n📧 **Transactional emails** — Brevo, Resend\n🔗 **REST API** — Documentation and webhooks\n📈 **Scalability** — Cloud-native architecture\n\nExample built: **BulkSMS** — multi-company SMS platform.",
  },

  /* ── Révisions ── */
  {
    id: 'revisions',
    pattern: /\b(révision|revision|modification|change|modifier|correction|ajustement|adjustment|retouche|feedback|itération|iteration|boucle|loop|refaire|redo)\b/i,
    fr: "Mohamed Ali inclut des **révisions** dans chaque projet ! ✏️\n\nPolitique de révisions standard :\n• Phase design : **3 rounds** de révisions inclus\n• Phase développement : **révisions illimitées** sur le périmètre défini\n• Modifications hors périmètre : facturées au taux horaire\n\nChaque étape est validée avec le client avant de passer à la suivante, évitant les mauvaises surprises.",
    en: "Mohamed Ali includes **revisions** in every project! ✏️\n\nStandard revision policy:\n• Design phase: **3 rounds** of revisions included\n• Development phase: **unlimited revisions** within defined scope\n• Out-of-scope changes: billed at hourly rate\n\nEach step is validated with the client before moving forward, avoiding surprises.",
  },

  /* ── Paiement ── */
  {
    id: 'payment',
    pattern: /\b(paiement|payment|virement|transfer|facture|invoice|paypal|stripe|interac|modalit|acompte|deposit|échelonné|installment|mode\s*de\s*paiement|pay)\b/i,
    fr: "Voici les **modalités de paiement** de Mohamed Ali :\n\n💳 **Modes acceptés** — Virement bancaire, Interac, PayPal\n📋 **Structure** :\n• 40% à la signature du contrat\n• 30% à la validation des maquettes\n• 30% à la livraison finale\n\n📄 Factures professionnelles fournies\n🔒 Contrat de prestation signé pour chaque projet\n\nPour les projets récurrents, paiement mensuel possible.",
    en: "Here are Mohamed Ali's **payment terms**:\n\n💳 **Accepted methods** — Bank transfer, Interac, PayPal\n📋 **Structure**:\n• 40% upon contract signing\n• 30% upon mockup approval\n• 30% upon final delivery\n\n📄 Professional invoices provided\n🔒 Service contract signed for each project\n\nFor recurring projects, monthly payment is possible.",
  },

  /* ── Réunion / Appel ── */
  {
    id: 'meeting',
    pattern: /\b(réunion|meeting|appel|call|zoom|teams|google\s*meet|rendez.?vous|appointment|discuter|discuss|parler|talk|présenter|present|démo|demo|consultation)\b/i,
    fr: "Mohamed Ali propose des **appels de découverte gratuits** ! 📞\n\nFormats disponibles :\n📹 **Zoom / Google Meet** — Vidéoconférence\n📱 **WhatsApp / Téléphone** — Appel direct\n💬 **Email** — Pour les échanges écrits\n\nUn premier appel de 30 minutes est **100% gratuit** pour discuter de votre projet sans engagement.\n\n👉 Contactez-le sur WhatsApp (+1 613-291-7943) ou via le formulaire pour planifier !",
    en: "Mohamed Ali offers **free discovery calls**! 📞\n\nAvailable formats:\n📹 **Zoom / Google Meet** — Video conference\n📱 **WhatsApp / Phone** — Direct call\n💬 **Email** — For written exchanges\n\nA first 30-minute call is **100% free** to discuss your project with no commitment.\n\n👉 Contact him on WhatsApp (+1 613-291-7943) or via the contact form to schedule!",
  },

  /* ── SEO ── */
  {
    id: 'seo',
    pattern: /\b(seo|référencement|google|ranking|moteur\s*de\s*recherche|search\s*engine|mot.?clé|keyword|optimis|organic|trafic|traffic|indexation|sitemap)\b/i,
    fr: "Mohamed Ali intègre les **bonnes pratiques SEO** dans chaque projet ! 🔍\n\nInclus par défaut :\n✅ Structure sémantique HTML5 correcte\n✅ Méta-tags optimisés (title, description, OG)\n✅ Sitemap XML & robots.txt\n✅ Performance Lighthouse 90+ (Core Web Vitals)\n✅ Images optimisées (WebP, lazy loading)\n✅ URLs propres et hiérarchie logique\n\nPour du SEO avancé (contenu, link building, stratégie), il peut recommander des partenaires spécialisés.",
    en: "Mohamed Ali integrates **SEO best practices** in every project! 🔍\n\nIncluded by default:\n✅ Correct HTML5 semantic structure\n✅ Optimized meta tags (title, description, OG)\n✅ XML Sitemap & robots.txt\n✅ Lighthouse 90+ performance (Core Web Vitals)\n✅ Optimized images (WebP, lazy loading)\n✅ Clean URLs and logical hierarchy\n\nFor advanced SEO (content, link building, strategy), he can recommend specialized partners.",
  },

  /* ── Hébergement / Déploiement ── */
  {
    id: 'deployment',
    pattern: /\b(déploiement|deploy|hébergement|hosting|vercel|netlify|domaine|domain|mise\s*en\s*ligne|go\s*live|launch|server|serveur|cloud|vps|aws|digitalocean)\b/i,
    fr: "Mohamed Ali gère le **déploiement et l'hébergement** de vos projets ! 🚀\n\nPlateforme recommandées :\n☁️ **Vercel** — Frontend React (CDN global, HTTPS automatique)\n🌐 **Netlify** — Sites statiques & JAMstack\n🗄️ **Supabase** — Base de données & auth\n📦 **Railway / Render** — Backend Node.js\n🖥️ **VPS** — Pour les projets nécessitant plus de contrôle\n\nIl peut aussi configurer votre nom de domaine et les certificats SSL.",
    en: "Mohamed Ali handles **deployment and hosting** for your projects! 🚀\n\nRecommended platforms:\n☁️ **Vercel** — React frontend (global CDN, auto HTTPS)\n🌐 **Netlify** — Static sites & JAMstack\n🗄️ **Supabase** — Database & auth\n📦 **Railway / Render** — Node.js backend\n🖥️ **VPS** — For projects requiring more control\n\nHe can also configure your domain name and SSL certificates.",
  },

  /* ── Projets urgents ── */
  {
    id: 'urgency',
    pattern: /\b(urgent|urgence|rapide|vite|asap|dès\s*que\s*possible|rush|quick|fast|priorité|priority|immédiatement|immediately|express)\b/i,
    fr: "Mohamed Ali peut gérer des projets **urgents** ! ⚡\n\nPour les demandes urgentes :\n• Contactez directement via **WhatsApp** : +1 (613) 291-7943\n• Précisez votre deadline dans le message\n• Une majoration de **25-50%** peut s'appliquer selon l'urgence\n• Disponibilité confirmée sous **quelques heures**\n\nN'attendez pas — plus tôt vous contactez, mieux Mohamed Ali peut planifier votre projet !",
    en: "Mohamed Ali can handle **urgent projects**! ⚡\n\nFor urgent requests:\n• Contact directly via **WhatsApp**: +1 (613) 291-7943\n• Specify your deadline in the message\n• A **25-50% rush fee** may apply depending on urgency\n• Availability confirmed within **a few hours**\n\nDon't wait — the sooner you reach out, the better Mohamed Ali can plan your project!",
  },

  /* ── Djibouti / Afrique ── */
  {
    id: 'djibouti',
    pattern: /\b(djibouti|djib|somalie|somalia|éthiopie|ethiopia|érythrée|eritrea|afrique|africa|corne\s*de\s*l.afrique|horn\s*of\s*africa|golfe\s*d.aden|gulf\s*of\s*aden|swahili|francophon|francophone)\b/i,
    fr: "Mohamed Ali a une **connexion forte avec Djibouti** et la région ! 🇩🇯\n\nIl a réalisé plusieurs projets pour des clients djiboutiens :\n🌍 **Voyage Voyage** — Agence de tourisme leader à Djibouti\n🏥 **Clinique Al-Baraka** — Réservation médicale\n💻 **DWI** — Djibouti Wellness Initiative\n\nIl comprend parfaitement les **défis du marché local** : infrastructure internet, préférences culturelles, et besoins spécifiques des entreprises de la région.",
    en: "Mohamed Ali has a **strong connection with Djibouti** and the region! 🇩🇯\n\nHe has completed several projects for Djiboutian clients:\n🌍 **Voyage Voyage** — Leading tourism agency in Djibouti\n🏥 **Clinique Al-Baraka** — Medical booking\n💻 **DWI** — Djibouti Wellness Initiative\n\nHe fully understands the **local market challenges**: internet infrastructure, cultural preferences, and specific needs of businesses in the region.",
  },

  /* ── Confidentialité / NDA ── */
  {
    id: 'confidentiality',
    pattern: /\b(nda|confidentialité|confidentiality|secret|privé|private|accord\s*de\s*confidentialité|non.?disclosure|contrat|contract|propriété\s*intellectuelle|intellectual\s*property|gdpr|rgpd)\b/i,
    fr: "Mohamed Ali prend la **confidentialité très au sérieux** ! 🔒\n\n• **NDA (Accord de Non-Divulgation)** signé sur demande avant tout échange sensible\n• **Contrat de prestation** professionnel pour chaque projet\n• **Propriété intellectuelle** transférée au client à la livraison finale\n• **RGPD / GDPR** respecté dans le développement\n• Certains projets enterprise restent **totalement confidentiels**\n\nVous pouvez travailler avec Mohamed Ali en toute confiance.",
    en: "Mohamed Ali takes **confidentiality very seriously**! 🔒\n\n• **NDA (Non-Disclosure Agreement)** signed on request before any sensitive exchange\n• **Professional service contract** for every project\n• **Intellectual property** transferred to client upon final delivery\n• **GDPR compliant** development\n• Some enterprise projects remain **fully confidential**\n\nYou can work with Mohamed Ali with complete confidence.",
  },

  /* ── Témoignages / Avis ── */
  {
    id: 'testimonials',
    pattern: /\b(avis|review|témoignage|testimonial|client|satisfaction|référence|recommandation|recommand|note|rating|étoile|star|feedback|retour\s*client)\b/i,
    fr: "Mohamed Ali maintient un taux de **100% de satisfaction client** ! ⭐\n\n\"Mohamed a livré notre site Voyage Voyage avec une qualité exceptionnelle. Toujours disponible et très professionnel.\" — *Client, Djibouti*\n\n\"BOCRide a été développé rapidement et parfaitement. L'application fonctionne impeccablement.\" — *Client, Ottawa*\n\nAu total : **12+ projets livrés, 0 client insatisfait**. N'hésitez pas à demander des références spécifiques.",
    en: "Mohamed Ali maintains a **100% client satisfaction rate**! ⭐\n\n\"Mohamed delivered our Voyage Voyage site with exceptional quality. Always available and very professional.\" — *Client, Djibouti*\n\n\"BOCRide was developed quickly and perfectly. The app works flawlessly.\" — *Client, Ottawa*\n\nOverall: **12+ delivered projects, 0 unsatisfied clients**. Feel free to ask for specific references.",
  },

  /* ── Mobile / Responsive ── */
  {
    id: 'mobile',
    pattern: /\b(mobile|responsive|tablette|tablet|smartphone|iphone|android|ios|écran|screen|adaptatif|adaptive|fluide|fluid|breakpoint)\b/i,
    fr: "Tous les projets de Mohamed Ali sont **100% responsive** ! 📱\n\nApproche mobile-first :\n✅ Design adapté à tous les écrans (320px → 4K)\n✅ Touch-friendly — interactions optimisées mobile\n✅ Images et assets optimisés par breakpoint\n✅ Tests sur iOS Safari, Chrome Android, etc.\n✅ Performance native avec les PWA\n\nUn site qui n'est pas mobile-first en 2025 perd 60%+ de son audience !",
    en: "All of Mohamed Ali's projects are **100% responsive**! 📱\n\nMobile-first approach:\n✅ Adapted to all screens (320px → 4K)\n✅ Touch-friendly — mobile-optimized interactions\n✅ Images and assets optimized per breakpoint\n✅ Tested on iOS Safari, Chrome Android, etc.\n✅ Native performance with PWAs\n\nA non-mobile-first site in 2025 loses 60%+ of its audience!",
  },

  /* ── Performance ── */
  {
    id: 'performance',
    pattern: /\b(performance|vitesse|speed|rapide|fast|lighthouse|core\s*web\s*vitals|lcp|fid|cls|chargement|loading|optimis|pagespeed|score)\b/i,
    fr: "Mohamed Ali optimise la **performance** de chaque projet ! ⚡\n\nRésultats typiques Lighthouse :\n🟢 **Performance** — 90-100\n🟢 **Accessibilité** — 95+\n🟢 **Bonnes pratiques** — 100\n🟢 **SEO** — 95+\n\nTechniques utilisées : lazy loading, code splitting, compression Brotli, CDN, caching HTTP, images WebP/AVIF, bundle optimization avec Vite.",
    en: "Mohamed Ali optimizes **performance** in every project! ⚡\n\nTypical Lighthouse scores:\n🟢 **Performance** — 90-100\n🟢 **Accessibility** — 95+\n🟢 **Best Practices** — 100\n🟢 **SEO** — 95+\n\nTechniques: lazy loading, code splitting, Brotli compression, CDN, HTTP caching, WebP/AVIF images, Vite bundle optimization.",
  },

  /* ── Accessibilité ── */
  {
    id: 'accessibility',
    pattern: /\b(accessibilité|accessibility|wcag|aria|handicap|disability|daltonisme|color\s*blind|screen\s*reader|lecteur\s*d.écran|contraste|contrast)\b/i,
    fr: "Mohamed Ali respecte les standards d'**accessibilité web** ! ♿\n\n• **WCAG 2.1 AA** — Niveau cible pour tous les projets\n• **Balises ARIA** — Navigation assistive\n• **Contrastes de couleurs** — Ratio minimum 4.5:1\n• **Navigation clavier** — Toutes les fonctions accessibles\n• **Textes alternatifs** — Images et icônes documentées\n\nUn web accessible est un web pour tous — c'est aussi un critère SEO positif !",
    en: "Mohamed Ali follows **web accessibility** standards! ♿\n\n• **WCAG 2.1 AA** — Target level for all projects\n• **ARIA labels** — Assistive navigation\n• **Color contrasts** — Minimum 4.5:1 ratio\n• **Keyboard navigation** — All functions accessible\n• **Alt texts** — Images and icons documented\n\nAn accessible web is a web for everyone — it's also a positive SEO factor!",
  },

  /* ── Merci / Au revoir ── */
  {
    id: 'bye',
    pattern: /\b(merci|thank|au\s*revoir|goodbye|bye|bonne\s*(journée|soirée|nuit)|good\s*(day|night|bye)|à\s*(bientôt|plus|tout\s*à\s*l.heure)|ciao|see\s*you)\b/i,
    fr: "Merci de votre intérêt pour le travail de Mohamed Ali ! 🙏\n\nN'hésitez pas à revenir si vous avez d'autres questions. Bonne journée ! 😊\n\n📱 Pour démarrer un projet : **+1 (613) 291-7943**",
    en: "Thank you for your interest in Mohamed Ali's work! 🙏\n\nFeel free to come back if you have more questions. Have a great day! 😊\n\n📱 To start a project: **+1 (613) 291-7943**",
  },

  /* ── Oui / Confirmation ── */
  {
    id: 'yes',
    pattern: /^(oui|yes|ok|okay|d'accord|sure|absolument|exactly|exactement|parfait|perfect|super|great|cool|👍|yep|yup)[\s!.]*$/i,
    fr: "Super ! 😊 Dans ce cas, je vous invite à contacter Mohamed Ali directement pour discuter des détails de votre projet.\n\n📱 **WhatsApp** : +1 (613) 291-7943\n📧 **Email** : Mohameda.robleh@gmail.com\n\nIl vous répondra dans les 24 heures !",
    en: "Great! 😊 In that case, I invite you to contact Mohamed Ali directly to discuss your project details.\n\n📱 **WhatsApp**: +1 (613) 291-7943\n📧 **Email**: Mohameda.robleh@gmail.com\n\nHe'll reply within 24 hours!",
  },
];

/* ─── Fallback ────────────────────────────────────────── */
const FALLBACK = {
  fr: "Je ne suis pas sûr d'avoir compris votre question. 😊\n\nVoici ce que je peux vous dire :\n• Tapez **services** pour voir les offres\n• Tapez **projets** pour voir les réalisations\n• Tapez **contact** pour joindre Mohamed Ali\n• Tapez **tarifs** pour les prix\n• Tapez **stack** pour les technologies\n\nOu contactez directement Mohamed Ali sur **WhatsApp : +1 (613) 291-7943** !",
  en: "I'm not sure I understood your question. 😊\n\nHere's what I can tell you:\n• Type **services** to see the offerings\n• Type **projects** to see the work\n• Type **contact** to reach Mohamed Ali\n• Type **pricing** for rates\n• Type **stack** for technologies\n\nOr contact Mohamed Ali directly on **WhatsApp: +1 (613) 291-7943**!",
};

const GREETING = {
  fr: "Bonjour ! Je suis **Mo**, l'assistant de Mohamed Ali Robleh. 👋\n\nComment puis-je vous aider aujourd'hui ?",
  en: "Hello! I'm **Mo**, Mohamed Ali Robleh's assistant. 👋\n\nHow can I help you today?",
};

const QUICK_REPLIES = {
  fr: ['Vos services 💼', 'Projets réalisés 🗂️', 'Tarifs 💰', 'Disponible ? ✅', 'Comment vous contacter ? 📱'],
  en: ['Your services 💼', 'Projects 🗂️', 'Pricing 💰', 'Available? ✅', 'How to contact? 📱'],
};

/* ─── Quick reply → KB id direct map ─────────────────── */
const QR_MAP = {
  // FR
  'Vos services 💼':            'services',
  'Projets réalisés 🗂️':       'portfolio',
  'Tarifs 💰':                  'pricing',
  'Disponible ? ✅':            'availability',
  'Comment vous contacter ? 📱':'contact',
  // EN
  'Your services 💼':           'services',
  'Projects 🗂️':               'portfolio',
  'Pricing 💰':                 'pricing',
  'Available? ✅':              'availability',
  'How to contact? 📱':         'contact',
};

/* ─── Smart matcher ───────────────────────────────────── */
function getResponse(input, lang) {
  const text = input.trim();

  // 1. Direct match for quick replies
  if (QR_MAP[text]) {
    const entry = KB.find(e => e.id === QR_MAP[text]);
    if (entry) return lang === 'en' ? entry.en : entry.fr;
  }

  // 2. Regex matching on lowercased input
  const lower = text.toLowerCase();
  for (const entry of KB) {
    if (entry.pattern.test(lower)) {
      return lang === 'en' ? entry.en : entry.fr;
    }
  }

  return lang === 'en' ? FALLBACK.en : FALLBACK.fr;
}

/* ─── Bold markdown renderer ─────────────────────────── */
function RenderText({ text }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} style={{ color: '#c4b5fd', fontWeight: 600 }}>{part}</strong>
          : part
      )}
    </>
  );
}

/* ─── Message bubble ─────────────────────────────────── */
function MessageBubble({ msg }) {
  const isBot = msg.from === 'bot';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{ display: 'flex', justifyContent: isBot ? 'flex-start' : 'flex-end', marginBottom: 10 }}
    >
      {isBot && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginRight: 8, marginTop: 2,
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.62rem', fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif',
        }}>Mo</div>
      )}
      <div style={{
        maxWidth: '82%',
        background: isBot ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.65)',
        border: `1px solid ${isBot ? 'rgba(124,58,237,0.22)' : 'rgba(124,58,237,0.7)'}`,
        borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
        padding: '9px 13px',
        fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.65,
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }}>
        <RenderText text={msg.text} />
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.62rem', fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif',
      }}>Mo</div>
      <div style={{
        background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)',
        borderRadius: '4px 14px 14px 14px', padding: '10px 14px',
        display: 'flex', gap: 4, alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#9d5cf6' }}
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────── */
export default function ChatBot() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en';

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && !started) {
      setStarted(true);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages([{ id: Date.now(), from: 'bot', text: GREETING[lang] }]);
      }, 800);
    }
  }, [open, started, lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) { setHasNew(false); setTimeout(() => inputRef.current?.focus(), 300); }
  }, [open]);

  useEffect(() => {
    const t = setTimeout(() => setHasNew(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: text.trim() }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: getResponse(text, lang) }]);
    }, 700 + Math.random() * 500);
  };

  const qr = QUICK_REPLIES[lang];

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 88, right: 32, zIndex: 800,
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(124,58,237,0.5)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        animate={{ boxShadow: ['0 4px 24px rgba(124,58,237,0.35)', '0 4px 36px rgba(124,58,237,0.65)', '0 4px 24px rgba(124,58,237,0.35)'] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={22} color="#fff" />
              </motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <MessageCircle size={22} color="#fff" />
              </motion.div>
          }
        </AnimatePresence>
        <AnimatePresence>
          {hasNew && !open && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              style={{ position: 'absolute', top: 4, right: 4, width: 10, height: 10, borderRadius: '50%', background: '#10b981', border: '2px solid #05070f' }} />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', bottom: 152, right: 32, zIndex: 800,
              width: 340, maxHeight: 530,
              background: 'rgba(5, 6, 18, 0.97)',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 18, backdropFilter: 'blur(20px)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.08)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '13px 16px',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(6,182,212,0.08))',
              borderBottom: '1px solid rgba(124,58,237,0.18)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.85rem', color: '#fff',
                boxShadow: '0 0 12px rgba(124,58,237,0.5)',
                flexShrink: 0,
              }}>M</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.86rem', color: '#fff' }}>
                  Mo — morobleh.dev
                </p>
                <p style={{ margin: 0, fontSize: '0.68rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  {lang === 'fr' ? 'Assistant virtuel · En ligne' : 'Virtual assistant · Online'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '12px 10px',
              display: 'flex', flexDirection: 'column',
              scrollbarWidth: 'thin', scrollbarColor: 'rgba(124,58,237,0.25) transparent',
            }}>
              {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
              <AnimatePresence>{typing && <TypingIndicator />}</AnimatePresence>

              {/* Quick replies after greeting */}
              {messages.length === 1 && !typing && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                  {qr.map(q => (
                    <button key={q} onClick={() => sendMessage(q)}
                      style={{
                        background: 'rgba(124,58,237,0.09)', border: '1px solid rgba(124,58,237,0.28)',
                        borderRadius: 20, padding: '5px 10px', fontSize: '0.7rem',
                        color: '#c4b5fd', fontFamily: 'Syne, sans-serif', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.target.style.background = 'rgba(124,58,237,0.22)'; e.target.style.borderColor = 'rgba(124,58,237,0.55)'; }}
                      onMouseLeave={e => { e.target.style.background = 'rgba(124,58,237,0.09)'; e.target.style.borderColor = 'rgba(124,58,237,0.28)'; }}
                    >{q}</button>
                  ))}
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '9px 10px', borderTop: '1px solid rgba(124,58,237,0.13)',
              display: 'flex', gap: 7, alignItems: 'center',
              background: 'rgba(255,255,255,0.015)',
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder={lang === 'fr' ? 'Posez votre question...' : 'Ask your question...'}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(124,58,237,0.18)',
                  borderRadius: 10, padding: '8px 12px',
                  color: '#e2e8f0', fontSize: '0.82rem',
                  fontFamily: 'Inter, sans-serif', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(124,58,237,0.18)'}
              />
              <motion.button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                whileHover={input.trim() ? { scale: 1.08 } : {}}
                whileTap={input.trim() ? { scale: 0.93 } : {}}
                style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: input.trim() ? 'var(--accent)' : 'rgba(124,58,237,0.12)',
                  border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                <Send size={14} color={input.trim() ? '#fff' : '#52525b'} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
