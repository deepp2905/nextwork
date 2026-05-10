import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from '../icons/Icons';

export default function AskMessages({ messages, thinking, centered, leading }) {
  const ref = useRef(null);
  const [showJump, setShowJump] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const evaluate = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowJump(distance > 16);
    };
    evaluate();
    el.addEventListener('scroll', evaluate);
    const ro = new ResizeObserver(evaluate);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', evaluate);
      ro.disconnect();
    };
  }, [messages, thinking]);

  const jumpToBottom = () => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="ask-panel__messages-shell">
      <div
        className={`ask-panel__messages${centered ? ' ask-panel__messages--centered' : ''}`}
        ref={ref}
      >
        {leading}
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
      <AnimatePresence>
        {showJump && (
          <motion.button
            key="jump"
            type="button"
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="ask-panel__jump"
            onClick={jumpToBottom}
            aria-label="Jump to latest"
          >
            <ChevronDown />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
