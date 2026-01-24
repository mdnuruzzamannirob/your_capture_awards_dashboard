'use client';

import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { FileText } from 'lucide-react';
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

const DetailsStep = () => {
  const form = useFormContext<ContestFinalValues>();
  const watchRecurring = form.watch('details.recurring');
  const bannerFile = form.watch('details.banner') as File | undefined;

  const preview = useMemo(
    () => (bannerFile ? URL.createObjectURL(bannerFile) : null),
    [bannerFile],
  );

  return (
    <div className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="flex items-center gap-2 border-b border-gray-800 pb-4 text-lg font-semibold">
        <FileText className="size-5 text-emerald-500" /> Details
      </h2>

      <div className="grid grid-cols-1 gap-4 space-y-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="details.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contest Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Neon Nights 2025" {...field} />
              </FormControl>
              <FormMessage />
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
              <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="details.banner"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Banner Image</FormLabel>
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => field.onChange(e.target.files?.[0])}
              />
              <FormControl>
                <label
                  htmlFor="banner-upload"
                  className={cn(
                    'relative flex h-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition',
                    preview
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-700 hover:border-gray-500',
                  )}
                >
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Banner preview"
                      fill
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <p className="text-sm font-medium">Click to upload banner</p>
                      <p className="text-xs">PNG / JPG / WEBP (max 5MB)</p>
                    </div>
                  )}
                </label>
              </FormControl>
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default DetailsStep;
