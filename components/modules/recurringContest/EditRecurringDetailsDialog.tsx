'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { BannerPickerDialog } from '@/components/modules/content/DetailsStep';
import CategoryInput from '@/components/modules/content/CategoryInput';
import ContestRichTextEditor from '@/components/modules/content/ContestRichTextEditor';
import { WEB_IMAGE_ACCEPT } from '@/lib/constants/uploads';
import { buildUpdateRecurringContestFormData, getApiErrorMessage } from '@/lib/recurringContest';
import { recurringDetailsSchema, type RecurringDetailsValues } from '@/lib/schemas/recurringContestSchema';
import { dateToZonedInput, zonedInputToDate } from '@/lib/timezone';
import { useUpdateRecurringContestMutation } from '@/store/features/recurringContest/recurringContestApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type EditRecurringDetailsDialogProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: RecurringDetailsValues;
  timezone: string;
};

const EditRecurringDetailsDialog = ({
  id,
  open,
  onOpenChange,
  initialValues,
  timezone,
}: EditRecurringDetailsDialogProps) => {
  const [updateRecurringContest, { isLoading }] = useUpdateRecurringContestMutation();
  const form = useForm<RecurringDetailsValues>({
    resolver: zodResolver(recurringDetailsSchema) as Resolver<RecurringDetailsValues>,
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (open) form.reset(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isMoneyContest = form.watch('isMoneyContest');
  const banner = form.watch('banner');
  const bannerUserPhotoId = form.watch('bannerUserPhotoId');
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const bannerPreview = useMemo(() => {
    if (banner instanceof File) return URL.createObjectURL(banner);
    return typeof banner === 'string' && banner ? banner : null;
  }, [banner]);

  useEffect(() => {
    if (!bannerPreview?.startsWith('blob:')) return;
    return () => URL.revokeObjectURL(bannerPreview);
  }, [bannerPreview]);

  const onSubmit = async (values: RecurringDetailsValues) => {
    try {
      await updateRecurringContest({ id, body: buildUpdateRecurringContestFormData(values) }).unwrap();
      toast.success('Recurring contest details updated');
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-56px)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit recurring contest details</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <p className="text-muted-foreground -mt-1 text-xs">
              Changes apply to every contest generated from this template from now on. Contests
              that have already started or ended are not changed.
            </p>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <CategoryInput value={field.value ?? []} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="banner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner image</FormLabel>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept={WEB_IMAGE_ACCEPT}
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        field.onChange(file);
                        form.setValue('bannerUserPhotoId', undefined);
                      }
                      event.target.value = '';
                    }}
                  />
                  <FormControl>
                    <div className="border-border-strong bg-surface-secondary relative overflow-hidden rounded-[10px] border border-dashed">
                      <div className="relative h-40 w-full">
                        {bannerPreview ? (
                          <Image
                            src={bannerPreview}
                            alt="Recurring contest banner preview"
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 100vw, 576px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <ImageOff className="text-muted-foreground size-7" />
                          </div>
                        )}
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
                          className="bg-background/75 text-foreground inline-flex items-center justify-center rounded-lg border border-white/35 px-3 py-2 text-[10px] font-bold backdrop-blur-lg"
                        >
                          Choose from submissions
                        </button>
                        <button
                          type="button"
                          onClick={() => bannerInputRef.current?.click()}
                          className="bg-background/75 text-foreground inline-flex items-center justify-center rounded-lg border border-white/35 px-3 py-2 text-[10px] font-bold backdrop-blur-lg"
                        >
                          {bannerPreview ? 'Change image' : 'Upload image'}
                        </button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <BannerPickerDialog
                    open={pickerOpen}
                    onOpenChange={setPickerOpen}
                    selectedPhotoId={bannerUserPhotoId}
                    onSelect={(photo) => {
                      field.onChange(photo.url);
                      form.setValue('bannerUserPhotoId', photo.id, { shouldDirty: true });
                      setPickerOpen(false);
                    }}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <ContestRichTextEditor value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date &amp; time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="scheme-dark"
                        value={dateToZonedInput(field.value, timezone)}
                        onChange={(event) => field.onChange(zonedInputToDate(event.target.value, timezone))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End date &amp; time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="scheme-dark"
                        value={dateToZonedInput(field.value, timezone)}
                        onChange={(event) => field.onChange(zonedInputToDate(event.target.value, timezone))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="entryFeeCoins"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry fee (coins)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isMoneyContest"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2.5 space-y-0">
                  <FormLabel className="mt-0!">Money contest</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isMoneyContest && (
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="minPrize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min prize</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(event) => field.onChange(event.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxPrize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max prize</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(event) => field.onChange(event.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input placeholder="USD" maxLength={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="entryFeeAmount"
              render={({ field }) => (
                <FormItem className="max-w-[220px]">
                  <FormLabel>Entry fee (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      {...field}
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applyToUpcoming"
              render={({ field }) => (
                <FormItem className="border-border-subtle flex flex-row items-start justify-between gap-4 space-y-0 rounded-lg border p-3">
                  <div className="grid gap-1">
                    <FormLabel className="mt-0!">Also update the upcoming contest</FormLabel>
                    <p className="text-muted-foreground text-xs">
                      Applies the title, description, banner and categories to the occurrence that
                      is already scheduled but has not started. Dates, fees and prizes only apply to
                      contests generated after this one.
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  'Save changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecurringDetailsDialog;
