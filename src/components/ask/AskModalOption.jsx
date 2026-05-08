export default function AskModalOption({ label, isMulti, selected, onClick }) {
  return (
    <button
      type="button"
      className={`ask-modal__option type-small-body-14${
        selected ? ' ask-modal__option--selected' : ''
      }`}
      onClick={onClick}
    >
      {isMulti && (
        <span
          className={`ask-modal__check${selected ? ' ask-modal__check--on' : ''}`}
          aria-hidden="true"
        >
          {selected && '✓'}
        </span>
      )}
      <span>{label}</span>
    </button>
  );
}
