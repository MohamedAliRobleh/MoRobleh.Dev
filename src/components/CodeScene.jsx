import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

/* ─── Syntax token types ─────────────────────────────── */
const COLORS = {
  kw:   '#c084fc',  // keywords       — violet clair
  fn:   '#fbbf24',  // fonctions       — amber
  str:  '#22d3ee',  // strings         — cyan
  cmt:  '#4b5563',  // commentaires    — gris
  num:  '#f87171',  // nombres         — rouge clair
  tag:  '#34d399',  // balises JSX     — vert émeraude
  attr: '#93c5fd',  // attributs       — bleu clair
  op:   '#e879f9',  // opérateurs      — fuchsia
  def:  '#e2e8f0',  // défaut          — blanc doux
  px:   '#a5f3fc',  // propriétés CSS  — sky
};

/* ─── Token helper ────────────────────────────────────── */
const t = (text, type = 'def') => ({ text, type });
const nl = { nl: true };   // saut de ligne

/* ─── Snippets ────────────────────────────────────────── */
const SNIPPETS = [
  // Snippet 1 — React component
  [
    t('import ', 'kw'), t('{ ', 'def'), t('motion', 'fn'), t(', ', 'def'), t('useAnimation', 'fn'), t(' }', 'def'), nl,
    t('from ', 'kw'), t("'framer-motion'", 'str'), nl,
    nl,
    t('const ', 'kw'), t('HeroSection', 'fn'), t(' = () => {', 'def'), nl,
    t('  const ', 'kw'), t('[', 'op'), t('visible', 'attr'), t(', ', 'def'), t('setVisible', 'fn'), t('] = ', 'op'), nl,
    t('    ', 'def'), t('useState', 'fn'), t('(', 'op'), t('false', 'num'), t(')', 'op'), nl,
    nl,
    t('  return ', 'kw'), t('(', 'op'), nl,
    t('    <', 'tag'), t('motion.section', 'fn'), nl,
    t('      initial', 'attr'), t('={{ ', 'op'), t('opacity', 'px'), t(': ', 'op'), t('0', 'num'), t(' }}', 'op'), nl,
    t('      animate', 'attr'), t('={{ ', 'op'), t('opacity', 'px'), t(': ', 'op'), t('1', 'num'), t(' }}', 'op'), nl,
    t('    >', 'tag'), nl,
    t('      <', 'tag'), t('h1', 'fn'), t('>', 'tag'), t('morobleh', 'def'), t('.', 'op'), t('dev', 'attr'), t('</', 'tag'), t('h1', 'fn'), t('>', 'tag'), nl,
    t('    </', 'tag'), t('motion.section', 'fn'), t('>', 'tag'), nl,
    t('  )', 'op'), nl,
    t('}', 'def'), nl,
  ],
  // Snippet 2 — CSS glass card
  [
    t('/* Premium glassmorphism */', 'cmt'), nl,
    t('.glass-card', 'fn'), t(' {', 'def'), nl,
    t('  background', 'px'), t(': ', 'op'), t('rgba', 'fn'), t('(', 'op'), t('255, 255, 255, 0.03', 'num'), t(')', 'op'), nl,
    t('  border', 'px'), t(': ', 'op'), t('1px', 'num'), t(' solid ', 'def'), t('rgba', 'fn'), t('(', 'op'), t('124, 58, 237, 0.4', 'num'), t(')', 'op'), nl,
    t('  backdrop-filter', 'px'), t(': ', 'op'), t('blur', 'fn'), t('(', 'op'), t('16px', 'num'), t(')', 'op'), nl,
    t('  border-radius', 'px'), t(': ', 'op'), t('16px', 'num'), nl,
    t('  transition', 'px'), t(': all ', 'def'), t('0.35s', 'num'), t(' ease', 'def'), nl,
    t('}', 'def'), nl,
    nl,
    t('.glass-card', 'fn'), t(':hover {', 'def'), nl,
    t('  border-color', 'px'), t(': ', 'op'), t('rgba', 'fn'), t('(', 'op'), t('124, 58, 237, 0.6', 'num'), t(')', 'op'), nl,
    t('  box-shadow', 'px'), t(': ', 'op'), t('0 12px 48px ', 'def'), nl,
    t('    ', 'def'), t('rgba', 'fn'), t('(', 'op'), t('124, 58, 237, 0.2', 'num'), t(')', 'op'), nl,
    t('  transform', 'px'), t(': ', 'op'), t('translateY', 'fn'), t('(', 'op'), t('-6px', 'num'), t(')', 'op'), nl,
    t('}', 'def'), nl,
  ],
  // Snippet 3 — Brevo API / async fetch
  [
    t('// Contact form — Brevo API', 'cmt'), nl,
    t('async function ', 'kw'), t('sendMessage', 'fn'), t('(data) {', 'def'), nl,
    t('  const ', 'kw'), t('res = ', 'def'), t('await ', 'kw'), t('fetch', 'fn'), t('(', 'op'), nl,
    t("    '", 'def'), t('https://api.brevo.com/v3/smtp/email', 'str'), t("',", 'def'), nl,
    t('    {', 'def'), nl,
    t('      method', 'attr'), t(': ', 'op'), t("'POST'", 'str'), t(',', 'def'), nl,
    t('      headers', 'attr'), t(': {', 'def'), nl,
    t("        'api-key'", 'str'), t(': ', 'op'), t('BREVO_KEY', 'fn'), nl,
    t('      },', 'def'), nl,
    t('      body', 'attr'), t(': ', 'op'), t('JSON', 'fn'), t('.', 'op'), t('stringify', 'fn'), t('(data)', 'def'), nl,
    t('    }', 'def'), nl,
    t('  )', 'def'), nl,
    nl,
    t('  if ', 'kw'), t('(!res.', 'def'), t('ok', 'attr'), t(') ', 'def'), t('throw new ', 'kw'), t('Error', 'fn'), t('()', 'op'), nl,
    t('  return ', 'kw'), t('res.', 'def'), t('json', 'fn'), t('()', 'op'), nl,
    t('}', 'def'), nl,
  ],
];

