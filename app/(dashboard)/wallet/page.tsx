import Title from '@/components/common/Title';
import WalletManagement from '@/components/modules/wallet/WalletManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Wallet as WalletIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Clock,
} from 'lucide-react';

const Wallet = () => {
  // Mock stats - replace with actual API data
  const stats = [
    {
      title: 'Total Payments',
      value: '$58,340',
      icon: WalletIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Store Revenue',
      value: '$35,890',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Subscription Revenue',
      value: '$22,450',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Total Refunds',
      value: '$1,250',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Completed Transactions',
      value: '1,245',
      icon: Clock,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Platform Commission',
      value: '$8,760',
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-500/10',
    },
  ];

  return (
    <section className="space-y-5 p-5">
      <Title
        title="Payment Transactions"
        description="Monitor user payments, store purchases, subscriptions, and refunds"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            View and manage user payments, store purchases, subscriptions, and refunds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WalletManagement />
        </CardContent>
      </Card>
    </section>
  );
};

export default Wallet;
