import { motion } from 'framer-motion';
import { Sparkle, Folder, BookOpen } from './icons/Icons';
import './MenuBar.css';

const TABS = [
  { id: 'ask', label: 'Ask', Icon: Sparkle },
  { id: 'projects', label: 'Projects', Icon: Folder },
  { id: 'documentation', label: 'Documentation', Icon: BookOpen },
];

export default function MenuBar({ activeTab, onSelect }) {
  return (
    <nav className="menu-bar" aria-label="Primary">
      <ul className="menu-bar__list">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <li key={id}>
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
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
