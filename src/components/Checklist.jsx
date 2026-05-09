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
                    <svg
                      key="tick"
                      className="checklist__tick"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    >
                      <motion.path
                        d="M2.5 6.25 5 8.75 9.5 3.75"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        exit={{ pathLength: 0, transition: { duration: 0 } }}
                        transition={{ duration: 0.12, ease: [0.65, 0, 0.35, 1] }}
                      />
                    </svg>
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
