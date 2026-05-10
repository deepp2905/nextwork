import Tooltip from './Tooltip';
import './DocThemeToolbar.css';

const COLOR_OPTIONS = [
  { key: 'light', label: 'Light', bg: '#ffffff', primary: '#0f9d8a' },
  { key: 'dark', label: 'Dark', bg: '#0c0d10', primary: '#22d3ee' },
  { key: 'warm-cream', label: 'Warm Cream', bg: '#f5ebe0', primary: '#c2562e' },
  { key: 'bold-accent', label: 'Bold Accent', bg: '#ffffff', primary: '#7c3aed' },
];

const TYPE_OPTIONS = [
  {
    key: 'modern',
    label: 'Modern',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 700,
  },
  {
    key: 'serif',
    label: 'Serif',
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700,
  },
  {
    key: 'display',
    label: 'Display',
    fontFamily: "'Bricolage Grotesque', 'Inter', system-ui, sans-serif",
    fontWeight: 700,
  },
  {
    key: 'minimal',
    label: 'Minimal',
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    fontWeight: 500,
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
              <button
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={opt.label}
                className="doc-swatch"
                data-active={active ? 'true' : 'false'}
                style={{ '--swatch-bg': opt.bg, '--swatch-primary': opt.primary }}
                onClick={() => onChange(opt.key)}
              >
                <span className="doc-swatch__dot" aria-hidden="true" />
              </button>
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
              <button
                type="button"
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
              </button>
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
  return (
    <div className="doc-theme-toolbar">
      <ColorSwatches value={colorTheme} onChange={onColorChange} />
      <TypeSwatches value={typeTheme} onChange={onTypeChange} />
    </div>
  );
}
