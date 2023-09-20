const baseClassname = `
  text-white font-telegrama

  px-2 py-2 rounded-md
  transition-all duration-75
  focus:!outline-none active:!outline-none ring-none
  group

  disabled:text-zinc-500
  `;

const fancyBgClassname = `
  bg-gradient-to-r from-amber-600 to-orange-600
  hover:from-amber-700 hover:to-orange-700
  active:from-amber-800 active:to-orange-800
  disabled:from-zinc-800 disabled:to-zinc-700
  `;

const bgClassname = `
  bg-indigo-600 hover:bg-orange-800 active:bg-orange-900
  disabled:bg-zinc-700
  `;

const outlineClassname = `
  bg-transparent active:!bg-zinc-500 disabled:bg-zinc-700
  border border-gray-700 hover:border-orange-500
  !text-zinc-400 hover:!text-zinc-300
  `;

export function Button({ className, children, fancy, outline, innerRef, ...props }) {
  let btnStyleClassname;
  if (outline) {
    btnStyleClassname = outlineClassname;
  } else if (fancy) {
    btnStyleClassname = fancyBgClassname;
  } else {
    btnStyleClassname = bgClassname;
  }

  return (
    <button
      className={`
        ${baseClassname}
        ${btnStyleClassname}
        ${className}
      `}
      ref={innerRef}
      {...props}
    >
      {children}
    </button>
  );
}

