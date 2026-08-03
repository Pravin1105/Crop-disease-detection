export default function Logo() {
  return (
    <div className="flex items-center gap-4">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-blue-100 shadow-[inset_0_-12px_18px_rgba(31,116,255,0.22)]">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-300 to-blue-600 text-white shadow-[0_8px_18px_rgba(37,99,235,0.35)]">
          <span className="relative inline-block h-5 w-5 rounded-md bg-white text-brand">
            <span className="absolute left-1/2 top-[3px] h-[14px] w-1 -translate-x-1/2 rounded-full bg-brand" />
            <span className="absolute left-[3px] top-1/2 h-1 w-[14px] -translate-y-1/2 rounded-full bg-brand" />
          </span>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold leading-none text-brand">CDD</p>
        <p className="mt-2 text-sm font-medium text-muted">Crop Disease Detection</p>
      </div>
    </div>
  );
}
