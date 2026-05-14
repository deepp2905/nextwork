import { motion } from 'framer-motion';
import Tooltip from './Tooltip';
import { Cube } from './icons/Icons';
import './DocThemeToolbar.css';

const COLOR_OPTIONS = [
  { key: 'light', label: 'Light', bg: '#ffffff', primary: '#1b1b1b' },
  { key: 'bold-accent', label: 'Bold Accent', bg: '#ffffff', primary: '#7c3aed' },
  { key: 'marigold', label: 'Marigold', bg: '#fffbf2', primary: '#e8703a' },
  { key: 'bookshelf', label: 'Bookshelf', bg: '#fdf9f1', primary: '#3d6b4a' },
  { key: 'dark', label: 'Dark', bg: '#0c0d10', primary: '#ee22ee' },
  { key: 'graphite', label: 'Graphite', bg: '#0f1115', primary: '#6ea8fe' },
  
];

const TYPE_OPTIONS = [
  {
    key: 'modern',
    label: 'Modern',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 800,
  },
  {
    key: 'display',
    label: 'Display',
    fontFamily: "'Bricolage Grotesque', 'Inter', system-ui, sans-serif",
    fontWeight: 800,
  },
  {
    key: 'editorial',
    label: 'Editorial',
    fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
    fontWeight: 800,
  },
  {
    key: 'technical',
    label: 'Technical',
    fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
    fontWeight: 800,
  },
];

function ColorSwatches({ value, onChange }) {
  return (
    <div className="doc-theme-toolbar__group">
      <span className="doc-theme-toolbar__label">Color</span>
      <div
        className="doc-theme-toolbar__swatches"
        role="radiogroup"
        aria-label="Color"
      >
        {COLOR_OPTIONS.map((opt) => {
          const active = opt.key === value;
          return (
            <Tooltip key={opt.key} label={opt.label} placement="bottom">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                role="radio"
                aria-checked={active}
                aria-label={opt.label}
                className="doc-swatch"
                data-active={active ? 'true' : 'false'}
                style={{ '--swatch-bg': opt.bg, '--swatch-primary': opt.primary }}
                onClick={() => onChange(opt.key)}
              >
                <span className="doc-swatch__dot" aria-hidden="true" />
              </motion.button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

function TypeSwatches({ value, onChange }) {
  return (
    <div className="doc-theme-toolbar__group">
      <span className="doc-theme-toolbar__label">Typography</span>
      <div
        className="doc-theme-toolbar__swatches"
        role="radiogroup"
        aria-label="Typography"
      >
        {TYPE_OPTIONS.map((opt) => {
          const active = opt.key === value;
          return (
            <Tooltip key={opt.key} label={opt.label} placement="bottom">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                role="radio"
                aria-checked={active}
                aria-label={opt.label}
                className="doc-swatch doc-swatch--type"
                data-active={active ? 'true' : 'false'}
                style={{
                  '--swatch-font': opt.fontFamily,
                  '--swatch-weight': opt.fontWeight,
                }}
                onClick={() => onChange(opt.key)}
              >
                <span className="doc-swatch__aa" aria-hidden="true">Aa</span>
              </motion.button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

export default function DocThemeToolbar({
  colorTheme,
  typeTheme,
  onColorChange,
  onTypeChange,
}) {
  const randomize = () => {
    const pickDifferent = (list, current) => {
      const others = list.filter((o) => o.key !== current);
      const pool = others.length > 0 ? others : list;
      return pool[Math.floor(Math.random() * pool.length)].key;
    };
    onColorChange(pickDifferent(COLOR_OPTIONS, colorTheme));
    onTypeChange(pickDifferent(TYPE_OPTIONS, typeTheme));
  };

  return (
    <div className="doc-theme-toolbar">
      <div className="doc-theme-toolbar__groups">
        <ColorSwatches
          value={colorTheme}
          onChange={onColorChange}
        />
        <TypeSwatches
          value={typeTheme}
          onChange={onTypeChange}
        />
      </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          className="doc-swatch doc-swatch--randomize"
          onClick={randomize}
          aria-label="Randomize theme"
        >
          <Cube />
          Randomize
        </motion.button>
    </div>
  );
}
