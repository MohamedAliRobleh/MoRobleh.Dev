import React, { lazy, Suspense, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Code2, Smartphone, Palette, Network, Truck, Bot, ArrowRight, ChevronDown,
} from 'lucide-react';
import { fadeUp, fadeIn, scaleIn, staggerContainer, viewportConfig } from '../hooks/useScrollAnimation';

const Spline = lazy(() => import('@splinetool/react-spline'));

class SplineErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: false }; }
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? this.props.fallback : this.props.children; }
}

function SplineFallback() {
  return (
    <div className="hero-3d-fallback">
      <div style={{ textAlign: 'center' }}>
        <div className="hero-3d-orb" />
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontFamily: 'Syne,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          morobleh<span style={{ color: 'var(--accent)' }}>.</span>dev
        </p>
      </div>
    </div>
  );
}

function AnimatedWord({ word, delay, highlight }) {
  return (
    <motion.span
      className={`animated-word${highlight ? ' gradient-text' : ''}`}
      initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {word}{' '}
    </motion.span>
  );
}

function CountUp({ to, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = to / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), to);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const FEATURED_SERVICES = [
  { key: 's1', icon: <Code2 size={22} /> },
  { key: 's2', icon: <Smartphone size={22} /> },
  { key: 's6', icon: <Bot size={22} /> },
];

const TECH_BADGES = ['React', 'Supabase', 'Bootstrap', 'Figma', 'Node.js', 'PWA'];

export default function Home() {
  const { t } = useTranslation();

  const titleStart = t('hero.title_start').split(' ');
  const titleHighlight = t('hero.title_highlight').split(' ');
  const titleEnd = t('hero.title_end').split(' ');
  const allWords = [
    ...titleStart.map((w) => ({ word: w, highlight: false })),
    ...titleHighlight.map((w) => ({ word: w, highlight: true })),
    ...titleEnd.map((w) => ({ word: w, highlight: false })),
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero-section mesh-bg">
        <div className="container">
          <div className="hero-content">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ marginBottom: 24 }}
              >
                <span className="badge-available">
                  <span className="pulse-dot" />
                  {t('hero.badge')}
                </span>
              </motion.div>

              <div className="hero-title-wrapper">
                {allWords.map((item, i) => (
                  <AnimatedWord
                    key={i}
                    word={item.word}
                    highlight={item.highlight}
                    delay={0.25 + i * 0.08}
                  />
                ))}
              </div>

              <motion.p
                className="hero-subtitle"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.85 }}
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.div
                className="hero-cta-row"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <Link to="/portfolio" className="btn-primary-accent">
                  <span>{t('hero.cta_projects')}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="btn-outline-accent">
                  {t('hero.cta_contact')}
                </Link>
              </motion.div>

              <motion.div
                className="hero-tech-row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                {TECH_BADGES.map((badge, i) => (
                  <motion.span
                    key={badge}
                    className="tech-badge"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + i * 0.07, duration: 0.35 }}
                  >
                    {badge}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Right — 3D */}
            <motion.div
              className="hero-3d-wrapper"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            >
              <SplineErrorBoundary fallback={<SplineFallback />}>
                <Suspense fallback={<SplineFallback />}>
                  <Spline
                    scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                    style={{ width: '100%', height: '100%' }}
                  />
                </Suspense>
              </SplineErrorBoundary>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <div className="scroll-line" />
          <span>{t('hero.scroll')}</span>
          <ChevronDown size={12} />
        </motion.div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-bar">
        <div className="container">
          <motion.div
            className="stats-grid"
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {[
              { num: t('stats.projects_num'), suf: t('stats.projects_suffix'), label: t('stats.projects_label') },
              { num: t('stats.experience_num'), suf: t('stats.experience_suffix'), label: t('stats.experience_label') },
              { num: t('stats.countries_num'), suf: t('stats.countries_suffix'), label: t('stats.countries_label') },
              { num: t('stats.satisfaction_num'), suf: t('stats.satisfaction_suffix'), label: t('stats.satisfaction_label') },
            ].map((stat, i) => (
              <motion.div key={i} className="stat-item" variants={scaleIn}>
                <div className="stat-number">
                  <CountUp to={Number(stat.num)} suffix={stat.suf} />
                </div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT TEASER ===== */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            className="about-grid"
            variants={staggerContainer(0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <motion.div variants={scaleIn}>
              <div className="avatar-wrapper">
                <div className="avatar-inner">M</div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <span className="section-eyebrow">{t('about.eyebrow')}</span>
              <h2 className="section-title">{t('about.title')}</h2>
              <p className="section-subtitle mb-3">{t('about.bio')}</p>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 28 }}>
                {t('about.bio2')}
              </p>
              <Link to="/services" className="btn-ghost">
                {t('about.cta')} <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="divider-gradient" />

      {/* ===== FEATURED SERVICES ===== */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            className="text-center mb-5"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <span className="section-eyebrow">{t('featured.eyebrow')}</span>
            <h2 className="section-title">{t('featured.title')}</h2>
            <p className="section-subtitle mx-auto">{t('featured.subtitle')}</p>
          </motion.div>

          <motion.div
            className="services-preview-grid"
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {FEATURED_SERVICES.map((svc) => (
              <motion.div key={svc.key} className="glass-card service-card" variants={fadeUp}>
                <div className="service-icon-wrap">{svc.icon}</div>
                <h3>{t(`services.${svc.key}_title`)}</h3>
                <p>{t(`services.${svc.key}_desc`)}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-5"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <Link to="/services" className="btn-ghost">
              {t('featured.cta')} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-banner">
        <div className="container">
          <motion.div
            className="cta-banner-inner"
            variants={staggerContainer(0.12, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <motion.h2 className="cta-banner-title" variants={fadeUp}>
              {t('cta_banner.title')}
            </motion.h2>
            <motion.p className="cta-banner-subtitle" variants={fadeUp}>
              {t('cta_banner.subtitle')}
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/contact" className="btn-primary-accent">
                <span>{t('cta_banner.button')}</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
