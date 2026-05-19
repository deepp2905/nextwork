import { useMemo, useState } from 'react';
import { MY_PROJECTS, STATUS_FILTERS, statusOf } from './data';
import SearchBar from './SearchBar';
import FilterTabs from './FilterTabs';
import SortButton from './SortButton';
import ProjectRow from './ProjectRow';
import './MyProjectsView.css';

/** The My Projects view: progress summary, search and a filtered row list. */
export default function MyProjectsView() {
  const [activeStatus, setActiveStatus] = useState('in-progress');
  const [query, setQuery] = useState('');

  const summary = useMemo(() => {
    const counts = { 'in-progress': 0, completed: 0 };
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
            {summary['in-progress']} projects in progress and {summary.completed}{' '}
            completed — jump back into one below.
          </p>
        </div>

        <SearchBar
          variant="plain"
          value={query}
          onChange={setQuery}
          placeholder="Search your projects…"
          inputClassName="type-small-body-14"
          iconSize={16}
        />
      </div>

      <div className="projects-modal__toolbar">
        <FilterTabs
          filters={STATUS_FILTERS}
          activeId={activeStatus}
          onSelect={setActiveStatus}
          withDots
        />
        <SortButton label="Sort: Last opened" />
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
