export default function UploadIllustration() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-32 w-36">
      <div className="absolute left-4 top-12 h-16 w-16 rounded-[40%] bg-[#efd4ca] opacity-90 shadow-sm" />
      <div className="absolute left-16 top-3 h-20 w-16 rotate-[-2deg] border border-slate-700 bg-white/30 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
      <div className="absolute left-[60px] top-[78px] h-12 w-12 border border-slate-600 bg-violet-200 shadow-sm" />
      <div className="absolute right-2 top-[52px] h-14 w-11 rounded-b-[18px] border border-slate-600 bg-cyan-100 shadow-sm" />
      <div className="absolute right-2 top-[48px] h-5 w-11 rounded-[50%] border border-slate-600 bg-cyan-100" />
    </div>
  );
}
