'use client';

import { TipTapEditor } from '@/components/common/tiptap-editor/TipTapEditor';
import TipTapViewer from '@/components/common/tiptap-editor/TipTapViewer';
import DetailsStep from '@/components/modules/content/DetailsStep';
import PrizesStep from '@/components/modules/content/PrizesStep';
import RewardsStep from '@/components/modules/content/RewardsStep';
import RulesStep from '@/components/modules/content/RulesStep';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDefaultContestValues } from '@/lib/contest';
import { contestFinalSchema, type ContestFinalValues } from '@/lib/schemas/contestSchema';
import {
  useGetSitePolicyQuery,
  useUpdateSitePolicyMutation,
} from '@/store/features/settings/settingsApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, FilePenLine, FileText, Loader2, Settings2, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type FieldErrors, type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const CONTENT_TYPE = 'PHOTOGRAPHER_OF_THE_YEAR' as const;

function findFirstError(errors: FieldErrors<ContestFinalValues>): string | undefined {
  const queue: unknown[] = [errors];
  while (queue.length) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') continue;
    if ('message' in current && typeof current.message === 'string') return current.message;
    queue.push(...Object.values(current));
  }
  return undefined;
}

const getTextContent = (value: string) =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') return 'Unable to save the Learn More page.';
  if ('data' in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return 'Unable to save the Learn More page.';
};

const ContestSetup = () => {
  const form = useForm<ContestFinalValues>({
    resolver: zodResolver(contestFinalSchema) as Resolver<ContestFinalValues>,
    defaultValues: getDefaultContestValues(),
    mode: 'onChange',
  });

  const recurring = form.watch('details.recurring');
  const isMoneyContest = form.watch('prizes.isMoneyContest');
  const coinRequirement = form.watch('prizes.coin_requirement');

  useEffect(() => {
    const current = form.getValues('details.recurringType');
    if (!recurring && current !== undefined) {
      form.setValue('details.recurringType', undefined, { shouldDirty: true });
    } else if (recurring && !current) {
      form.setValue('details.recurringType', 'DAILY', { shouldDirty: true });
    }
  }, [form, recurring]);

  useEffect(() => {
    if (isMoneyContest) return;
    if (form.getValues('prizes.minPrize') !== 0) {
      form.setValue('prizes.minPrize', 0, { shouldDirty: true });
    }
    if (form.getValues('prizes.maxPrize') !== 0) {
      form.setValue('prizes.maxPrize', 0, { shouldDirty: true });
    }
  }, [form, isMoneyContest]);

  useEffect(() => {
    if (!coinRequirement && form.getValues('prizes.coin_required') !== 0) {
      form.setValue('prizes.coin_required', 0, { shouldDirty: true });
    }
  }, [coinRequirement, form]);

  const handleSubmit = () => {
    toast.info('Design preview only - saving is not wired up yet.');
  };

  return (
    <div className="pt-2">
      <div className="mb-5">
        <h3 className="text-heading flex items-center gap-2 text-lg font-semibold">
          <Settings2 className="text-primary size-5" />
          Contest setup
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Configure the yearly contest details, prizes, rules, and rewards.
        </p>
      </div>

      <Form {...form}>
        <div className="grid items-start gap-[clamp(20px,2.4vw,36px)] min-[1280px]:grid-cols-[minmax(480px,1.08fr)_minmax(390px,0.92fr)]">
          <form
            className="grid min-w-0 gap-3"
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              toast.error(findFirstError(errors) ?? 'Please check the highlighted fields.');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            })}
          >
            <DetailsStep />
            <PrizesStep />
            <RulesStep />
            <RewardsStep />

            <div className="mt-2 flex flex-wrap items-center justify-end gap-2.5 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset(getDefaultContestValues())}
              >
                Reset
              </Button>
              <Button type="submit" className="min-w-36">
                Save Photography of the Year
              </Button>
            </div>
          </form>
          <div className="hidden min-[1280px]:block" aria-hidden="true" />
        </div>
      </Form>
    </div>
  );
};

