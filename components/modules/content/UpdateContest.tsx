'use client';

import { Button } from '@/components/ui/button';
import { buildContestFormData, mapContestToFormValues } from '@/lib/contest';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import {
  useGetContestQuery,
  useGetPotyAdminOverviewQuery,
  useUpdateContestMutation,
  useUpdatePhotographyOfTheYearContestMutation,
} from '@/store/features/contest/contestApi';
import type { Contest } from '@/store/features/contest/types';
import { useParams, useRouter } from 'next/navigation';
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

type UpdateContestProps = {
  /** Where Save and Cancel lead. Defaults to the contest's details page. */
  returnTo?: string;
};

const UpdateContest = ({ returnTo }: UpdateContestProps = {}) => {
  const router = useRouter();
  const params = useParams();
  const contestId = params?.id as string;
  const { data, isLoading, isFetching, isError } = useGetContestQuery(
    { id: contestId },
    { skip: !contestId },
  );
  const [updateContest, { isLoading: isUpdating }] = useUpdateContestMutation();
  const [updatePotyContest, { isLoading: isUpdatingPoty }] =
    useUpdatePhotographyOfTheYearContestMutation();
  const contest = data?.data as Contest | undefined;
  const isUpcoming = contest?.status === 'UPCOMING' || contest?.status === 'NEW';
  // Photographer of the Year runs for a year, so it stays editable while active.
  const isRunningPoty = Boolean(
    contest?.isPhotographyOfYear &&
      contest.status === 'ACTIVE' &&
      new Date(contest.endDate ?? 0).getTime() > Date.now(),
  );
  const canEditContest = Boolean(contest && (isUpcoming || isRunningPoty) && !contest.deletedAt);
  // Photographer of the Year takes registrations while scheduled: once anyone
  // has registered, the entry fee and rules lock (the API enforces the same).
  const { data: potyOverview } = useGetPotyAdminOverviewQuery(undefined, {
    skip: !contest?.isPhotographyOfYear,
  });
  const potyEntry = potyOverview?.data?.contests.find((item) => item.id === contestId);
  const feeAndRulesLocked =
    isRunningPoty ||
    Boolean(potyEntry?.editLocks?.feeAndRules ?? (potyEntry && potyEntry.participantCount > 0));

  const handleSubmit = async (values: ContestFinalValues) => {
    try {
      const body = buildContestFormData(values);
      // Locked fields are not sent; the API rejects changes to them.
      if (isRunningPoty) {
        body.delete('startDate');
      }
      if (feeAndRulesLocked) {
        body.delete('entryFeeAmount');
        body.delete('rules');
      }
      if (contest?.isPhotographyOfYear) {
        await updatePotyContest({ id: contestId, body }).unwrap();
      } else {
        await updateContest({ id: contestId, body }).unwrap();
      }
      toast.success('Contest updated successfully');
      router.push(returnTo ?? `/contest/${contestId}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!contest && (isLoading || isFetching)) return <ContestFormSkeleton />;

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

  if (!canEditContest) {
    return (
      <div className="border-border-subtle bg-surface-secondary text-muted-foreground rounded-lg border p-8 text-center">
        <p>
          {contest.isPhotographyOfYear
            ? 'Photographer of the Year can only be edited until it ends.'
            : 'Only upcoming contests can be edited.'}
        </p>
        <Button
          type="button"
          onClick={() => router.push(`/contest/${contest.id}`)}
          className="mt-4"
        >
          Back to contest
        </Button>
      </div>
    );
  }

  return (
    <ContestForm
      mode="update"
      initialValues={mapContestToFormValues(contest)}
      isSubmitting={isUpdating || isUpdatingPoty}
      onSubmit={handleSubmit}
      onCancel={() => router.push(returnTo ?? `/contest/${contestId}`)}
      lockStartedFields={isRunningPoty}
      lockFeeAndRules={feeAndRulesLocked}
      header={
        contest.isPhotographyOfYear
          ? {
              backHref: '/photographer-of-the-year',
              backLabel: 'Photographer of the Year',
              title: 'Edit Photographer of the Year',
              description: isRunningPoty
                ? 'The contest is running. Update its presentation or extend the end date.'
                : 'Update the dates, entry fee, rules and presentation before the contest opens.',
            }
          : undefined
      }
    />
  );
};

export default UpdateContest;
