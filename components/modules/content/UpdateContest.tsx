'use client';

import { Button } from '@/components/ui/button';
import { buildContestFormData, mapContestToFormValues } from '@/lib/contest';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import { useGetContestQuery, useUpdateContestMutation } from '@/store/features/contest/contestApi';
import type { Contest } from '@/store/features/contest/types';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ContestForm from './ContestForm';

function getErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Something went wrong!';
  if ('data' in error) {
    const data = error.data as { message?: string; error?: { message?: string } } | undefined;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }
  if ('message' in error && typeof error.message === 'string') return error.message;
  return 'Something went wrong!';
}

const UpdateContest = () => {
  const router = useRouter();
  const params = useParams();
  const contestId = params?.id as string;
  const { data, isLoading, isFetching, isError } = useGetContestQuery(
    { id: contestId },
    { skip: !contestId },
  );
  const [updateContest, { isLoading: isUpdating }] = useUpdateContestMutation();
  const contest = data?.data as Contest | undefined;

  const handleSubmit = async (values: ContestFinalValues) => {
    try {
      await updateContest({ id: contestId, body: buildContestFormData(values) }).unwrap();
      toast.success('Contest updated successfully');
      router.push(`/contest/${contestId}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    );
  }

  if (isError || !contest?.id) {
    return (
      <div className="border-border-subtle bg-surface-secondary text-muted-foreground rounded-lg border p-8 text-center">
        <p>Contest not found or could not be loaded.</p>
        <Button type="button" onClick={() => router.push('/contest')} className="mt-4">
          Back to contests
        </Button>
      </div>
    );
  }

  return (
    <ContestForm
      mode="update"
      initialValues={mapContestToFormValues(contest)}
      isSubmitting={isUpdating}
      onSubmit={handleSubmit}
      onCancel={() => router.push(`/contest/${contestId}`)}
    />
  );
};

export default UpdateContest;

