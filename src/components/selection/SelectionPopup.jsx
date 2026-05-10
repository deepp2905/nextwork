import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkle, Highlight } from '../icons/Icons';
import './SelectionPopup.css';

const HIGHLIGHT_CLASS = 'doc__highlight';

const wrapRange = (range) => {
  try {
    const mark = document.createElement('mark');
    mark.className = HIGHLIGHT_CLASS;
    if (range.startContainer === range.endContainer) {
      range.surroundContents(mark);
    } else {
      mark.appendChild(range.extractContents());
      range.insertNode(mark);
    }
    return true;
  } catch {
    return false;
  }
};

export default function SelectionPopup({ articleSelector, onAsk }) {
  const [popup, setPopup] = useState(null);
  const [hovered, setHovered] = useState(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const article = document.querySelector(articleSelector);
    if (!article) return;

    const evaluateSelection = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setPopup(null);
        return;
      }
      const range = sel.getRangeAt(0);
      if (!article.contains(range.commonAncestorContainer)) {
        setPopup(null);
        return;
      }
      const text = sel.toString();
      if (!text.trim()) {
        setPopup(null);
        return;
      }
      const rects = range.getClientRects();
      const firstRect = rects[0];
      const fullRect = range.getBoundingClientRect();
      if (!firstRect || (fullRect.width === 0 && fullRect.height === 0)) {
        setPopup(null);
        return;
      }
      setPopup({
        text,
        top: firstRect.top + window.scrollY,
        left: fullRect.left + fullRect.width / 2 + window.scrollX,
      });
    };

    const onMouseDown = (e) => {
      if (e.target.closest('.selection-popup')) return;
      isDraggingRef.current = true;
      setPopup(null);
    };
    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      // selectionchange has already fired; evaluate once on release
      evaluateSelection();
    };
    const onSelectionChange = () => {
      // While dragging, suppress popup updates until mouseup.
      if (isDraggingRef.current) return;
      evaluateSelection();
    };

    const onScroll = () => {
      if (!isDraggingRef.current) evaluateSelection();
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('selectionchange', onSelectionChange);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('selectionchange', onSelectionChange);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [articleSelector]);

  const handleAsk = () => {
    if (!popup) return;
    onAsk(popup.text);
    // Keep selection and popup mounted per spec.
  };

  const handleHighlight = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    wrapRange(sel.getRangeAt(0));
    setPopup(null);
    sel.removeAllRanges();
  };

  return (
    <AnimatePresence>
      {popup && (
        <motion.div
          className="selection-popup"
          style={{ top: popup.top, left: popup.left }}
          initial={{ opacity: 0, y: -120, scale: 0.96 }}
          animate={{ opacity: 1, y: -60, scale: 1 }}
          exit={{ opacity: 0, y: -120, scale: 0.96, transition: { duration: 0.08, ease: 'easeIn'  } }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            className="selection-popup__btn type-small-body-14"
            onClick={handleAsk}
            onMouseEnter={() => setHovered('ask')}
            onMouseLeave={() => setHovered(null)}
          >
            <Sparkle />
            Ask
          </motion.button>
          <span
            className={`selection-popup__divider${hovered ? ' selection-popup__divider--hidden' : ''}`}
            aria-hidden="true"
          />
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            className="selection-popup__btn type-small-body-14"
            onClick={handleHighlight}
            onMouseEnter={() => setHovered('highlight')}
            onMouseLeave={() => setHovered(null)}
          >
            <Highlight />
            Highlight
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
