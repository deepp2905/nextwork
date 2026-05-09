import { AnimatePresence, motion } from 'framer-motion';
import AskInputRow from './AskInputRow.jsx';
import AskModal from './AskModal.jsx';

export default function AskComposer({
  modalOpen,
  draft,
  onDraftChange,
  onSubmitInput,
  inputDisabled,
  inputRef,
  pendingQuote,
  onClearQuote,
  stepIndex,
  setStepIndex,
  reachedLast,
  questions,
  answers,
  customText,
  isAnswered,
  pickSingle,
  toggleMulti,
  updateCustom,
  onSubmitModal,
}) {
  const showQuote = !modalOpen && !!pendingQuote;
  return (
    <div className={`ask-panel__composer${showQuote ? ' ask-panel__composer--with-quote' : ''}`}>
      <AnimatePresence initial={false}>
        {showQuote && (
          <motion.div
            key="quote"
            className="ask-panel__quote"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div className="ask-panel__quote-inner">
              <span className="ask-panel__quote-text type-small-body-14">{pendingQuote}</span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                className="ask-panel__quote-close"
                onClick={onClearQuote}
                aria-label="Remove quoted text"
              >
                ✕
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        {modalOpen ? (
          <AskModal
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            reachedLast={reachedLast}
            questions={questions}
            answers={answers}
            customText={customText}
            isAnswered={isAnswered}
            pickSingle={pickSingle}
            toggleMulti={toggleMulti}
            updateCustom={updateCustom}
            onSubmit={onSubmitModal}
          />
        ) : (
          <AskInputRow
            ref={inputRef}
            draft={draft}
            onDraftChange={onDraftChange}
            onSubmit={onSubmitInput}
            disabled={inputDisabled}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
