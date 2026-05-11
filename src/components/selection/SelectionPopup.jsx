import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkle, Highlight, Close } from '../icons/Icons';
import './SelectionPopup.css';

const HIGHLIGHT_CLASS = 'doc__highlight';

const firstTextNode = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  return walker.nextNode();
};

const lastTextNode = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let last = null;
  let n;
  while ((n = walker.nextNode())) last = n;
  return last;
};

const trimRangeWhitespace = (range) => {
  // If start is at element boundary, descend to first text node.
  if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
    const first = firstTextNode(range.startContainer);
    if (first) range.setStart(first, 0);
  }
  if (range.endContainer.nodeType === Node.ELEMENT_NODE) {
    const last = lastTextNode(range.endContainer);
    if (last) range.setEnd(last, last.nodeValue.length);
  }
  // Trim leading whitespace
  while (
    range.startContainer.nodeType === Node.TEXT_NODE &&
    range.startOffset < range.startContainer.nodeValue.length &&
    /\s/.test(range.startContainer.nodeValue[range.startOffset])
  ) {
    range.setStart(range.startContainer, range.startOffset + 1);
  }
  // Trim trailing whitespace
  while (
    range.endContainer.nodeType === Node.TEXT_NODE &&
    range.endOffset > 0 &&
    /\s/.test(range.endContainer.nodeValue[range.endOffset - 1])
  ) {
    range.setEnd(range.endContainer, range.endOffset - 1);
  }
};

const wrapBlockSegment = (range, groupId) => {
  try {
    if (
      range.startContainer === range.endContainer &&
      range.startContainer.nodeType === Node.TEXT_NODE
    ) {
      const mark = document.createElement('mark');
      mark.className = HIGHLIGHT_CLASS;
      mark.dataset.highlightGroup = groupId;
      range.surroundContents(mark);
      return;
    }
    const fragment = range.extractContents();
    if (!fragment.textContent || !fragment.textContent.trim()) return;
    const mark = document.createElement('mark');
    mark.className = HIGHLIGHT_CLASS;
    mark.dataset.highlightGroup = groupId;
    mark.appendChild(fragment);
    range.insertNode(mark);
  } catch {
    /* noop */
  }
};

let highlightGroupCounter = 0;

const wrapRange = (range) => {
  trimRangeWhitespace(range);
  if (range.collapsed) return false;

  // Find all block-level "highlightable" elements the range intersects.
  // We highlight per-block to keep each <mark> within a single paragraph/heading,
  // which avoids cross-block padding gaps and structural weirdness.
  const root = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
    ? range.commonAncestorContainer
    : range.commonAncestorContainer.parentElement;
  if (!root) return false;

  const blocks = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (el) =>
      el.matches?.('[data-highlightable]') && range.intersectsNode(el)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP,
  });
  let b;
  while ((b = walker.nextNode())) blocks.push(b);

  // If no whitelisted block intersects, nothing to highlight.
  if (blocks.length === 0) {
    // Fallback: range is entirely inside one whitelisted block (commonAncestor itself).
    const ancestorBlock = root.closest?.('[data-highlightable]');
    if (ancestorBlock) blocks.push(ancestorBlock);
    else return false;
  }

  const groupId = String(++highlightGroupCounter);

  // For each block, build a sub-range clipped to the block, then wrap.
  // comparePoint returns: -1 if point is before range, 0 if inside, 1 if after.
  blocks.forEach((block) => {
    const subRange = document.createRange();
    const blockEndOffset = block.childNodes.length;
    // Sub-start: the later of (range start) and (block start).
    if (range.comparePoint(block, 0) === -1) {
      subRange.setStart(range.startContainer, range.startOffset);
    } else {
      subRange.setStart(block, 0);
    }
    // Sub-end: the earlier of (range end) and (block end).
    if (range.comparePoint(block, blockEndOffset) === 1) {
      subRange.setEnd(range.endContainer, range.endOffset);
    } else {
      subRange.setEnd(block, blockEndOffset);
    }
    trimRangeWhitespace(subRange);
    if (!subRange.collapsed) wrapBlockSegment(subRange, groupId);
  });
  return true;
};

const unwrapMark = (mark) => {
  const parent = mark.parentNode;
  if (!parent) return;
  while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
  parent.removeChild(mark);
  parent.normalize();
};

const unwrapHighlightGroup = (mark) => {
  const groupId = mark.dataset?.highlightGroup;
  if (!groupId) {
    unwrapMark(mark);
    return;
  }
  const all = document.querySelectorAll(
    `.${HIGHLIGHT_CLASS}[data-highlight-group="${groupId}"]`,
  );
  all.forEach(unwrapMark);
};

// Returns the cumulative text-character offset of a node within `root`,
// counting only text inside `root`. Used to convert element-based positions
// to character offsets that survive DOM mutations like normalize().
const textOffsetOf = (root, targetNode, targetOffset) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let total = 0;
  let n;
  while ((n = walker.nextNode())) {
    if (n === targetNode) return total + targetOffset;
    total += n.nodeValue.length;
  }
  return total;
};