/* ─── Tokenized text → React spans ──────────────────── */
function TokenSpan({ token }) {
  return (
    <span style={{ color: COLORS[token.type] || COLORS.def }}>
      {token.text}
    </span>
  );
}

/* ─── Holographic forearm ────────────────────────────── */
function Hand({ side = 'left' }) {
  const isRight = side === 'right';
  const tilt = isRight ? 'rotate(6deg)' : 'rotate(-6deg)';
  return (
    <svg
      width="72" height="100"
      viewBox="0 0 72 100"
      style={{
        filter: `drop-shadow(0 0 12px rgba(124,58,237,0.8)) drop-shadow(0 0 24px rgba(124,58,237,0.3))`,
        transform: tilt,
        transformOrigin: 'center bottom',
      }}
    >
      <defs>
        <linearGradient id={`arm-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="45%"  stopColor="#9d5cf6" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`shine-${side}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="white" stopOpacity="0" />
          <stop offset="35%"  stopColor="white" stopOpacity="0.12" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`clip-${side}`}>
          <rect x="4" y="0" width="64" height="100" rx="22" />
        </clipPath>
      </defs>

      {/* Main forearm shape */}
      <rect x="4" y="0" width="64" height="100" rx="22"
        fill={`url(#arm-${side})`} />

      {/* Specular shine */}
      <rect x="4" y="0" width="64" height="100" rx="22"
        fill={`url(#shine-${side})`} />

      {/* Top edge glow */}
      <rect x="4" y="0" width="64" height="4" rx="22"
        fill="#22d3ee" fillOpacity="0.6" />

      {/* Stroke */}
      <rect x="4" y="0" width="64" height="100" rx="22"
        fill="none"
        stroke="url(#arm-${side})"
        strokeWidth="1.2"
        strokeOpacity="0.5" />

      {/* Inner circuit line decoration */}
      <line x1="20" y1="18" x2="52" y2="18"
        stroke="#22d3ee" strokeWidth="0.7" strokeOpacity="0.35" />
      <line x1="16" y1="30" x2="56" y2="30"
        stroke="#9d5cf6" strokeWidth="0.5" strokeOpacity="0.25" />
      <circle cx="36" cy="18" r="2.5"
        fill="#22d3ee" fillOpacity="0.5" />
    </svg>
  );
}

