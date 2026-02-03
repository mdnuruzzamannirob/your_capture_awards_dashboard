'use client';

import { useState } from 'react';
import { StoreProductForm } from './StoreProductForm';
import { StoreProduct } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoDotFill } from 'react-icons/go';
import { DollarSign, ShoppingCart, Edit2, Trash2, Package } from 'lucide-react';

const typeColors = {
  key: 'border-amber-500/50 bg-amber-500/10 text-amber-600',
  boost: 'border-purple-500/50 bg-purple-500/10 text-purple-600',
  swap: 'border-pink-500/50 bg-pink-500/10 text-pink-600',
};

const typeIcons = {
  key: '🔑',
  boost: '⚡',
  swap: '🔄',
};

// Mock data
const mockStoreProducts: StoreProduct[] = [
  {
    id: '1',
    productId: 'prod_key_001',
    name: 'Gold Key',
    description: 'Unlock premium features and exclusive content for your account',
    productType: 'key',
    price: 9.99,
    currency: 'USD',
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
    totalPurchases: 1400,
    totalRevenue: 8386.0,
    isActive: false,
    stripeProductId: 'prod_5566778899',
    stripePriceId: 'price_5566778899',
    createdAt: '2024-02-18T16:00:00Z',
    updatedAt: '2025-01-30T12:00:00Z',
  },
];

export default function StoreProductManagement() {
  const [products, setProducts] = useState<StoreProduct[]>(mockStoreProducts);
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<StoreProduct | null>(null);

  const handleCreateProduct = (formData: any) => {
    const newProduct: StoreProduct = {
      id: Date.now().toString(),
      productId: `prod_${formData.productType}_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      productType: formData.productType,
      price: formData.price,
      currency: 'USD',
      totalPurchases: 0,
      totalRevenue: 0,
      isActive: formData.isActive,
      stripeProductId: `stripe_prod_${Date.now()}`,
      stripePriceId: `stripe_price_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (formData: any) => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                description: formData.description,
                productType: formData.productType,
                price: formData.price,
                isActive: formData.isActive,
                updatedAt: new Date().toISOString(),
              }
            : p,
        ),
      );
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = () => {
    if (deletingProduct) {
      setProducts(products.filter((p) => p.id !== deletingProduct.id));
      setDeletingProduct(null);
    }
  };

  const handleToggleActive = (product: StoreProduct) => {
    setProducts(
      products.map((p) =>
        p.id === product.id
          ? { ...p, isActive: !p.isActive, updatedAt: new Date().toISOString() }
          : p,
      ),
    );
  };

  return (
    <div className="min-h-screen space-y-8">
      {/* Summary Statistics */}
      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <h2 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
          Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Items */}
          <div className="flex items-start justify-between rounded-lg border bg-gradient-to-br from-blue-50/50 to-blue-50/0 p-4 dark:from-blue-950/20 dark:to-blue-950/0">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Items</p>
              <p className="mt-2 text-3xl font-bold">{products.length}</p>
              <p className="text-muted-foreground mt-1 text-xs">Purchasable items</p>
            </div>
            <Package className="h-8 w-8 opacity-10" />
          </div>

          {/* Total Purchases */}
          <div className="flex items-start justify-between rounded-lg border bg-gradient-to-br from-green-50/50 to-green-50/0 p-4 dark:from-green-950/20 dark:to-green-950/0">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Purchases</p>
              <p className="mt-2 text-3xl font-bold">
                {products.reduce((acc, p) => acc + p.totalPurchases, 0).toLocaleString()}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">All time</p>
            </div>
            <ShoppingCart className="h-8 w-8 opacity-10" />
          </div>

          {/* Total Revenue */}
          <div className="flex items-start justify-between rounded-lg border bg-gradient-to-br from-purple-50/50 to-purple-50/0 p-4 dark:from-purple-950/20 dark:to-purple-950/0">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
              <p className="mt-2 text-3xl font-bold">
                $
                {products
                  .reduce((acc, p) => acc + p.totalRevenue, 0)
                  .toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">All time</p>
            </div>
            <DollarSign className="h-8 w-8 opacity-10" />
          </div>

          {/* Active Items */}
          <div className="flex items-start justify-between rounded-lg border bg-gradient-to-br from-emerald-50/50 to-emerald-50/0 p-4 dark:from-emerald-950/20 dark:to-emerald-950/0">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Active Items</p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {products.filter((p) => p.isActive).length}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">Currently visible</p>
            </div>
            <GoDotFill className="h-8 w-8 text-green-600 opacity-10" />
          </div>
        </div>
      </div>

      {/* Page Title & Description */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Store Management</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Create and manage purchasable items across all categories. Each item can be purchased
          unlimited times by users.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="bg-card flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2 font-medium">
            All Items
            <Badge variant="secondary">{products.length}</Badge>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 font-medium">
            🔑 Keys
            <Badge variant="secondary">
              {products.filter((p) => p.productType === 'key').length}
            </Badge>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 font-medium">
            ⚡ Boosts
            <Badge variant="secondary">
              {products.filter((p) => p.productType === 'boost').length}
            </Badge>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 font-medium">
            🔄 Swaps
            <Badge variant="secondary">
              {products.filter((p) => p.productType === 'swap').length}
            </Badge>
          </Button>
        </div>
        <StoreProductForm onCreate={handleCreateProduct} />
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
          >
            {/* Card Header */}
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{typeIcons[product.productType]}</span>
                    <Badge
                      variant="outline"
                      className={cn('capitalize', typeColors[product.productType])}
                    >
                      {product.productType}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'flex-shrink-0 gap-1',
                    product.isActive
                      ? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400'
                      : 'border-gray-500/50 bg-gray-500/10 text-gray-700 dark:text-gray-400',
                  )}
                >
                  <GoDotFill className="size-2" />
                  {product.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{product.description}</CardDescription>
            </CardHeader>

            {/* Card Content */}
            <CardContent className="flex-1 space-y-4">
              {/* Price */}
              <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                <span className="text-muted-foreground text-sm font-medium">Price</span>
                <span className="text-primary text-xl font-bold">${product.price.toFixed(2)}</span>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card/50 space-y-1 rounded-lg border p-3">
                  <div className="text-muted-foreground flex items-center gap-1.5">
                    <ShoppingCart className="size-3.5" />
                    <span className="text-xs font-medium">Purchases</span>
                  </div>
                  <p className="text-lg font-semibold">{product.totalPurchases.toLocaleString()}</p>
                </div>
                <div className="bg-card/50 space-y-1 rounded-lg border p-3">
                  <div className="text-muted-foreground flex items-center gap-1.5">
                    <DollarSign className="size-3.5" />
                    <span className="text-xs font-medium">Revenue</span>
                  </div>
                  <p className="text-lg font-semibold text-green-600">
                    $
                    {product.totalRevenue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleToggleActive(product)}
                >
                  {product.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                  <Edit2 className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingProduct(product)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingProduct && (
        <StoreProductForm
          product={editingProduct}
          onUpdate={handleUpdateProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Store Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingProduct?.name}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
