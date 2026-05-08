import { AnimatePresence } from 'framer-motion';
import AskInputRow from './AskInputRow.jsx';
import AskModal from './AskModal.jsx';

export default function AskComposer({
  modalOpen,
  draft,
  onDraftChange,
  onSubmitInput,
  inputDisabled,
  stepIndex,
  setStepIndex,
  answers,
  customText,
  isAnswered,
  allAnswered,
  pickSingle,
  toggleMulti,
  updateCustom,
  onSubmitModal,
}) {
  return (
    <div className="ask-panel__composer">
      <AnimatePresence mode="wait" initial={false}>
        {modalOpen ? (
          <AskModal
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            answers={answers}
            customText={customText}
            isAnswered={isAnswered}
            allAnswered={allAnswered}
            pickSingle={pickSingle}
            toggleMulti={toggleMulti}
            updateCustom={updateCustom}
            onSubmit={onSubmitModal}
          />
        ) : (
          <AskInputRow
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
