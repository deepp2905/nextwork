import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkle, Folder, BookOpen } from './icons/Icons';
import Tooltip from './Tooltip';
import './MenuBar.css';

const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);
const modKey = isMac ? '⌘' : 'Ctrl';

const TABS = [
  { id: 'ask', label: 'Ask', Icon: Sparkle, shortcut: `${modKey} + ‹` },
  { id: 'projects', label: 'Projects', Icon: Folder, shortcut: null },
  { id: 'documentation', label: 'Documentation', Icon: BookOpen, shortcut: `${modKey} + ›` },
];

function MenuTab({ id, label, Icon, isActive, onSelect, 'aria-describedby': describedBy }) {
  const [pressed, setPressed] = useState(false);

  const press = () => setPressed(true);
  const release = () => setPressed(false);

  return (
    <button
      type="button"
      className={`menu-bar__tab type-small-body${isActive ? ' menu-bar__tab--active' : ''}`}
      onClick={() => onSelect(id)}
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      aria-pressed={isActive}
      aria-describedby={describedBy}
    >
      <motion.span
        className="menu-bar__tab-inner"
        animate={{ scale: pressed ? 0.95 : 1 }}
        transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      >
        <Icon className="menu-bar__icon" />
        <span>{label}</span>
      </motion.span>
    </button>
  );
}

export default function MenuBar({ activeTab, onSelect }) {
  return (
    <nav className="menu-bar" aria-label="Primary" data-tooltip-group>
      <ul className="menu-bar__list">
        {TABS.map(({ id, label, Icon, shortcut }) => {
          const isActive = activeTab === id;
          const tooltipLabel = shortcut ? `${shortcut}` : label;
          return (
            <li key={id}>
              <Tooltip
                label={tooltipLabel}
                placement="top"
                gap={16}
                disabled={!!activeTab}
              >
                <MenuTab
                  id={id}
                  label={label}
                  Icon={Icon}
                  isActive={isActive}
                  onSelect={onSelect}
                />
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
