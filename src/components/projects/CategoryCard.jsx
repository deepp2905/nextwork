import { motion } from 'framer-motion';
import './CategoryCard.css';

/** A single category card in the Explore grid. */
export default function CategoryCard({ title, count, blurb, featured }) {
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
