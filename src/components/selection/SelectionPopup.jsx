import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkle, Highlight } from '../icons/Icons';
import './SelectionPopup.css';

const HIGHLIGHTS_KEY = 'nextwork.highlights.v1';
const HIGHLIGHT_CLASS = 'doc__highlight';

const loadHighlights = () => {
  try {
    const raw = localStorage.getItem(HIGHLIGHTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveHighlights = (list) => {
  try {
    localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(list));
  } catch {
    // ignore quota / privacy mode failures
  }
};

const getArticleText = (article) => article.textContent || '';

const findOffset = (article, range) => {
  let offset = 0;
  const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node === range.startContainer) return offset + range.startOffset;
    offset += node.textContent.length;
  }
  return -1;
};

const wrapRange = (article, start, length) => {
  if (start < 0 || length <= 0) return false;
  const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
  let consumed = 0;
  let startNode = null;
  let startNodeOffset = 0;
  let endNode = null;
  let endNodeOffset = 0;
  const end = start + length;
  let node;
  while ((node = walker.nextNode())) {
    const len = node.textContent.length;
    if (!startNode && consumed + len > start) {
      startNode = node;
      startNodeOffset = start - consumed;
    }
    if (consumed + len >= end) {
      endNode = node;
      endNodeOffset = end - consumed;
      break;
    }
    consumed += len;
  }
  if (!startNode || !endNode) return false;
  try {
    const range = document.createRange();
    range.setStart(startNode, startNodeOffset);
    range.setEnd(endNode, endNodeOffset);
    if (startNode === endNode) {
      const mark = document.createElement('mark');
      mark.className = HIGHLIGHT_CLASS;
      range.surroundContents(mark);
    } else {
      const fragment = range.extractContents();
      const mark = document.createElement('mark');
      mark.className = HIGHLIGHT_CLASS;
      mark.appendChild(fragment);
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
    const stored = loadHighlights();
    stored.forEach((h) => wrapRange(article, h.start, h.length));
  }, [articleSelector]);

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
        start: findOffset(article, range),
        length: text.length,
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
    if (!popup) return;
    const article = document.querySelector(articleSelector);
    if (!article) return;
    const ok = wrapRange(article, popup.start, popup.length);
    if (ok) {
      const next = [...loadHighlights(), { start: popup.start, length: popup.length, text: popup.text }];
      saveHighlights(next);
    }
    setPopup(null);
    window.getSelection()?.removeAllRanges();
  };

  return (
    <AnimatePresence>
      {popup && (
        <motion.div
          className="selection-popup"
          style={{ top: popup.top, left: popup.left }}
          initial={{ opacity: 0, y: 4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.96, transition: { duration: 0.1 } }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <button
            type="button"
            className="selection-popup__btn type-small-body-14"
            onClick={handleAsk}
            onMouseEnter={() => setHovered('ask')}
            onMouseLeave={() => setHovered(null)}
          >
            <Sparkle />
            Ask
          </button>
          <span
            className={`selection-popup__divider${hovered ? ' selection-popup__divider--hidden' : ''}`}
            aria-hidden="true"
          />
          <button
            type="button"
            className="selection-popup__btn type-small-body-14"
            onClick={handleHighlight}
            onMouseEnter={() => setHovered('highlight')}
            onMouseLeave={() => setHovered(null)}
          >
            <Highlight />
            Highlight
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
