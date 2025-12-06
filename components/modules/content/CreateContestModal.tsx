'use client';

import { contestSchema, ContestValues } from '@/lib/schemas/contestSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  CheckCircle2,
  Trophy,
  FileText,
  Info,
  Crown,
  Image as ImageIcon,
  User,
  Camera,
  Scissors,
  DollarSign,
  Zap,
  RotateCw,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Trash2,
  Plus,
  ArrowLeft,
  ArrowRight,
  Scale,
  ClipboardCheck,
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
import { Textarea } from '@/components/ui/textarea';
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
import TipTapEditorr, {
  proseBaseStyles,
  TipTapEditor,
} from '@/components/common/tiptap-editor/TipTapEditor';
import { cn } from '@/lib/utils';
import TipTapViewer from '@/components/common/tiptap-editor/TipTapViewer';

// --- Constants & Expanded Rules Icons ---
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

// Expanded Icon List for Rules
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

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const CreateContestModal = () => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [html, setHtml] = useState('<p>Hello world</p>');

  const form = useForm<ContestValues>({
    resolver: zodResolver(contestSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: undefined,
      endDate: undefined,
      rules: [{ title: 'General Rules', icon: 'info', description: 'Original photos only.' }],
      prizes: [
        {
          type: 'photo_winner',
          title: '1st Place',
          amount: '$500',
          keyBoost: 10,
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

  // Navigation Logic
  const handleNext = async () => {
    const fields = STEPS[currentStep].fields as any;

    // Custom check for rules/prizes to ensure array is not empty
    if (currentStep === 1 && form.getValues('rules').length === 0) {
      form.setError('rules', { type: 'manual', message: 'Please add at least one rule.' });
      return;
    }
    if (currentStep === 2 && form.getValues('prizes').length === 0) {
      form.setError('prizes', { type: 'manual', message: 'Please add at least one prize.' });
      return;
    }

    const isValid = await form.trigger(fields);

    if (isValid) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = (data: ContestValues) => {
    console.log('FINAL CONTEST SUBMISSION DATA:', data);
    alert('Contest Created! Check console for data.');
  };

  if (typeof window === 'undefined') {
    return;
  }

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <Button className="text-white">Create Contest</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="relative flex items-center justify-between">
          <div className="absolute top-5 right-10 left-10 z-0 hidden h-0.5 bg-gray-800 md:block" />
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const colorClass = isCompleted
              ? 'bg-green-500 border-green-500 text-black'
              : isActive
                ? 'bg-white border-white text-gray-950 shadow-white/30'
                : 'bg-gray-900 border-gray-700 text-gray-500';

            return (
              <div key={step.id} className="group relative z-10 flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-md transition-all duration-300 ${colorClass}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`mt-3 text-sm font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* FORM AREA */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* --- STEP 1: DETAILS --- */}
            {currentStep === 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Contest Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Neon Nights 2025"
                            className="h-11 border-gray-800 bg-gray-950 text-lg text-white placeholder:text-gray-600 focus-visible:ring-white/20"
                            {...field}
                          />
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
                      <FormLabel className="text-gray-300">Start Date & Time</FormLabel>
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
                      <FormLabel className="text-gray-300">End Date & Time</FormLabel>
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
                        <FormLabel className="text-gray-300">Full Description</FormLabel>
                        <FormControl>
                          <TipTapEditor
                            value={field.value}
                            onChange={field.onChange}
                            minHeight="h-[200px]"
                            placeholder="Describe the contest theme, rules, and inspiration in detail..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* --- STEP 2: RULES --- */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Contest Rules ({ruleFields.length})
                  </h3>
                  <Button
                    type="button"
                    onClick={() => appendRule({ title: '', icon: 'info', description: '' })}
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-700"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add New Rule
                  </Button>
                </div>

                <div className="space-y-6">
                  {ruleFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative rounded-lg border border-gray-800 bg-gray-950 p-5 transition-all duration-300 hover:border-white/20"
                    >
                      <div className="absolute top-4 right-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRule(index)}
                          className="text-gray-500 hover:bg-red-950/30 hover:text-red-400"
                          disabled={ruleFields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        {/* Icon Select */}
                        <FormField
                          control={form.control}
                          name={`rules.${index}.icon`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-400">Icon</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 border-gray-700 bg-gray-900 text-white">
                                    <SelectValue placeholder="Select Icon" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-48 overflow-y-auto border-gray-800 bg-gray-900 text-white">
                                  {RULE_ICONS.map((icon) => {
                                    const IconComp = icon.icon;
                                    return (
                                      <SelectItem key={icon.value} value={icon.value}>
                                        <div className="flex items-center gap-3">
                                          <IconComp className="text-primary h-4 w-4" />
                                          <span>{icon.label}</span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        {/* Title Input */}
                        <FormField
                          control={form.control}
                          name={`rules.${index}.title`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="text-gray-400">Rule Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Originality Requirement"
                                  className="h-11 border-gray-700 bg-gray-900 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Description (Rich Text) */}
                        <div className="md:col-span-3">
                          <FormField
                            control={form.control}
                            name={`rules.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-400">
                                  Description (Rich Text)
                                </FormLabel>
                                <FormControl>
                                  <TipTapEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    minHeight="h-24"
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
                <FormMessage>{form.formState.errors.rules?.root?.message}</FormMessage>
              </div>
            )}

            {/* --- STEP 3: PRIZES --- */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Prizes & Rewards ({prizeFields.length})
                  </h3>
                  <Button
                    type="button"
                    onClick={() =>
                      appendPrize({
                        type: 'photo_winner',
                        title: '',
                        amount: '',
                        keyBoost: 0,
                        swap: 0,
                        description: '',
                      })
                    }
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-700"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Prize
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {prizeFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative rounded-xl border border-gray-700 bg-gray-950 p-6 transition-all duration-300 hover:border-yellow-500/50"
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
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="md:col-span-4">
                          <FormField
                            control={form.control}
                            name={`prizes.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-400">Prize Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-11 border-gray-700 bg-gray-900 text-white">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="border-gray-800 bg-gray-900 text-white">
                                    {PRIZE_TYPES.map((type) => {
                                      const IconComp = type.icon;
                                      return (
                                        <SelectItem key={type.value} value={type.value}>
                                          <div className="flex items-center gap-2">
                                            <IconComp className="h-4 w-4 text-yellow-500" />
                                            <span>{type.label}</span>
                                          </div>
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Prize Title and Amount */}
                        <FormField
                          control={form.control}
                          name={`prizes.${index}.title`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
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
                            <FormItem className="md:col-span-2">
                              <FormLabel className="text-gray-400">
                                Value / Amount (e.g. $100)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="$500 USD"
                                  className="h-11 border-gray-700 bg-gray-900 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Key Boost and Swap */}
                        <FormField
                          control={form.control}
                          name={`prizes.${index}.keyBoost`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-400">Key Boost (Units)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="10"
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
                          name={`prizes.${index}.swap`}
                          render={({ field }) => (
                            <FormItem>
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

                        <div className="md:col-span-4">
                          <FormField
                            control={form.control}
                            name={`prizes.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-400">
                                  Description (Optional)
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Specific details about the prize delivery..."
                                    className="min-h-20 border-gray-700 bg-gray-900 text-white"
                                    {...field}
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
                <FormMessage>{form.formState.errors.prizes?.root?.message}</FormMessage>
              </div>
            )}

            {/* --- STEP 4: REVIEW --- */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
                <h3 className="text-2xl font-semibold text-white">Final Review</h3>
                <div className="space-y-6 rounded-lg border border-gray-800 bg-gray-950 p-6">
                  <div className="grid grid-cols-2">
                    <p className="text-gray-500">Title</p>
                    <p className="font-semibold text-white">{form.getValues('title')}</p>
                    <p className="text-gray-500">Start Time</p>
                    <p className="font-semibold text-white">
                      {format(form.getValues('startDate')!, 'PPpp')}
                    </p>
                    <p className="text-gray-500">End Time</p>
                    <p className="font-semibold text-white">
                      {format(form.getValues('endDate')!, 'PPpp')}
                    </p>
                  </div>
                  <Separator className="bg-gray-800" />
                  <h4 className="text-xl font-semibold text-white">Rules & Prizes</h4>
                  <p className="text-gray-400">
                    ({form.getValues('rules').length} Rules, {form.getValues('prizes').length}{' '}
                    Prizes)
                  </p>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-between pb-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`px-6 text-gray-400 hover:bg-gray-800 hover:text-white ${currentStep === 0 ? 'invisible' : 'visible'}`}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>

              {currentStep === STEPS.length - 1 ? (
                <Button
                  type="submit"
                  size="lg"
                  className="bg-green-600 px-8 font-bold text-white hover:bg-green-700"
                >
                  Launch Contest
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  size="lg"
                  className="bg-white px-6 font-semibold text-black hover:bg-gray-200"
                >
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContestModal;
