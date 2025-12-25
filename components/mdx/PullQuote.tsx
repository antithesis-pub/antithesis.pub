import { ReactNode } from 'react';

type PullQuoteProps = {
  children: ReactNode;
  position?: 'left' | 'right' | 'center';
};

export function PullQuote({ children, position = 'right' }: PullQuoteProps) {
  const baseClasses = "my-6 p-6 border-l-4 border-gray-800 --color-background";
  
  const positionClasses = {
    left: "float-left w-1/2 mr-6",
    right: "float-right w-1/2 ml-6",
    center: "w-2/3 mx-auto"
  };

  return (
    <aside className={`${baseClasses} ${positionClasses[position]}`}>
      <p className="text-2xl font-serif italic text-center leading-tight">
        {children}
      </p>
    </aside>
  );
}