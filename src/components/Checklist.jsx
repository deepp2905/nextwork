import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './Checklist.css';

export default function Checklist({ items }) {
  const [checked, setChecked] = useState(() => new Set());

  const toggle = (i) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <ul className="checklist">
      {items.map((item, i) => {
        const isChecked = checked.has(i);
        return (
          <li key={i} className="checklist__item">
            <button
              type="button"
              className="checklist__row"
              onClick={() => toggle(i)}
              aria-pressed={isChecked}
            >
              <span
                className={`checklist__box${isChecked ? ' checklist__box--checked' : ''}`}
                aria-hidden="true"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {isChecked && (
                    <motion.span
                      key="tick"
                      className="checklist__tick"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0 } }}
                      transition={{ duration: 0.1, ease: 'easeOut' }}
                    >
                      ✓
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span
                className={`checklist__label type-body${isChecked ? ' checklist__label--checked' : ''}`}
              >
                {item}
                <motion.span
                  className="checklist__strike"
                  aria-hidden="true"
                  initial={false}
                  animate={{ scaleX: isChecked ? 1 : 0 }}
                  transition={
                    isChecked
                      ? { duration: 0.1, ease: 'easeOut' }
                      : { duration: 0 }
                  }
                />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
