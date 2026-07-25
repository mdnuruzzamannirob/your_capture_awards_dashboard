'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex shrink-0 select-none items-center justify-center gap-1.5 rounded-md border border-transparent text-[13px] leading-none font-medium whitespace-nowrap outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.2,0,0,1)] active:translate-y-px focus-visible:shadow-[var(--focus-shadow)] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default:
          'border-primary bg-primary font-semibold text-primary-foreground shadow-[var(--shadow-brand)] hover:border-primary-hover hover:bg-primary-hover active:border-primary-active active:bg-primary-active',
        destructive: 'border-destructive/20 bg-transparent text-destructive hover:bg-error-subtle',
        outline:
          'border-border-default bg-surface-secondary text-foreground hover:border-border-strong hover:bg-surface-tertiary',
        secondary:
          'border-border-default bg-surface-secondary text-secondary-foreground hover:border-border-strong hover:bg-surface-tertiary',
        ghost:
          'bg-transparent text-muted-foreground hover:bg-surface-secondary hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-8 px-3 has-[>svg]:px-2.5',
        xs: "h-6.5 gap-1 rounded-sm px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-6.5 gap-1 rounded-sm px-2.5 text-xs has-[>svg]:px-2',
        lg: 'h-9.5 px-4 text-sm has-[>svg]:px-3.5',
        icon: 'size-8',
        'icon-xs': "size-6.5 rounded-sm [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-6.5 rounded-sm',
        'icon-lg': 'size-9.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
