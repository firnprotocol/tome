export function Card({ title, className, children, titleClassName }) {
  return (
    <div
      className={`bg-stone-400 border-2 transition-all border-slate-800 hover:border-slate-500 hover:shadow-slate-100/20 shadow-2xl pt-3 px-6 pb-6 rounded-lg ${className ?? ""}`}>
      <>
        <div className={`font-medium font-telegrama text-lg mb-2 text-stone-800 opacity-90 ${titleClassName}`}>
          {title}
        </div>
      </>
      {children}
    </div>
  );
}
