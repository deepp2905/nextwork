import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AskMessages({ messages, thinking, centered }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  return (
    <div
      className={`ask-panel__messages${centered ? ' ask-panel__messages--centered' : ''}`}
      ref={ref}
    >
      {messages.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`ask-panel__message ask-panel__message--${m.from} type-body`}
        >
          {m.node ?? m.text}
        </motion.div>
      ))}
      <AnimatePresence>
        {thinking && (
          <motion.div
            key="thinking"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="ask-panel__message ask-panel__message--assistant ask-panel__thinking"
            aria-label="Assistant is thinking"
          >
            <span className="ask-panel__dot" />
            <span className="ask-panel__dot" />
            <span className="ask-panel__dot" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
