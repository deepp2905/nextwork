import { AnimatePresence, motion } from 'framer-motion';
import { CLARIFY_QUESTIONS } from './clarifyQuestions';
import AskModalOption from './AskModalOption.jsx';

export default function AskModal({
  stepIndex,
  setStepIndex,
  answers,
  customText,
  isAnswered,
  allAnswered,
  pickSingle,
  toggleMulti,
  updateCustom,
  onSubmit,
}) {
  const totalSteps = CLARIFY_QUESTIONS.length;
  const currentQuestion = CLARIFY_QUESTIONS[stepIndex];
  const isLast = stepIndex === totalSteps - 1;
  const currentDone = isAnswered(currentQuestion.id);

  const goPrev = () => setStepIndex(Math.max(0, stepIndex - 1));
  const goNext = () => setStepIndex(Math.min(totalSteps - 1, stepIndex + 1));

  const isMultiSelected = (qId, option) => {
    const v = answers[qId];
    return Array.isArray(v) && v.includes(option);
  };
  const isSingleSelected = (qId, option) => answers[qId] === option;

  return (
    <motion.div
      key="modal"
      className="ask-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <div className="ask-modal__header">
        <span className="type-small-body-14 type-eyebrow ask-modal__title">
          A few quick questions
        </span>
        <div className="ask-modal__nav">
          <button
            type="button"
            className="ask-modal__arrow"
            onClick={goPrev}
            disabled={stepIndex === 0}
            aria-label="Previous question"
          >
            ‹
          </button>
          <span className="type-small-body-14 ask-modal__count">
            {stepIndex + 1}/{totalSteps}
          </span>
          <button
            type="button"
            className="ask-modal__arrow"
            onClick={goNext}
            disabled={stepIndex === totalSteps - 1}
            aria-label="Next question"
          >
            ›
          </button>
        </div>
      </div>

      <div className="ask-modal__dots" role="tablist">
        {CLARIFY_QUESTIONS.map((q, i) => (
          <button
            key={q.id}
            type="button"
            className={`ask-modal__dot${
              i === stepIndex ? ' ask-modal__dot--active' : ''
            }${isAnswered(q.id) ? ' ask-modal__dot--done' : ''}`}
            onClick={() => setStepIndex(i)}
            aria-label={`Go to question ${i + 1}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="ask-modal__body"
        >
          <p className="type-body ask-modal__prompt">{currentQuestion.prompt}</p>
          <div className="ask-modal__options">
            {currentQuestion.options.map((option) => {
              const isMulti = currentQuestion.type === 'multi';
              const selected = isMulti
                ? isMultiSelected(currentQuestion.id, option)
                : isSingleSelected(currentQuestion.id, option);
              return (
                <AskModalOption
                  key={option}
                  label={option}
                  isMulti={isMulti}
                  selected={selected}
                  onClick={() => {
                    if (isMulti) {
                      toggleMulti(currentQuestion.id, option);
                    } else {
                      pickSingle(currentQuestion.id, option);
                      if (!isLast) {
                        setTimeout(goNext, 150);
                      }
                    }
                  }}
                />
              );
            })}
            <input
              type="text"
              className="ask-modal__custom type-small-body-14"
              placeholder="Something else…"
              value={customText[currentQuestion.id] || ''}
              onChange={(e) => updateCustom(currentQuestion, e.target.value)}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="ask-modal__footer">
        <button
          type="button"
          className="ask-modal__submit type-small-body-14"
          disabled={isLast ? !allAnswered : !currentDone}
          onClick={isLast ? onSubmit : goNext}
        >
          {isLast ? 'Submit' : 'Next'}
        </button>
      </div>
    </motion.div>
  );
}
