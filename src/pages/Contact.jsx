import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import { FaLinkedinIn, FaWhatsapp, FaGithub } from 'react-icons/fa';
import { fadeUp, staggerContainer, viewportConfig } from '../hooks/useScrollAnimation';

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const RECIPIENT_EMAIL = 'mohameda.robleh@gmail.com';
const RECIPIENT_NAME = 'Mohamed Ali Robleh';
// Sender vérifié dans Brevo (active: true)
const SENDER_EMAIL = 'mohameda.robleh@gmail.com';
const SENDER_NAME = 'MoRobleh.Dev';

async function sendViaBrevo({ from_name, from_email, subject, message }) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: RECIPIENT_EMAIL, name: RECIPIENT_NAME }],
      replyTo: { email: from_email, name: from_name },
      subject: `[Portfolio] ${subject} — ${from_name}`,
      htmlContent: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:0">
          <div style="background:#7c3aed;padding:24px 32px;border-radius:12px 12px 0 0">
            <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700">morobleh.dev</h1>
            <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px">Nouveau message via le formulaire de contact</p>
          </div>
          <div style="background:#0d0f1e;padding:32px;border-radius:0 0 12px 12px;border:1px solid #1e2040;border-top:none">
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              <tr>
                <td style="padding:10px 0;color:#a1a1aa;width:100px;font-size:13px;vertical-align:top">De</td>
                <td style="padding:10px 0;color:#fff;font-size:14px;font-weight:600">${from_name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#a1a1aa;font-size:13px">Email</td>
                <td style="padding:10px 0"><a href="mailto:${from_email}" style="color:#9d5cf6;font-size:14px">${from_email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#a1a1aa;font-size:13px">Sujet</td>
                <td style="padding:10px 0;color:#fff;font-size:14px">${subject}</td>
              </tr>
            </table>
            <div style="background:#12142a;border-radius:8px;padding:20px;border-left:3px solid #7c3aed">
              <p style="color:#a1a1aa;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.08em">Message</p>
              <p style="color:#fff;line-height:1.7;white-space:pre-wrap;margin:0;font-size:14px">${message}</p>
            </div>
            <a href="mailto:${from_email}" style="display:inline-block;margin-top:24px;background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
              Répondre à ${from_name}
            </a>
          </div>
        </div>
      `,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Brevo error');
  }
  return res.json();
}

export default function Contact() {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const subjects = [
    t('contact.subject_new_project'),
    t('contact.subject_partnership'),
    t('contact.subject_support'),
    t('contact.subject_other'),
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const fd = new FormData(formRef.current);
    try {
      await sendViaBrevo({
        from_name: fd.get('from_name'),
        from_email: fd.get('from_email'),
        subject: fd.get('subject'),
        message: fd.get('message'),
      });
      setStatus('success');
      formRef.current?.reset();
    } catch {
      setStatus('error');
    }
  };

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
              {t('contact.eyebrow')}
            </motion.span>
            <motion.h1
              className="section-title"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
              variants={fadeUp}
            >
              {t('contact.title')}
            </motion.h1>
            <motion.p className="section-subtitle" variants={fadeUp}>
              {t('contact.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className="contact-grid">
            {/* Left — Info */}
            <motion.div
              variants={staggerContainer(0.12)}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              {/* Location badge */}
              <motion.div variants={fadeUp} style={{ marginBottom: 32 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.18)',
                  borderRadius: 100, padding: '8px 16px',
                  fontSize: '0.82rem', color: 'var(--accent-cyan)',
                  fontFamily: 'Syne, sans-serif', fontWeight: 600,
                }}>
                  <MapPin size={14} />
                  {t('contact.location')}
                </div>
              </motion.div>

              {/* Icon-only contact links */}
              <motion.div variants={fadeUp} style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <a
                    href="mailto:Mohameda.robleh@gmail.com"
                    className="contact-icon-btn"
                    title="Email"
                  >
                    <Mail size={20} />
                  </a>
                  <a
                    href="https://wa.me/16132917943"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-icon-btn"
                    title="WhatsApp"
                  >
                    <Phone size={20} />
                  </a>
                  <a
                    href="https://linkedin.com/in/mohamed-ali-roblehh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-icon-btn"
                    title="LinkedIn"
                  >
                    <FaLinkedinIn size={19} />
                  </a>
                  <a
                    href="https://github.com/MohamedAliRobleh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-icon-btn"
                    title="GitHub"
                  >
                    <FaGithub size={19} />
                  </a>
                  <a
                    href="https://wa.me/16132917943"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-icon-btn"
                    title="WhatsApp"
                  >
                    <FaWhatsapp size={20} />
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              <div className="glass-card" style={{ padding: '36px 32px' }}>
                {status === 'success' ? (
                  <motion.div
                    className="form-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CheckCircle size={36} style={{ color: '#34d399', margin: '0 auto 12px', display: 'block' }} />
                    <h4>{t('contact.form_success_title')}</h4>
                    <p>{t('contact.form_success_desc')}</p>
                  </motion.div>
                ) : (
                  <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                      <label className="form-label" htmlFor="from_name">{t('contact.form_name')}</label>
                      <input
                        id="from_name"
                        name="from_name"
                        type="text"
                        className="form-control-custom"
                        placeholder={t('contact.placeholder_name')}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="from_email">{t('contact.form_email')}</label>
                      <input
                        id="from_email"
                        name="from_email"
                        type="email"
                        className="form-control-custom"
                        placeholder={t('contact.placeholder_email')}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="subject">{t('contact.form_subject')}</label>
                      <select id="subject" name="subject" className="form-control-custom" required>
                        <option value="">{t('contact.form_subject')}</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="message">{t('contact.form_message')}</label>
                      <textarea
                        id="message"
                        name="message"
                        className="form-control-custom"
                        placeholder={t('contact.placeholder_message')}
                        required
                      />
                    </div>

                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '12px 16px', borderRadius: 8, marginBottom: 16,
                          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                          color: '#f87171', fontSize: '0.88rem',
                        }}
                      >
                        <AlertCircle size={16} />
                        {t('contact.form_error')}
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      className="btn-primary-accent w-100"
                      disabled={status === 'sending'}
                      whileHover={status !== 'sending' ? { scale: 1.02 } : {}}
                      whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
                    >
                      {status === 'sending' ? (
                        <span style={{ opacity: 0.75 }}>{t('contact.form_sending')}</span>
                      ) : (
                        <>
                          <span>{t('contact.form_send')}</span>
                          <Send size={16} />
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
