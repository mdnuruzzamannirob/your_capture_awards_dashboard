'use client';

import MetricCard from '@/components/common/MetricCard';
import Title from '@/components/common/Title';
import WalletManagement from '@/components/modules/wallet/WalletManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetTransactionStatsQuery } from '@/store/features/wallet/walletApi';
import { DollarSign, ShoppingCart, Wallet as WalletIcon } from 'lucide-react';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const getErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') return 'Failed to load transaction stats.';

  if ('data' in error) {
    const data = (error as { data?: { message?: string; error?: { message?: string } } }).data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }

  if ('message' in error && typeof (error as { message?: string }).message === 'string') {
    return (error as { message: string }).message;
  }

  return 'Failed to load transaction stats.';
};

const Wallet = () => {
  const { data, isError, error, refetch } = useGetTransactionStatsQuery();

  const statsData = data?.data;
  const stats = [
    {
      title: 'Total Successful Payments',
      value: statsData?.totalSuccessfulPayments ?? 0,
      icon: WalletIcon,
    },
    {
      title: 'This Month Revenue',
      value: currency.format(statsData?.thisMonthTotalRevenue ?? 0),
      icon: DollarSign,
    },
    {
      title: 'Store Revenue',
      value: currency.format(statsData?.totalStoreRevenue ?? 0),
      icon: ShoppingCart,
    },
  ];

  return (
    <section className="dashboard-page space-y-5">
      <Title
        title="Payment Transactions"
        description="Monitor store and subscription transactions with live wallet stats"
      />

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

      <div className="mb-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {stats.map((stat) => (
          <MetricCard
            key={stat.title}
            label={stat.title}
            value={typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <WalletManagement />
    </section>
  );
};

export default Wallet;
