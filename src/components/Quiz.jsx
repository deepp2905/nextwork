import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Cross } from './icons/Icons';
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

  const isCorrect = submitted && selected === QUESTION.correct;

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
              <motion.button
                type="button"
                whileTap={submitted ? undefined : { scale: 0.98 }}
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
                onClick={() => !submitted && setSelected(opt.id)}
                disabled={submitted}
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
              </motion.button>
            </li>
          );
        })}
      </ul>

      {!submitted ? (
        <motion.button
          type="button"
          whileTap={selected == null ? undefined : { scale: 0.95 }}
          className="quiz__submit type-small-body"
          onClick={() => setSubmitted(true)}
          disabled={selected == null}
        >
          Check answer
        </motion.button>
      ) : (
        <div
          className={`quiz__feedback ${
            isCorrect ? 'quiz__feedback--correct' : 'quiz__feedback--wrong'
          }`}
        >
          <p className="quiz__feedback-text type-body">
            <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong>{' '}
            {QUESTION.explanation}
          </p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            className="quiz__retry type-small-body-14"
            onClick={() => {
              setSelected(null);
              setSubmitted(false);
            }}
          >
            Try again
          </motion.button>
        </div>
      )}
    </section>
  );
}
