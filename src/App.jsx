import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AskPanel from './components/AskPanel.jsx';
import Document from './components/Document.jsx';
import MenuBar from './components/MenuBar.jsx';
import SelectionPopup from './components/selection/SelectionPopup.jsx';
import './App.css';

const ASK_MIN = 320;
const ASK_MAX = 720;
const ASK_DEFAULT = 400;

export default function App() {
  const [activeTab, setActiveTab] = useState(null);
  const [askWidth, setAskWidth] = useState(ASK_DEFAULT);
  const [isResizing, setIsResizing] = useState(false);
  const [pendingQuote, setPendingQuote] = useState(null);
  const resizingRef = useRef(false);

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

  useEffect(() => {
    const onMove = (e) => {
      if (!resizingRef.current) return;
      const next = Math.min(ASK_MAX, Math.max(ASK_MIN, e.clientX));
      setAskWidth(next);
    };
    const onUp = () => {
      if (!resizingRef.current) return;
      resizingRef.current = false;
      setIsResizing(false);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const askOffset = activeTab === 'ask' ? askWidth : 0;

  return (
    <div
      className={`app${isResizing ? ' app--resizing' : ''}`}
      style={{ '--ask-offset': `${askOffset}px` }}
    >
      <AnimatePresence initial={false}>
        {activeTab === 'ask' && (
          <motion.div
            key="ask-wrapper"
            className="ask-wrapper"
            style={isResizing ? { width: askWidth } : undefined}
            initial={{ width: 0 }}
            animate={isResizing ? undefined : { width: askWidth }}
            exit={{ width: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
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
      <SelectionPopup articleSelector=".doc" onAsk={handleAskFromSelection} />
      <MenuBar activeTab={activeTab} onSelect={handleTabSelect} />
    </div>
  );
}
