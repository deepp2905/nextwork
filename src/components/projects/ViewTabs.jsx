import { LayoutGroup, motion } from 'framer-motion';
import { VIEWS } from './data';
import './ViewTabs.css';

/**
 * Explore / My Projects segmented toggle.
 * The white background slides between tabs via a shared layoutId.
 * Wrapped in its own LayoutGroup so the shared-layout animation stays
 * scoped here and never entangles the overlay's exit animation.
 */
export default function ViewTabs({ activeView, onSelect }) {
  return (
    <LayoutGroup id="projects-view-tabs">
      <div className="projects-modal__views" role="tablist">
        {VIEWS.map(({ id, label }) => {
          const isActive = activeView === id;
          return (
            <motion.button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`projects-view type-subheading${
                isActive ? ' projects-view--active' : ''
              }`}
              onClick={() => onSelect(id)}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            >
              {isActive && (
                <motion.span
                  layoutId="projects-view-pill"
                  className="projects-view__pill"
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                />
              )}
              <span className="projects-view__label">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
