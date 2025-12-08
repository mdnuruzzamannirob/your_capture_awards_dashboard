'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';
import { ContestValues, contestSchema } from '@/lib/schemas/contestSchema';
import {
  Trophy,
  Scale,
  Trash2,
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { DateTimePicker } from '@/components/common/date-time-picker';
import { format } from 'date-fns';
import { TipTapEditor } from '@/components/common/tiptap-editor/TipTapEditor';
import { cn } from '@/lib/utils';
import {
  CREATE_CONTEST_PRIZE_TYPES,
  CREATE_CONTEST_RULE_ICONS,
  CREATE_CONTEST_STEPS,
  RECURRING_TYPES,
} from '@/lib/constants';
import Image from 'next/image';
import DynamicIcon from '@/components/common/DynamicIcon';
import { useCreateContestMutation } from '@/store/features/contest/contestApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const CreateContest: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [createContest, { isLoading }] = useCreateContestMutation();
  const form = useForm<ContestValues>({
    resolver: zodResolver(contestSchema) as Resolver<ContestValues>,
    defaultValues: {
      title: '',
      description: '',
      banner: undefined,
      maxUploads: 4,
      minPrize: 0,
      maxPrize: 0,
      isMoneyContest: false,
      recurring: false,
      recurringType: 'DAILY',
      mode: 'SOLO',
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      rules: [{ name: '', icon: 'info', description: '' }],
      prizes: [
        {
          category: 'TOP_PHOTOGRAPHER',
          icon: 'User',
          key: 0,
          boost: 0,
          swap: 0,
        },
      ],
    },
    mode: 'onChange',
  });

  const { watch, setValue, getValues, control, formState, trigger } = form;
  const watchRecurring = watch('recurring');
  const watchIsMoney = watch('isMoneyContest');

  useEffect(() => {
    if (!watchRecurring) {
      setValue('recurringType', undefined as unknown as ContestValues['recurringType']);
      void trigger('recurringType');
    } else {
      const val = getValues('recurringType');
      if (!val) setValue('recurringType', 'DAILY' as any);
    }
  }, [watchRecurring]);

  useEffect(() => {
    if (!watchIsMoney) {
      setValue('minPrize', 0);
      setValue('maxPrize', 0);
      void trigger(['minPrize', 'maxPrize']);
    }
  }, [watchIsMoney]);

  const {
    fields: ruleFields,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({
    control,
    name: 'rules',
  });

  const {
    fields: prizeFields,
    append: appendPrize,
    remove: removePrize,
  } = useFieldArray({
    control,
    name: 'prizes',
  });

  // Navigate with validation when moving forward
  const goToStep = async (targetIndex: number) => {
    if (targetIndex === currentStep) return;
    if (targetIndex < currentStep) {
      setCurrentStep(targetIndex);
      window.scrollTo(0, 0);
      return;
    }

    // moving forward: validate current step fields first
    const fieldsToValidate = CREATE_CONTEST_STEPS[currentStep].fields as readonly string[];

    if (currentStep === 1 && getValues('rules').length === 0) {
      form.setError('rules', { type: 'manual', message: 'Please add at least one rule.' });
      return;
    }
    if (currentStep === 2 && getValues('prizes').length === 0) {
      form.setError('prizes', { type: 'manual', message: 'Please add at least one prize.' });
      return;
    }

    const ok = await form.trigger(fieldsToValidate as any);
    if (ok) {
      setCurrentStep(targetIndex);
      window.scrollTo(0, 0);
    }
  };

  const handleNext = async () => {
    await goToStep(Math.min(currentStep + 1, CREATE_CONTEST_STEPS.length - 1));
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSubmit = async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      window.scrollTo(0, 0);
      return;
    }

    // Raw values from form
    const raw = getValues();

    // Validate with Zod
    const data = contestSchema.parse(raw);

    // Create FormData
    const formData = new FormData();

    // Loop through keys of data and append to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // If value is an array, append each item
        value.forEach((v) => formData.append(`${key}[]`, v as any));
      } else if (value instanceof File) {
        // If value is a file, append directly
        formData.append(key, value);
      } else if (typeof value === 'object' && value !== null) {
        // Nested object -> convert to JSON string
        formData.append(key, JSON.stringify(value));
      } else {
        // Primitive value
        formData.append(key, value as any);
      }
    });

    try {
      await createContest(formData).unwrap();
      toast.success('New Contest Created');
      router.push('/contest');
    } catch (err: any) {
      toast.error(err?.message || err?.data?.message || 'Something went wrong!');
    }
  };

  const stepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5">
            <h1 className="flex items-center gap-2 border-b pb-5 text-lg font-semibold">
              <span className="border-muted flex size-10 min-w-10 items-center justify-center rounded-full border-2 bg-gray-700">
                <FileText className="size-5" />
              </span>{' '}
              Details
            </h1>

            <div className="grid items-start gap-5 rounded-xl border bg-gray-900 p-5 md:grid-cols-2">
              <h1 className="col-span-full text-lg font-semibold">Contest Introduction</h1>

              {/* Title */}
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Neon Nights 2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Uploads */}
              <FormField
                control={control}
                name="maxUploads"
                render={({ field }) => (
                  <FormItem className="md:col-span-1">
                    <FormLabel className="text-gray-400">Max Uploads</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
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
              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => {
                  const file = field.value as File | undefined;
                  const preview = file ? URL?.createObjectURL(file) : null;

                  return (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-gray-400">Banner</FormLabel>

                      {/* Hidden input */}
                      <input
                        type="file"
                        accept="image/*"
                        id="banner-upload"
                        className="hidden"
                        onChange={(e) => {
                          const selected = e.target.files?.[0];
                          field.onChange(selected);
                        }}
                      />

                      {/* Custom UI */}
                      <FormControl>
                        <label
                          htmlFor="banner-upload"
                          className={cn(
                            'flex h-60 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition',
                            preview
                              ? 'border-gray-700 hover:border-gray-500'
                              : 'border-gray-600 hover:border-gray-400',
                          )}
                        >
                          {preview ? (
                            <Image
                              src={preview}
                              alt="Banner preview"
                              width={2000}
                              height={300}
                              className="h-full w-full rounded-xl object-cover"
                            />
                          ) : (
                            <div className="text-center text-gray-400">
                              <p className="text-sm">Click to upload banner</p>
                              <p className="text-xs">PNG / JPG / WEBP (max 2MB)</p>
                            </div>
                          )}
                        </label>
                      </FormControl>

                      {/* Remove button */}
                      {preview && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-red-400"
                          onClick={() => field.onChange(undefined)}
                        >
                          Remove image
                        </Button>
                      )}

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-gray-400">Full Description</FormLabel>
                    <FormControl>
                      <TipTapEditor
                        value={field.value}
                        onChange={field.onChange}
                        minHeight="h-48"
                        placeholder="Describe the contest theme, rules, and inspiration in detail..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid items-start gap-5 rounded-xl border bg-gray-900 p-5 md:grid-cols-2">
              <h1 className="col-span-full text-lg font-semibold">Contest Payout</h1>

              <FormField
                control={control}
                name="isMoneyContest"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-gray-400">Money Prize?</FormLabel>
                    <FormControl>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <span className="text-sm text-gray-300">Has cash prize</span>
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="minPrize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Min Prize</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        disabled={!watchIsMoney}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="maxPrize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Max Prize</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        disabled={!watchIsMoney}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid items-start gap-5 rounded-xl border bg-gray-900 p-5 md:grid-cols-2">
              <h1 className="col-span-full text-lg font-semibold">Contest Schedule</h1>

              <FormField
                control={control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Start Date & Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                        label="Select Start Date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">End Date & Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                        label="Select End Date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="recurring"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Recurring Contest?</FormLabel>
                    <FormControl>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <span className="text-sm text-gray-300">
                          Repeat this contest periodically
                        </span>
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Recurring Type (conditional AND disabled when recurring false) */}
              <FormField
                control={control}
                name="recurringType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Recurring Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ''}
                        onValueChange={(v) => field.onChange(v as any)}
                        // the UI is disabled if recurring is false
                        // when disabled we also display the control so user sees it
                        // but they cannot change it
                        // This mirrors the isMoneyContest behavior that you used for prizes
                        // (we also clear the value in a useEffect when recurring=false)
                        disabled={!watchRecurring}
                      >
                        <SelectTrigger className="min-h-11 w-full ring-white/20 focus:ring-2">
                          <SelectValue placeholder="Select recurring frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {RECURRING_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Mode */}
            {/* <FormField
              control={control}
              name="mode"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-gray-400">Contest Mode</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={(v) => field.onChange(v as any)}>
                      <SelectTrigger className="min-h-11">
                        <SelectValue placeholder="Select Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOLO">Solo</SelectItem>
                        <SelectItem value="TEAM">Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
        );

      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5">
            <div className="flex items-center justify-between border-b pb-5">
              <h1 className="flex items-center gap-2 text-lg font-semibold">
                <span className="border-muted flex size-10 min-w-10 items-center justify-center rounded-full border-2 bg-gray-700">
                  <Scale className="size-5" />
                </span>{' '}
                Contest Rules <span className="text-primary">({ruleFields.length})</span>
              </h1>

              <Button
                type="button"
                onClick={() => appendRule({ name: '', icon: 'info', description: '' })}
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-700"
              >
                <Plus className="size-5" /> Add New Rule
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-10">
              {ruleFields.map((f, index) => (
                <div
                  key={f.id}
                  className="relative rounded-xl border bg-gray-900 p-5 transition-all duration-300"
                >
                  <div className="absolute top-5 right-5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRule(index)}
                      className="text-gray-500 hover:text-red-400"
                      disabled={ruleFields.length === 1}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-4">
                    {/* Icon Select */}
                    <FormField
                      control={control}
                      name={`rules.${index}.icon`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400">Rule Icon</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value || ''}
                              onValueChange={(value) => field.onChange(value)}
                            >
                              <SelectTrigger className="min-h-11 ring-white/20 focus:ring-2">
                                <SelectValue placeholder="Select Icon" />
                              </SelectTrigger>
                              <SelectContent align="start" className="max-h-60 overflow-y-auto">
                                {CREATE_CONTEST_RULE_ICONS.map((icon) => (
                                  <SelectItem key={icon.value} value={icon.icon}>
                                    <div className="flex items-center gap-3">
                                      <DynamicIcon
                                        name={icon.icon}
                                        className="text-primary size-4"
                                      />
                                      <span>{icon.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Title Input */}
                    <div className="col-span-4">
                      <FormField
                        control={control}
                        name={`rules.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-gray-400">Rule Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Originality Requirement"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Description */}
                    <div className="col-span-full">
                      <FormField
                        control={control}
                        name={`rules.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-400">Rule Description</FormLabel>
                            <FormControl>
                              <TipTapEditor
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Explain this rule in detail..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* array-level error */}
            {formState.errors.rules && (
              <div className="text-sm text-red-400">{(formState.errors.rules as any).message}</div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5">
            <div className="flex items-center justify-between border-b pb-5">
              <h1 className="flex items-center gap-2 text-lg font-semibold">
                <span className="border-muted flex size-10 min-w-10 items-center justify-center rounded-full border-2 bg-gray-700">
                  <Trophy className="size-5" />
                </span>{' '}
                Prizes <span className="text-primary">({prizeFields.length})</span>
              </h1>
              <Button
                type="button"
                onClick={() =>
                  appendPrize({
                    category: 'TOP_PHOTOGRAPHER',
                    icon: 'User',
                    boost: 0,
                    key: 0,
                    swap: 0,
                  })
                }
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-700"
              >
                <Plus className="size-5" /> Add Prize
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {prizeFields.map((f, index) => (
                <div
                  key={f.id}
                  className="relative rounded-xl border bg-gray-900 p-5 transition-all duration-300"
                >
                  <div className="absolute top-5 right-5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePrize(index)}
                      className="text-gray-500 hover:text-red-400"
                      disabled={prizeFields.length === 1}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-6">
                    <div className="md:col-span-full">
                      <FormField
                        control={control}
                        name={`prizes.${index}.category`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-400">Prize Category</FormLabel>
                            <FormControl className="ring-white/20 focus:ring-2">
                              <Select
                                value={field.value || ''}
                                onValueChange={(value) => {
                                  field.onChange(value);

                                  const matched = CREATE_CONTEST_PRIZE_TYPES.find(
                                    (t) => t.value === value,
                                  );

                                  if (matched) {
                                    setValue(`prizes.${index}.icon`, matched.icon);
                                  }
                                }}
                              >
                                <SelectTrigger className="min-h-11 ring-white/20 focus:ring-2">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent align="start" className="max-h-60 overflow-y-auto">
                                  {CREATE_CONTEST_PRIZE_TYPES.map((type) => {
                                    return (
                                      <SelectItem key={type.value} value={type.value}>
                                        <div className="flex items-center gap-2">
                                          <DynamicIcon
                                            name={type.icon}
                                            className="size-4 text-yellow-500"
                                          />
                                          <span>{type.label}</span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Key Boost and Swap */}
                    <FormField
                      control={control}
                      name={`prizes.${index}.key`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-gray-400">Key</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`prizes.${index}.boost`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-gray-400">Boost</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`prizes.${index}.swap`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-gray-400">Swap</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            {formState.errors.prizes && (
              <div className="text-sm text-red-400">{(formState.errors.prizes as any).message}</div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5">
            <h1 className="flex items-center gap-2 border-b pb-5 text-lg font-semibold">
              <span className="border-muted flex size-10 min-w-10 items-center justify-center rounded-full border-2 bg-gray-700">
                <Trophy className="size-5" />
              </span>{' '}
              Review
            </h1>

            <div className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-5">
              <div className="grid grid-cols-2">
                <p className="text-gray-500">Title</p>
                <p className="font-semibold text-white">{getValues('title')}</p>
                <p className="text-gray-500">Max Upload</p>
                <p className="font-semibold text-white">{getValues('maxUploads')}</p>
                <p className="text-gray-500">Start Time</p>
                <p className="font-semibold text-white">
                  {getValues('startDate') ? format(getValues('startDate')!, 'PPpp') : 'N/A'}
                </p>
                <p className="text-gray-500">End Time</p>
                <p className="font-semibold text-white">
                  {getValues('endDate') ? format(getValues('endDate')!, 'PPpp') : 'N/A'}
                </p>
              </div>
              <Separator className="bg-gray-800" />
              <h4 className="text-xl font-semibold text-white">Rules & Prizes</h4>
              <p className="text-gray-400">
                ({getValues('rules').length} Rules, {getValues('prizes').length} Prizes)
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
      <div className="sticky top-[77px] z-40 col-span-12 flex h-fit w-full flex-row items-start gap-10 overflow-x-auto rounded-xl border bg-gray-900 p-5 max-xl:justify-between xl:col-span-2 xl:flex-col">
        <div className="bg-muted absolute top-10 z-0 max-xl:right-10 max-xl:left-10 max-xl:h-0.5 xl:top-5 xl:bottom-5 xl:left-10 xl:w-0.5" />

        {CREATE_CONTEST_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const colorClass = isCompleted
            ? 'bg-green-600 border-green-600 text-white'
            : isActive
              ? 'bg-white border-white text-gray-950 shadow shadow-white/30'
              : 'bg-gray-700 border-muted text-gray-300';

          return (
            <div
              key={step.id}
              className="group relative z-10 flex cursor-pointer flex-col items-center justify-center gap-2 transition duration-300 xl:flex-row"
              onClick={() => goToStep(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') goToStep(index);
              }}
            >
              <div
                className={cn(
                  'flex h-10 w-10 min-w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                  colorClass,
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="size-5" />
                ) : (
                  <DynamicIcon name={step.icon} className="size-5" />
                )}
              </div>
              <span
                className={cn(
                  'font-medium whitespace-nowrap transition duration-300 max-md:text-sm',
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white',
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <Form {...(form as any)}>
        <form className="col-span-12 space-y-10 xl:col-span-10">
          {stepContent()}

          {/* Footer Buttons */}
          <div className="flex justify-between pb-5">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={currentStep === 0 ? 'invisible' : 'visible'}
            >
              <ArrowLeft className="size-5" /> Back
            </Button>

            {currentStep === CREATE_CONTEST_STEPS.length - 1 ? (
              <Button
                type="button"
                size="lg"
                disabled={isLoading}
                onClick={handleFinalSubmit}
                className="bg-green-600 text-white hover:bg-green-700 disabled:cursor-default disabled:opacity-50"
              >
                {isLoading ? 'Launching...' : 'Launch Contest'}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext} size="lg" className="text-white">
                Next Step <ArrowRight className="size-5" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateContest;
