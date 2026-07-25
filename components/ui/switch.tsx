'use client';

import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

function Switch({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default';
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'peer group/switch border-border-default data-[state=checked]:border-primary data-[state=checked]:bg-primary-soft data-[state=unchecked]:bg-surface-tertiary inline-flex shrink-0 items-center rounded-full border shadow-none transition-[background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.2,0,0,1)] outline-none focus-visible:shadow-[0_0_0_3px_var(--brand-subtle)] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[18px] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-muted-foreground data-[state=checked]:bg-primary pointer-events-none block rounded-full ring-0 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.2,0,0,1)] group-data-[size=default]/switch:size-3.5 group-data-[size=sm]/switch:size-3 data-[state=checked]:translate-x-3.5 data-[state=unchecked]:translate-x-px',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
