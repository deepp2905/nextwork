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

export default function MenuBar({ activeTab, onSelect }) {
  return (
    <nav className="menu-bar" aria-label="Primary">
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
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  className={`menu-bar__tab type-small-body${isActive ? ' menu-bar__tab--active' : ''}`}
                  onClick={() => onSelect(id)}
                  aria-pressed={isActive}
                >
                  <Icon className="menu-bar__icon" />
                  <span>{label}</span>
                </motion.button>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
