import React from 'react';

interface PageHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ kicker, title, description }) => {
  return (
    <div className="pt-10 pb-12 mb-8 border-b border-[var(--color-border)]">
      <div className="max-w-4xl">
        {kicker && (
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--color-primary)] mb-3">
            {kicker}
          </p>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text)] tracking-tight text-balance leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
