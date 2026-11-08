'use client';

import ContestForm from '@/components/modules/content/ContestForm';
import ContestFormSkeleton from '@/components/modules/content/ContestFormSkeleton';
import { Button } from '@/components/ui/button';
import { buildContestFormData, getDefaultContestValues } from '@/lib/contest';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import {
  useCreatePhotographyOfTheYearContestMutation,
  useGetContestCreationOptionsQuery,
} from '@/store/features/contest/contestApi';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from './potyUi';

const PotyCreate = () => {
  const router = useRouter();
  const [createContest, { isLoading: isCreating }] = useCreatePhotographyOfTheYearContestMutation();
  const { data, isLoading, isFetching, isError, refetch } = useGetContestCreationOptionsQuery();
  const options = data?.data;

  // POTY is a one-off yearly contest with a fixed 8-photo limit and no prizes
  // or coin fee of its own; its prize pool comes from entry fees.
  const initialValues = useMemo(() => {
    if (!options) return undefined;
    const values = getDefaultContestValues(options);
    values.details.isPhotographyOfYear = true;
    values.details.maxUploads = 8;
    values.details.recurring = false;
    values.prizes.isMoneyContest = false;
    values.prizes.coin_requirement = false;
    values.awards = [];
    return values;
  }, [options]);

  const handleSubmit = async (values: ContestFinalValues) => {
    try {
      await createContest(buildContestFormData(values, options)).unwrap();
      toast.success('Photographer of the Year contest created.');
      router.push('/photographer-of-the-year');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to create the Photographer of the Year contest.'));
    }
  };

  if (!options && (isLoading || isFetching)) return <ContestFormSkeleton />;

  if (!options || !initialValues || isError) {
    return (
      <div className="border-border-subtle bg-surface-secondary text-muted-foreground rounded-lg border p-8 text-center">
        <p>Contest options could not be loaded.</p>
        <Button type="button" onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <ContestForm
      mode="create"
      initialValues={initialValues}
      isSubmitting={isCreating}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/photographer-of-the-year')}
      header={{
        backHref: '/photographer-of-the-year',
        backLabel: 'Photographer of the Year',
        title: 'New Photographer of the Year',
        description:
          'Set the dates, entry fee and rules. Entries are ranked by the votes their photos earn in regular contests during this window; you choose the winners from the top 10 when it closes.',
      }}
    />
  );
};

export default PotyCreate;
