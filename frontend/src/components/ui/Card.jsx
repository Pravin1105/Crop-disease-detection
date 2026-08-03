export default function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-lg border border-border bg-white shadow-panel ${className}`}
    >
      {children}
    </section>
  );
}
