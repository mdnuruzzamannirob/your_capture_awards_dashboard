'use client';

import MetricCard from '@/components/common/MetricCard';
import Title from '@/components/common/Title';
import ContestTable from '@/components/modules/content/ContestTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetContestStatsQuery } from '@/store/features/contest/contestApi';
import { CheckCircle2, Clock, Trophy, XCircle } from 'lucide-react';
import Link from 'next/link';

const getErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') return 'Failed to load contest stats.';

  if ('data' in error) {
    const data = (error as { data?: { message?: string; error?: { message?: string } } }).data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }

  if ('message' in error && typeof (error as { message?: string }).message === 'string') {
    return (error as { message: string }).message;
  }

  return 'Failed to load contest stats.';
};

const ContestPage = () => {
  const { data, isError, error, refetch } = useGetContestStatsQuery();
  const statsData = data?.data;

  const stats = [
    {
      title: 'Total Contests',
      value: (statsData?.running ?? 0) + (statsData?.upcoming ?? 0) + (statsData?.completed ?? 0),
      icon: Trophy,
    },
    {
      title: 'Active Contests',
      value: statsData?.running ?? 0,
      icon: CheckCircle2,
    },
    {
      title: 'Upcoming Contests',
      value: statsData?.upcoming ?? 0,
      icon: Clock,
    },
    {
      title: 'Closed Contests',
      value: statsData?.completed ?? 0,
      icon: XCircle,
    },
  ];

  return (
    <section className="dashboard-page space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Title
          title="Contest Management"
          description="Monitor and manage all contests, participants, and results"
          className="flex-1"
        />
        <Link href="/contest/create-contest">
          <Button>Create Contest</Button>
        </Link>
      </div>

      {isError && (
        <Card>
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <p className="text-destructive text-sm">{getErrorMessage(error)}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mb-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <MetricCard
            key={stat.title}
            label={stat.title}
            value={stat.value.toLocaleString()}
            icon={stat.icon}
          />
        ))}
      </div>

      <ContestTable />
    </section>
  );
};

export default ContestPage;
