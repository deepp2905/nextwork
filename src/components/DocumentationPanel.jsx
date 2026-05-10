import { useState } from 'react';
import { motion } from 'framer-motion';
import { Close } from './icons/Icons';
import DocThemeToolbar from './DocThemeToolbar';
import DocumentationMock from './DocumentationMock';
import './DocumentationPanel.css';

export default function DocumentationPanel({ onClose }) {
  const [colorTheme, setColorTheme] = useState('light');
  const [typeTheme, setTypeTheme] = useState('modern');
  const [hoverColor, setHoverColor] = useState(null);
  const [hoverType, setHoverType] = useState(null);

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
      <div
        className="doc-panel__themed"
        data-doc-color-theme={hoverColor ?? colorTheme}
        data-doc-type-theme={hoverType ?? typeTheme}
      >
        <DocThemeToolbar
          colorTheme={colorTheme}
          typeTheme={typeTheme}
          onColorChange={setColorTheme}
          onTypeChange={setTypeTheme}
          onColorHover={setHoverColor}
          onTypeHover={setHoverType}
        />
        <div className="doc-panel__scroll">
          <DocumentationMock />
        </div>
      </div>
    </aside>
  );
}
