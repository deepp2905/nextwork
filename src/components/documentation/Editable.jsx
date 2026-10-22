import { useRef, useState } from 'react';
import Tooltip from '../Tooltip';

const sessionStore = new Map();

export default function Editable({
  as: Tag = 'span',
  value,
  storeKey,
  className = '',
  ...rest
}) {
  const initial = storeKey && sessionStore.has(storeKey)
    ? sessionStore.get(storeKey)
    : value;
  const [text, setText] = useState(initial);
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);

  const commit = () => {
    const next = ref.current?.innerText ?? text;
    setText(next);
    if (storeKey) sessionStore.set(storeKey, next);
  };

  const onFocus = () => {
    const el = ref.current;
    const { width, height } = el.getBoundingClientRect();
    el.style.width = `${width}px`;
    el.style.minHeight = `${height}px`;
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
    commit();
    ref.current.style.removeProperty('width');
    ref.current.style.removeProperty('min-height');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ref.current?.blur();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (ref.current) ref.current.innerText = text;
      ref.current?.blur();
    }
  };

  return (
    <Tooltip label="Click to edit" placement="bottom" gap={10} disabled={focused}
      className={Tag === 'span' ? 'doc-editable-shell--inline' : 'doc-editable-shell'}>
      <Tag
        ref={ref}
        className={`doc-editable ${className}`.trim()}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        {...rest}
      >
        {text}
      </Tag>
    </Tooltip>
  );
}
