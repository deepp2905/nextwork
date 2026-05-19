import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight } from '../icons/Icons';
import { statusOf } from './data';
import './ProjectRow.css';

/** A single project row in the My Projects list. */
export default function ProjectRow({ project }) {
  const status = statusOf(project);
  const pct = project.total ? (project.done / project.total) * 100 : 0;
  const complete = status === 'completed';

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
          {complete && (
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
