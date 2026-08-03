export default function DashboardLayout({ sidebar, header, children }) {
  return (
    <main className="min-h-screen bg-[#f2f5f9] p-2 text-ink">
      <div className="mx-auto grid min-h-[calc(100vh-1rem)] max-w-[1680px] overflow-hidden rounded-lg border border-slate-200 bg-surface shadow-[0_10px_35px_rgba(15,23,42,0.10)] lg:grid-cols-[290px_minmax(0,1fr)]">
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
