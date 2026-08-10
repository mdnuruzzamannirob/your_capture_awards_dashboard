'use client';

import { buildContestFormData, getDefaultContestValues } from '@/lib/contest';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import {
  useCreateContestMutation,
  useGetContestCreationOptionsQuery,
} from '@/store/features/contest/contestApi';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import ContestForm from './ContestForm';
import ContestFormSkeleton from './ContestFormSkeleton';

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

const CreateContest = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startRecurring = searchParams.get('recurring') === '1';
  const [createContest, { isLoading }] = useCreateContestMutation();
  const {
    data: optionsData,
    isLoading: isOptionsLoading,
    isFetching: isOptionsFetching,
    isError: isOptionsError,
    error: optionsError,
    refetch: refetchOptions,
  } = useGetContestCreationOptionsQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const options = optionsData?.data;
  const didNotifyOptionsError = useRef(false);

  useEffect(() => {
    if (!isOptionsError || didNotifyOptionsError.current) return;
    didNotifyOptionsError.current = true;
    toast.error(getErrorMessage(optionsError));
  }, [isOptionsError, optionsError]);

  const handleSubmit = async (values: ContestFinalValues) => {
    try {
      await createContest(buildContestFormData(values, options)).unwrap();
      toast.success('New contest created');
      router.push('/contest');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!options && (isOptionsLoading || isOptionsFetching)) return <ContestFormSkeleton />;

  if (!options) {
    return (
      <div className="border-border-subtle bg-surface-secondary text-muted-foreground rounded-lg border p-8 text-center">
        <p>Contest options could not be loaded.</p>
        <button
          type="button"
          onClick={() => refetchOptions()}
          className="bg-primary text-primary-foreground mt-4 rounded-md px-4 py-2 text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  const initialValues = getDefaultContestValues(options);
  if (startRecurring) {
    initialValues.details.recurring = true;
    initialValues.details.recurringType = 'DAILY';
  }

  return (
    <ContestForm
      mode="create"
      initialValues={initialValues}
      isSubmitting={isLoading}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/contest')}
    />
  );
};

export default CreateContest;
