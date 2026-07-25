import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-input bg-surface text-foreground selection:bg-primary-soft selection:text-foreground file:text-foreground placeholder:text-placeholder-foreground hover:border-border-strong h-8 w-full min-w-0 rounded-md border px-2.5 py-1 text-[13px] shadow-none transition-[background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.2,0,0,1)] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_var(--brand-subtle)]',
        'aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_3px_var(--error-subtle)]',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
