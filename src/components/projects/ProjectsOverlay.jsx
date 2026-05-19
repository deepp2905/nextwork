import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Close } from '../icons/Icons';
import { VIEWS } from './data';
import ViewTabs from './ViewTabs';
import ExploreView from './ExploreView';
import MyProjectsView from './MyProjectsView';
import './ProjectsOverlay.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Modal overlay opened from the Projects menu tab. */
export default function ProjectsOverlay({ onClose }) {
  const [activeView, setActiveView] = useState('explore');
  const [direction, setDirection] = useState(1);
  const modalRef = useRef(null);
  const backdropMouseDown = useRef(false);

  // Lock background scroll while the overlay is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Move focus into the modal on open; restore it to the trigger on close.
  useEffect(() => {
    const trigger = document.activeElement;
    const firstFocusable = modalRef.current?.querySelector(FOCUSABLE);
    firstFocusable?.focus();
    return () => {
      if (trigger instanceof HTMLElement) trigger.focus();
    };
  }, []);

  // Escape to close + trap Tab within the modal.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !modalRef.current) return;
      const items = modalRef.current.querySelectorAll(FOCUSABLE);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const selectView = (id) => {
    if (id === activeView) return;
    const next = VIEWS.findIndex((v) => v.id === id);
    const current = VIEWS.findIndex((v) => v.id === activeView);
    setDirection(next > current ? 1 : -1);
    setActiveView(id);
  };

  // Close only when the press AND release both land on the backdrop,
  // so a drag that starts inside the modal can't dismiss it.
  const onBackdropMouseDown = (e) => {
    backdropMouseDown.current = e.target === e.currentTarget;
  };
  const onBackdropClick = (e) => {
    if (backdropMouseDown.current && e.target === e.currentTarget) onClose();
    backdropMouseDown.current = false;
  };

  return (
    <motion.div
      className="projects-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeOut' } }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      onMouseDown={onBackdropMouseDown}
      onClick={onBackdropClick}
    >
      <motion.div
        ref={modalRef}
        className="projects-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Projects"
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{
          opacity: 0,
          scale: 0.97,
          y: 8,
          transition: { duration: 0.08, ease: 'easeOut' },
        }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
      >
        <header className="projects-modal__header">
          <ViewTabs activeView={activeView} onSelect={selectView} />
          <motion.button
            type="button"
            className="projects-modal__close"
            onClick={onClose}
            aria-label="Close projects"
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 600, damping: 30 }}
          >
            <Close size={16} />
          </motion.button>
        </header>

        <div className="projects-modal__view">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={activeView}
              custom={direction}
              className="projects-modal__view-inner"
              variants={{
                enter: (dir) => ({ opacity: 0, x: dir * 8 }),
                center: { opacity: 1, x: 0 },
                exit: (dir) => ({ opacity: 0, x: dir * -8 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              {activeView === 'explore' ? <ExploreView /> : <MyProjectsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
