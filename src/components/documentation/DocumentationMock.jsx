import { proofOfWork } from '../../data/proofOfWork';
import Editable from './Editable';
import './DocumentationMock.css';

export default function DocumentationMock() {
  const { eyebrow, title, author, completedOn, sections } = proofOfWork;

  return (
    <article className="doc-mock">
      <section className="doc-mock__hero">
        <span className="doc-mock__eyebrow">{eyebrow}</span>
        <h1 className="doc-mock__title">{title}</h1>
        <div className="doc-mock__meta">
          <Editable as="span" className="doc-mock__name" value={author} storeKey="author" />
          <span className="doc-mock__divider" aria-hidden="true" />
          <span className="doc-mock__date">Completed {completedOn}</span>
        </div>
      </section>

      {sections.map((section) => (
        <section
          key={section.key}
          className="doc-mock__section"
          data-key={section.key}
        >
          <span className="doc-mock__section-eyebrow">
            {section.eyebrow}
          </span>
          <h2 className="doc-mock__section-title">{section.title}</h2>
          <Editable
            as="p"
            className="doc-mock__section-body"
            value={section.body}
            storeKey={`section.${section.key}.body`}
          />
          <div
            className="doc-mock__image"
            role="img"
            aria-label={section.imageLabel}
          >
            <span className="doc-mock__image-label">{section.imageLabel}</span>
          </div>
        </section>
      ))}
    </article>
  );
}
