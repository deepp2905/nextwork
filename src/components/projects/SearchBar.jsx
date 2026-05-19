import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkle, Cross } from '../icons/Icons';
import './SearchBar.css';

/**
 * Search field used by both Projects views.
 * - `variant="plain"` renders the muted My Projects search (no Generate button).
 * - `onGenerate` adds the Explore Generate button.
 * Clicking anywhere on the bar focuses the input.
 */
export default function SearchBar({
  value,
  onChange,
  placeholder,
  variant = 'default',
  inputClassName = 'type-body',
  iconSize = 20,
  onGenerate,
}) {
  const inputRef = useRef(null);

  const focusInput = (e) => {
    if (e.target.closest('button, input')) return;
    e.preventDefault();
    inputRef.current?.focus();
  };

  const className =
    variant === 'plain'
      ? 'projects-search projects-search--plain'
      : 'projects-search';

  const clear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={className} onMouseDown={focusInput}>
      <Search size={iconSize} className="projects-search__icon" />
      <input
        ref={inputRef}
        type="text"
        className={`projects-search__input ${inputClassName}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <motion.button
          type="button"
          className="projects-search__clear"
          aria-label="Clear search"
          onClick={clear}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
        >
          <Cross size={12} />
        </motion.button>
      )}
      {onGenerate && (
        <motion.button
          type="button"
          className="projects-search__generate type-subheading"
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
          onClick={onGenerate}
        >
          <Sparkle size={14} />
          Generate
        </motion.button>
      )}
    </div>
  );
}
