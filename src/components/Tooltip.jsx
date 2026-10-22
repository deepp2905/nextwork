import { cloneElement, isValidElement, createContext, useContext, useState, useId, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

const TooltipContext = createContext(null);

export function TooltipProvider({ children }) {
  const [active, setActive] = useState(null);
  const current = useRef(null);
  const pending = useRef(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);
  const controls = useMemo(() => ({
    show(item) {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      pending.current = item.id;
      const reveal = () => {
        current.current = item;
        setActive(item);
      };
      // Only a currently visible tooltip in an explicitly marked group can
      // hand its bubble to a sibling. Standalone controls always open afresh.
      if (current.current && (current.current.id === item.id ||
        (item.group && current.current.group === item.group))) reveal();
      else {
        current.current = null;
        setActive(null);
        openTimer.current = setTimeout(reveal, 500);
      }
    },
    hide(id, immediately = false) {
      if (pending.current === id) {
        clearTimeout(openTimer.current);
        pending.current = null;
      }
      if (current.current?.id !== id) return;
      clearTimeout(closeTimer.current);
      const close = () => {
        current.current = null;
        setActive(null);
      };
      if (immediately) close();
      else closeTimer.current = setTimeout(close, 120);
    },
  }), []);

  useEffect(() => {
    const dismiss = (event) => {
      if (event.key === 'Escape') {
        clearTimeout(openTimer.current);
        clearTimeout(closeTimer.current);
        pending.current = null;
        current.current = null;
        setActive(null);
      }
    };
    window.addEventListener('keydown', dismiss);
    return () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      window.removeEventListener('keydown', dismiss);
    };
  }, []);

  const [pos, setPos] = useState({ top: 0, left: 0 });
  useLayoutEffect(() => {
    if (!active) return;
    const update = () => {
      const rect = active.element.getBoundingClientRect();
      setPos({
        left: rect.left + rect.width / 2,
        top: active.placement === 'top' ? rect.top - active.gap : rect.bottom + active.gap,
      });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [active]);

  return (
    <TooltipContext.Provider value={controls}>
      {children}
      {active && createPortal(
        <span className="tooltip__position" style={{ transform: `translate(${pos.left}px, ${pos.top}px)` }}>
          <span role="tooltip" id={active.id} className="tooltip__bubble" data-placement={active.placement}>
            {active.label}
          </span>
        </span>, document.body,
      )}
    </TooltipContext.Provider>
  );
}

export default function Tooltip({ label, children, placement = 'bottom', gap = 6, disabled = false }) {
  const controls = useContext(TooltipContext);
  const id = useId();
  const triggerRef = useRef(null);
  const engaged = useRef(false);
  const show = () => {
    if (disabled) return;
    engaged.current = true;
    const element = triggerRef.current;
    controls.show({ id, label, placement, gap, element,
      group: element.closest('[data-tooltip-group]') });
  };
  const hide = () => {
    engaged.current = false;
    controls.hide(id);
  };
  useEffect(() => {
    if (disabled) { engaged.current = false; controls.hide(id, true); }
    else if (engaged.current) show();
  }, [disabled, label, placement, gap]);
  useEffect(() => () => controls.hide(id, true), [controls, id]);

  return (
    <span ref={triggerRef} className="tooltip" onMouseEnter={show} onMouseLeave={hide}
      onFocus={show} onBlur={hide} onPointerDown={hide}>
      {typeof children === 'function' ? children({ 'aria-describedby': id })
        : isValidElement(children) ? cloneElement(children, {
          'aria-describedby': [children.props['aria-describedby'], id].filter(Boolean).join(' '),
        }) : children}
    </span>
  );
}
