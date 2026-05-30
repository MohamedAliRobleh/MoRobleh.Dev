import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { FaLinkedinIn, FaWhatsapp, FaGithub } from 'react-icons/fa';
import { staggerContainer, fadeUp, viewportConfig } from '../hooks/useScrollAnimation';

export default function Footer() {
  const { t } = useTranslation();

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/portfolio', label: t('nav.portfolio') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const socials = [
    { href: 'https://linkedin.com/in/mohamed-ali-roblehh', label: 'LinkedIn', icon: <FaLinkedinIn size={15} /> },
    { href: 'https://github.com/MohamedAliRobleh', label: 'GitHub', icon: <FaGithub size={15} /> },
    { href: 'https://wa.me/16132917943', label: 'WhatsApp', icon: <FaWhatsapp size={16} /> },
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <motion.div
          className="footer-grid"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {/* Col 1 — Brand */}
          <motion.div variants={fadeUp}>
            <Link to="/" className="footer-logo">
              morobleh<span className="logo-dot">.</span>dev
            </Link>
            <p className="footer-tagline">{t('footer.tagline')}</p>
          </motion.div>

          {/* Col 2 — Links */}
          <motion.div variants={fadeUp}>
            <p className="footer-col-title">{t('footer.links_title')}</p>
            <ul className="footer-links">
              {links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Col 3 — Socials */}
          <motion.div variants={fadeUp}>
            <p className="footer-col-title">{t('footer.social_title')}</p>
            <div>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                >
                  {s.icon}
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="footer-bottom">
          <p>
            {t('footer.copyright').split('morobleh.dev').map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}<span>morobleh.dev</span>
                </span>
              ) : (
                part
              )
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
