'use client';

import { useMemo } from 'react';
import Title from '@/components/common/Title';
import StoreProductManagement from '@/components/modules/store/StoreProductManagement';
import { StoreProduct } from '@/types';
import { ShoppingCart, DollarSign, Package, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const mockStoreProducts: StoreProduct[] = [
  {
    id: '1',
    productId: 'prod_key_001',
    name: 'Gold Key',
    description: 'Unlock premium features and exclusive content for your account',
    productType: 'key',
    price: 9.99,
    currency: 'USD',
    quantity: 150,
    totalPurchases: 1245,
    totalRevenue: 12373.55,
    isActive: true,
    stripeProductId: 'prod_1234567890',
    stripePriceId: 'price_1234567890',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2025-02-03T10:00:00Z',
  },
  {
    id: '2',
    productId: 'prod_key_002',
    name: 'Platinum Key',
    description: 'Maximum access to all premium features and exclusive tools',
    productType: 'key',
    price: 19.99,
    currency: 'USD',
    quantity: 89,
    totalPurchases: 680,
    totalRevenue: 13593.2,
    isActive: true,
    stripeProductId: 'prod_0987654321',
    stripePriceId: 'price_0987654321',
    createdAt: '2024-01-25T09:30:00Z',
    updatedAt: '2025-02-02T09:30:00Z',
  },
  {
    id: '3',
    productId: 'prod_boost_001',
    name: 'Vote Boost',
    description: 'Double your voting power for 24 hours - boost your contest entries',
    productType: 'boost',
    price: 4.99,
    currency: 'USD',
    quantity: 320,
    totalPurchases: 3450,
    totalRevenue: 17215.5,
    isActive: true,
    stripeProductId: 'prod_5544332211',
    stripePriceId: 'price_5544332211',
    createdAt: '2024-02-01T10:15:00Z',
    updatedAt: '2025-02-03T15:00:00Z',
  },
  {
    id: '4',
    productId: 'prod_boost_002',
    name: 'View Boost',
    description: 'Increase visibility of your contest entries for 48 hours',
    productType: 'boost',
    price: 7.99,
    currency: 'USD',
    quantity: 215,
    totalPurchases: 2340,
    totalRevenue: 18696.6,
    isActive: true,
    stripeProductId: 'prod_9988776655',
    stripePriceId: 'price_9988776655',
    createdAt: '2024-02-05T11:30:00Z',
    updatedAt: '2025-02-03T14:45:00Z',
  },
  {
    id: '5',
    productId: 'prod_boost_003',
    name: 'Mega Boost',
    description: 'Triple visibility and double voting power for 7 days',
    productType: 'boost',
    price: 14.99,
    currency: 'USD',
    quantity: 75,
    totalPurchases: 890,
    totalRevenue: 13341.1,
    isActive: true,
    stripeProductId: 'prod_3344556677',
    stripePriceId: 'price_3344556677',
    createdAt: '2024-02-10T13:00:00Z',
    updatedAt: '2025-02-01T10:20:00Z',
  },
  {
    id: '6',
    productId: 'prod_swap_001',
    name: 'Category Swap',
    description: 'Change contest category for your entry after submission',
    productType: 'swap',
    price: 2.99,
    currency: 'USD',
    quantity: 500,
    totalPurchases: 1980,
    totalRevenue: 5920.2,
    isActive: true,
    stripeProductId: 'prod_2233445566',
    stripePriceId: 'price_2233445566',
    createdAt: '2024-02-12T14:15:00Z',
    updatedAt: '2025-02-03T11:10:00Z',
  },
  {
    id: '7',
    productId: 'prod_swap_002',
    name: 'Photo Swap',
    description: 'Replace submitted photo in active contest',
    productType: 'swap',
    price: 3.99,
    currency: 'USD',
    quantity: 340,
    totalPurchases: 1560,
    totalRevenue: 6224.4,
    isActive: true,
    stripeProductId: 'prod_7788990011',
    stripePriceId: 'price_7788990011',
    createdAt: '2024-02-15T15:45:00Z',
    updatedAt: '2025-02-02T16:30:00Z',
  },
  {
    id: '8',
    productId: 'prod_swap_003',
    name: 'Complete Swap',
    description: 'Full entry modification including photo, title, and category',
    productType: 'swap',
    price: 5.99,
    currency: 'USD',
    quantity: 0,
    totalPurchases: 1400,
    totalRevenue: 8386.0,
    isActive: false,
    stripeProductId: 'prod_5566778899',
    stripePriceId: 'price_5566778899',
    createdAt: '2024-02-18T16:00:00Z',
    updatedAt: '2025-01-30T12:00:00Z',
  },
];

export default function StorePage() {
  const stats = useMemo(() => {
    const activeProducts = mockStoreProducts.filter((p) => p.isActive);
    const totalPurchases = mockStoreProducts.reduce((sum, p) => sum + p.totalPurchases, 0);
    const totalRevenue = mockStoreProducts.reduce((sum, p) => sum + p.totalRevenue, 0);
    const avgPrice =
      mockStoreProducts.length > 0
        ? mockStoreProducts.reduce((sum, p) => sum + p.price, 0) / mockStoreProducts.length
        : 0;

    return [
      {
        title: 'Total Products',
        value: mockStoreProducts.length,
        icon: Package,
        color: 'text-blue-600',
        bgColor: 'bg-blue-500/10',
      },
      {
        title: 'Total Purchases',
        value: totalPurchases,
        icon: ShoppingCart,
        color: 'text-green-600',
        bgColor: 'bg-green-500/10',
      },
      {
        title: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icon: DollarSign,
        color: 'text-purple-600',
        bgColor: 'bg-purple-500/10',
      },
      {
        title: 'Active Products',
        value: activeProducts.length,
        icon: TrendingUp,
        color: 'text-amber-600',
        bgColor: 'bg-amber-500/10',
      },
    ];
  }, []);

  return (
    <section className="space-y-5 p-5">
      <Title
        title="Store Management"
        description="Create and manage purchasable items across all categories. Each item can be purchased unlimited times by users."
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

      <StoreProductManagement mockStoreProducts={mockStoreProducts} />
    </section>
  );
}
