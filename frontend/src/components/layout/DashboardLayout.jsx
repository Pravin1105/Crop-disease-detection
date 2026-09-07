export default function DashboardLayout({ sidebar, header, children }) {
  return (
    <main className="min-h-screen bg-[var(--bg)] p-2 text-[var(--text)] transition-colors">
      <div className="mx-auto grid min-h-[calc(100vh-1rem)] max-w-[1680px] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] lg:grid-cols-[280px_minmax(0,1fr)]">
        {sidebar}
        <div className="flex min-w-0 flex-col">
          {header}
          <div className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[1260px] flex-col gap-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
