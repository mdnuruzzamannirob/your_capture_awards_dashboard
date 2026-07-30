'use client';

import { buildContestFormData, getDefaultContestValues } from '@/lib/contest';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import {
  useCreateContestMutation,
  useGetContestCreationOptionsQuery,
} from '@/store/features/contest/contestApi';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
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

const CreateContest = () => {
  const router = useRouter();
  const [createContest, { isLoading }] = useCreateContestMutation();
  const {
    data: optionsData,
    isLoading: isOptionsLoading,
    isError: isOptionsError,
    error: optionsError,
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

  if (isOptionsLoading || !options)
    return <div className="p-8 text-sm">Loading contest options...</div>;

  return (
    <ContestForm
      mode="create"
      initialValues={getDefaultContestValues(options)}
      isSubmitting={isLoading || isOptionsLoading}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/contest')}
    />
  );
};

export default CreateContest;
