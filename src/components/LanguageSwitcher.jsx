import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('fr') ? 'fr' : 'en';

  const switchTo = (lng) => {
    if (lng !== current) {
      i18n.changeLanguage(lng);
    }
  };

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn ${current === 'fr' ? 'active' : ''}`}
        onClick={() => switchTo('fr')}
      >
        FR
      </button>
      <button
        className={`lang-btn ${current === 'en' ? 'active' : ''}`}
        onClick={() => switchTo('en')}
      >
        EN
      </button>
    </div>
  );
}
