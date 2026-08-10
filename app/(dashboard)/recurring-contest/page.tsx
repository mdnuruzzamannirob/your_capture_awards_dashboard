'use client';

import Title from '@/components/common/Title';
import RecurringContestTable from '@/components/modules/recurringContest/RecurringContestTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const RecurringContestPage = () => {
  return (
    <section className="dashboard-page space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Title
          title="Recurring Contests"
          description="Manage recurring contest templates that automatically generate new contests on a schedule"
          className="flex-1"
        />
        <Link href="/contest/create-contest?recurring=1">
          <Button>Create Recurring Contest</Button>
        </Link>
      </div>

      <RecurringContestTable />
    </section>
  );
};

export default RecurringContestPage;
