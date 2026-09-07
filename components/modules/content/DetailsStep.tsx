'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import { useGetBannerCandidatesQuery } from '@/store/features/contest/contestApi';
import { Check, ChevronDown, ImageOff, Search } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import ContestRichTextEditor from './ContestRichTextEditor';

const BannerPickerDialog = ({
  open,
  onOpenChange,
  onSelect,
  selectedPhotoId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (photo: { id: string; url: string }) => void;
  selectedPhotoId?: string;
}) => {
  const [search, setSearch] = useState('');
  const { data, isLoading, isFetching } = useGetBannerCandidatesQuery(
    { search: search.trim() || undefined, limit: 32 },
    { skip: !open },
  );
  const photos = data?.data.photos ?? [];
  const isBusy = isLoading || isFetching;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-border-subtle shrink-0 border-b px-5 py-4">
          <DialogTitle>Choose from submissions</DialogTitle>
          <p className="text-muted-foreground text-xs">
            Pick a photo already submitted by a photographer to use as this contest&apos;s banner.
            They&apos;ll be credited on the contest card.
          </p>
        </DialogHeader>

        <div className="border-border-subtle shrink-0 border-b px-5 py-3">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              className={`${inputClass} h-9 pl-9`}
              placeholder="Search by title or photographer"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-4">
          {isBusy ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-surface-secondary aspect-square animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : photos.length ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {photos.map((photo) => {
                const isSelected = photo.id === selectedPhotoId;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => {
                      onSelect(photo);
                      onOpenChange(false);
                    }}
                    className={cn(
                      'group overflow-hidden rounded-lg border text-left transition-colors',
                      isSelected
                        ? 'border-primary ring-primary/30 ring-2'
                        : 'border-border-strong hover:border-primary/50',
                    )}
                  >
                    <div className="bg-surface-secondary relative aspect-square w-full overflow-hidden">
                      <Image
                        src={photo.url}
                        alt={photo.title || 'Submitted photo'}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 33vw, 200px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      {isSelected && (
                        <span className="bg-primary text-primary-foreground absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full shadow">
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    {photo.user?.fullName && (
                      <div className="flex min-w-0 items-center gap-1.5 px-2 py-1.5">
                        {photo.user.avatar ? (
                          <Image
                            src={photo.user.avatar}
                            alt={photo.user.fullName}
                            width={16}
                            height={16}
                            unoptimized
                            className="size-4 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <span className="bg-primary/15 text-primary flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold">
                            {photo.user.fullName.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                        <p className="truncate text-[11px] font-medium">{photo.user.fullName}</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <ImageOff className="text-muted-foreground size-8" />
              <p className="text-sm font-medium">No submitted photos found</p>
              <p className="text-muted-foreground text-xs">Try a different search term.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
  const bannerUserPhotoId = form.watch('details.bannerUserPhotoId');
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const preview = useMemo(() => {
    if (banner instanceof File) return URL.createObjectURL(banner);
    return typeof banner === 'string' && banner ? banner : null;
  }, [banner]);

  return (
    <section
      className="border-border-subtle bg-surface-secondary overflow-hidden rounded-lg border"
      aria-labelledby="contest-details-title"
    >
      <header className="border-border-subtle flex min-h-13 items-center border-b bg-(--bg-inset) px-4.5 py-3">
        <h2 id="contest-details-title" className="text-heading text-sm font-extrabold">
          Details
        </h2>
      </header>

      <div className="grid gap-3.5 p-4.5">
        <div className="grid items-start gap-3.5 sm:grid-cols-2">
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
                <FormLabel className={labelClass}>Category (optional)</FormLabel>
                <FormControl>
                  <Input
                    className={inputClass}
                    placeholder="e.g. Street photography"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage className={messageClass} />
              </FormItem>
            )}
          />
        </div>

        <div className="grid items-start gap-3.5 sm:grid-cols-2">
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
                  if (file) {
                    field.onChange(file);
                    form.setValue('details.bannerUserPhotoId', undefined);
                  }
                }}
              />
              <FormControl>
                <div className="border-border-strong bg-surface-secondary relative grid min-h-42.5 place-items-center overflow-hidden rounded-[10px] border border-dashed">
                  {preview ? (
                    <>
                      <div className="relative h-52.5 w-full">
                        <Image
                          src={preview}
                          alt="Contest banner preview"
                          fill
                          unoptimized
                          sizes="(max-width: 880px) 100vw, 880px"
                          className="object-cover"
                        />
                      </div>
                      {bannerUserPhotoId && (
                        <span className="bg-background/75 text-foreground absolute top-2.5 left-2.5 rounded-md border border-white/35 px-2 py-1 text-[10px] font-bold backdrop-blur-lg">
                          From submission
                        </span>
                      )}
                      <div className="absolute right-2.5 bottom-2.5 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setPickerOpen(true)}
                          className="bg-background/75 text-foreground inline-flex items-center justify-center rounded-lg border border-white/35 px-3 py-2.25 text-[10px] font-bold backdrop-blur-lg"
                        >
                          Choose from submissions
                        </button>
                        <button
                          type="button"
                          onClick={() => bannerInputRef.current?.click()}
                          className="bg-background/75 text-foreground inline-flex items-center justify-center rounded-lg border border-white/35 px-3 py-2.25 text-[10px] font-bold backdrop-blur-lg"
                        >
                          Change image
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <label
                        htmlFor="contest-banner-upload"
                        className="border-input bg-surface text-body hover:border-primary hover:text-foreground inline-flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.25 text-[10px] font-bold transition-colors"
                      >
                        Upload a banner image
                      </label>
                      <button
                        type="button"
                        onClick={() => setPickerOpen(true)}
                        className="border-input bg-surface text-body hover:border-primary hover:text-foreground inline-flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.25 text-[10px] font-bold transition-colors"
                      >
                        Choose from submissions
                      </button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage className={messageClass} />

              <BannerPickerDialog
                open={pickerOpen}
                onOpenChange={setPickerOpen}
                selectedPhotoId={bannerUserPhotoId}
                onSelect={(photo) => {
                  field.onChange(photo.url);
                  form.setValue('details.bannerUserPhotoId', photo.id);
                }}
              />
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
            <FormItem className="flex flex-row items-center gap-2.25 space-y-0">
              <FormLabel className="text-body order-1 mt-0! text-[11px] font-medium">
                Make this a recurring contest
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primary order-2 h-5! w-8.5!"
                />
              </FormControl>
              <FormMessage className={messageClass} />
            </FormItem>
          )}
        />

        {recurring && (
          <div className="grid gap-3.5 rounded-lg border border-dashed border-border-strong p-3.5">
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

            <div className="grid items-start gap-3.5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="details.recurringTimezone"
                render={({ field }) => (
                  <FormItem className={fieldClass}>
                    <FormLabel className={labelClass}>Timezone</FormLabel>
                    <FormControl>
                      <Input className={inputClass} placeholder="e.g. UTC" {...field} />
                    </FormControl>
                    <FormMessage className={messageClass} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="details.recurringMaxOccurrences"
                render={({ field }) => (
                  <FormItem className={fieldClass}>
                    <FormLabel className={labelClass}>Max occurrences (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        className={inputClass}
                        placeholder="Unlimited"
                        value={field.value ?? ''}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === '' ? undefined : Number(event.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage className={messageClass} />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="details.recurringEndsAt"
              render={({ field }) => (
                <FormItem className={fieldClass}>
                  <FormLabel className={labelClass}>Recurrence ends at (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className={`${inputClass} scheme-dark`}
                      value={toDateTimeInputValue(field.value)}
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value ? new Date(event.target.value) : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage className={messageClass} />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default DetailsStep;
