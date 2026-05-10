import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AskModalOption from './AskModalOption.jsx';

export default function AskModal({
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
  onSubmit,
}) {
  const totalSteps = questions.length;
  if (totalSteps === 0) return null;
  const currentQuestion = questions[stepIndex];
  const isLast = stepIndex === totalSteps - 1;
  const showSubmit = isLast;
  const currentDone = isAnswered(currentQuestion.id);

  const [direction, setDirection] = useState(1);
  const goPrev = () => {
    setDirection(-1);
    setStepIndex(Math.max(0, stepIndex - 1));
  };
  const goNext = () => {
    setDirection(1);
    setStepIndex(Math.min(totalSteps - 1, stepIndex + 1));
  };

  const isMultiSelected = (qId, option) => {
    const v = answers[qId];
    return Array.isArray(v) && v.includes(option);
  };
  const isSingleSelected = (qId, option) => answers[qId] === option;

  return (
    <motion.div
      key="modal"
      layout
      className="ask-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut', layout: { duration: 0.25, ease: [0.32, 0.72, 0, 1] } }}
    >
      <div className="ask-modal__header">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.h2
            key={currentQuestion.id}
            custom={direction}
            className="type-h3 ask-modal__prompt"
            variants={{
              enter: (dir) => ({ opacity: 0, x: dir * 8 }),
              center: { opacity: 1, x: 0 },
              exit: (dir) => ({ opacity: 0, x: dir * -8 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {currentQuestion.prompt}
          </motion.h2>
        </AnimatePresence>
        <span className="type-small-body-14 ask-modal__count">
          {stepIndex + 1}/{totalSteps}
        </span>
      </div>

      <motion.div
        layout
        transition={{ layout: { duration: 0.3, ease: [0.32, 0.72, 0, 1] } }}
        className="ask-modal__body-wrapper"
      >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentQuestion.id}
          custom={direction}
          variants={{
            enter: (dir) => ({ opacity: 0, x: dir * 8 }),
            center: { opacity: 1, x: 0 },
            exit: (dir) => ({ opacity: 0, x: dir * -8 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="ask-modal__body"
        >
          <motion.div layout className="ask-modal__options">
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
          </motion.div>
        </motion.div>
      </AnimatePresence>
      </motion.div>

      <div className="ask-modal__footer">
        {stepIndex > 0 && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            className="ask-modal__skip type-small-body-14"
            onClick={goPrev}
          >
            Back
          </motion.button>
        )}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          className="ask-modal__submit type-small-body-14"
          onClick={showSubmit ? onSubmit : goNext}
        >
          {showSubmit ? 'Submit' : 'Next'}
        </motion.button>
      </div>
    </motion.div>
  );
}
