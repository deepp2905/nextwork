import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Close, ChevronDown } from '../icons/Icons';
import './ProjectsOverlay.css';

const FILTERS = [
  { id: 'all', label: 'All', count: 75 },
  { id: 'roadmaps', label: 'Roadmaps', count: 9 },
  { id: 'specialty', label: 'Specialty', count: 28 },
  { id: 'tools', label: 'Tools', count: 38 },
];

const CATEGORIES = [
  {
    id: 'all-projects',
    title: 'All projects',
    count: 75,
    blurb: 'Everything across roadmaps, specialties and tools.',
    featured: true,
    filter: 'all',
  },
  {
    id: 'new-this-week',
    title: 'New this week',
    count: 13,
    blurb: 'Fresh roadmaps and tools added in the last 7 days.',
    filter: 'all',
  },
  {
    id: 'ai-ml',
    title: 'AI / ML',
    count: 37,
    blurb: 'Agents, RAG, embeddings, fine-tuning, evals.',
    filter: 'specialty',
  },
  {
    id: 'claude-code',
    title: 'Claude Code',
    count: 21,
    blurb: 'Hooks, sub-agents, MCP servers, slash commands.',
    filter: 'tools',
  },
  {
    id: 'second-brain',
    title: 'AI Second Brain',
    count: 9,
    blurb: 'Capture, retrieve and act on your own knowledge.',
    filter: 'roadmaps',
  },
  {
    id: 'productivity',
    title: 'Productivity',
    count: 15,
    blurb: 'Automate the small stuff so the big stuff ships.',
    filter: 'tools',
  },
];

function CategoryCard({ title, count, blurb, featured }) {
  return (
    <motion.button
      type="button"
      className="projects-card"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
    >
      <div className="projects-card__media">
        {featured && (
          <span className="projects-card__badge type-small-body-14">
            <span className="projects-card__badge-dot" />
            Featured
          </span>
        )}
      </div>
      <div className="projects-card__body">
        <div className="projects-card__heading">
          <span className="type-h3">{title}</span>
          <span className="projects-card__count type-small-body">{count}</span>
        </div>
        <p className="projects-card__blurb type-small-body-14">{blurb}</p>
      </div>
    </motion.button>
  );
}

const VIEWS = [
  { id: 'explore', label: 'Explore' },
  { id: 'mine', label: 'My Projects' },
];

export default function ProjectsOverlay({ onClose }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeView, setActiveView] = useState('explore');

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const visible =
    activeFilter === 'all'
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.filter === activeFilter);

  return (
    <motion.div
      className="projects-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      onMouseDown={onClose}
      role="presentation"
    >
      <motion.div
        className="projects-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Projects"
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="projects-modal__header">
          <div className="projects-modal__views" role="tablist">
            {VIEWS.map(({ id, label }) => {
              const isActive = activeView === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`projects-view type-subheading${
                    isActive ? ' projects-view--active' : ''
                  }`}
                  onClick={() => setActiveView(id)}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="projects-modal__close"
            onClick={onClose}
            aria-label="Close projects"
          >
            <Close size={16} />
          </button>
        </header>

        <div className="projects-modal__title-group">
          <h2 className="type-h1-24">Projects</h2>
          <p className="projects-modal__subtitle type-body">
            Browse roadmaps, specialties and tools to build next.
          </p>
        </div>

        <div className="projects-modal__toolbar">
          <div className="projects-modal__filters" role="tablist">
            {FILTERS.map(({ id, label, count }) => {
              const isActive = activeFilter === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`projects-filter type-subheading${
                    isActive ? ' projects-filter--active' : ''
                  }`}
                  onClick={() => setActiveFilter(id)}
                >
                  <span>{label}</span>
                  <span className="projects-filter__count">{count}</span>
                </button>
              );
            })}
          </div>
          <button type="button" className="projects-sort type-subheading">
            Sort: Popular
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="projects-modal__grid-scroll">
          <div className="projects-modal__grid">
            {visible.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
