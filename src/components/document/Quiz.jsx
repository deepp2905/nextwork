import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Cross } from '../icons/Icons';
import './Quiz.css';

const QUESTION = {
  prompt: 'Which AWS service is best suited for hosting a static React app with a CI/CD pipeline tied to a Git repo?',
  options: [
    { id: 'a', label: 'Amazon EC2' },
    { id: 'b', label: 'AWS Amplify Hosting' },
    { id: 'c', label: 'Amazon S3 (alone, with no other services)' },
    { id: 'd', label: 'AWS Lambda' },
  ],
  correct: 'b',
  explanation:
    'Amplify Hosting connects directly to your Git repo, builds on each push, and serves the app over a CDN — no extra glue needed.',
};

export default function Quiz() {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [checking, setChecking] = useState(false);

  const isCorrect = submitted && selected === QUESTION.correct;

  const handleCheck = () => {
    if (selected == null || checking) return;
    setChecking(true);
    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      setChecking(false);
      setSubmitted(true);
    }, delay);
  };

  return (
    <section className="quiz">
      <span className="quiz__eyebrow type-subheading type-eyebrow">Knowledge check</span>
      <h3 className="quiz__prompt type-h2">{QUESTION.prompt}</h3>

      <ul className="quiz__options" role="radiogroup" aria-label={QUESTION.prompt}>
        {QUESTION.options.map((opt) => {
          const chosen = selected === opt.id;
          const correct = submitted && opt.id === QUESTION.correct;
          const wrong = submitted && chosen && opt.id !== QUESTION.correct;
          return (
            <li key={opt.id}>
              <button
                type="button"
                role="radio"
                aria-checked={chosen}
                className={[
                  'quiz__option',
                  'type-body',
                  chosen && 'quiz__option--chosen',
                  correct && 'quiz__option--correct',
                  wrong && 'quiz__option--wrong',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => !submitted && !checking && setSelected(opt.id)}
                disabled={submitted || checking}
              >
                <span className="quiz__option-radio" aria-hidden="true" />
                <span className="quiz__option-label">{opt.label}</span>
                {correct && (
                  <span className="quiz__option-badge quiz__option-badge--correct" aria-hidden="true">
                    <Check />
                  </span>
                )}
                {wrong && (
                  <span className="quiz__option-badge quiz__option-badge--wrong" aria-hidden="true">
                    <Cross />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <motion.div
        className={[
          'quiz__feedback',
          submitted && (isCorrect ? 'quiz__feedback--correct' : 'quiz__feedback--wrong'),
        ]
          .filter(Boolean)
          .join(' ')}
        data-revealed={submitted ? 'true' : 'false'}
        initial={false}
      >
        <p className="quiz__feedback-text type-body" aria-hidden={!submitted}>
          <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong>{' '}
          {QUESTION.explanation}
        </p>
        <motion.button
          type="button"
          whileTap={
            submitted || (selected != null && !checking)
              ? { scale: 0.95 }
              : undefined
          }
          className={`quiz__submit type-small-body${submitted ? ' quiz__submit--outline' : ''}`}
          onClick={
            submitted
              ? () => {
                  setSelected(null);
                  setSubmitted(false);
                }
              : handleCheck
          }
          disabled={!submitted && (selected == null || checking)}
        >
          {checking ? (
            <span className="quiz__spinner" aria-label="Checking answer" />
          ) : submitted ? (
            'Try again'
          ) : (
            'Check answer'
          )}
        </motion.button>
      </motion.div>
    </section>
  );
}
