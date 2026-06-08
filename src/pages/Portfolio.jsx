import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Lock } from 'lucide-react';
import { fadeUp, staggerContainer, viewportConfig } from '../hooks/useScrollAnimation';
import thumbVoyage      from '../assets/thumbnail-voyage.jpg';
import thumbDwi         from '../assets/thumbnail-dwi.jpg';
import thumbCampusride  from '../assets/thumbnail-campusride.jpg';
import thumbBluestars   from '../assets/thumbnail-bluestars.jpg';
import thumbKhidma      from '../assets/thumbnail-khidma.jpg';
import thumbAlbaraka    from '../assets/thumbnail-albaraka.jpg';
import thumbBulksms     from '../assets/thumbnail-bulksms.jpg';
import thumbBellacoiffure from '../assets/thumbnail-bellacoiffure.jpg';
import thumbMovierent   from '../assets/thumbnail-movierent.jpg';
import thumbJobapp      from '../assets/thumbnail-linkedin.jpg';

const GRADIENTS = {
  web:      'linear-gradient(135deg, #1e3a5f 0%, #2d1b69 100%)',
  pwa:      'linear-gradient(135deg, #1a1040 0%, #4a1d96 100%)',
  platform: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  ai:       'linear-gradient(135deg, #0a192f 0%, #0d4a5e 100%)',
  saas:     'linear-gradient(135deg, #1a0533 0%, #3b0764 100%)',
};

const PROJECTS = [
  { id: 1,  name: 'Voyage Voyage',         desc: 'Agence de tourisme',              url: 'https://voyagevoyagedj.com',               category: 'web',      gradient: GRADIENTS.web,      tags: ['Web', 'Tourism'],     thumbnail: thumbVoyage },
  { id: 2,  name: 'DWI',                   desc: 'Djibouti Wellness Initiative',    url: 'https://dwi-website-six.vercel.app',       category: 'web',      gradient: GRADIENTS.web,      tags: ['Web', 'Health'],      thumbnail: thumbDwi },
  { id: 3,  name: 'BOCRide',               desc: 'Application de covoiturage',      url: null,                                       category: 'pwa',      gradient: GRADIENTS.pwa,      tags: ['PWA', 'Carpooling'] },
  { id: 4,  name: 'CampusRide',            desc: 'Covoiturage Collège La Cité',    url: 'https://campusride-delta.vercel.app',      category: 'pwa',      gradient: GRADIENTS.pwa,      tags: ['PWA', 'Campus'],      thumbnail: thumbCampusride },
  { id: 5,  name: 'Ottawa Blue Stars',     desc: 'Gestion d\'équipe sportive',     url: 'https://ottawa-blue-stars.vercel.app',     category: 'pwa',      gradient: GRADIENTS.pwa,      tags: ['PWA', 'Sports'],      thumbnail: thumbBluestars },
  { id: 6,  name: 'Khidma',               desc: 'Marketplace services à domicile', url: 'https://khidma-henna.vercel.app',          category: 'platform', gradient: GRADIENTS.platform, tags: ['Platform', 'Marketplace'], thumbnail: thumbKhidma },
  { id: 7,  name: 'Clinique Al-Baraka',    desc: 'Réservation médicale',           url: 'https://rendez-vous-clinique.vercel.app',  category: 'web',      gradient: GRADIENTS.web,      tags: ['Web', 'Healthcare'],  thumbnail: thumbAlbaraka },
  { id: 8,  name: 'BulkSMS',              desc: 'Plateforme SMS',                 url: 'https://bulksms-platform.vercel.app',      category: 'platform', gradient: GRADIENTS.saas,     tags: ['SaaS', 'Platform'],   thumbnail: thumbBulksms },
  { id: 9,  name: 'MaplePath',            desc: 'Guide immigration Canada',        url: 'https://maple-path-rust.vercel.app',       category: 'web',      gradient: GRADIENTS.web,      tags: ['Web', 'Immigration'], hidden: true },
  { id: 10, name: 'Bella Coiffure',        desc: 'Site vitrine salon',             url: 'https://bella-coiffure-seven.vercel.app',  category: 'web',      gradient: GRADIENTS.web,      tags: ['Web', 'Beauty'],      thumbnail: thumbBellacoiffure },
  { id: 11, name: 'MovieRent',            desc: 'Location de films en ligne',      url: 'https://movierent-six.vercel.app',         category: 'platform', gradient: GRADIENTS.platform, tags: ['Platform', 'Streaming'], thumbnail: thumbMovierent },
  { id: 13, name: 'Job Application System', desc: 'Système de candidature d\'emploi', url: 'https://modern-job-application-system.vercel.app/', category: 'platform', gradient: GRADIENTS.saas, tags: ['Platform', 'SaaS', 'HR'], thumbnail: thumbJobapp },
  { id: 12, name: 'Confidential',          desc: '',                                url: null,                                       category: 'all',      gradient: GRADIENTS.ai,       tags: [] },
];

