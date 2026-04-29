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
  StoreProductType,
} from '@/store/features/store/types';
import { Key, RefreshCw, Trash2, Zap } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import StoreProductForm from './StoreProductForm';

const typeIcons: Record<StoreProductType, React.ComponentType<{ className?: string }>> = {
  KEY: Key,
  BOOST: Zap,
  SWAP: RefreshCw,
};

const typeColors: Record<
  StoreProductType,
  { bg: string; border: string; icon: string; text: string }
> = {
  KEY: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-800/30',
    icon: 'text-amber-600 dark:text-amber-400',
    text: 'text-amber-700 dark:text-amber-300',
  },
  BOOST: {
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-200 dark:border-purple-800/30',
    icon: 'text-purple-600 dark:text-purple-400',
    text: 'text-purple-700 dark:text-purple-300',
  },
  SWAP: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/20',
    border: 'border-cyan-200 dark:border-cyan-800/30',
    icon: 'text-cyan-600 dark:text-cyan-400',
    text: 'text-cyan-700 dark:text-cyan-300',
  },
};

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

const StoreProductManagement = () => {
  const [filter, setFilter] = useState<StoreProductType>('KEY');
  const [page, setPage] = useState(1);
  const [deletingProduct, setDeletingProduct] = useState<StoreProduct | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetStoreProductsQuery({
    type: filter,
    page,
    limit: 10,
  });

  const [createStoreProduct, { isLoading: isCreating }] = useCreateStoreProductMutation();
  const [updateStoreProduct, { isLoading: isUpdating }] = useUpdateStoreProductMutation();
  const [deleteStoreProduct, { isLoading: isDeleting }] = useDeleteStoreProductMutation();

  const products = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  const handleCreateProduct = async (payload: CreateStoreProductBody) => {
    try {
      const response = await createStoreProduct(payload).unwrap();
      toast.success(response.message || 'Product created successfully.');
      setPage(1);
      refetch();
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError, 'Failed to create product.'));
      throw mutationError;
    }
  };

  const handleUpdateProduct = async (productId: string, payload: CreateStoreProductBody) => {
    try {
      const response = await updateStoreProduct({ productId, ...payload }).unwrap();
      toast.success(response.message || 'Product updated successfully.');
      refetch();
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
      refetch();
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError, 'Failed to delete product.'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 max-sm:flex-col-reverse">
        <div className="bg-background/70 flex items-center rounded-lg border p-1">
          <Button
            type="button"
            variant={filter === 'KEY' ? 'default' : 'ghost'}
            onClick={() => {
              setFilter('KEY');
              setPage(1);
            }}
            className="gap-2"
          >
            <Key className="size-4" />
            Keys
          </Button>
          <Button
            type="button"
            variant={filter === 'BOOST' ? 'default' : 'ghost'}
            onClick={() => {
              setFilter('BOOST');
              setPage(1);
            }}
            className="gap-2"
          >
            <Zap className="size-4" />
            Boosts
          </Button>
          <Button
            type="button"
            variant={filter === 'SWAP' ? 'default' : 'ghost'}
            onClick={() => {
              setFilter('SWAP');
              setPage(1);
            }}
            className="gap-2"
          >
            <RefreshCw className="size-4" />
            Swaps
          </Button>
        </div>
        <StoreProductForm onSubmit={handleCreateProduct} isLoading={isCreating} />
      </div>

      {(isLoading || isFetching) && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-0">
              <CardContent className="space-y-4 p-5">
                <div className="bg-muted h-5 w-1/2 animate-pulse rounded" />
                <div className="bg-muted h-20 animate-pulse rounded" />
                <div className="bg-muted h-9 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Card>
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const Icon = typeIcons[product.productType];
              const colors = typeColors[product.productType];

              return (
                <Card key={product.id} className="p-0">
                  <CardContent className="space-y-4 p-5 text-sm">
                    <div className="flex items-start justify-between">
                      <h3 className="text-foreground leading-tight font-semibold">
                        {product.title}
                      </h3>
                      <p
                        className={`inline-flex h-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase ${
                          product.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : product.status === 'INACTIVE'
                              ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            product.status === 'ACTIVE'
                              ? 'bg-emerald-500'
                              : product.status === 'INACTIVE'
                                ? 'bg-zinc-400'
                                : 'bg-red-500'
                          }`}
                        />
                        {product.status}
                      </p>
                    </div>

                    <div className="bg-muted/30 grid grid-cols-2 gap-3 rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground text-xs">Price</p>
                        <p className="text-foreground font-semibold">
                          {product.currency} {product.amount.toFixed(2)}
                        </p>
                      </div>

                      <div className="space-y-0.5 text-right">
                        <p className="text-muted-foreground text-xs">Stock</p>
                        <p className="text-foreground font-semibold">{product.quantity} units</p>
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-muted-foreground text-xs">Category</p>
                        <div
                          className={`flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${colors.bg} ${colors.border}`}
                        >
                          <Icon className={`size-3.5 ${colors.icon}`} />
                          <span className={colors.text}>{product.productType}</span>
                        </div>
                      </div>

                      <div className="space-y-0.5 text-right">
                        <p className="text-muted-foreground text-xs">Type</p>
                        <p className="text-foreground font-medium">{product.productType}</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground line-clamp-2 text-xs">
                      {product.description || 'No description available.'}
                    </p>

                    <div className="flex items-center gap-2">
                      <StoreProductForm
                        triggerLabel="Edit"
                        title="Update Store Product"
                        description="Update selected product details."
                        initialValues={product}
                        onSubmit={(payload) => handleUpdateProduct(product.id, payload)}
                        isLoading={isUpdating}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setDeletingProduct(product)}
                      >
                        <Trash2 className="size-4" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {!products.length && (
            <Card>
              <CardContent className="text-muted-foreground py-10 text-center text-sm">
                No products found for {filter}.
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-sm">
              Page {meta?.page ?? page} of {meta?.totalPages ?? 1} • Total {meta?.total ?? 0}
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
              Are you sure you want to delete{' '}
              <span className="font-semibold">{deletingProduct?.title}</span>? This action cannot be
              undone.
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
