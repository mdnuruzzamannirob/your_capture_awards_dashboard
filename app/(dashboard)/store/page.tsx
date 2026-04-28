'use client';

import Title from '@/components/common/Title';
import StoreProductManagement from '@/components/modules/store/StoreProductManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useGetStoreStatsQuery } from '@/store/features/store/storeApi';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';

const getErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') return 'Failed to load store stats.';

  if ('data' in error) {
    const data = (error as { data?: { message?: string; error?: { message?: string } } }).data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }

  if ('message' in error && typeof (error as { message?: string }).message === 'string') {
    return (error as { message: string }).message;
  }

  return 'Failed to load store stats.';
};

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

export default function StorePage() {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetStoreStatsQuery();
  const statsData = data?.data;

  const stats = [
    {
      title: 'Total Products',
      value: statsData?.totalProducts ?? 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Purchases',
      value: statsData?.totalPurchases ?? 0,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Revenue',
      value: currency.format(statsData?.totalRevenue ?? 0),
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Active Products',
      value: statsData?.totalActiveProducts ?? 0,
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <section className="space-y-5 p-5">
      <Title
        title="Store Management"
        description="Create and manage store items with live product and revenue stats."
      />

      {(isLoading || isFetching) && (
        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
          <Spinner className="size-4" /> Loading store stats...
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

      <StoreProductManagement />
    </section>
  );
}
