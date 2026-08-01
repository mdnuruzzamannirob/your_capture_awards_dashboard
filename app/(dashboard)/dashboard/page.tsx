'use client';

import MetricCard from '@/components/common/MetricCard';
import Title from '@/components/common/Title';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetDashboardOverviewQuery } from '@/store/features/dashboard/dashboardApi';
import {
  CreditCard,
  DollarSign,
  Image as ImageIcon,
  ShoppingCart,
  Trophy,
  UserCheck,
  Users,
} from 'lucide-react';
import { useMemo } from 'react';
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-US');

const getStatusVariant = (status: string) => {
  if (status === 'RUNNING') return 'default';
  if (status === 'UPCOMING') return 'outline';
  return 'secondary';
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

const getErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') return 'Failed to load dashboard overview.';

  if ('data' in error) {
    const data = (error as { data?: { message?: string; error?: { message?: string } } }).data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }

  if ('message' in error && typeof (error as { message?: string }).message === 'string') {
    return (error as { message: string }).message;
  }

  return 'Failed to load dashboard overview.';
};

/* ─────────────────────────── Skeleton ─────────────────────────── */

const DashboardSkeleton = () => (
  <div className="space-y-5 overflow-hidden">
    {/* Stats Grid */}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="py-4">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="bg-muted size-12 animate-pulse rounded-lg" />
            <div className="space-y-2">
              <div className="bg-muted h-3 w-24 animate-pulse rounded" />
              <div className="bg-muted h-7 w-32 animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* User Growth + Contest Status */}
    <div className="grid gap-5 lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="bg-muted h-5 w-40 animate-pulse rounded" />
            <div className="bg-muted h-3 w-56 animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="bg-muted h-75 w-full animate-pulse rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Recent Contests */}
    <Card>
      <CardHeader>
        <div className="bg-muted h-5 w-36 animate-pulse rounded" />
        <div className="bg-muted h-3 w-52 animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-2">
                <div className="bg-muted h-4 w-48 animate-pulse rounded" />
                <div className="flex items-center gap-4">
                  <div className="bg-muted h-3 w-28 animate-pulse rounded" />
                  <div className="bg-muted h-3 w-24 animate-pulse rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-muted h-3 w-24 animate-pulse rounded" />
                <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ─────────────────────────── Dashboard ─────────────────────────── */

const Dashboard = () => {
  const { data, isLoading, isFetching, isError, error } = useGetDashboardOverviewQuery();

  const overview = data?.data;

  const stats = useMemo(
    () => [
      {
        title: 'Total Revenue',
        value: currency.format(overview?.totalRevenue ?? 0),
        icon: DollarSign,
      },
      {
        title: 'Total Users',
        value: numberFormatter.format(overview?.totalUsers ?? 0),
        icon: Users,
      },
      {
        title: 'Active Contests',
        value: numberFormatter.format(overview?.totalActiveContests ?? 0),
        icon: Trophy,
      },
      {
        title: 'Store Revenue',
        value: currency.format(overview?.totalStoreSalesRevenue ?? 0),
        icon: ShoppingCart,
      },
      {
        title: 'Paid Members',
        value: numberFormatter.format(overview?.paid_members_count ?? 0),
        icon: UserCheck,
      },
      {
        title: 'Total Payments',
        value: numberFormatter.format(overview?.totalPayments ?? 0),
        icon: CreditCard,
      },
    ],
    [overview],
  );

  const growthData = useMemo(
    () =>
      MONTH_LABELS.map((month, index) => ({
        month,
        users: overview?.userGrowthByMonth?.[index] ?? 0,
      })),
    [overview],
  );

  const contestDistribution = useMemo(
    () => [
      {
        name: 'Running',
        value: overview?.totalContests?.running ?? 0,
        color: 'var(--color-info-500)',
      },
      {
        name: 'Upcoming',
        value: overview?.totalContests?.upcoming ?? 0,
        color: 'var(--color-warning-500)',
      },
      {
        name: 'Completed',
        value: overview?.totalContests?.completed ?? 0,
        color: 'var(--color-success-500)',
      },
    ],
    [overview],
  );

  return (
    <section className="dashboard-page space-y-5">
      <Title
        title="Dashboard Overview"
        description="Live platform metrics, revenue, user growth, and latest contests"
      />

      {isError && (
        <Card className="border-destructive/40 gap-0 py-0">
          <CardContent className="text-destructive p-4 text-[13px]">
            {getErrorMessage(error)}
          </CardContent>
        </Card>
      )}

      {isLoading || isFetching ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
              <MetricCard key={stat.title} label={stat.title} value={stat.value} icon={stat.icon} />
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly growth from API user history</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={growthData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any) => {
                        if (Array.isArray(value)) {
                          return value.map((v) => numberFormatter.format(Number(v))).join(', ');
                        }
                        return value !== undefined && value !== null
                          ? numberFormatter.format(Number(value))
                          : '';
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="var(--color-brand-500)"
                      strokeWidth={2}
                      name="Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contest Status</CardTitle>
                <CardDescription>Running, upcoming, and completed contests</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={contestDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {contestDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => {
                        if (Array.isArray(value)) {
                          return value.map((v) => numberFormatter.format(Number(v))).join(', ');
                        }
                        return value !== undefined && value !== null
                          ? numberFormatter.format(Number(value))
                          : '';
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Contests</CardTitle>
              <CardDescription>Latest contests from dashboard overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(overview?.recentContests ?? []).map((contest) => (
                  <div
                    key={contest.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <h4 className="font-semibold">{contest.title}</h4>
                      <div className="text-muted-foreground flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          {numberFormatter.format(contest.participantCount)} participants
                        </span>
                        <span className="flex items-center gap-1">
                          <ImageIcon className="size-3" />
                          {numberFormatter.format(contest.totalPhoto)} photos
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-muted-foreground text-xs">
                        {formatDate(contest.createdAt)}
                      </p>
                      <Badge variant={getStatusVariant(contest.status)}>{contest.status}</Badge>
                    </div>
                  </div>
                ))}

                {!overview?.recentContests?.length && (
                  <p className="text-muted-foreground py-4 text-center text-sm">
                    No recent contests found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
};

export default Dashboard;
