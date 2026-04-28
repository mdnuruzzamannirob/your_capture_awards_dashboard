'use client';

import Title from '@/components/common/Title';
import SubscriptionManagement from '@/components/modules/subscription/SubscriptionManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useGetSubscriptionStatsQuery } from '@/store/features/subscription/subscriptionApi';
import { DollarSign, Package, TrendingUp, Users } from 'lucide-react';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const getErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') return 'Failed to load subscription stats.';

  if ('data' in error) {
    const data = (error as { data?: { message?: string; error?: { message?: string } } }).data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }

  if ('message' in error && typeof (error as { message?: string }).message === 'string') {
    return (error as { message: string }).message;
  }

  return 'Failed to load subscription stats.';
};

export default function SubscriptionPlanPage() {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetSubscriptionStatsQuery();

  const statsData = data?.data;
  const monthlyRevenue =
    Object.values(statsData?.monthlySubscriptionRevenue ?? {}).reduce(
      (sum, item) => sum + item,
      0,
    ) / 12;

  const stats = [
    {
      title: 'Total Plans',
      value: statsData?.totalPlans ?? 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Subscribers',
      value: statsData?.totalActiveSubscribers ?? 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Monthly Revenue (Avg)',
      value: currency.format(monthlyRevenue),
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Total Subscription Revenue',
      value: currency.format(statsData?.totalSubscriptionRevenue ?? 0),
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <section className="space-y-5 p-5">
      <Title
        title="Subscription Plan"
        description="Manage subscription plans with live revenue and subscriber stats."
      />

      {(isLoading || isFetching) && (
        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
          <Spinner className="size-4" /> Loading subscription stats...
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

      <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                  <h3 className="text-2xl font-bold">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <SubscriptionManagement />
    </section>
  );
}
