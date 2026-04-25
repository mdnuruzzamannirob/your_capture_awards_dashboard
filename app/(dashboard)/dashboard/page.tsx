'use client';

import Title from '@/components/common/Title';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
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
  Bar,
  BarChart,
  CartesianGrid,
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

const Dashboard = () => {
  const { data, isLoading, isFetching, isError, error } = useGetDashboardOverviewQuery();

  const overview = data?.data;

  const stats = useMemo(
    () => [
      {
        title: 'Total Revenue',
        value: currency.format(overview?.totalRevenue ?? 0),
        icon: DollarSign,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-500/10',
      },
      {
        title: 'Total Users',
        value: numberFormatter.format(overview?.totalUsers ?? 0),
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-500/10',
      },
      {
        title: 'Active Contests',
        value: numberFormatter.format(overview?.totalActiveContests ?? 0),
        icon: Trophy,
        color: 'text-amber-600',
        bgColor: 'bg-amber-500/10',
      },
      {
        title: 'Store Revenue',
        value: currency.format(overview?.totalStoreSalesRevenue ?? 0),
        icon: ShoppingCart,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-500/10',
      },
      {
        title: 'Paid Members',
        value: numberFormatter.format(overview?.paid_members_count ?? 0),
        icon: UserCheck,
        color: 'text-green-600',
        bgColor: 'bg-green-500/10',
      },
      {
        title: 'Total Payments',
        value: numberFormatter.format(overview?.totalPayments ?? 0),
        icon: CreditCard,
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-500/10',
      },
    ],
    [overview],
  );

  const revenueData = useMemo(
    () =>
      MONTH_LABELS.map((month, index) => ({
        month,
        store: overview?.revenueByType?.[index]?.store ?? 0,
        contest: overview?.revenueByType?.[index]?.contest ?? 0,
        subscription: overview?.revenueByType?.[index]?.subscription ?? 0,
        total: overview?.revenueByType?.[index]?.total ?? 0,
      })),
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

  const memberRatioData = useMemo(
    () =>
      MONTH_LABELS.map((month, index) => ({
        month,
        premium: overview?.member_ratio?.[index]?.premium ?? 0,
        pro: overview?.member_ratio?.[index]?.pro ?? 0,
      })),
    [overview],
  );

  const contestDistribution = useMemo(
    () => [
      { name: 'Running', value: overview?.totalContests?.running ?? 0, color: '#16a34a' },
      { name: 'Upcoming', value: overview?.totalContests?.upcoming ?? 0, color: '#f59e0b' },
      { name: 'Completed', value: overview?.totalContests?.completed ?? 0, color: '#3b82f6' },
    ],
    [overview],
  );

  return (
    <section className="space-y-5 p-5">
      <Title
        title="Dashboard Overview"
        description="Live platform metrics, revenue, user growth, and latest contests"
      />

      {isError && (
        <Card className="border-destructive/40">
          <CardContent className="text-destructive p-6 text-sm">
            {getErrorMessage(error)}
          </CardContent>
        </Card>
      )}

      {(isLoading || isFetching) && (
        <Card>
          <CardContent className="text-muted-foreground flex items-center gap-2 p-6 text-sm">
            <Spinner className="size-4" /> Loading dashboard overview...
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="py-4">
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={`flex size-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                >
                  <Icon className={`size-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Type</CardTitle>
            <CardDescription>Monthly subscription, store, and contest revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => currency.format(value)} />
                <Legend />
                <Bar dataKey="subscription" fill="#0ea5e9" name="Subscription" />
                <Bar dataKey="store" fill="#f59e0b" name="Store" />
                <Bar dataKey="contest" fill="#8b5cf6" name="Contest" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly growth from API user history</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => numberFormatter.format(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Member Ratio (Pro vs Premium)</CardTitle>
            <CardDescription>Month-wise membership split</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memberRatioData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => numberFormatter.format(value)} />
                <Legend />
                <Bar dataKey="premium" fill="#14b8a6" name="Premium" />
                <Bar dataKey="pro" fill="#f97316" name="Pro" />
              </BarChart>
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
                <Tooltip formatter={(value: number) => numberFormatter.format(value)} />
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
                  <p className="text-muted-foreground text-xs">{formatDate(contest.createdAt)}</p>
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
    </section>
  );
};

export default Dashboard;
