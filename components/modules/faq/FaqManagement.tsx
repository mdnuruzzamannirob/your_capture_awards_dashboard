'use client';

import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetFaqsQuery,
  useUpdateFaqMutation,
} from '@/store/features/faq/faqApi';
import type { Faq, FaqPayload } from '@/store/features/faq/types';
import { Plus } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createFaqColumns } from './faq-columns';

type StatusFilter = 'all' | 'active' | 'inactive';

const defaultForm: Required<FaqPayload> = {
  question: '',
  answer: '',
  category: '',
  order: 0,
  isActive: true,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback;

  if ('data' in error) {
    const data = (error as { data?: { message?: string; error?: { message?: string } } }).data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }

  if ('message' in error && typeof (error as { message?: string }).message === 'string') {
    return (error as { message: string }).message;
  }

  return fallback;
};

const FaqManagement = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [form, setForm] = useState<Required<FaqPayload>>(defaultForm);

  const isActive =
    statusFilter === 'all' ? undefined : statusFilter === 'active' ? true : false;
  const faqsQuery = useGetFaqsQuery({ page, limit, search, isActive });
  const [createFaq, createState] = useCreateFaqMutation();
  const [updateFaq, updateState] = useUpdateFaqMutation();
  const [deleteFaq, deleteState] = useDeleteFaqMutation();
  const isSaving = createState.isLoading || updateState.isLoading;

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const faqs = faqsQuery.data?.data ?? [];
  const meta = faqsQuery.data?.meta;

  const openCreateDialog = () => {
    setEditingFaq(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEditDialog = (faq: Faq) => {
    setEditingFaq(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category ?? '',
      order: faq.order,
      isActive: faq.isActive,
    });
    setDialogOpen(true);
  };

  const buildPayload = (): FaqPayload => ({
    question: form.question.trim(),
    answer: form.answer.trim(),
    category: form.category.trim() || undefined,
    order: Number(form.order) || 0,
    isActive: form.isActive,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = buildPayload();

    try {
      const response = editingFaq
        ? await updateFaq({ id: editingFaq.id, body: payload }).unwrap()
        : await createFaq(payload).unwrap();

      toast.success(response.message || 'FAQ saved successfully.');
      setDialogOpen(false);
      setEditingFaq(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save FAQ.'));
    }
  };

  const handleDelete = async (faq: Faq) => {
    const confirmed = window.confirm(`Delete this FAQ?\n\n${faq.question}`);
    if (!confirmed) return;

    try {
      const response = await deleteFaq(faq.id).unwrap();
      toast.success(response.message || 'FAQ deleted successfully.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete FAQ.'));
    }
  };

  const columns = createFaqColumns(openEditDialog, handleDelete);

  return (
    <>
      <div className="space-y-4">
        {faqsQuery.isError && (
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-destructive text-sm">
                {getErrorMessage(faqsQuery.error, 'Failed to load FAQs.')}
              </p>
              <Button variant="outline" size="sm" onClick={() => faqsQuery.refetch()}>
                Retry
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:max-w-xl sm:flex-row">
            <label htmlFor="faq-search" className="sr-only">
              Search FAQs
            </label>
            <Input
              id="faq-search"
              type="text"
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                setPage(1);
              }}
              placeholder="Search FAQs..."
              className="sm:max-w-sm"
            />
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as StatusFilter);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All FAQs</SelectItem>
                <SelectItem value="active">Active only</SelectItem>
                <SelectItem value="inactive">Inactive only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="size-4" />
            Add FAQ
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={faqs}
          page={meta?.page ?? page}
          pageSize={meta?.limit ?? limit}
          total={meta?.total ?? 0}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setLimit(size);
            setPage(1);
          }}
          onRowClick={openEditDialog}
          isLoading={faqsQuery.isLoading || faqsQuery.isFetching || deleteState.isLoading}
          hideViewOptions
          hideSearch
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[95vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="faq-question">Question</Label>
              <Input
                id="faq-question"
                value={form.question}
                onChange={(event) =>
                  setForm((current) => ({ ...current, question: event.target.value }))
                }
                required
                placeholder="What should users know?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faq-answer">Answer</Label>
              <Textarea
                id="faq-answer"
                value={form.answer}
                onChange={(event) =>
                  setForm((current) => ({ ...current, answer: event.target.value }))
                }
                required
                placeholder="Write a clear, helpful answer."
                className="min-h-36 resize-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="faq-category">Category</Label>
                <Input
                  id="faq-category"
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, category: event.target.value }))
                  }
                  placeholder="General"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faq-order">Order</Label>
                <Input
                  id="faq-order"
                  type="number"
                  value={form.order}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, order: Number(event.target.value) }))
                  }
                  min={0}
                />
              </div>
            </div>

            <div className="border-border-subtle flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="faq-active">Visible on website</Label>
                <p className="text-muted-foreground mt-1 text-sm">
                  Inactive FAQs stay saved in dashboard but are hidden publicly.
                </p>
              </div>
              <Switch
                id="faq-active"
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm((current) => ({ ...current, isActive: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <Spinner className="size-4" />
                ) : editingFaq ? (
                  'Save changes'
                ) : (
                  'Create FAQ'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FaqManagement;
