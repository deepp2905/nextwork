import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from '../icons/Icons';

const AskInputRow = forwardRef(function AskInputRow(
  { draft, onDraftChange, onSubmit, disabled },
  ref,
) {
  const textareaRef = useRef(null);
  useImperativeHandle(ref, () => textareaRef.current, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [draft]);

  const sendDisabled = !draft.trim() || disabled;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendDisabled) onSubmit(e);
    }
  };

  return (
    <motion.form
      key="input"
      className="ask-panel__input-row"
      onSubmit={onSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        className="ask-panel__input type-body"
        placeholder="Ask anything…"
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <motion.button
        type="submit"
        whileTap={sendDisabled ? undefined : { scale: 0.96 }}
        className="ask-panel__send"
        disabled={sendDisabled}
        aria-label="Send"
      >
        <ArrowUp />
      </motion.button>
    </motion.form>
  );
});

export default AskInputRow;
