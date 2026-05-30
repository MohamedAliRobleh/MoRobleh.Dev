import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';

function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const follower = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const el = cursorRef.current;
    const fl = followerRef.current;
    if (!el || !fl) return;

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      el.style.left = e.clientX + 'px';
      el.style.top = e.clientY + 'px';
    };

    const onOver = (e) => {
      if (e.target.closest('a, button, .glass-card, .filter-tab, .project-card')) {
        document.body.classList.add('cursor-hover');
      }
    };

    const onOut = (e) => {
      if (e.target.closest('a, button, .glass-card, .filter-tab, .project-card')) {
        document.body.classList.remove('cursor-hover');
      }
    };

    const animate = () => {
      follower.current.x += (mouse.current.x - follower.current.x) * 0.13;
      follower.current.y += (mouse.current.y - follower.current.y) * 0.13;
      fl.style.left = follower.current.x + 'px';
      fl.style.top = follower.current.y + 'px';
      raf.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
};

function PageWrapper({ children }) {
  return (
    <motion.div
      className="page-wrapper"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();

  return (
    <>
      <CustomCursor />
      <ScrollToTop />
      <ChatBot />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
          <Route path="/portfolio" element={<PageWrapper><Portfolio /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default App;
