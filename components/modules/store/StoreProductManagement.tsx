'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
  useCreateStoreProductMutation,
  useDeleteStoreProductMutation,
  useGetStoreProductsQuery,
  useUpdateStoreProductMutation,
} from '@/store/features/store/storeApi';
import {
  CreateStoreProductBody,
  StoreProduct,
  StoreProductCategory,
} from '@/store/features/store/types';
import { Coins, Package, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import StoreProductForm from './StoreProductForm';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback;

  if ('data' in error) {
    const data = (error as { data?: { message?: string; error?: { message?: string } } }).data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }

  if ('message' in error && typeof (error as { message?: string }).message === 'string') {
    return (error as { message: string }).message;
  }

  return fallback;
};

const categoryMeta: Record<StoreProductCategory, { label: string; icon: typeof Coins }> = {
  COINS: { label: 'Coin packs', icon: Coins },
  BUNDLES: { label: 'Bundles', icon: Package },
};

const categoryStyles: Record<
  StoreProductCategory,
  { tab: string; badge: string }
> = {
  COINS: {
    tab: 'data-[state=active]:bg-orange-500 data-[state=active]:text-white',
    badge: 'bg-orange-500/15 text-orange-300 border-orange-500/20',
  },
  BUNDLES: {
    tab: 'data-[state=active]:bg-slate-100 data-[state=active]:text-slate-950',
    badge: 'bg-slate-100/10 text-slate-100 border-white/10',
  },
};