const LearnMoreContent = () => {
  const { data, isLoading, isFetching, isError } = useGetSitePolicyQuery({
    type: CONTENT_TYPE,
  });
  const [updateSitePolicy, { isLoading: isSaving }] = useUpdateSitePolicyMutation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const policy = data?.data?.[0];

  useEffect(() => {
    if (!policy) return;
    setTitle(policy.title ?? 'Photographer of the Year');
    setContent(policy.content ?? '');
  }, [policy]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Add a page title before saving.');
      return;
    }

    if (!getTextContent(content)) {
      toast.error('Add page content before saving.');
      return;
    }

    try {
      const response = await updateSitePolicy({
        type: CONTENT_TYPE,
        title: title.trim(),
        content,
      }).unwrap();
      toast.success(response.message || 'Learn More page saved successfully.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading || (isFetching && !policy && !isError)) {
    return (
      <div className="text-muted-foreground flex min-h-80 items-center justify-center gap-2 text-sm">
        <Spinner className="size-6" /> Loading Learn More content...
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2">
      <div>
        <h3 className="text-heading flex items-center gap-2 text-lg font-semibold">
          <FileText className="text-primary size-5" />
          Learn More content
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Write and preview the information displayed on the public Learn More page.
        </p>
      </div>

      {isError && !policy ? (
        <div className="border-warning/30 bg-warning/10 text-warning rounded-lg border px-4 py-3 text-sm">
          No Learn More content exists yet. Add a title and content, then save to publish it.
        </div>
      ) : null}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilePenLine className="text-primary size-5" />
              Page content
            </CardTitle>
            <CardDescription>
              Use headings, lists, links, images, and formatted text to structure the page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="poty-page-title">Page title</Label>
              <Input
                id="poty-page-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Everything you need to know about Photographer of the Year"
                maxLength={200}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label>Page content</Label>
              <TipTapEditor
                value={content}
                onChange={setContent}
                placeholder="Start writing the Photographer of the Year details..."
                minHeight="min-h-[420px]"
                maxHeight="max-h-[700px]"
              />
            </div>

            <div className="border-border flex justify-end border-t pt-5">
              <Button onClick={handleSave} disabled={isSaving} className="min-w-36">
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Saving...
                  </>
                ) : (
                  'Save Learn More page'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:sticky xl:top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="text-primary size-4" /> Content preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-border bg-background min-h-64 overflow-hidden rounded-lg border p-5">
              {title.trim() || getTextContent(content) ? (
                <>
                  <h3 className="text-heading text-2xl leading-tight font-semibold">
                    {title.trim() || 'Untitled page'}
                  </h3>
                  <TipTapViewer
                    content={content}
                    className="text-body mt-5 text-sm leading-6 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg"
                  />
                </>
              ) : (
                <div className="text-muted-foreground flex min-h-52 items-center justify-center text-center text-sm leading-6">
                  Your title and formatted content will appear here as you write.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const PhotographyOfTheYearTab = () => (
  <div className="animate-fade-in w-full">
    <header className="mb-6 w-full">
      <h2 className="text-heading mt-0 mb-1.5 flex items-center gap-2 text-[clamp(1.5rem,2.5vw,2rem)] leading-tight font-semibold tracking-[-0.035em]">
        <Trophy className="text-primary size-6" />
        Photographer of the Year
      </h2>
      <p className="text-muted-foreground max-w-2xl text-sm leading-6">
        Configure the annual contest and manage the public information page from one place.
      </p>
    </header>

    <Tabs defaultValue="contest-setup" className="gap-5">
      <TabsList className="h-11">
        <TabsTrigger value="contest-setup" className="px-5">
          <Settings2 className="size-4" />
          Contest Setup
        </TabsTrigger>
        <TabsTrigger value="learn-more" className="px-5">
          <FileText className="size-4" />
          Learn More Content
        </TabsTrigger>
      </TabsList>

      <TabsContent value="contest-setup">
        <ContestSetup />
      </TabsContent>
      <TabsContent value="learn-more">
        <LearnMoreContent />
      </TabsContent>
    </Tabs>
  </div>
);

export default PhotographyOfTheYearTab;
