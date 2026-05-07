import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AskPanel from './components/AskPanel.jsx';
import Document from './components/Document.jsx';
import MenuBar from './components/MenuBar.jsx';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState(null);

  const handleTabSelect = (tab) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  return (
    <div className="app">
      <AnimatePresence initial={false}>
        {activeTab === 'ask' && (
          <motion.div
            key="ask-wrapper"
            className="ask-wrapper"
            initial={{ width: 0 }}
            animate={{ width: 400 }}
            exit={{ width: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
          >
            <AskPanel onClose={() => setActiveTab(null)} />
          </motion.div>
        )}
      </AnimatePresence>
      <main className="app__main">
        <Document />
      </main>
      <MenuBar activeTab={activeTab} onSelect={handleTabSelect} />
    </div>
  );
}
