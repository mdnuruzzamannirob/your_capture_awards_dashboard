'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import { Check, ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import ContestRichTextEditor from './ContestRichTextEditor';

const inputClass =
  'h-8 rounded-md border-input bg-surface px-2.5 text-[13px] leading-[1.4] shadow-none';
const selectClass = `${inputClass} scheme-dark w-full appearance-none pr-9 text-foreground outline-none`;
const labelClass = 'text-xs font-medium text-label-foreground data-[error=true]:text-destructive';
const tierName: Record<string, string> = {
  AMATEUR: 'Amateur',
  TALENTED: 'Talented',
  SUPREME: 'Supreme',
  SUPERIOR: 'Superior',
  TOP_NOTCH: 'Top Notch',
};

const submissionOptions = [
  {
    id: 'non-relevant',
    label: 'Non-relevant images',
    value: 'Non-relevant images',
    matches: (item: string) => item.toLowerCase().includes('non-relevant'),
  },
  {
    id: 'similar-images',
    label:
      'Similar images — images with the same subject, background, foreground, and location must be distinct',
    value:
      'Similar images: Images with the same combination of subject, background, foreground and location are not allowed. Images must be distinct',
    matches: (item: string) => item.toLowerCase().includes('similar images'),
  },
  {
    id: 'duplicate-image',
    label: 'The same image multiple times, including crops, angle changes, or tone changes',
    value: 'Same image multiple times (cropped, angle change or tone changes)',
    matches: (item: string) => item.toLowerCase().includes('same image multiple'),
  },
  {
    id: 'ai-generated',
    label: 'AI-generated images',
    value: 'AI images',
    matches: (item: string) => item.toLowerCase().includes('ai'),
  },
] as const;

const fileFormatOptions = [
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/jpg', label: 'JPG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WEBP' },
  { value: 'image/heic', label: 'HEIC' },
  { value: 'image/tiff', label: 'TIFF' },
] as const;

function RuleEditor({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="border-border border-b p-[18px] last:border-b-0">
      <h3 className="text-heading mb-3 text-xs font-extrabold">{title}</h3>
      <div className="grid gap-[11px]">{children}</div>
    </article>
  );
}

function SystemTextField({
  name,
  label,
}: {
  name: 'rules.copyright.text' | 'rules.voting.text' | 'rules.participation.text';
  label: string;
}) {
  const form = useFormContext<ContestFinalValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1.5">
          <FormLabel className={labelClass}>{label}</FormLabel>
          <FormControl>
            <ContestRichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder={`Write ${label.toLowerCase()}...`}
            />
          </FormControl>
          <div className="flex items-start justify-between gap-3">
            <FormMessage className="text-[9px]" />
            <small className="text-caption-foreground ml-auto text-[8px]">
              {field.value.length}/800
            </small>
          </div>
        </FormItem>
      )}
    />
  );
}

const RulesStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const levels = form.watch('rules.levelRequirements');

  return (
    <section
      className="border-border-subtle bg-surface-secondary overflow-hidden rounded-lg border"
      aria-labelledby="contest-rules-title"
    >
      <header className="border-border-subtle flex min-h-13 items-center border-b bg-[var(--bg-inset)] px-[18px] py-3">
        <h2 id="contest-rules-title" className="text-heading text-sm font-extrabold">
          Rules
        </h2>
      </header>

      <RuleEditor title="Submission limit">
        <FormField
          control={form.control}
          name="details.maxUploads"
          render={({ field }) => (
            <FormItem className="gap-1.5">
              <FormLabel className={labelClass}>Maximum submissions</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  className={inputClass}
                  {...field}
                  onChange={(event) => field.onChange(event.target.value)}
                />
              </FormControl>
              <FormMessage className="text-[9px]" />
            </FormItem>
          )}
        />
      </RuleEditor>

      <RuleEditor title="Submission rules">
        <FormField
          control={form.control}
          name="rules.submissionRules.disallowed"
          render={({ field }) => (
            <FormItem className="gap-0">
              <FormLabel className={`${labelClass} mb-[7px]`}>Select rules</FormLabel>
              <div className="grid gap-0.5">
                {submissionOptions.map((option) => {
                  const checked = field.value.some(option.matches);
                  return (
                    <label
                      key={option.id}
                      className="text-body hover:bg-surface-tertiary flex min-h-[38px] cursor-pointer items-center gap-2 rounded-[7px] px-1 py-1.5 text-[10px] transition-colors"
                    >
                      <Checkbox
                        checked={checked}
                        className="size-[19px] rounded-md"
                        onCheckedChange={(nextChecked) => {
                          const withoutCurrent = field.value.filter(
                            (item) => !option.matches(item),
                          );
                          field.onChange(
                            nextChecked ? [...withoutCurrent, option.value] : withoutCurrent,
                          );
                          if (option.id === 'ai-generated') {
                            form.setValue('rules.submissionRules.allowAiImages', !nextChecked, {
                              shouldDirty: true,
                            });
                          }
                        }}
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
              <FormMessage className="mt-1 text-[9px]" />
            </FormItem>
          )}
        />
      </RuleEditor>

      <RuleEditor title="Level requirements">
        <div className="text-caption-foreground grid grid-cols-[minmax(0,1fr)_minmax(120px,0.72fr)] gap-2.5 pb-1 text-xs font-bold">
          <span>Level</span>
          <span>Votes</span>
        </div>
        <div className="grid gap-[3px]">
          {levels.map((item, index) => (
            <div
              key={item.level}
              className="grid min-h-[43px] grid-cols-[minmax(0,1fr)_minmax(120px,0.72fr)] items-center gap-2.5 py-[3px]"
            >
              <span className="text-body text-sm font-semibold">
                {tierName[item.level] ?? item.level}
              </span>
              <FormField
                control={form.control}
                name={`rules.levelRequirements.${index}.votes`}
                render={({ field }) => (
                  <FormItem className="gap-1">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          min={0}
                          aria-label={`Required votes for ${tierName[item.level] ?? item.level}`}
                          className={`${inputClass} pr-[43px]`}
                          {...field}
                          onChange={(event) => field.onChange(event.target.value)}
                        />
                        <span className="text-caption-foreground pointer-events-none absolute top-1/2 right-[10px] -translate-y-1/2 text-[8px] font-bold">
                          votes
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[9px]" />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      </RuleEditor>

      <RuleEditor title="Submission format">
        <FormField
          control={form.control}
          name="rules.submissionFormat.mimeTypes"
          render={({ field }) => (
            <FormItem className="gap-[7px]">
              <FormLabel className={labelClass}>Accepted file formats</FormLabel>
              <div className="flex flex-wrap gap-1.5">
                {fileFormatOptions.map((format) => {
                  const checked = field.value.includes(format.value);
                  return (
                    <label key={format.value} className="cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        className="sr-only"
                        onChange={() =>
                          field.onChange(
                            checked
                              ? field.value.filter((item) => item !== format.value)
                              : [...field.value, format.value],
                          )
                        }
                      />
                      <span
                        className={`inline-flex h-8 min-w-[61px] items-center justify-center gap-1 rounded-lg border px-2 text-[9px] font-extrabold transition-colors ${
                          checked
                            ? 'border-primary/60 bg-primary-soft text-primary-soft-foreground'
                            : 'border-input bg-surface-secondary text-muted-foreground'
                        }`}
                      >
                        {checked && <Check size={12} />}
                        {format.label}
                      </span>
                    </label>
                  );
                })}
              </div>
              <FormMessage className="text-[9px]" />
            </FormItem>
          )}
        />

        <div className="grid gap-[7px]">
          <div className="flex items-center justify-between pb-[7px]">
            <span className={labelClass}>Minimum resolution</span>
            <small className="text-caption-foreground text-[8px]">Pixels</small>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_15px_minmax(0,1fr)] items-end gap-[7px]">
            {(
              [
                ['minWidth', 'Width'],
                ['minHeight', 'Height'],
              ] as const
            ).map(([key, label], index) => (
              <div className="contents" key={key}>
                {index === 1 && (
                  <b className="text-caption-foreground pb-[11px] text-center text-xs font-medium">
                    ×
                  </b>
                )}
                <FormField
                  control={form.control}
                  name={`rules.submissionFormat.${key}`}
                  render={({ field }) => (
                    <FormItem className="gap-1.5">
                      <FormLabel className={labelClass}>{label}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            min={1}
                            className={`${inputClass} pr-12`}
                            {...field}
                            onChange={(event) => field.onChange(event.target.value)}
                          />
                          <i className="text-caption-foreground pointer-events-none absolute top-1/2 right-[10px] -translate-y-1/2 text-[8px] font-bold not-italic">
                            px
                          </i>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[9px]" />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="rules.submissionFormat.maxSizeMB"
          render={({ field }) => (
            <FormItem className="gap-1.5">
              <FormLabel className={labelClass}>Maximum image size</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    min={1}
                    className={`${inputClass} pr-12`}
                    {...field}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                  <i className="text-caption-foreground pointer-events-none absolute top-1/2 right-[10px] -translate-y-1/2 text-[8px] font-bold not-italic">
                    MB
                  </i>
                </div>
              </FormControl>
              <FormMessage className="text-[9px]" />
            </FormItem>
          )}
        />
      </RuleEditor>

      <RuleEditor title="Eligibility">
        <FormField
          control={form.control}
          name="rules.eligibility.minAge"
          render={({ field }) => (
            <FormItem className="gap-1.5">
              <FormLabel className={labelClass}>Minimum participant age</FormLabel>
              <FormControl>
                <div className="relative">
                  <select
                    className={selectClass}
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                  >
                    {Array.from({ length: 201 }, (_, age) => (
                      <option value={age} key={age}>
                        {age} {age === 1 ? 'year' : 'years'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </div>
              </FormControl>
              <FormMessage className="text-[9px]" />
            </FormItem>
          )}
        />
      </RuleEditor>

      <RuleEditor title="Copyright">
        <SystemTextField name="rules.copyright.text" label="Copyright text" />
      </RuleEditor>

      <RuleEditor title="Voting">
        <SystemTextField name="rules.voting.text" label="Voting text" />
      </RuleEditor>

      <RuleEditor title="Participation">
        <SystemTextField name="rules.participation.text" label="Participation text" />
      </RuleEditor>
    </section>
  );
};

export default RulesStep;