/* ─── Keyboard ────────────────────────────────────────── */
function Keyboard({ activeKeys }) {
  const rows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M'],
  ];
  return (
    <div style={{
      background: 'rgba(10,8,25,0.8)',
      border: '1px solid rgba(124,58,237,0.25)',
      borderRadius: 12,
      padding: '10px 14px',
      display: 'flex', flexDirection: 'column', gap: 6,
      boxShadow: '0 4px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1)',
    }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
          {row.map((k) => {
            const isActive = activeKeys.includes(k);
            return (
              <div
                key={k}
                style={{
                  width: 28, height: 28,
                  borderRadius: 5,
                  background: isActive
                    ? 'rgba(124,58,237,0.4)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? 'rgba(124,58,237,0.8)' : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.55rem', color: isActive ? '#c4b5fd' : '#3f3f46',
                  fontFamily: 'Syne, sans-serif', fontWeight: 700,
                  transition: 'all 0.12s ease',
                  boxShadow: isActive ? '0 0 8px rgba(124,58,237,0.5)' : 'none',
                }}
              >
                {k}
              </div>
            );
          })}
        </div>
      ))}
      {/* Space bar */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 140, height: 22, borderRadius: 5,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
        }} />
      </div>
    </div>
  );
}

/* ─── Main CodeScene ─────────────────────────────────── */
export default function CodeScene() {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const termRef = useRef(null);
  const handsRef = useRef(null);

  // ── Parallax on mouse ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let raf;
    let tx = 0, ty = 0;
    let cx = 0, cy = 0;

    const onMove = (e) => {
      const r = container.getBoundingClientRect();
      tx = (e.clientX - r.left - r.width / 2) / r.width;
      ty = (e.clientY - r.top - r.height / 2) / r.height;
    };

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (bgRef.current)    bgRef.current.style.transform    = `translate(${cx * -8}px, ${cy * -8}px)`;
      if (termRef.current)  termRef.current.style.transform  = `translate(${cx * -18}px, ${cy * -14}px)`;
      if (handsRef.current) handsRef.current.style.transform = `translate(${cx * 10}px, ${cy * 8}px)`;
      raf = requestAnimationFrame(tick);
    };

    container.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      container.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ── Typewriter state ──
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [cursor, setCursor] = useState(true);
  const [activeKeys, setActiveKeys] = useState([]);
  const tokenIdxRef = useRef(0);
  const charIdxRef = useRef(0);
  const timeoutRef = useRef(null);
  const KEYS = 'QWERTYUIOPASDFGHJKLZXCVBNM';

  const randomKey = useCallback(() => {
    const k = KEYS[Math.floor(Math.random() * KEYS.length)];
    setActiveKeys([k]);
    setTimeout(() => setActiveKeys([]), 120);
  }, []);

  useEffect(() => {
    const snippet = SNIPPETS[snippetIdx];
    tokenIdxRef.current = 0;
    charIdxRef.current = 0;
    setTokens([]);

    const typeNext = () => {
      if (tokenIdxRef.current >= snippet.length) {
        // Snippet complete — pause then restart next
        timeoutRef.current = setTimeout(() => {
          setSnippetIdx(i => (i + 1) % SNIPPETS.length);
        }, 2200);
        return;
      }

      const tok = snippet[tokenIdxRef.current];

      if (tok.nl) {
        setTokens(prev => [...prev, { nl: true, id: Math.random() }]);
        tokenIdxRef.current++;
        charIdxRef.current = 0;
        timeoutRef.current = setTimeout(typeNext, 80);
        return;
      }

      const text = tok.text;
      if (charIdxRef.current < text.length) {
        const ch = text[charIdxRef.current];
        setTokens(prev => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && !last.nl && last.type === tok.type && last.growing) {
            next[next.length - 1] = { ...last, text: last.text + ch };
          } else {
            next.push({ text: ch, type: tok.type, growing: true, id: Math.random() });
          }
          return next;
        });
        charIdxRef.current++;
        randomKey();

        // Variable speed: faster for spaces/common chars, slower for special chars
        const delay = ch === ' ' ? 35
          : ch === '\n' ? 80
          : '(){};:'.includes(ch) ? 60 + Math.random() * 60
          : 28 + Math.random() * 55;

        timeoutRef.current = setTimeout(typeNext, delay);
      } else {
        // Seal last token (remove growing flag)
        setTokens(prev => {
          const next = [...prev];
          if (next.length) next[next.length - 1] = { ...next[next.length - 1], growing: false };
          return next;
        });
        tokenIdxRef.current++;
        charIdxRef.current = 0;
        // Brief pause between tokens
        timeoutRef.current = setTimeout(typeNext, 10);
      }
    };

    timeoutRef.current = setTimeout(typeNext, 400);
    return () => clearTimeout(timeoutRef.current);
  }, [snippetIdx, randomKey]);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursor(c => !c), 530);
    return () => clearInterval(id);
  }, []);

  // Build display lines from tokens
  const lines = [[]];
  tokens.forEach(tok => {
    if (tok.nl) lines.push([]);
    else lines[lines.length - 1].push(tok);
  });
  // Keep last 14 lines visible
  const visibleLines = lines.slice(-14);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%', height: '100%', position: 'relative',
        overflow: 'hidden', borderRadius: 24,
        background: 'linear-gradient(135deg, #07091a 0%, #0d0f24 100%)',
        border: '1px solid rgba(124,58,237,0.15)',
      }}
    >
      {/* ── Background ambient orbs ── */}
      <div ref={bgRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '15%', left: '20%',
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '15%',
          width: 160, height: 160, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
        }} />
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* ── Terminal window ── */}
      <div
        ref={termRef}
        style={{
          position: 'absolute', top: '6%', left: '5%', right: '5%',
          background: 'rgba(5, 5, 18, 0.85)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 14,
          backdropFilter: 'blur(12px)',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.08)',
        }}
      >
        {/* Title bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          <span style={{
            marginLeft: 8, fontSize: '0.7rem', color: '#4b5563',
            fontFamily: 'monospace', letterSpacing: '0.05em',
          }}>
            morobleh.dev — editor
          </span>
        </div>

        {/* Code content */}
        <div style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '0.7rem', lineHeight: 1.75, minHeight: 260 }}>
          {visibleLines.map((line, li) => (
            <div key={li} style={{ display: 'flex' }}>
              {/* Line number */}
              <span style={{
                color: '#2d3748', minWidth: 28, textAlign: 'right',
                marginRight: 16, userSelect: 'none', fontSize: '0.65rem',
              }}>
                {lines.length - visibleLines.length + li + 1}
              </span>
              {/* Tokens */}
              <span>
                {line.map((tok, ti) => (
                  <TokenSpan key={ti} token={tok} />
                ))}
                {/* Cursor on last line */}
                {li === visibleLines.length - 1 && (
                  <span style={{
                    display: 'inline-block', width: 8, height: '1em',
                    background: cursor ? '#9d5cf6' : 'transparent',
                    verticalAlign: 'middle', marginLeft: 1,
                    transition: 'background 0.1s',
                    borderRadius: 1,
                  }} />
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Status bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '5px 14px',
          background: 'rgba(124,58,237,0.15)',
          borderTop: '1px solid rgba(124,58,237,0.2)',
        }}>
          <span style={{ fontSize: '0.58rem', color: '#9d5cf6', fontFamily: 'monospace' }}>
            ⬤ JavaScript / JSX
          </span>
          <span style={{ fontSize: '0.58rem', color: '#4b5563', fontFamily: 'monospace' }}>
            Ln {lines.length}  Col {(lines[lines.length - 1]?.reduce((a, t) => a + t.text.length, 0) || 0) + 1}
          </span>
        </div>
      </div>

      {/* ── Keyboard + Hands ── */}
      <div
        ref={handsRef}
        style={{
          position: 'absolute', bottom: '3%', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        }}
      >
        <Keyboard activeKeys={activeKeys} />

        {/* Hands */}
        <div style={{ display: 'flex', gap: 60, marginTop: -10, paddingBottom: 4 }}>
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.18, repeat: Infinity, repeatDelay: 0.45, ease: 'easeInOut' }}
          >
            <Hand side="left" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.18, repeat: Infinity, repeatDelay: 0.5, delay: 0.09, ease: 'easeInOut' }}
          >
            <Hand side="right" />
          </motion.div>
        </div>
      </div>

      {/* ── Corner accent ── */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 120, height: 120,
        background: 'radial-gradient(circle at top right, rgba(6,182,212,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
