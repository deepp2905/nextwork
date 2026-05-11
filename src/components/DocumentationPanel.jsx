import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Close, Pin } from './icons/Icons';
import Tooltip from './Tooltip';
import DocThemeToolbar from './DocThemeToolbar';
import DocumentationMock from './DocumentationMock';
import './DocumentationPanel.css';

export default function DocumentationPanel({ onClose }) {
  const [colorTheme, setColorTheme] = useState('light');
  const [typeTheme, setTypeTheme] = useState('modern');
  const [toolbarOpen, setToolbarOpen] = useState(false);

  return (
    <aside
      className="doc-panel doc-panel__themed"
      aria-label="Documentation"
      data-doc-color-theme={colorTheme}
      data-doc-type-theme={typeTheme}
    >
      <header className="doc-panel__header">
        <h2 className="doc-panel__title type-h3">Documentation</h2>
        <div className="doc-panel__actions">
          <Tooltip label={toolbarOpen ? 'Hide theme toolbar' : 'Customize theme'} placement="bottom">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              className="doc-panel__icon-btn"
              data-active={toolbarOpen ? 'true' : 'false'}
              onClick={() => setToolbarOpen((v) => !v)}
              aria-pressed={toolbarOpen}
              aria-label="Toggle theme toolbar"
            >
              <Pin size={18} />
            </motion.button>
          </Tooltip>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            className="doc-panel__icon-btn"
            onClick={onClose}
            aria-label="Close Documentation panel"
          >
            <Close />
          </motion.button>
        </div>
      </header>
      <AnimatePresence initial={false}>
        {toolbarOpen && (
          <motion.div
            key="toolbar"
            className="doc-panel__toolbar-slot"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <DocThemeToolbar
              colorTheme={colorTheme}
              typeTheme={typeTheme}
              onColorChange={setColorTheme}
              onTypeChange={setTypeTheme}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <DocumentationMock />
    </aside>
  );
}
