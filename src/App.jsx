import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AskPanel from './components/AskPanel.jsx';
import DocumentationPanel from './components/DocumentationPanel.jsx';
import Document from './components/Document.jsx';
import MenuBar from './components/MenuBar.jsx';
import SelectionPopup from './components/selection/SelectionPopup.jsx';
import './App.css';

const ASK_MIN = 420;
const ASK_MAX = 720;
const ASK_DEFAULT = 500;

const DOC_MIN = 480;
const DOC_MAX = 1080;
const DOC_DEFAULT = 720;

export default function App() {
  const [activeTab, setActiveTab] = useState(null);
  const [askWidth, setAskWidth] = useState(ASK_DEFAULT);
  const [isResizing, setIsResizing] = useState(false);
  const [docWidth, setDocWidth] = useState(DOC_DEFAULT);
  const [isDocResizing, setIsDocResizing] = useState(false);
  const [pendingQuote, setPendingQuote] = useState(null);
  const resizingRef = useRef(false);
  const docResizingRef = useRef(false);

  const handleTabSelect = (tab) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  const handleAskFromSelection = (text) => {
    setPendingQuote(text);
    setActiveTab('ask');
  };

  const startResize = (e) => {
    e.preventDefault();
    resizingRef.current = true;
    setIsResizing(true);
  };

  const startDocResize = (e) => {
    e.preventDefault();
    docResizingRef.current = true;
    setIsDocResizing(true);
  };

  useEffect(() => {
    const onMove = (e) => {
      if (resizingRef.current) {
        const next = Math.min(ASK_MAX, Math.max(ASK_MIN, e.clientX));
        setAskWidth(next);
      }
      if (docResizingRef.current) {
        const next = Math.min(
          DOC_MAX,
          Math.max(DOC_MIN, window.innerWidth - e.clientX),
        );
        setDocWidth(next);
      }
    };
    const onUp = () => {
      if (resizingRef.current) {
        resizingRef.current = false;
        setIsResizing(false);
      }
      if (docResizingRef.current) {
        docResizingRef.current = false;
        setIsDocResizing(false);
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const anyResizing = isResizing || isDocResizing;

  return (
    <div className={`app${anyResizing ? ' app--resizing' : ''}`}>
      <AnimatePresence initial={false}>
        {activeTab === 'ask' && (
          <motion.div
            key="ask-wrapper"
            className="ask-wrapper"
            initial={{ width: 0 }}
            animate={{ width: askWidth }}
            exit={{ width: 0 }}
            transition={
              isResizing
                ? { duration: 0 }
                : { type: 'spring', stiffness: 280, damping: 32 }
            }
          >
            <motion.div
              className="ask-wrapper__inner"
              style={{ width: askWidth }}
              initial={{ x: -askWidth }}
              animate={{ x: 0 }}
              exit={{ x: -askWidth }}
              transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            >
              <AskPanel
                onClose={() => setActiveTab(null)}
                pendingQuote={pendingQuote}
                onClearQuote={() => setPendingQuote(null)}
              />
              <div
                className="ask-wrapper__handle"
                onMouseDown={startResize}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize Ask panel"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="app__main">
        <Document />
      </main>
      <AnimatePresence initial={false}>
        {activeTab === 'documentation' && (
          <motion.div
            key="doc-wrapper"
            className="doc-wrapper"
            initial={{ width: 0 }}
            animate={{ width: docWidth }}
            exit={{ width: 0 }}
            transition={
              isDocResizing
                ? { duration: 0 }
                : { type: 'spring', stiffness: 280, damping: 32 }
            }
          >
            <motion.div
              className="doc-wrapper__inner"
              style={{ width: docWidth }}
              initial={{ x: docWidth }}
              animate={{ x: 0 }}
              exit={{ x: docWidth }}
              transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            >
              <div
                className="doc-wrapper__handle"
                onMouseDown={startDocResize}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize Documentation panel"
              />
              <DocumentationPanel onClose={() => setActiveTab(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SelectionPopup articleSelector=".doc" onAsk={handleAskFromSelection} />
      <MenuBar activeTab={activeTab} onSelect={handleTabSelect} />
    </div>
  );
}
