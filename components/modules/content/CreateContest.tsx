'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';
import { ContestValues, contestSchema } from '@/lib/schemas/contestSchema';
import {
  Trophy,
  FileText,
  Scale,
  ClipboardCheck,
  Info,
  AlertCircle,
  TrendingUp,
  Camera,
  Scissors,
  DollarSign,
  Zap,
  RotateCw,
  Lightbulb,
  Crown,
  Image as ImageIcon,
  User,
  Trash2,
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
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

const STEPS = [
  {
    id: 0,
    title: 'Details',
    icon: FileText,
    fields: ['title', 'description', 'startDate', 'endDate'],
  },
  { id: 1, title: 'Rules', icon: Scale, fields: ['rules'] },
  { id: 2, title: 'Prizes', icon: Trophy, fields: ['prizes'] },
  { id: 3, title: 'Review', icon: ClipboardCheck, fields: [] },
];

const RULE_ICONS = [
  { value: 'info', label: 'General', icon: Info },
  { value: 'alert', label: 'Warning', icon: AlertCircle },
  { value: 'star', label: 'Important', icon: TrendingUp },
  { value: 'camera', label: 'Submission', icon: Camera },
  { value: 'edit', label: 'Editing Limit', icon: Scissors },
  { value: 'money', label: 'Financial', icon: DollarSign },
  { value: 'boost', label: 'Boost Use', icon: Zap },
  { value: 'swap', label: 'Swap Use', icon: RotateCw },
  { value: 'idea', label: 'Theme/Concept', icon: Lightbulb },
];

const PRIZE_TYPES = [
  { value: 'photo_winner', label: 'Best Photo Winner', icon: ImageIcon },
  { value: 'photographer_winner', label: 'Best Photographer', icon: User },
  { value: 'yc_top_winner', label: 'YC Top Choice', icon: Crown },
];

const CreateContest: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const form = useForm<ContestValues>({
    resolver: zodResolver(contestSchema) as Resolver<ContestValues>,
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      rules: [{ title: 'General Rules', icon: 'info', description: 'Original photos only.' }],
      prizes: [
        {
          type: 'photo_winner',
          title: '1st Place',
          amount: '$500',
          key: 10,
          boost: 10,
          swap: 5,
          description: '',
        },
      ],
    },
    mode: 'onChange',
  });

  const {
    fields: ruleFields,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({
    control: form.control,
    name: 'rules',
  });

  const {
    fields: prizeFields,
    append: appendPrize,
    remove: removePrize,
  } = useFieldArray({
    control: form.control,
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
    const fieldsToValidate = STEPS[currentStep].fields as readonly string[];

    if (currentStep === 1 && form.getValues('rules').length === 0) {
      form.setError('rules', { type: 'manual', message: 'Please add at least one rule.' });
      return;
    }
    if (currentStep === 2 && form.getValues('prizes').length === 0) {
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
    await goToStep(Math.min(currentStep + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  // only process final submit when on last step
  const onSubmit = (data: ContestValues) => {
    if (currentStep !== STEPS.length - 1) {
      return;
    }
    console.log('FINAL CONTEST SUBMISSION DATA:', data);
    alert('Contest Created! Check console for data.');
  };

  const stepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 grid grid-cols-1 gap-5 md:grid-cols-2">
            <h1 className="col-span-full flex items-center gap-2 border-b pb-4 text-lg font-semibold">
              <span className="border-muted flex size-10 min-w-10 items-center justify-center rounded-full border-2 bg-gray-700">
                <FileText className="size-5" />
              </span>{' '}
              Details
            </h1>

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Contest Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Neon Nights 2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date Pickers */}
            <FormField
              control={form.control}
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
              control={form.control}
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

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
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
          </div>
        );
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5">
            <div className="flex items-center justify-between border-b pb-4">
              <h1 className="flex items-center gap-2 text-lg font-semibold">
                <span className="border-muted flex size-10 min-w-10 items-center justify-center rounded-full border-2 bg-gray-700">
                  <Scale className="size-5" />
                </span>{' '}
                Contest Rules{' '}
                <span>
                  {' '}
                  (<span className="text-primary">{ruleFields.length}</span>)
                </span>
              </h1>

              <Button
                type="button"
                onClick={() => appendRule({ title: '', icon: 'info', description: '' })}
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-700"
              >
                <Plus className="mr-2 size-4" /> Add New Rule
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-10">
              {ruleFields.map((f, index) => (
                <div
                  key={f.id}
                  className="relative rounded-lg border bg-gray-950/50 p-5 transition-all duration-300"
                >
                  <div className="absolute top-1 right-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRule(index)}
                      className="text-gray-500 hover:bg-red-950/30 hover:text-red-400"
                      disabled={ruleFields.length === 1}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-4">
                    {/* Icon Select */}
                    <FormField
                      control={form.control}
                      name={`rules.${index}.icon`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400">Rule Icon</FormLabel>
                          <FormControl className="min-h-11 w-full ring-white/20 focus:ring-2">
                            <Select
                              value={field.value || ''}
                              onValueChange={(val) => field.onChange(val)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Icon" />
                              </SelectTrigger>
                              <SelectContent align="start" className="max-h-60 overflow-y-auto">
                                {RULE_ICONS.map((icon) => {
                                  const IconComp = icon.icon;
                                  return (
                                    <SelectItem key={icon.value} value={icon.value}>
                                      <div className="flex items-center gap-3">
                                        <IconComp className="text-primary size-4" />
                                        <span>{icon.label}</span>
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

                    {/* Title Input */}
                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name={`rules.${index}.title`}
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
                        control={form.control}
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
            {form.formState.errors.rules && (
              <div className="text-sm text-red-400">
                {(form.formState.errors.rules as any).message}
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-5">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Trophy /> Prizes & Rewards ({prizeFields.length})
              </h3>
              <Button
                type="button"
                onClick={() =>
                  appendPrize({
                    type: 'photo_winner',
                    title: '',
                    amount: '',
                    boost: 0,
                    key: 0,
                    swap: 0,
                    description: '',
                  })
                }
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-700"
              >
                <Plus className="mr-2 size-4" /> Add Prize
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {prizeFields.map((f, index) => (
                <div
                  key={f.id}
                  className="relative rounded-xl border bg-gray-950/50 p-5 transition-all duration-300"
                >
                  <div className="absolute top-4 right-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePrize(index)}
                      className="text-gray-500 hover:bg-red-950/30 hover:text-red-400"
                      disabled={prizeFields.length === 1}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-6">
                    <div className="md:col-span-full">
                      <FormField
                        control={form.control}
                        name={`prizes.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-400">Prize Category</FormLabel>
                            <FormControl className="min-h-11 ring-white/20 focus:ring-2">
                              <Select
                                value={field.value || ''}
                                onValueChange={(v) => field.onChange(v)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent align="start" className="max-h-60 overflow-y-auto">
                                  {PRIZE_TYPES.map((type) => {
                                    const IconComp = type.icon;
                                    return (
                                      <SelectItem key={type.value} value={type.value}>
                                        <div className="flex items-center gap-2">
                                          <IconComp className="size-4 text-yellow-500" />
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

                    {/* Prize Title and Amount */}
                    <FormField
                      control={form.control}
                      name={`prizes.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-3">
                          <FormLabel className="text-gray-400">Prize Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Grand Prize"
                              className="h-11 border-gray-700 bg-gray-900 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`prizes.${index}.amount`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-3">
                          <FormLabel className="text-gray-400">
                            Value / Amount (e.g. $100)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="$500 USD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Key Boost and Swap */}
                    <FormField
                      control={form.control}
                      name={`prizes.${index}.key`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-gray-400">Key (Units)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`prizes.${index}.boost`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-gray-400">Boost (Units)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`prizes.${index}.swap`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-gray-400">Swap (Units)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="5"
                              className="h-11 border-gray-700 bg-gray-900 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
            {form.formState.errors.prizes && (
              <div className="text-sm text-red-400">
                {(form.formState.errors.prizes as any).message}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
            <h3 className="text-2xl font-semibold text-white">Final Review</h3>
            <div className="space-y-6 rounded-lg border border-gray-800 bg-gray-950 p-6">
              <div className="grid grid-cols-2">
                <p className="text-gray-500">Title</p>
                <p className="font-semibold text-white">{form.getValues('title')}</p>
                <p className="text-gray-500">Start Time</p>
                <p className="font-semibold text-white">
                  {form.getValues('startDate')
                    ? format(form.getValues('startDate')!, 'PPpp')
                    : 'N/A'}
                </p>
                <p className="text-gray-500">End Time</p>
                <p className="font-semibold text-white">
                  {form.getValues('endDate') ? format(form.getValues('endDate')!, 'PPpp') : 'N/A'}
                </p>
              </div>
              <Separator className="bg-gray-800" />
              <h4 className="text-xl font-semibold text-white">Rules & Prizes</h4>
              <p className="text-gray-400">
                ({form.getValues('rules').length} Rules, {form.getValues('prizes').length} Prizes)
              </p>
            </div>
          </div>
        );

      default:
        return;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
      <div className="sticky top-[77px] z-40 col-span-12 flex h-fit w-full flex-row items-start gap-10 overflow-x-auto rounded-xl border bg-gray-900 p-5 max-xl:justify-between xl:col-span-2 xl:flex-col">
        <div className="bg-muted absolute top-10 z-0 max-xl:right-10 max-xl:left-10 max-xl:h-0.5 xl:top-5 xl:bottom-5 xl:left-10 xl:w-0.5" />

        {STEPS.map((step, index) => {
          const Icon = step.icon;
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
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="col-span-12 space-y-8 rounded-xl border bg-gray-900 p-5 md:col-span-10"
        >
          {stepContent()}

          {/* Footer Buttons */}
          <div className="flex justify-between pb-4">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={cn(
                'px-5 text-gray-400 hover:bg-gray-800 hover:text-white',
                currentStep === 0 ? 'invisible' : 'visible',
              )}
            >
              <ArrowLeft className="mr-2 size-4" /> Back
            </Button>

            {currentStep === STEPS.length - 1 ? (
              <Button
                type="submit"
                size="lg"
                className="bg-green-600 px-5 text-white hover:bg-green-700"
              >
                Launch Contest
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                size="lg"
                className="bg-white px-5 font-semibold text-black hover:bg-gray-200"
              >
                Next Step <ArrowRight className="ml-2 size-4" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateContest;
