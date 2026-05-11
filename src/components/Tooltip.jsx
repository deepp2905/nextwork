import { useState, useId, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

export default function Tooltip({
  label,
  children,
  placement = 'bottom',
  gap = 6,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const id = useId();
  const triggerRef = useRef(null);

  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  useLayoutEffect(() => {
    if (!open) return;
    const el = triggerRef.current;
    if (!el) return;
    const updatePosition = () => {
      const rect = el.getBoundingClientRect();
      const left = rect.left + rect.width / 2;
      const top = placement === 'top' ? rect.top - gap : rect.bottom + gap;
      setPos({ top, left });
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, placement, gap]);

  const isOpen = open && !disabled;

  return (
    <>
      <span
        ref={triggerRef}
        className="tooltip"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {typeof children === 'function'
          ? children({ 'aria-describedby': id })
          : children}
      </span>
      {createPortal(
        <span
          role="tooltip"
          id={id}
          className="tooltip__bubble"
          data-placement={placement}
          data-open={isOpen ? 'true' : 'false'}
          style={{ top: pos.top, left: pos.left }}
        >
          {label}
        </span>,
        document.body,
      )}
    </>
  );
}
