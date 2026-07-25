'use client';

import MetricCard from '@/components/common/MetricCard';
import Title from '@/components/common/Title';
import StoreProductManagement from '@/components/modules/store/StoreProductManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetStoreStatsQuery } from '@/store/features/store/storeApi';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [isMounted, setIsMounted] = useState(false);
  const { data, isError, error, refetch } = useGetStoreStatsQuery();
  const statsData = data?.data;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const stats = [
    {
      title: 'Total Products',
      value: statsData?.totalProducts ?? 0,
      icon: Package,
    },
    {
      title: 'Total Purchases',
      value: statsData?.totalPurchases ?? 0,
      icon: ShoppingCart,
    },
    {
      title: 'Total Revenue',
      value: currency.format(statsData?.totalRevenue ?? 0),
      icon: DollarSign,
    },
    {
      title: 'Active Products',
      value: statsData?.totalActiveProducts ?? 0,
      icon: TrendingUp,
    },
  ];

  return (
    <section className="space-y-5">
      <Title
        title="Store Management"
        description="Create and manage store items with live product and revenue stats."
      />

      {isMounted && isError && (
        <Card>
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <p className="text-destructive text-sm">{getErrorMessage(error)}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mb-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <MetricCard
            key={stat.title}
            label={stat.title}
            value={
              isMounted
                ? typeof stat.value === 'number'
                  ? stat.value.toLocaleString()
                  : stat.value
                : '—'
            }
            icon={stat.icon}
          />
        ))}
      </div>

      {isMounted ? <StoreProductManagement /> : null}
    </section>
  );
}
