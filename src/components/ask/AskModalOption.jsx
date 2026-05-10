import { AnimatePresence, motion } from 'framer-motion';

export default function AskModalOption({ label, isMulti, selected, onClick }) {
  return (
    <motion.button
      type="button"
      layout
      transition={{ layout: { duration: 0.4, ease: [0.32, 0.72, 0, 1] } }}
      className={`ask-modal__option type-small-body-14${
        selected ? ' ask-modal__option--selected' : ''
      }`}
      onClick={onClick}
    >
      {isMulti && (
        <span
          className={`ask-modal__check${selected ? ' ask-modal__check--on' : ''}`}
          aria-hidden="true"
        >
          <AnimatePresence initial={false}>
            {selected && (
              <svg
                key="tick"
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
      )}
      <span>{label}</span>
    </motion.button>
  );
}