const StoreProductManagement = () => {
  const [category, setCategory] = useState<StoreProductCategory>('COINS');
  const [page, setPage] = useState(1);
  const [deletingProduct, setDeletingProduct] = useState<StoreProduct | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetStoreProductsQuery({
    category,
    page,
    limit: 10,
  });

  const [createStoreProduct, { isLoading: isCreating }] = useCreateStoreProductMutation();
  const [updateStoreProduct, { isLoading: isUpdating }] = useUpdateStoreProductMutation();
  const [deleteStoreProduct, { isLoading: isDeleting }] = useDeleteStoreProductMutation();

  const products = data?.data ?? [];
  const meta = data?.meta;
  const categoryLabel = categoryMeta[category].label;
  const totalCount = meta?.total ?? 0;

  const handleCreateProduct = async (payload: CreateStoreProductBody) => {
    try {
      const response = await createStoreProduct(payload).unwrap();
      toast.success(response.message || 'Product created successfully.');
      setPage(1);
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError, 'Failed to create product.'));
      throw mutationError;
    }
  };

  const handleUpdateProduct = async (productId: string, payload: CreateStoreProductBody) => {
    try {
      const response = await updateStoreProduct({ productId, ...payload }).unwrap();
      toast.success(response.message || 'Product updated successfully.');
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError, 'Failed to update product.'));
      throw mutationError;
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      const response = await deleteStoreProduct({ productId: deletingProduct.id }).unwrap();
      toast.success(response.message || 'Product deleted successfully.');
      setDeletingProduct(null);
      if (products.length === 1 && page > 1) {
        setPage((prev) => Math.max(1, prev - 1));
      }
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError, 'Failed to delete product.'));
    }
  };

  const renderSkeleton = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden border-white/10 bg-slate-900/90 p-0">
            <CardContent className="space-y-4 p-5 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="bg-white/10 h-4 w-32 animate-pulse rounded" />
                  <div className="bg-white/10 h-5 w-18 animate-pulse rounded-full" />
                </div>
                <div className="bg-white/10 h-5 w-16 animate-pulse rounded-full" />
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="space-y-2">
                  <div className="bg-white/10 h-3 w-10 animate-pulse rounded" />
                  <div className="bg-white/10 h-4 w-20 animate-pulse rounded" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="bg-white/10 ml-auto h-3 w-10 animate-pulse rounded" />
                  <div className="bg-white/10 ml-auto h-4 w-12 animate-pulse rounded" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="bg-white/10 h-3 w-16 animate-pulse rounded" />
                <div className="bg-white/10 h-9 w-full animate-pulse rounded-md" />
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-white/10 h-9 flex-1 animate-pulse rounded-md" />
                <div className="bg-white/10 h-9 w-24 animate-pulse rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="bg-white/10 h-4 w-40 animate-pulse rounded" />
        <div className="flex items-center gap-2">
          <div className="bg-white/10 h-9 w-24 animate-pulse rounded" />
          <div className="bg-white/10 h-9 w-20 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 max-md:flex-col md:items-end">
        <div className="inline-flex rounded-lg border border-white/10 bg-slate-950 p-1">
          {Object.entries(categoryMeta).map(([value, meta]) => {
            const Icon = meta.icon;
            const isActive = category === value;
            const styles = categoryStyles[value as StoreProductCategory];

            return (
              <Button
                key={value}
                type="button"
                variant="ghost"
                data-state={isActive ? 'active' : 'inactive'}
                onClick={() => {
                  setCategory(value as StoreProductCategory);
                  setPage(1);
                }}
                className={`gap-2 ${styles.tab}`}
              >
                <Icon className="size-4" />
                {meta.label}
              </Button>
            );
          })}
        </div>

        <StoreProductForm
          onSubmit={handleCreateProduct}
          isLoading={isCreating}
          defaultCategory={category}
        />
      </div>

      {(isLoading || isFetching) && renderSkeleton()}

      {isError && (
        <Card className="border-white/10 bg-slate-900/90">
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <p className="text-destructive text-sm">
              {getErrorMessage(error, 'Failed to load store products.')}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isFetching && !isError && (
        <>
          <div className="flex items-center justify-between gap-3 max-md:flex-col md:items-start">
            <div>
              <p className="text-sm font-semibold">{categoryLabel}</p>
              <p className="text-muted-foreground text-xs">
                Page {meta?.page ?? page} of {meta?.totalPages ?? 1} · Total {totalCount}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const styles = categoryStyles[product.category];

              return (
                <Card key={product.id} className="overflow-hidden p-0">
                  <CardContent className="space-y-4 p-5 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-foreground leading-tight font-semibold">{product.title}</h3>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${styles.badge}`}>
                        {product.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-3">
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground text-xs">Price</p>
                        <p className="font-semibold">
                          {product.category === 'COINS'
                            ? `${product.amount} ${product.currency}`
                            : `${product.amount} coins`}
                        </p>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <p className="text-muted-foreground text-xs">Stock</p>
                        <p className="font-semibold">{product.quantity}</p>
                      </div>
                    </div>

                    {product.category === 'BUNDLES' ? (
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                          Bundle items
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.items?.length ? (
                            product.items.map((item) => (
                              <span
                                key={`${product.id}-${item.type}`}
                                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs"
                              >
                                {item.type} x {item.quantity}
                              </span>
                            ))
                          ) : (
                            <p className="text-muted-foreground text-xs">No items configured.</p>
                          )}
                        </div>
                      </div>
                    ) : null}

                    <p className="text-muted-foreground line-clamp-2 text-xs">
                      {product.description || 'No description available.'}
                    </p>

                    <div className="flex items-center gap-2">
                      <StoreProductForm
                        triggerLabel="Edit"
                        title="Update Store Product"
                        description="Update this store offer."
                        initialValues={product}
                        onSubmit={(payload) => handleUpdateProduct(product.id, payload)}
                        isLoading={isUpdating}
                      />
                      <Button type="button" variant="destructive" onClick={() => setDeletingProduct(product)}>
                        <Trash2 className="size-4" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {!products.length && (
            <Card className="border-white/10 bg-slate-900/90">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No products found for {categoryLabel}.
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-sm">
              Page {meta?.page ?? page} of {meta?.totalPages ?? 1} · Total {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={(meta?.page ?? page) <= 1 || isFetching}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={(meta?.page ?? page) >= (meta?.totalPages ?? 1) || isFetching}
                onClick={() => setPage((prev) => prev + 1)}
              >
                {isFetching ? <Spinner className="size-4" /> : 'Next'}
              </Button>
            </div>
          </div>
        </>
      )}

      <AlertDialog open={Boolean(deletingProduct)} onOpenChange={() => setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{deletingProduct?.title}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StoreProductManagement;
