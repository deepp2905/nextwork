import { useState, useId } from 'react';
import './Tooltip.css';

export default function Tooltip({ label, children, placement = 'bottom' }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  return (
    <span
      className="tooltip"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {typeof children === 'function'
        ? children({ 'aria-describedby': id })
        : children}
      <span
        role="tooltip"
        id={id}
        className="tooltip__bubble"
        data-placement={placement}
        data-open={open ? 'true' : 'false'}
      >
        {label}
      </span>
    </span>
  );
}
