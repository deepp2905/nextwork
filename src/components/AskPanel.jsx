import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AskMessages from './ask/AskMessages.jsx';
import AskComposer from './ask/AskComposer.jsx';
import { Sparkle } from './icons/Icons';
import { CLARIFY_QUESTIONS, formatAnswer } from './ask/clarifyQuestions.js';
import './AskPanel.css';

const SUGGESTIONS = [
  'Explain step 3 in more detail',
  "I'm stuck on AWS setup — help",
  'Quiz me on what I just read',
];

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

export default function AskPanel({ onClose, pendingQuote, onClearQuote }) {
  const [messages, setMessages] = useState([
    {
      from: 'assistant',
      node: (
        <>
          <h2 className="ask-panel__welcome type-h2">
            Welcome Deep!
            <br />
            How can I help you today?
          </h2>
          <p className="ask-panel__welcome-body">
            I&rsquo;m here to help you work through this tutorial. Ask anything,
            or pick a suggestion below.
          </p>
        </>
      ),
    },
  ]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [reachedLast, setReachedLast] = useState(false);
  const [answers, setAnswers] = useState({});
  const [customText, setCustomText] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    if (stepIndex === CLARIFY_QUESTIONS.length - 1) setReachedLast(true);
  }, [stepIndex]);

  useEffect(() => {
    if (modalOpen || thinking) return;
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length !== 1) return;
      const target = e.target;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
      const el = inputRef.current;
      if (!el) return;
      e.preventDefault();
      setDraft((d) => d + e.key);
      el.focus();
      requestAnimationFrame(() => {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      });
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [modalOpen, thinking]);

  const aiDelay = () => 2000 + Math.random() * 3000;

  const send = (text) => {
    const value = text.trim();
    if (!value || thinking || modalOpen) return;
    const quoted = pendingQuote ? `> ${pendingQuote}\n\n${value}` : value;
    setMessages((prev) => [...prev, { from: 'user', text: quoted }]);
    setDraft('');
    onClearQuote?.();
    setAnswers({});
    setCustomText({});
    setStepIndex(0);
    setReachedLast(false);
    setThinking(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: 'assistant',
          text: 'For more context, please answer the following questions:',
        },
      ]);
      setThinking(false);
      setModalOpen(true);
    }, aiDelay());
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
    const userText = CLARIFY_QUESTIONS.map(
      (q) => `Q: ${q.prompt}\nA: ${formatAnswer(q, answers[q.id], customText[q.id])}`,
    ).join('\n\n');
    setMessages((prev) => [...prev, { from: 'user', text: userText }]);
    setModalOpen(false);
    setThinking(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: 'assistant',
          text: `Thanks for the context — that helps me tailor this. Based on what you've shared, here's where I'd start:\n\n${LOREM}`,
        },
      ]);
      setThinking(false);
    }, aiDelay());
  };

  const hasUserMessage = messages.some((m) => m.from === 'user');

  return (
    <aside className="ask-panel" aria-label="Ask">
      <header className="ask-panel__header">
        <span className="ask-panel__title type-subheading">
          <Sparkle />
          Ask
        </span>
        <button
          type="button"
          className="ask-panel__close type-small-body-14"
          onClick={onClose}
          aria-label="Close Ask panel"
        >
          ✕
        </button>
      </header>

      <AskMessages
        messages={messages}
        thinking={thinking}
        centered={!hasUserMessage && !thinking && !modalOpen}
      />

      {!hasUserMessage && !modalOpen && (
        <div className="ask-panel__suggestions">
          {SUGGESTIONS.map((s) => (
            <motion.button
              key={s}
              type="button"
              whileTap={{ scale: 0.95 }}
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
        pendingQuote={pendingQuote}
        onClearQuote={onClearQuote}
        onDraftChange={setDraft}
        onSubmitInput={onSubmitInput}
        inputDisabled={thinking || modalOpen}
        inputRef={inputRef}
        stepIndex={stepIndex}
        setStepIndex={setStepIndex}
        reachedLast={reachedLast}
        answers={answers}
        customText={customText}
        isAnswered={isAnswered}
        pickSingle={pickSingle}
        toggleMulti={toggleMulti}
        updateCustom={updateCustom}
        onSubmitModal={submitModal}
      />
    </aside>
  );
}
