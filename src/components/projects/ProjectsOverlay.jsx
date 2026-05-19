import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Close } from '../icons/Icons';
import { VIEWS } from './data';
import ViewTabs from './ViewTabs';
import ExploreView from './ExploreView';
import MyProjectsView from './MyProjectsView';
import './ProjectsOverlay.css';

/** Modal overlay opened from the Projects menu tab. */
export default function ProjectsOverlay({ onClose }) {
  const [activeView, setActiveView] = useState('explore');
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
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

  return (
    <motion.div
      className="projects-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      onMouseDown={onClose}
      role="presentation"
    >
      <motion.div
        className="projects-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Projects"
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        onMouseDown={(e) => e.stopPropagation()}
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
