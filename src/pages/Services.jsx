import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Code2, Smartphone, Palette, Network, Truck, Bot, Calendar, Cloud, Wrench, ArrowRight, Lock, Zap,
} from 'lucide-react';
import { fadeUp, staggerContainer, viewportConfig, scaleIn } from '../hooks/useScrollAnimation';

const SERVICE_ICONS = [
  <Code2 size={22} />,
  <Smartphone size={22} />,
  <Palette size={22} />,
  <Network size={22} />,
  <Truck size={22} />,
  <Bot size={22} />,
  <Calendar size={22} />,
  <Cloud size={22} />,
  <Wrench size={22} />,
];

export default function Services() {
  const { t } = useTranslation();

  const services = SERVICE_ICONS.map((icon, i) => ({
    key: `s${i + 1}`,
    icon,
    title: t(`services.s${i + 1}_title`),
    desc: t(`services.s${i + 1}_desc`),
  }));

  return (
    <>
      {/* Page hero */}
      <section className="page-hero mesh-bg">
        <div className="container">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
          >
            <motion.span className="section-eyebrow" variants={fadeUp}>
              {t('services.eyebrow')}
            </motion.span>
            <motion.h1 className="section-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }} variants={fadeUp}>
              {t('services.title')}
            </motion.h1>
            <motion.p className="section-subtitle" variants={fadeUp}>
              {t('services.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services grid */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            className="services-grid"
            variants={staggerContainer(0.09)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {services.map((svc) => (
              <motion.div
                key={svc.key}
                className="glass-card service-full-card"
                variants={fadeUp}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div className="service-icon-wrap">{svc.icon}</div>
                  {(svc.key === 's3' || svc.key === 's6') && (
                    <span className="badge-on-request">{t('services.on_demand')}</span>
                  )}
                </div>
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* On demand */}
          <motion.div
            className="on-demand-section"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <Zap size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {t('services.on_demand_title')}
              </span>{' '}
              <span style={{ fontSize: '0.88rem', color: 'var(--text-dim)' }}>
                {t('services.on_demand_items')}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enterprise section */}
      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div
            className="enterprise-section"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span className="section-eyebrow" style={{ margin: 0 }}>
                  {t('services.enterprise_eyebrow')}
                </span>
                <span className="badge-pill">
                  <Lock size={11} />
                  {t('services.enterprise_badge')}
                </span>
              </div>
              <h2
                className="section-title"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', maxWidth: 680 }}
              >
                {t('services.enterprise_title')}
              </h2>
              <p className="section-subtitle mb-4">
                {t('services.enterprise_desc')}
              </p>
              <Link to="/contact" className="btn-primary-accent">
                <span>{t('services.enterprise_cta')}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
