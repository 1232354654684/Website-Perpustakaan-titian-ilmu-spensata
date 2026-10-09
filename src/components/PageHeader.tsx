import React from 'react';

interface PageHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ kicker, title, description }) => {
  return (
    <div className="pt-10 pb-12 mb-8 border-b border-[#E6DFD3]/80">
      <div className="max-w-4xl">
        {kicker && (
          <p className="text-xs uppercase tracking-widest font-semibold text-[#1B4332] mb-3">
            {kicker}
          </p>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight text-balance leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
