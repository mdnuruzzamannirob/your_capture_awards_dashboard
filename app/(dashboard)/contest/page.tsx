'use client';

import Title from '@/components/common/Title';
import ContestTable from '@/components/modules/content/ContestTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
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
  const { data, isLoading, isFetching, isError, error, refetch } = useGetContestStatsQuery();
  const statsData = data?.data;

  const stats = [
    {
      title: 'Total Contests',
      value: (statsData?.running ?? 0) + (statsData?.upcoming ?? 0) + (statsData?.completed ?? 0),
      icon: Trophy,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Contests',
      value: statsData?.running ?? 0,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Upcoming Contests',
      value: statsData?.upcoming ?? 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Closed Contests',
      value: statsData?.completed ?? 0,
      icon: XCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-500/10',
    },
  ];

  return (
    <section className="space-y-5 p-5">
      <div className="flex flex-row items-center justify-between">
        <Title
          title="Contest Management"
          description="Monitor and manage all contests, participants, and results"
        />
        <Link href="/contest/create-contest">
          <Button className="text-white">Create Contest</Button>
        </Link>
      </div>

      {(isLoading || isFetching) && (
        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
          <Spinner className="size-4" /> Loading contest stats...
        </div>
      )}

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

      <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="py-4">
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={`flex size-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                >
                  <Icon className={`size-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ContestTable />
    </section>
  );
};

export default ContestPage;
