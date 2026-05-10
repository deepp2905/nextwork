import { motion } from 'framer-motion';
import { Close } from './icons/Icons';
import './DocumentationPanel.css';

export default function DocumentationPanel({ onClose }) {
  return (
    <aside className="doc-panel" aria-label="Documentation">
      <header className="doc-panel__header">
        <h2 className="doc-panel__title type-h3">Documentation</h2>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          className="doc-panel__close"
          onClick={onClose}
          aria-label="Close Documentation panel"
        >
          <Close />
        </motion.button>
      </header>
      <div className="doc-panel__body">
        <p className="type-body doc-panel__placeholder">
          Documentation content goes here.
        </p>
      </div>
    </aside>
  );
}