// Inverse of textOffsetOf: convert a character offset within `root` back
// into a (textNode, offset) pair after the DOM may have been mutated.
const rangePointAtOffset = (root, charOffset) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let remaining = charOffset;
  let n;
  while ((n = walker.nextNode())) {
    const len = n.nodeValue.length;
    if (remaining <= len) return { node: n, offset: remaining };
    remaining -= len;
  }
  return null;
};

export default function SelectionPopup({ articleSelector, onAsk }) {
  const [popup, setPopup] = useState(null);
  const [hovered, setHovered] = useState(null);
  const isDraggingRef = useRef(false);
  const lockedRef = useRef(false);
  const popupRef = useRef(null);
  const hoverTargetRef = useRef(null);
  const hideTimerRef = useRef(null);
  const popupElRef = useRef(null);
  const triangleRef = useRef(null);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const article = document.querySelector(articleSelector);
    if (!article) return;

    const evaluateSelection = () => {
      if (lockedRef.current) return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        if (popupRef.current?.mode !== 'highlight') setPopup(null);
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
        mode: 'selection',
        text,
        top: firstRect.top + window.scrollY,
        left: fullRect.left + fullRect.width / 2 + window.scrollX,
      });
    };

    const onMouseDown = (e) => {
      if (e.target.closest('.selection-popup')) return;
      if (e.target.closest(`.${HIGHLIGHT_CLASS}`)) return;
      lockedRef.current = false;
      isDraggingRef.current = true;
      setPopup(null);
    };
    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      evaluateSelection();
    };
    const onSelectionChange = () => {
      if (isDraggingRef.current) return;
      evaluateSelection();
    };
    const onScroll = () => {
      if (!isDraggingRef.current) evaluateSelection();
    };

    const clearHideTimer = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    // Build a triangle from the cursor's current position to the popup's
    // top-left and top-right corners. While the cursor is inside this triangle
    // we treat the user as "in transit" toward the popup and suppress hide /
    // suppress reposition to other highlights. Triangle expires on a timer so
    // a stationary cursor doesn't trap the popup forever.
    const buildTriangle = () => {
      const popEl = popupElRef.current;
      if (!popEl) {
        triangleRef.current = null;
        return;
      }
      const rect = popEl.getBoundingClientRect();
      triangleRef.current = {
        cursor: { x: lastMouseRef.current.x, y: lastMouseRef.current.y },
        topLeft: { x: rect.left, y: rect.bottom },
        topRight: { x: rect.right, y: rect.bottom },
        expiresAt: performance.now() + 400,
      };
    };

    const pointInTriangle = (p, a, b, c) => {
      const sign = (p1, p2, p3) =>
        (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
      const d1 = sign(p, a, b);
      const d2 = sign(p, b, c);
      const d3 = sign(p, c, a);
      const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
      const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
      return !(hasNeg && hasPos);
    };

    const inHoverTriangle = (x, y) => {
      const t = triangleRef.current;
      if (!t) return false;
      if (performance.now() > t.expiresAt) {
        triangleRef.current = null;
        return false;
      }
      return pointInTriangle({ x, y }, t.cursor, t.topLeft, t.topRight);
    };

    const showHighlightPopup = (mark) => {
      clearHideTimer();
      hoverTargetRef.current = mark;
      const groupId = mark.dataset?.highlightGroup;
      const groupMarks = groupId
        ? Array.from(
            document.querySelectorAll(
              `.${HIGHLIGHT_CLASS}[data-highlight-group="${groupId}"]`,
            ),
          )
        : [mark];
      const text = groupMarks.map((m) => m.textContent || '').join(' ');
      // Position above the first mark in document order, centered horizontally on it.
      const firstMark = groupMarks[0];
      const rect = firstMark.getBoundingClientRect();
      setPopup({
        mode: 'highlight',
        text,
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
      requestAnimationFrame(buildTriangle);
    };

    const scheduleHide = () => {
      clearHideTimer();
      hideTimerRef.current = setTimeout(() => {
        if (popupRef.current?.mode === 'highlight') {
          hoverTargetRef.current = null;
          setPopup(null);
        }
      }, 120);
    };

    const onMouseOver = (e) => {
      const mark = e.target.closest(`.${HIGHLIGHT_CLASS}`);
      if (mark && article.contains(mark)) {
        const currentGroup = hoverTargetRef.current?.dataset?.highlightGroup;
        const newGroup = mark.dataset?.highlightGroup;
        // Same group: just keep popup up, don't reposition.
        if (currentGroup && newGroup && currentGroup === newGroup) {
          clearHideTimer();
          return;
        }
        // If the cursor is mid-traverse toward the existing popup, don't
        // swap the popup to the new highlight underneath the cursor.
        if (
          popupRef.current?.mode === 'highlight' &&
          inHoverTriangle(lastMouseRef.current.x, lastMouseRef.current.y)
        ) {
          clearHideTimer();
          return;
        }
        showHighlightPopup(mark);
        return;
      }
      const inPopup = e.target.closest('.selection-popup');
      if (inPopup) {
        clearHideTimer();
        triangleRef.current = null;
        return;
      }
      // Cursor is over neither a highlight nor the popup. If it's still inside
      // the hover triangle, treat it as transit and don't hide.
      if (
        popupRef.current?.mode === 'highlight' &&
        inHoverTriangle(lastMouseRef.current.x, lastMouseRef.current.y)
      ) {
        clearHideTimer();
        return;
      }
      if (popupRef.current?.mode === 'highlight') scheduleHide();
    };

    const onMouseMove = (e) => {
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('selectionchange', onSelectionChange);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('selectionchange', onSelectionChange);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll, true);
      clearHideTimer();
    };
  }, [articleSelector]);

  // keep ref in sync so listeners can read latest popup state
  popupRef.current = popup;

  const handleAsk = () => {
    if (!popup) return;
    lockedRef.current = true;
    onAsk(popup.text);
  };

  const handleHighlight = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const text = sel.toString();
    const fullRect = range.getBoundingClientRect();
    const firstRect = range.getClientRects()[0];
    wrapRange(range);
    sel.removeAllRanges();
    const firstMark = document.querySelector(`.${HIGHLIGHT_CLASS}[data-highlight-group="${highlightGroupCounter}"]`);
    if (firstMark) hoverTargetRef.current = firstMark;
    lockedRef.current = true;
    setPopup({
      mode: 'highlight',
      text,
      top: (firstRect ?? fullRect).top + window.scrollY,
      left: fullRect.left + fullRect.width / 2 + window.scrollX,
    });
  };

  const handleRemoveHighlight = () => {
    const mark = hoverTargetRef.current;
    if (!mark) {
      lockedRef.current = true;
      setPopup((prev) => (prev ? { ...prev, mode: 'selection' } : prev));
      return;
    }

    // Find every mark in the group so we can span the full original selection,
    // and pick a stable common ancestor that will survive normalize().
    const groupId = mark.dataset?.highlightGroup;
    const groupMarks = groupId
      ? Array.from(
          document.querySelectorAll(
            `.${HIGHLIGHT_CLASS}[data-highlight-group="${groupId}"]`,
          ),
        )
      : [mark];
    const firstMark = groupMarks[0];
    const lastMark = groupMarks[groupMarks.length - 1];

    // Find a common ancestor that contains every mark in the group.
    let ancestor = firstMark.parentElement;
    while (ancestor && !groupMarks.every((m) => ancestor.contains(m))) {
      ancestor = ancestor.parentElement;
    }
    if (!ancestor) ancestor = document.body;

    // Capture the character-offset range BEFORE unwrapping, using the first
    // text node of the first mark and the last text node of the last mark
    // as boundary anchors.
    const startTextNode = firstTextNode(firstMark);
    const endTextNode = lastTextNode(lastMark);
    let startOffset = null;
    let endOffset = null;
    if (startTextNode && endTextNode) {
      startOffset = textOffsetOf(ancestor, startTextNode, 0);
      endOffset = textOffsetOf(ancestor, endTextNode, endTextNode.nodeValue.length);
    }

    unwrapHighlightGroup(mark);
    hoverTargetRef.current = null;

    // Restore the selection over the unwrapped text so the user can re-act on it.
    if (startOffset != null && endOffset != null) {
      const startPoint = rangePointAtOffset(ancestor, startOffset);
      const endPoint = rangePointAtOffset(ancestor, endOffset);
      if (startPoint && endPoint) {
        const sel = window.getSelection();
        const range = document.createRange();
        range.setStart(startPoint.node, startPoint.offset);
        range.setEnd(endPoint.node, endPoint.offset);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }

    lockedRef.current = true;
    setPopup((prev) => (prev ? { ...prev, mode: 'selection' } : prev));
  };

  const isHighlightMode = popup?.mode === 'highlight';

  return (
    <AnimatePresence>
      {popup && (
        <motion.div
          ref={popupElRef}
          className="selection-popup"
          style={{ top: popup.top, left: popup.left }}
          initial={{ opacity: 0, y: -120, scale: 0.96 }}
          animate={{ opacity: 1, y: -60, scale: 1 }}
          exit={{ opacity: 0, y: -120, scale: 0.96, transition: { duration: 0.08, ease: 'easeIn' } }}
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
          {isHighlightMode ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              className="selection-popup__btn type-small-body-14"
              onClick={handleRemoveHighlight}
              onMouseEnter={() => setHovered('remove')}
              onMouseLeave={() => setHovered(null)}
            >
              <Close />
              Remove highlight
            </motion.button>
          ) : (
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
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
