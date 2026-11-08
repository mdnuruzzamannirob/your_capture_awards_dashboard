'use client';

import { TipTapEditor } from '@/components/common/tiptap-editor/TipTapEditor';
import TipTapViewer from '@/components/common/tiptap-editor/TipTapViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
  useGetSitePolicyQuery,
  useUpdateSitePolicyMutation,
} from '@/store/features/settings/settingsApi';
import { Eye, FilePenLine, FileText, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage as getApiErrorMessage } from './potyUi';

// The public "Learn More" page for Photographer of the Year is stored as a site
// policy of this type.
const CONTENT_TYPE = 'PHOTOGRAPHER_OF_THE_YEAR' as const;

const getTextContent = (value: string) =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getErrorMessage = (error: unknown, fallback = 'Unable to save the Learn More page.') =>
  getApiErrorMessage(error, fallback);

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

export default LearnMoreContent;
