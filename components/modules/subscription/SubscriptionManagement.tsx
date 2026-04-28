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
import {
  useCreateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  useGetSubscriptionPlansQuery,
  useUpdateSubscriptionPlanMutation,
} from '@/store/features/subscription/subscriptionApi';
import { PlanStatus, SubscriptionPlan } from '@/store/features/subscription/types';
import { Check, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import SubscriptionPlanForm, {
  SubscriptionPlanFormValues,
  toCreatePlanBody,
} from './SubscriptionPlanForm';

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

const SubscriptionManagement = () => {
  const [filter, setFilter] = useState<'all' | PlanStatus>('all');
  const [page, setPage] = useState(1);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<SubscriptionPlan | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetSubscriptionPlansQuery({
    status: filter === 'all' ? undefined : filter,
    page,
    limit: 10,
  });

  const [createPlan, { isLoading: isCreating }] = useCreateSubscriptionPlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdateSubscriptionPlanMutation();
  const [deletePlan, { isLoading: isDeleting }] = useDeleteSubscriptionPlanMutation();

  const plans = data?.data ?? [];
  const meta = data?.meta;

  const handleCreate = async (values: SubscriptionPlanFormValues) => {
    try {
      const response = await createPlan(toCreatePlanBody(values)).unwrap();
      toast.success(response.message || 'Subscription plan created successfully.');
      setPage(1);
      refetch();
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError, 'Failed to create subscription plan.'));
      throw mutationError;
    }
  };

  const handleUpdate = async (values: SubscriptionPlanFormValues, planId?: string) => {
    const id = planId ?? editingPlan?.id;
    if (!id) return;

    try {
      const response = await updatePlan({
        id,
        planName: values.planName,
        stripe_price_id: values.stripe_price_id ?? null,
        stripe_product_id: values.stripe_product_id ?? null,
        features: values.features,
        amount: values.amount,
        recurring: values.recurring,
        currency: values.currency,
        status: values.status,
      }).unwrap();
      toast.success(response.message || 'Subscription plan updated successfully.');
      setEditingPlan(null);
      refetch();
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError, 'Failed to update subscription plan.'));
      throw mutationError;
    }
  };

  const handleDelete = async () => {
    if (!deletingPlan) return;

    try {
      const response = await deletePlan({ id: deletingPlan.id }).unwrap();
      toast.success(response.message || 'Subscription plan deleted successfully.');
      setDeletingPlan(null);
      refetch();
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError, 'Failed to delete subscription plan.'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="bg-background/70 flex items-center rounded-lg border p-1">
          <Button
            type="button"
            variant={filter === 'all' ? 'default' : 'ghost'}
            onClick={() => {
              setFilter('all');
              setPage(1);
            }}
          >
            All
          </Button>
          <Button
            type="button"
            variant={filter === 'ACTIVE' ? 'default' : 'ghost'}
            onClick={() => {
              setFilter('ACTIVE');
              setPage(1);
            }}
          >
            Active
          </Button>
          <Button
            type="button"
            variant={filter === 'INACTIVE' ? 'default' : 'ghost'}
            onClick={() => {
              setFilter('INACTIVE');
              setPage(1);
            }}
          >
            Inactive
          </Button>
        </div>

        <SubscriptionPlanForm
          title="Create Subscription Plan"
          description="Create a new plan for your users."
          onSubmit={handleCreate}
          isLoading={isCreating}
        />
      </div>

      {(isLoading || isFetching) && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="p-0">
              <CardContent className="space-y-4 p-6">
                <div className="bg-muted h-6 w-1/3 animate-pulse rounded" />
                <div className="bg-muted h-16 animate-pulse rounded" />
                <div className="bg-muted h-24 animate-pulse rounded" />
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
              {getErrorMessage(error, 'Failed to load subscription plans.')}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isFetching && !isError && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className="flex flex-col overflow-hidden p-0">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4">
                    <div className="flex justify-between gap-2">
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        {plan.planName}
                      </h3>
                      <p
                        className={`inline-flex h-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase ${
                          plan.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${plan.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                        />
                        {plan.status}
                      </p>
                    </div>

                    <p className="mt-1.5 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6 rounded-lg bg-white/5 p-4">
                    <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                      Amount
                    </p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-zinc-900 dark:text-white">
                        {plan.currency} {plan.amount.toFixed(2)}
                      </span>
                      <span className="text-sm font-medium text-zinc-500">/{plan.recurring}</span>
                    </div>
                  </div>

                  <div className="mb-6 flex-1">
                    <p className="mb-3 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                      Features Included
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.length ? (
                        plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400"
                          >
                            <Check className="size-4 text-emerald-500" strokeWidth={3} />
                            {feature}
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-foreground text-sm">No features configured.</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="destructive"
                      size="icon-lg"
                      onClick={() => setDeletingPlan(plan)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <SubscriptionPlanForm
                      triggerLabel="Edit Plan"
                      title="Update Subscription Plan"
                      description="Update selected plan details."
                      initialValues={plan}
                      onSubmit={(values) => handleUpdate(values, plan.id)}
                      isLoading={isUpdating}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {!plans.length && (
              <Card className="col-span-full border bg-transparent">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Button variant="outline" className="mb-4 size-12 rounded-full" disabled>
                    <Plus className="size-7" />
                  </Button>
                  <h3 className="text-lg font-semibold">No plans available</h3>
                  <p className="text-muted-foreground text-center text-sm">
                    No plans found for current filter.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

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
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <AlertDialog open={Boolean(deletingPlan)} onOpenChange={() => setDeletingPlan(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold">{deletingPlan?.planName}</span>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Plan'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubscriptionManagement;
