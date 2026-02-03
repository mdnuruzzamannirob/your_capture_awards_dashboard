'use client';

import { useState } from 'react';
import { StoreProductForm } from './StoreProductForm';
import { StoreProduct } from '@/types';
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
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2, Key, Zap, RefreshCw } from 'lucide-react';

const typeIcons = {
  key: Key,
  boost: Zap,
  swap: RefreshCw,
};

const typeColors = {
  key: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-800/30',
    icon: 'text-amber-600 dark:text-amber-400',
    text: 'text-amber-700 dark:text-amber-300',
  },
  boost: {
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-200 dark:border-purple-800/30',
    icon: 'text-purple-600 dark:text-purple-400',
    text: 'text-purple-700 dark:text-purple-300',
  },
  swap: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/20',
    border: 'border-cyan-200 dark:border-cyan-800/30',
    icon: 'text-cyan-600 dark:text-cyan-400',
    text: 'text-cyan-700 dark:text-cyan-300',
  },
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
    quantity: 150,
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
    isActive: false,
    stripeProductId: 'prod_5566778899',
    stripePriceId: 'price_5566778899',
    createdAt: '2024-02-18T16:00:00Z',
    updatedAt: '2025-01-30T12:00:00Z',
  },
];

interface StoreProductManagementProps {
  mockStoreProducts?: StoreProduct[];
}

export default function StoreProductManagement({
  mockStoreProducts: initialProducts,
}: StoreProductManagementProps = {}) {
  const [products, setProducts] = useState<StoreProduct[]>(initialProducts || mockStoreProducts);
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<StoreProduct | null>(null);
  const [filter, setFilter] = useState<'all' | 'key' | 'boost' | 'swap'>('all');

  const handleCreateProduct = (formData: any) => {
    const newProduct: StoreProduct = {
      id: Date.now().toString(),
      productId: `prod_${formData.productType}_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      productType: formData.productType,
      price: formData.price,
      currency: 'USD',
      quantity: formData.quantity || 0,
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
                quantity: formData.quantity || 0,
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

  const filteredProducts = products.filter((product) => {
    if (filter === 'all') return true;
    return product.productType === filter;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="bg-background/70 flex items-center rounded-lg border p-1">
          <Button
            type="button"
            variant={filter === 'all' ? 'default' : 'ghost'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            type="button"
            variant={filter === 'key' ? 'default' : 'ghost'}
            onClick={() => setFilter('key')}
            className="gap-2"
          >
            <Key className="h-4 w-4" />
            Keys
          </Button>
          <Button
            type="button"
            variant={filter === 'boost' ? 'default' : 'ghost'}
            onClick={() => setFilter('boost')}
            className="gap-2"
          >
            <Zap className="h-4 w-4" />
            Boosts
          </Button>
          <Button
            type="button"
            variant={filter === 'swap' ? 'default' : 'ghost'}
            onClick={() => setFilter('swap')}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Swaps
          </Button>
        </div>
        <StoreProductForm onCreate={handleCreateProduct} />
      </div>

      {/* Products Grid - Clean & Beautiful */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="p-0">
            <CardContent className="space-y-4 p-5 text-sm">
              {/* Header */}
              <div className="flex items-start justify-between">
                <h3 className="text-foreground leading-tight font-semibold">{product.name}</h3>

                {/* Status */}
                <p
                  className={`inline-flex h-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase ${
                    product.isActive
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${product.isActive ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                  />
                  {product.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>

              {/* Main Info */}
              <div className="bg-muted/30 grid grid-cols-2 gap-3 rounded-lg border p-3">
                {/* Price */}
                <div className="space-y-0.5">
                  <p className="text-muted-foreground text-xs">Price</p>
                  <p className="text-foreground font-semibold">${product.price.toFixed(2)}</p>
                </div>

                {/* Stock */}
                <div className="space-y-0.5 text-right">
                  <p className="text-muted-foreground text-xs">Stock</p>
                  <p className="text-foreground font-semibold">{product.quantity} units</p>
                </div>

                {/* Category */}
                <div className="space-y-0.5">
                  <p className="text-muted-foreground text-xs">Category</p>

                  {(() => {
                    const Icon = typeIcons[product.productType];
                    const colors = typeColors[product.productType];

                    return (
                      <div
                        className={`flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${colors.bg} ${colors.border}`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${colors.icon}`} />

                        <span className={`${colors.text} capitalize`}>{product.productType}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Currency */}
                <div className="space-y-0.5 text-right">
                  <p className="text-muted-foreground text-xs">Currency</p>
                  <p className="text-foreground font-medium">{product.currency}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  size="icon-lg"
                  variant="destructive"
                  onClick={() => setDeletingProduct(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditingProduct(product)}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
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
