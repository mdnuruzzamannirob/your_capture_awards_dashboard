'use client';

import { useCallback, useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { FileText, ImagePlus, Trash2, Upload } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DateTimePicker } from '@/components/common/date-time-picker';
import { TipTapEditor } from '@/components/common/tiptap-editor/TipTapEditor';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { RECURRING_TYPES } from '@/lib/constants';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';

/** Truncate a long filename to max `maxLen` chars with ellipsis in the middle */
function truncateFilename(name: string, maxLen = 36): string {
  if (name.length <= maxLen) return name;
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : '';
  const base = name.slice(0, name.lastIndexOf('.') === -1 ? name.length : name.lastIndexOf('.'));
  const keep = maxLen - ext.length - 3;
  return base.slice(0, Math.ceil(keep / 2)) + '…' + base.slice(-Math.floor(keep / 2)) + ext;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

const DetailsStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const watchRecurring = form.watch('details.recurring');
  const bannerFile = form.watch('details.banner') as File | string | undefined;
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = useMemo(() => {
    if (!bannerFile) return null;
    if (bannerFile instanceof File) return URL.createObjectURL(bannerFile);
    if (typeof bannerFile === 'string' && bannerFile.length > 0) return bannerFile;
    return null;
  }, [bannerFile]);

  const fileInfo = useMemo(() => {
    if (bannerFile instanceof File) {
      return { name: truncateFilename(bannerFile.name), size: formatBytes(bannerFile.size) };
    }
    if (typeof bannerFile === 'string' && bannerFile.length > 0) {
      const parts = bannerFile.split('/');
      return { name: truncateFilename(decodeURIComponent(parts[parts.length - 1])), size: null };
    }
    return null;
  }, [bannerFile]);

  const handleClearBanner = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.setValue('details.banner', undefined as unknown as File, { shouldDirty: true });
      if (inputRef.current) inputRef.current.value = '';
    },
    [form],
  );

  return (
    <div className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="flex items-center gap-2 border-b border-gray-800 pb-4 text-lg font-semibold">
        <FileText className="size-5 text-emerald-500" /> Details
      </h2>

      <div className="grid grid-cols-1 items-start gap-4 space-y-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="details.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contest Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Neon Nights 2025" {...field} />
              </FormControl>
              <div className="min-h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details.maxUploads"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max uploads per participant</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={4}
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                  }
                />
              </FormControl>
              <div className="min-h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="col-span-full grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="details.startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start date</FormLabel>
                <FormControl>
                  <DateTimePicker date={field.value} setDate={field.onChange} label="Start date" />
                </FormControl>
                <div className="min-h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details.endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End date</FormLabel>
                <FormControl>
                  <DateTimePicker date={field.value} setDate={field.onChange} label="End date" />
                </FormControl>
                <div className="min-h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="details.recurring"
          render={({ field }) => (
            <FormItem className="col-span-1 flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="mt-0!">Make this a recurring contest</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchRecurring && (
          <FormField
            control={form.control}
            name="details.recurringType"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Recurring frequency</FormLabel>
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-11! w-full">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RECURRING_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="min-h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        )}

        {/* ── Modern Banner Upload ── */}
        <FormField
          control={form.control}
          name="details.banner"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Banner Image</FormLabel>
              <input
                ref={inputRef}
                id="banner-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) field.onChange(file);
                }}
              />

              <FormControl>
                <div className="relative overflow-hidden rounded-xl border border-gray-700 bg-gray-950">
                  {/* Full preview */}
                  {preview ? (
                    <div className="relative h-56 w-full">
                      <Image
                        src={preview}
                        alt="Banner preview"
                        fill
                        className="object-cover"
                        sizes="100vw"
                      />
                      {/* Dark gradient overlay at bottom */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

                      {/* File info bar */}
                      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 px-4 py-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <Upload className="size-4 shrink-0 text-emerald-400" />
                          <span className="truncate text-sm font-medium text-white">
                            {fileInfo?.name}
                          </span>
                          {fileInfo?.size && (
                            <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-300">
                              {fileInfo.size}
                            </span>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-white/20"
                          >
                            <ImagePlus className="size-3.5" />
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={handleClearBanner}
                            className="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-300 backdrop-blur transition hover:bg-red-500/40"
                          >
                            <Trash2 className="size-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Empty upload area */
                    <label
                      htmlFor="banner-upload"
                      className={cn(
                        'flex h-48 cursor-pointer flex-col items-center justify-center gap-3 transition',
                        'hover:bg-gray-800/50',
                      )}
                    >
                      <div className="flex size-14 items-center justify-center rounded-full border border-dashed border-gray-600 bg-gray-800">
                        <ImagePlus className="size-6 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-200">
                          Click to upload banner image
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG, WEBP &mdash; max 24&nbsp;MB
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </FormControl>
              <div className="min-h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details.description"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <TipTapEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <div className="min-h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default DetailsStep;