const FILTERS = ['all', 'web', 'pwa', 'platform'];

export default function Portfolio() {
  const { t } = useTranslation();
  const [active, setActive] = useState('all');

  const filtered = (active === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === active || p.category === 'all')
  ).filter((p) => !p.hidden);

  const filterLabel = (key) => {
    const map = {
      all: t('portfolio.filter_all'),
      web: t('portfolio.filter_web'),
      pwa: t('portfolio.filter_pwa'),
      platform: t('portfolio.filter_platform'),
      ai: t('portfolio.filter_ai'),
    };
    return map[key] || key;
  };

  return (
    <>
      {/* Page hero */}
      <section className="page-hero mesh-bg">
        <div className="container">
          <motion.div
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
          >
            <motion.span className="section-eyebrow" variants={fadeUp}>
              {t('portfolio.eyebrow')}
            </motion.span>
            <motion.h1
              className="section-title"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
              variants={fadeUp}
            >
              {t('portfolio.title')}
            </motion.h1>
            <motion.p className="section-subtitle" variants={fadeUp}>
              {t('portfolio.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding" style={{ paddingTop: 48 }}>
        <div className="container">
          {/* Filter tabs */}
          <motion.div
            className="filter-tabs"
            variants={staggerContainer(0.06)}
            initial="hidden"
            animate="visible"
          >
            {FILTERS.map((f) => (
              <motion.button
                key={f}
                className={`filter-tab ${active === f ? 'active' : ''}`}
                onClick={() => setActive(f)}
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {filterLabel(f)}
              </motion.button>
            ))}
          </motion.div>

          {/* Grid */}
          <motion.div
            className="portfolio-grid"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={`project-card ${project.id === 12 ? 'confidential-card' : ''}`}
                >
                  {project.id === 12 ? (
                    /* Confidential card */
                    <>
                      <div className="project-thumbnail" style={{ background: project.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div
                          animate={{ scale: [1, 1.08, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Lock size={36} style={{ color: 'rgba(255,255,255,0.25)' }} />
                        </motion.div>
                      </div>
                      <div className="project-info">
                        <h3 style={{ color: 'var(--text-dim)' }}>{t('portfolio.confidential_title')}</h3>
                        <p style={{ fontSize: '0.83rem', color: 'var(--text-dim)', marginTop: 6 }}>
                          {t('portfolio.confidential_desc')}
                        </p>
                      </div>
                    </>
                  ) : (
                    /* Regular project card */
                    <>
                      <div className="project-thumbnail" style={{ background: project.thumbnail ? undefined : project.gradient }}>
                        {project.thumbnail ? (
                          <img
                            src={project.thumbnail}
                            alt={project.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        ) : (
                          <>
                            {/* Decorative grid lines */}
                            <div style={{
                              position: 'absolute', inset: 0, opacity: 0.12,
                              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                              backgroundSize: '32px 32px',
                            }} />
                            <div style={{
                              position: 'absolute', bottom: 16, left: 20,
                              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem',
                              color: 'rgba(255,255,255,0.15)', letterSpacing: '-0.02em',
                            }}>
                              {project.name}
                            </div>
                          </>
                        )}
                        <div className="project-overlay">
                          {project.url && (
                            <motion.a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary-accent"
                              style={{ fontSize: '0.82rem', padding: '9px 20px' }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>{t('portfolio.view_project')}</span>
                              <ExternalLink size={13} />
                            </motion.a>
                          )}
                        </div>
                      </div>
                      <div className="project-info">
                        <h3>{project.name}</h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: 10 }}>
                          {project.desc}
                        </p>
                        <div className="project-tags">
                          {project.tags.map((tag) => (
                            <span key={tag} className="project-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  );
}
