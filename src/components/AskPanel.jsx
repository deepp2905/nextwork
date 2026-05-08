import { useState } from 'react';
import { motion } from 'framer-motion';
import AskMessages from './ask/AskMessages.jsx';
import AskComposer from './ask/AskComposer.jsx';
import { CLARIFY_QUESTIONS, formatAnswer } from './ask/clarifyQuestions.js';
import './AskPanel.css';

const SUGGESTIONS = [
  'Explain step 3 in more detail',
  "I'm stuck on AWS setup — help",
  'Quiz me on what I just read',
];

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

export default function AskPanel({ onClose }) {
  const [messages, setMessages] = useState([
    {
      from: 'assistant',
      text: "Hi — I'm here to help you work through this tutorial. Ask anything, or pick a suggestion below.",
    },
  ]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [customText, setCustomText] = useState({});

  const startModal = (text) => {
    setMessages((prev) => [...prev, { from: 'user', text }]);
    setDraft('');
    setAnswers({});
    setCustomText({});
    setStepIndex(0);
    setModalOpen(true);
  };

  const send = (text) => {
    const value = text.trim();
    if (!value || thinking || modalOpen) return;
    startModal(value);
  };

  const onSubmitInput = (e) => {
    e.preventDefault();
    send(draft);
  };

  const isAnswered = (qId) => {
    const v = answers[qId];
    const c = customText[qId];
    if (c && c.trim()) return true;
    if (Array.isArray(v)) return v.length > 0;
    return typeof v === 'string' && v.trim().length > 0;
  };

  const allAnswered = CLARIFY_QUESTIONS.every((q) => isAnswered(q.id));

  const pickSingle = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
    setCustomText((prev) => ({ ...prev, [qId]: '' }));
  };

  const toggleMulti = (qId, option) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[qId]) ? prev[qId] : [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [qId]: next };
    });
  };

  const updateCustom = (q, value) => {
    setCustomText((prev) => ({ ...prev, [q.id]: value }));
    if (q.type === 'single' && value.trim()) {
      setAnswers((prev) => ({ ...prev, [q.id]: '' }));
    }
  };

  const submitModal = () => {
    if (!allAnswered) return;
    const summary = CLARIFY_QUESTIONS.map(
      (q) => `• ${q.prompt} ${formatAnswer(q, answers[q.id], customText[q.id])}`,
    ).join('\n');
    setModalOpen(false);
    setThinking(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: 'assistant',
          text: `Got it — here's what I'm working with:\n${summary}\n\n${LOREM}`,
        },
      ]);
      setThinking(false);
    }, 1400);
  };

  const hasUserMessage = messages.some((m) => m.from === 'user');

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

      <AskMessages messages={messages} thinking={thinking} />

      {!hasUserMessage && !modalOpen && (
        <div className="ask-panel__suggestions">
          {SUGGESTIONS.map((s) => (
            <motion.button
              key={s}
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="ask-panel__chip type-small-body-14"
              onClick={() => send(s)}
              disabled={thinking || modalOpen}
            >
              {s}
            </motion.button>
          ))}
        </div>
      )}

      <AskComposer
        modalOpen={modalOpen}
        draft={draft}
        onDraftChange={setDraft}
        onSubmitInput={onSubmitInput}
        inputDisabled={thinking || modalOpen}
        stepIndex={stepIndex}
        setStepIndex={setStepIndex}
        answers={answers}
        customText={customText}
        isAnswered={isAnswered}
        allAnswered={allAnswered}
        pickSingle={pickSingle}
        toggleMulti={toggleMulti}
        updateCustom={updateCustom}
        onSubmitModal={submitModal}
      />
    </aside>
  );
}
