import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Close,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Search,
  Sparkle,
  SortLines,
} from '../icons/Icons';
import './ProjectsOverlay.css';

const VIEWS = [
  { id: 'explore', label: 'Explore' },
  { id: 'mine', label: 'My Projects' },
];

/* ─────────────── Explore ─────────────── */

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

const RECOMMENDATIONS = [
  'Build a Claude app with tool use',
  'Secure a Postgres database',
  'Ship a Next.js side project',
];

function CategoryCard({ title, count, blurb, featured }) {
  return (
    <motion.button
      type="button"
      className="projects-card"
      whileTap={{ scale: 0.99 }}
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

function ExploreView() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');

  const visible =
    activeFilter === 'all'
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.filter === activeFilter);

  return (
    <>
      <div className="projects-modal__intro">
        <div className="projects-modal__title-group">
          <h2 className="type-h1">What do you want to build next?</h2>
          <p className="projects-modal__subtitle type-body">
            Describe a project in your own words, or pick a category below.
          </p>
        </div>

        <div className="projects-modal__search-group">
          <div className="projects-search">
            <Search size={20} className="projects-search__icon" />
            <input
              type="text"
              className="projects-search__input type-body"
              placeholder="e.g. an MCP server that summarises my Linear tickets"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <motion.button
              type="button"
              className="projects-search__generate type-subheading"
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            >
              <Sparkle size={14} />
              Generate
            </motion.button>
          </div>

          <div className="projects-chips">
            {RECOMMENDATIONS.map((label) => (
              <motion.button
                key={label}
                type="button"
                className="projects-chip type-small-body"
                whileTap={{ scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                onClick={() => setQuery(label)}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>
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
          <SortLines size={12} />
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
    </>
  );
}

/* ─────────────── My Projects ─────────────── */

// status is derived: 0 done → not-started, all done → completed, else in-progress
const MY_PROJECTS = [
  {
    id: 'micro-interactions',
    title: 'Micro Interactions with Motion + Rive',
    tag: 'React Animation',
    source: 'Created by you',
    when: '2h ago',
    done: 2,
    total: 6,
  },
  {
    id: 'design-to-code',
    title: 'Design to Code: Paper + Claude Code via MCP',
    tag: 'AI Design (Part 1)',
    source: 'NextWork',
    when: 'Yesterday',
    done: 3,
    total: 5,
  },
  {
    id: 'automate-second-brain',
    title: 'Automate Your AI Second Brain',
    tag: 'AI Second Brain (Part 2)',
    source: 'NextWork',
    when: '5d ago',
    done: 0,
    total: 7,
  },
  {
    id: 'build-second-brain',
    title: 'Build an AI Second Brain with Claude Code',
    tag: 'AI Second Brain (Part 1)',
    source: 'NextWork',
    when: '2w ago',
    done: 8,
    total: 8,
  },
  {
    id: 'git-worktrees',
    title: 'Claude Code with Git Worktrees',
    tag: 'Claude Code',
    source: 'NextWork',
    when: '3w ago',
    done: 1,
    total: 4,
  },
  {
    id: 'guardrails',
    title: 'Set Up Claude Code Guardrails',
    tag: 'Claude Code',
    source: 'NextWork',
    when: '1mo ago',
    done: 8,
    total: 10,
  },
];

const statusOf = (p) => {
  if (p.done === 0) return 'not-started';
  if (p.done >= p.total) return 'completed';
  return 'in-progress';
};

// totals as shown in the reference's filter pills
const STATUS_FILTERS = [
  { id: 'in-progress', label: 'In progress', count: 12 },
  { id: 'completed', label: 'Completed', count: 18 },
  { id: 'not-started', label: 'Not started', count: 5 },
];

function ProjectRow({ project }) {
  const status = statusOf(project);
  const pct = project.total ? (project.done / project.total) * 100 : 0;
  const complete = status === 'completed' || status === 'not-started';

  return (
    <motion.button
      type="button"
      className="projects-row"
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
    >
      <div className="projects-row__main">
        <div className="projects-row__title-line">
          <span className="projects-row__title type-subheading">
            {project.title}
          </span>
          {status === 'completed' && (
            <CheckCircle size={14} className="projects-row__done-icon" />
          )}
        </div>
        <div className="projects-row__meta">
          <span className="projects-row__tag">{project.tag}</span>
          <span className="projects-row__dot">·</span>
          <span>{project.source}</span>
          <span className="projects-row__dot">·</span>
          <span>{project.when}</span>
        </div>
      </div>

      <div className="projects-row__progress">
        <span className="projects-row__progress-label">
          {project.done} / {project.total} tasks
        </span>
        <div className="projects-row__track">
          <div
            className={`projects-row__fill${
              complete ? ' projects-row__fill--accent' : ''
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <span className="projects-row__chevron">
        <ChevronRight size={12} />
      </span>
    </motion.button>
  );
}

function MyProjectsView() {
  const [activeStatus, setActiveStatus] = useState('in-progress');
  const [query, setQuery] = useState('');

  const summary = useMemo(() => {
    const counts = { 'in-progress': 0, completed: 0, 'not-started': 0 };
    MY_PROJECTS.forEach((p) => (counts[statusOf(p)] += 1));
    return counts;
  }, []);

  const visible = MY_PROJECTS.filter((p) => {
    const matchesStatus = statusOf(p) === activeStatus;
    const matchesQuery = p.title
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <>
      <div className="projects-modal__intro projects-modal__intro--mine">
        <div className="projects-modal__title-group">
          <h2 className="type-h1">Pick up where you left off</h2>
          <p className="projects-modal__subtitle type-body">
            {summary['in-progress']} in progress · {summary.completed} completed
            {' · '}
            {summary['not-started']} not started
          </p>
        </div>

        <div className="projects-search projects-search--plain">
          <Search size={16} className="projects-search__icon" />
          <input
            type="text"
            className="projects-search__input type-small-body-14"
            placeholder="Search your projects…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="projects-modal__toolbar">
        <div className="projects-modal__filters" role="tablist">
          {STATUS_FILTERS.map(({ id, label, count }) => {
            const isActive = activeStatus === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`projects-filter type-subheading${
                  isActive ? ' projects-filter--active' : ''
                }`}
                onClick={() => setActiveStatus(id)}
              >
                {id !== 'all' && (
                  <span className={`projects-status-dot projects-status-dot--${id}`} />
                )}
                <span>{label}</span>
                <span className="projects-filter__count">{count}</span>
              </button>
            );
          })}
        </div>
        <button type="button" className="projects-sort type-subheading">
          <SortLines size={12} />
          Sort: Last opened
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="projects-modal__rows-scroll">
        {visible.length > 0 ? (
          visible.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))
        ) : (
          <p className="projects-modal__empty type-small-body">
            No projects match your search.
          </p>
        )}
      </div>
    </>
  );
}

/* ─────────────── Overlay shell ─────────────── */

export default function ProjectsOverlay({ onClose }) {
  const [activeView, setActiveView] = useState('explore');
  const [direction, setDirection] = useState(1);

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

  const selectView = (id) => {
    if (id === activeView) return;
    const next = VIEWS.findIndex((v) => v.id === id);
    const current = VIEWS.findIndex((v) => v.id === activeView);
    setDirection(next > current ? 1 : -1);
    setActiveView(id);
  };

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
                <motion.button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`projects-view type-subheading${
                    isActive ? ' projects-view--active' : ''
                  }`}
                  onClick={() => selectView(id)}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                >
                  {label}
                </motion.button>
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

        <div className="projects-modal__view">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={activeView}
              custom={direction}
              className="projects-modal__view-inner"
              variants={{
                enter: (dir) => ({ opacity: 0, x: dir * 8 }),
                center: { opacity: 1, x: 0 },
                exit: (dir) => ({ opacity: 0, x: dir * -8 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              {activeView === 'explore' ? <ExploreView /> : <MyProjectsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
