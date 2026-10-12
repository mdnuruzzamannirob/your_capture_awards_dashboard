'use client';

import { cn } from '@/lib/utils';
import { dedupeCategories, MAX_CONTEST_CATEGORIES } from '@/lib/contestCategories';
import { useGetContestCreationOptionsQuery } from '@/store/features/contest/contestApi';
import { Plus, Tag, X } from 'lucide-react';
import { useId, useMemo, useRef, useState } from 'react';

interface CategoryInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  placeholder?: string;
}

type Option = { kind: 'existing' | 'new'; name: string };

const MAX_VISIBLE_OPTIONS = 50;

// Multi-category picker with type-ahead suggestions. Suggestions are every
// category used before (served by /contests/create-options); a category saved
// for the first time is added to that list by the API. Typing an existing
// category in a different case reuses its original spelling, so the same
// category is never stored twice as e.g. "Street" and "street".
const CategoryInput = ({
  value,
  onChange,
  className,
  placeholder = 'Search or add a category',
}: CategoryInputProps) => {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState('');
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const { data: optionsData, isFetching } = useGetContestCreationOptionsQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const selected = useMemo(() => value ?? [], [value]);
  const isFull = selected.length >= MAX_CONTEST_CATEGORIES;
  const known = useMemo(
    () => dedupeCategories((optionsData?.data?.categories ?? []).map((category) => category.name)),
    [optionsData],
  );

  // Existing spelling for a typed category (case-insensitive), else as typed.
  const canonical = (name: string) =>
    known.find((item) => item.toLowerCase() === name.trim().toLowerCase()) ?? name.trim();

  const options = useMemo<Option[]>(() => {
    const selectedKeys = new Set(selected.map((category) => category.toLowerCase()));
    const query = draft.trim().toLowerCase();
    const available = known.filter((name) => !selectedKeys.has(name.toLowerCase()));
    const matches = query
      ? available
          .filter((name) => name.toLowerCase().includes(query))
          // Names starting with the query first, then the rest.
          .sort(
            (a, b) =>
              Number(!a.toLowerCase().startsWith(query)) -
              Number(!b.toLowerCase().startsWith(query)),
          )
      : available;
    const result: Option[] = matches
      .slice(0, MAX_VISIBLE_OPTIONS)
      .map((name) => ({ kind: 'existing', name }));
    const isKnown = known.some((name) => name.toLowerCase() === query);
    const isSelected = selectedKeys.has(query);
    if (query && !isKnown && !isSelected) {
      result.push({ kind: 'new', name: draft.trim() });
    }
    return result;
  }, [draft, known, selected]);

  const add = (raw: string) => {
    const next = dedupeCategories([...selected, ...raw.split(',').map(canonical)]).slice(
      0,
      MAX_CONTEST_CATEGORIES,
    );
    if (next.length !== selected.length) onChange(next);
    setDraft('');
    setHighlighted(0);
  };

  const remove = (category: string) => {
    onChange(selected.filter((item) => item !== category));
  };

  const showList = open && !isFull && (options.length > 0 || (isFetching && !known.length));
  const activeIndex = Math.min(highlighted, Math.max(options.length - 1, 0));

  return (
    <div className={cn('relative', className)}>
      <div
        className="border-input bg-surface focus-within:border-primary flex min-h-9 cursor-text flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5 transition-colors"
        onClick={() => inputRef.current?.focus()}
      >
        {selected.map((category) => (
          <span
            key={category}
            className="bg-primary-soft text-primary inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-medium"
          >
            {category}
            <button
              type="button"
              aria-label={`Remove ${category}`}
              onClick={(event) => {
                event.stopPropagation();
                remove(category);
              }}
              className="hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={showList ? `${listboxId}-${activeIndex}` : undefined}
          value={draft}
          disabled={isFull}
          onChange={(event) => {
            setDraft(event.target.value);
            setHighlighted(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            if (draft.trim()) add(draft);
            setOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setOpen(true);
              if (!options.length) return;
              const step = event.key === 'ArrowDown' ? 1 : -1;
              setHighlighted((activeIndex + step + options.length) % options.length);
            } else if (event.key === 'Enter') {
              // Never submit the surrounding form from this field.
              event.preventDefault();
              if (showList && options[activeIndex]) add(options[activeIndex].name);
              else if (draft.trim()) add(draft);
            } else if (event.key === ',') {
              event.preventDefault();
              if (draft.trim()) add(draft);
            } else if (event.key === 'Escape' && open) {
              event.preventDefault();
              setOpen(false);
            } else if (event.key === 'Backspace' && !draft && selected.length) {
              remove(selected[selected.length - 1]);
            }
          }}
          placeholder={
            isFull ? `Up to ${MAX_CONTEST_CATEGORIES} categories` : selected.length ? '' : placeholder
          }
          className="text-foreground placeholder:text-muted-foreground min-w-32 flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed"
        />
      </div>

      {showList && (
        <ul
          id={listboxId}
          role="listbox"
          className="border-border-subtle bg-surface absolute inset-x-0 top-[calc(100%+4px)] z-50 max-h-60 overflow-y-auto rounded-md border p-1 shadow-lg"
        >
          {options.length === 0 && (
            <li className="text-muted-foreground px-2 py-1.5 text-xs">Loading categories...</li>
          )}
          {options.map((option, index) => (
            <li
              key={`${option.kind}-${option.name}`}
              id={`${listboxId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              // mousedown (not click) so the input does not blur first.
              onMouseDown={(event) => {
                event.preventDefault();
                add(option.name);
              }}
              onMouseEnter={() => setHighlighted(index)}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
                index === activeIndex ? 'bg-accent text-foreground' : 'text-body',
              )}
            >
              {option.kind === 'new' ? (
                <>
                  <Plus className="text-primary size-3.5 shrink-0" />
                  <span className="truncate">
                    Add <span className="font-semibold">&ldquo;{option.name}&rdquo;</span> as a new
                    category
                  </span>
                </>
              ) : (
                <>
                  <Tag className="text-muted-foreground size-3.5 shrink-0" />
                  <span className="truncate">{option.name}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryInput;
