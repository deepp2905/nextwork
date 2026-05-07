import { useState } from 'react';
import './Checklist.css';

export default function Checklist({ items }) {
  const [checked, setChecked] = useState(() => new Set());

  const toggle = (i) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <ul className="checklist">
      {items.map((item, i) => {
        const isChecked = checked.has(i);
        return (
          <li key={i} className="checklist__item">
            <button
              type="button"
              className="checklist__row"
              onClick={() => toggle(i)}
              aria-pressed={isChecked}
            >
              <span
                className={`checklist__box${isChecked ? ' checklist__box--checked' : ''}`}
                aria-hidden="true"
              >
                {isChecked && <span className="checklist__tick">✓</span>}
              </span>
              <span
                className={`checklist__label type-body${isChecked ? ' checklist__label--checked' : ''}`}
              >
                {item}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
