'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border px-[7px] py-0.5 text-[11px] leading-[1.4] font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:shadow-[var(--focus-shadow)] aria-invalid:border-destructive [&>svg]:pointer-events-none [&>svg]:size-2.5',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-soft text-primary [a&]:hover:bg-primary-soft/80',
        secondary:
          'border-border-subtle bg-secondary text-muted-foreground [a&]:hover:bg-surface-tertiary',
        destructive:
          'border-transparent bg-error-subtle text-destructive [a&]:hover:bg-error-subtle/80',
        outline:
          'border-border-subtle bg-surface-secondary text-muted-foreground [a&]:hover:border-border-default [a&]:hover:text-foreground',
        ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 [a&]:hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
