# morobleh.dev — Portfolio Personnel

Portfolio professionnel premium construit avec React + Vite + Bootstrap 5.3.

## Stack Technique

- React 18 + Vite
- Bootstrap 5.3 (grille responsive)
- Framer Motion (animations)
- React Router v6 (navigation)
- @splinetool/react-spline (scène 3D hero)
- i18next + react-i18next (bilingue FR/EN)
- @emailjs/browser (formulaire sans backend)
- Lucide React (icônes)

## Démarrage rapide

```bash
npm install
npm run dev
```

## Configuration Brevo (formulaire de contact)

1. Créer un compte sur https://www.brevo.com
2. Aller dans **Settings → API Keys** → créer une clé API
3. Aller dans **Senders & IPs → Senders** → vérifier `Mohameda.robleh@gmail.com`
4. Dans `src/pages/Contact.jsx`, remplacer la constante :

```js
const BREVO_API_KEY = 'xkeysib-xxxxxxxxxxxxxxxxxxxxxxxx';
```

Le formulaire envoie directement à `Mohameda.robleh@gmail.com` avec le reply-to du visiteur.

## Personnalisation du thème

Dans src/index.css :

```css
:root {
  --bg: #05070f;
  --accent: #7c3aed;
  --accent-cyan: #06b6d4;
}
```

## Scène Spline (hero 3D)

Dans src/pages/Home.jsx, remplacer l'URL :

```jsx
scene="https://prod.spline.design/VOTRE_ID/scene.splinecode"
```

Un fallback gradient s'affiche automatiquement si la scène ne charge pas.

## Build

```bash
npm run build
npm run preview
```
