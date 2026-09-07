export default function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-colors ${className}`}
    >
      {children}
    </section>
  );
}
