'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import ContestRichTextEditor from './ContestRichTextEditor';

const inputClass =
  'h-8 rounded-md border-input bg-surface px-2.5 text-[13px] leading-[1.4] shadow-none';
const selectClass = `${inputClass} scheme-dark w-full appearance-none pr-9 text-foreground outline-none`;
const fieldClass = 'gap-1.5';
const labelClass = 'text-xs font-medium text-label-foreground data-[error=true]:text-destructive';
const messageClass = 'text-[11px] leading-tight';

function toDateTimeInputValue(value?: Date) {
  if (!value || Number.isNaN(value.getTime())) return '';
  const localDate = new Date(value.getTime() - value.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

const DetailsStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const recurring = form.watch('details.recurring');
  const banner = form.watch('details.banner') as File | string | undefined;
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const preview = useMemo(() => {
    if (banner instanceof File) return URL.createObjectURL(banner);
    return typeof banner === 'string' && banner ? banner : null;
  }, [banner]);

  return (
    <section
      className="border-border-subtle bg-surface-secondary overflow-hidden rounded-lg border"
      aria-labelledby="contest-details-title"
    >
      <header className="border-border-subtle flex min-h-13 items-center border-b bg-[var(--bg-inset)] px-[18px] py-3">
        <h2 id="contest-details-title" className="text-heading text-sm font-extrabold">
          Details
        </h2>
      </header>

      <div className="grid gap-[14px] p-[18px]">
        <div className="grid gap-[14px] sm:grid-cols-2">
          <FormField
            control={form.control}
            name="details.title"
            render={({ field }) => (
              <FormItem className={fieldClass}>
                <FormLabel className={labelClass}>Contest title</FormLabel>
                <FormControl>
                  <Input className={inputClass} placeholder="Contest title" {...field} />
                </FormControl>
                <FormMessage className={messageClass} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details.category"
            render={({ field }) => (
              <FormItem className={fieldClass}>
                <FormLabel className={labelClass}>Category</FormLabel>
                <FormControl>
                  <Input className={inputClass} placeholder="e.g. Street photography" {...field} />
                </FormControl>
                <FormMessage className={messageClass} />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-[14px] sm:grid-cols-2">
          <FormField
            control={form.control}
            name="details.startDate"
            render={({ field }) => (
              <FormItem className={fieldClass}>
                <FormLabel className={labelClass}>Start date &amp; time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    className={`${inputClass} scheme-dark`}
                    value={toDateTimeInputValue(field.value)}
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(new Date(event.target.value))}
                  />
                </FormControl>
                <FormMessage className={messageClass} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details.endDate"
            render={({ field }) => (
              <FormItem className={fieldClass}>
                <FormLabel className={labelClass}>End date &amp; time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    className={`${inputClass} scheme-dark`}
                    value={toDateTimeInputValue(field.value)}
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(new Date(event.target.value))}
                  />
                </FormControl>
                <FormMessage className={messageClass} />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="details.banner"
          render={({ field }) => (
            <FormItem className={fieldClass}>
              <FormLabel className={labelClass}>Banner image</FormLabel>
              <input
                ref={bannerInputRef}
                id="contest-banner-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) field.onChange(file);
                }}
              />
              <FormControl>
                <div className="border-border-strong bg-surface-secondary relative grid min-h-[170px] place-items-center overflow-hidden rounded-[10px] border border-dashed">
                  {preview ? (
                    <>
                      <div className="relative h-[210px] w-full">
                        <Image
                          src={preview}
                          alt="Contest banner preview"
                          fill
                          unoptimized
                          sizes="(max-width: 880px) 100vw, 880px"
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => bannerInputRef.current?.click()}
                        className="bg-background/75 text-foreground absolute right-[10px] bottom-[10px] inline-flex items-center justify-center rounded-lg border border-white/35 px-3 py-[9px] text-[10px] font-bold backdrop-blur-lg"
                      >
                        Change image
                      </button>
                    </>
                  ) : (
                    <label
                      htmlFor="contest-banner-upload"
                      className="border-input bg-surface text-body hover:border-primary hover:text-foreground inline-flex cursor-pointer items-center justify-center rounded-lg border px-3 py-[9px] text-[10px] font-bold transition-colors"
                    >
                      Upload a banner image
                    </label>
                  )}
                </div>
              </FormControl>
              <FormMessage className={messageClass} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details.description"
          render={({ field }) => (
            <FormItem className={fieldClass}>
              <FormLabel className={labelClass}>Description</FormLabel>
              <FormControl>
                <ContestRichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Write something..."
                />
              </FormControl>
              <FormMessage className={messageClass} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details.recurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-[9px] space-y-0">
              <FormLabel className="text-body order-1 mt-0! text-[11px] font-medium">
                Make this a recurring contest
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primary order-2 h-5! w-[34px]!"
                />
              </FormControl>
              <FormMessage className={messageClass} />
            </FormItem>
          )}
        />

        {recurring && (
          <FormField
            control={form.control}
            name="details.recurringType"
            render={({ field }) => (
              <FormItem className={fieldClass}>
                <FormLabel className={labelClass}>Recurring frequency</FormLabel>
                <FormControl>
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={field.value ?? 'DAILY'}
                      onChange={field.onChange}
                    >
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                    </select>
                    <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                  </div>
                </FormControl>
                <FormMessage className={messageClass} />
              </FormItem>
            )}
          />
        )}
      </div>
    </section>
  );
};

export default DetailsStep;
