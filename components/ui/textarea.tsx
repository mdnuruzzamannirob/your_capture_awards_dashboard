import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input bg-surface text-foreground placeholder:text-placeholder-foreground hover:border-border-strong focus-visible:border-primary aria-invalid:border-destructive flex field-sizing-content min-h-20 w-full resize-y rounded-md border px-2.5 py-[7px] text-[13px] shadow-none transition-[background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.2,0,0,1)] outline-none focus-visible:shadow-[0_0_0_3px_var(--brand-subtle)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:shadow-[0_0_0_3px_var(--error-subtle)]',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
