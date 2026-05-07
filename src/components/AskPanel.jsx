import { useState } from 'react';
import { motion } from 'framer-motion';
import './AskPanel.css';

const SUGGESTIONS = [
  'Explain step 3 in more detail',
  "I'm stuck on AWS setup — help",
  'Quiz me on what I just read',
];

export default function AskPanel({ onClose }) {
  const [messages, setMessages] = useState([
    {
      from: 'assistant',
      text: "Hi — I'm here to help you work through this tutorial. Ask anything, or pick a suggestion below.",
    },
  ]);
  const [draft, setDraft] = useState('');

  const send = (text) => {
    const value = text.trim();
    if (!value) return;
    setMessages((prev) => [...prev, { from: 'user', text: value }]);
    setDraft('');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send(draft);
  };

  return (
    <aside className="ask-panel" aria-label="Ask">
      <header className="ask-panel__header">
        <span className="type-subheading">Ask</span>
        <button
          type="button"
          className="ask-panel__close type-small-body-14"
          onClick={onClose}
          aria-label="Close Ask panel"
        >
          ✕
        </button>
      </header>

      <div className="ask-panel__messages">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`ask-panel__message ask-panel__message--${m.from} type-body`}
          >
            {m.text}
          </motion.div>
        ))}
      </div>

      <div className="ask-panel__suggestions">
        {SUGGESTIONS.map((s) => (
          <motion.button
            key={s}
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="ask-panel__chip type-small-body-14"
            onClick={() => send(s)}
          >
            {s}
          </motion.button>
        ))}
      </div>

      <form className="ask-panel__input-row" onSubmit={onSubmit}>
        <input
          type="text"
          className="ask-panel__input type-body"
          placeholder="Ask anything…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.96 }}
          className="ask-panel__send type-small-body"
          disabled={!draft.trim()}
        >
          Send
        </motion.button>
      </form>
    </aside>
  );
}
