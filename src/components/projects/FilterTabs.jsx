import { motion } from 'framer-motion';
import './FilterTabs.css';

/**
 * Row of pill filters in the toolbar.
 * Set `withDots` to render a status dot before each label (My Projects).
 */
export default function FilterTabs({ filters, activeId, onSelect, withDots }) {
  return (
    <div className="projects-modal__filters" role="tablist">
      {filters.map(({ id, label, count }) => {
        const isActive = activeId === id;
        return (
          <motion.button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`projects-filter type-subheading${
              isActive ? ' projects-filter--active' : ''
            }`}
            onClick={() => onSelect(id)}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 600, damping: 30 }}
          >
            {withDots && (
              <span
                className={`projects-status-dot projects-status-dot--${id}`}
              />
            )}
            <span>{label}</span>
            <span className="projects-filter__count">{count}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
