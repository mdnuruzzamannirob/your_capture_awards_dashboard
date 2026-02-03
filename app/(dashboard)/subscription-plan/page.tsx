'use client';

import { useMemo } from 'react';
import Title from '@/components/common/Title';
import SubscriptionManagement from '@/components/modules/subscription/SubscriptionManagement';
import { SubscriptionPlan } from '@/types';
import { Users, DollarSign, Package, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: '1',
    planId: 'plan_001',
    name: 'Basic Plan',
    description: 'Perfect for getting started with photography sharing',
    price: 4.99,
    currency: 'USD',
    billingCycle: 'monthly',
    features: ['50 GB Storage', 'Up to 1000 Photos', 'Basic Editing Tools', 'Community Access'],
    subscribers: 2450,
    isActive: true,
    stripePriceId: 'price_1234567890',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2025-02-03T10:30:00Z',
  },
  {
    id: '2',
    planId: 'plan_002',
    name: 'Pro Plan',
    description: 'For serious photographers and content creators',
    price: 9.99,
    currency: 'USD',
    billingCycle: 'monthly',
    features: [
      '500 GB Storage',
      'Unlimited Photos',
      'Advanced Editing',
      'Priority Support',
      'Portfolio Tools',
    ],
    subscribers: 1850,
    isActive: true,
    stripePriceId: 'price_0987654321',
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2025-02-02T14:00:00Z',
  },
  {
    id: '3',
    planId: 'plan_003',
    name: 'Premium Plan',
    description: 'Ultimate plan for professional photographers',
    price: 19.99,
    currency: 'USD',
    billingCycle: 'monthly',
    features: [
      '2 TB Storage',
      'Unlimited Photos',
      'Professional Tools',
      '24/7 Support',
      'Analytics Dashboard',
      'Team Collaboration',
    ],
    subscribers: 890,
    isActive: true,
    stripePriceId: 'price_5544332211',
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2025-02-01T09:15:00Z',
  },
  {
    id: '4',
    planId: 'plan_004',
    name: 'Pro Annual',
    description: 'Annual subscription for pro photographers',
    price: 99.99,
    currency: 'USD',
    billingCycle: 'yearly',
    features: [
      '500 GB Storage',
      'Unlimited Photos',
      'Advanced Editing',
      'Priority Support',
      'Save 16% vs monthly',
    ],
    subscribers: 560,
    isActive: true,
    stripePriceId: 'price_1122334455',
    createdAt: '2024-04-05T11:45:00Z',
    updatedAt: '2025-02-03T11:45:00Z',
  },
  {
    id: '5',
    planId: 'plan_005',
    name: 'Premium Annual',
    description: 'Best value annual plan for professionals',
    price: 199.99,
    currency: 'USD',
    billingCycle: 'yearly',
    features: [
      '2 TB Storage',
      'Unlimited Photos',
      'Professional Tools',
      '24/7 Support',
      'Save 17% vs monthly',
    ],
    subscribers: 320,
    isActive: true,
    stripePriceId: 'price_9988776655',
    createdAt: '2024-05-12T13:20:00Z',
    updatedAt: '2025-01-30T13:20:00Z',
  },
];

export default function SubscriptionPlanPage() {
  const stats = useMemo(() => {
    const activePlans = mockSubscriptionPlans.filter((p) => p.isActive);
    const totalSubscribers = mockSubscriptionPlans.reduce((sum, p) => sum + p.subscribers, 0);
    const monthlyRevenue = mockSubscriptionPlans
      .filter((p) => p.billingCycle === 'monthly')
      .reduce((sum, p) => sum + p.price * p.subscribers, 0);
    const yearlyRevenue = mockSubscriptionPlans
      .filter((p) => p.billingCycle === 'yearly')
      .reduce((sum, p) => sum + p.price * p.subscribers, 0);
    const totalRevenue = monthlyRevenue + yearlyRevenue;

    return [
      {
        title: 'Total Plans',
        value: activePlans.length,
        icon: Package,
        color: 'text-blue-600',
        bgColor: 'bg-blue-500/10',
      },
      {
        title: 'Active Subscribers',
        value: totalSubscribers,
        icon: Users,
        color: 'text-green-600',
        bgColor: 'bg-green-500/10',
      },
      {
        title: 'Monthly Revenue',
        value: `$${monthlyRevenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icon: DollarSign,
        color: 'text-purple-600',
        bgColor: 'bg-purple-500/10',
      },
      {
        title: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icon: TrendingUp,
        color: 'text-amber-600',
        bgColor: 'bg-amber-500/10',
      },
    ];
  }, []);

  return (
    <section className="space-y-5 p-5">
      <Title
        title="Subscription Plan"
        description="Manage your subscription plans and view key metrics."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <SubscriptionManagement />
    </section>
  );
}
