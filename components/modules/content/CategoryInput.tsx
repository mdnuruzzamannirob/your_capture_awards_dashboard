'use client';

import { cn } from '@/lib/utils';
import { dedupeCategories, MAX_CONTEST_CATEGORIES } from '@/lib/contestCategories';
import { useGetContestCreationOptionsQuery } from '@/store/features/contest/contestApi';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface CategoryInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  placeholder?: string;
}

// Multi-category picker: type a category and press Enter (or comma) to add it,
// or click one of the predefined categories below.
const CategoryInput = ({
  value,
  onChange,
  className,
  placeholder = 'Type a category and press Enter',
}: CategoryInputProps) => {
  const [draft, setDraft] = useState('');
  const { data: optionsData } = useGetContestCreationOptionsQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const selected = value ?? [];
  const selectedKeys = new Set(selected.map((category) => category.toLowerCase()));
  const suggestions = (optionsData?.data?.categories ?? [])
    .map((category) => category.name)
    .filter((name) => name && !selectedKeys.has(name.toLowerCase()));
  const isFull = selected.length >= MAX_CONTEST_CATEGORIES;

  const add = (raw: string) => {
    const next = dedupeCategories([...selected, ...raw.split(',')]).slice(0, MAX_CONTEST_CATEGORIES);
    if (next.length !== selected.length) onChange(next);
    setDraft('');
  };

  const remove = (category: string) => {
    onChange(selected.filter((item) => item !== category));
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <div className="border-input bg-surface focus-within:border-primary flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5 transition-colors">
        {selected.map((category) => (
          <span
            key={category}
            className="bg-primary-soft text-primary inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-medium"
          >
            {category}
            <button
              type="button"
              aria-label={`Remove ${category}`}
              onClick={() => remove(category)}
              className="hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          disabled={isFull}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if ((event.key === 'Enter' || event.key === ',') && draft.trim()) {
              event.preventDefault();
              add(draft);
            } else if (event.key === 'Enter') {
              // Never submit the surrounding form from this field.
              event.preventDefault();
            } else if (event.key === 'Backspace' && !draft && selected.length) {
              remove(selected[selected.length - 1]);
            }
          }}
          onBlur={() => {
            if (draft.trim()) add(draft);
          }}
          placeholder={
            isFull ? `Up to ${MAX_CONTEST_CATEGORIES} categories` : selected.length ? '' : placeholder
          }
          className="text-foreground placeholder:text-muted-foreground min-w-32 flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed"
        />
      </div>

      {!isFull && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => add(name)}
              className="border-border-subtle text-muted-foreground hover:border-primary hover:text-foreground inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[11px] font-medium transition-colors"
            >
              <Plus className="size-3" />
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryInput;
