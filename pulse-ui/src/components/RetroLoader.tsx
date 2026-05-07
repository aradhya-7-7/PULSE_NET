export default function RetroLoader({ text = "FETCHING_DATA..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 gap-4">
      <div className="w-10 h-10 bg-retro-yellow border-4 border-black animate-[spin_1.5s_steps(4)_infinite] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
      <span className="font-mono text-sm sm:text-base font-bold bg-black text-white px-3 py-1 border-2 border-transparent animate-pulse">
         {text} <span className="animate-ping">_</span>
      </span>
    </div>
  );
}