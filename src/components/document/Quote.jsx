export default function Quote({ title, children }) {
  return (
    <blockquote className="doc-quote">
      {title && <h3 className="doc-quote__title type-h3" data-highlightable>{title}</h3>}
      <p className="doc-quote__body type-body" data-highlightable>{children}</p>
    </blockquote>
  );
}
