'use client';

import { cn } from '@/lib/utils';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface InputProps<TFormValues extends FieldValues> {
  label: string;
  id: Path<TFormValues>;
  type?: string;
  placeholder?: string;
  required?: boolean;
  register?: UseFormRegister<TFormValues>;
  error?: string;
}

function FormField<TFormValues extends FieldValues>({
  label,
  id,
  type = 'text',
  placeholder,
  required = false,
  register,
  error,
}: InputProps<TFormValues>) {
  return (
    <div className="mb-3">
      <label
        htmlFor={id as string}
        className={cn(
          'text-label-foreground mb-1.5 block text-xs font-medium',
          error && 'text-destructive',
        )}
      >
        {label}
      </label>
      <input
        id={id as string}
        type={type}
        placeholder={placeholder}
        required={required}
        {...(register ? register(id) : {})}
        className={cn(
          'border-input bg-surface text-foreground placeholder:text-placeholder-foreground hover:border-border-strong focus:border-primary h-8 w-full rounded-md border px-2.5 text-[13px] transition-[background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.2,0,0,1)] outline-none focus:shadow-[0_0_0_3px_var(--brand-subtle)]',
          error &&
            'border-destructive focus:border-destructive focus:shadow-[0_0_0_3px_var(--error-subtle)]',
        )}
      />
      {error && <p className="text-destructive mt-1 text-[11px]">{error}</p>}
    </div>
  );
}

export default FormField;
