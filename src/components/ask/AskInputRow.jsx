import { motion } from 'framer-motion';

export default function AskInputRow({ draft, onDraftChange, onSubmit, disabled }) {
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
      <input
        type="text"
        className="ask-panel__input type-body"
        placeholder="Ask anything…"
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        disabled={disabled}
      />
      <motion.button
        type="submit"
        whileTap={{ scale: 0.96 }}
        className="ask-panel__send type-small-body"
        disabled={!draft.trim() || disabled}
      >
        Send
      </motion.button>
    </motion.form>
  );
}
