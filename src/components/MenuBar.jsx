import { motion } from 'framer-motion';
import './MenuBar.css';

const Sparkle = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" {...props}>
    <path d="M8 1.5l1.6 4.9 4.9 1.6-4.9 1.6L8 14.5l-1.6-4.9L1.5 8l4.9-1.6L8 1.5Z" />
  </svg>
);

const Folder = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" {...props}>
    <path d="M2 4.5C2 3.7 2.7 3 3.5 3h2.7c.4 0 .8.16 1.06.44L8.5 4.7H12.5c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-9c-.83 0-1.5-.67-1.5-1.5V4.5Z" />
  </svg>
);

const BookOpen = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" {...props}>
    <path d="M2 3.5h4c.83 0 1.5.67 1.5 1.5v8c0-.83-.67-1.5-1.5-1.5H2v-8Z" />
    <path d="M14 3.5h-4c-.83 0-1.5.67-1.5 1.5v8c0-.83.67-1.5 1.5-1.5h4v-8Z" />
  </svg>
);

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
