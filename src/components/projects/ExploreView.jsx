import { useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES, FILTERS, RECOMMENDATIONS } from './data';
import SearchBar from './SearchBar';
import FilterTabs from './FilterTabs';
import SortButton from './SortButton';
import CategoryCard from './CategoryCard';
import './ExploreView.css';

/** The Explore view: prompt, search, recommendation chips and category grid. */
export default function ExploreView() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const visible = CATEGORIES.filter((c) => {
    const matchesFilter = activeFilter === 'all' || c.filter === activeFilter;
    const matchesQuery =
      q === '' ||
      c.title.toLowerCase().includes(q) ||
      c.blurb.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

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
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="e.g. an MCP server that summarises my Linear tickets"
            onGenerate={() => {}}
          />

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
        <FilterTabs
          filters={FILTERS}
          activeId={activeFilter}
          onSelect={setActiveFilter}
        />
        <SortButton label="Sort: Popular" />
      </div>

      <div className="projects-modal__grid-scroll">
        {visible.length > 0 ? (
          <div className="projects-modal__grid">
            {visible.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        ) : (
          <p className="projects-modal__empty type-small-body">
            No categories match your search.
          </p>
        )}
      </div>
    </>
  );
}
