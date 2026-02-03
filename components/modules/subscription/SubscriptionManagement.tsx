'use client';

import { useState } from 'react';
import { SubscriptionPlanForm } from './SubscriptionPlanForm';
import { SubscriptionPlan } from '@/types';
import { SubscriptionPlanFormData } from '@/lib/schemas/subscriptionSchema';
import { Card, CardContent } from '@/components/ui/card';
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
import { Trash2, Edit2, Check, Plus } from 'lucide-react';

const SubscriptionManagement = ({
  mockSubscriptionPlans,
}: {
  mockSubscriptionPlans: SubscriptionPlan[];
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const handleCreatePlan = (formData: SubscriptionPlanFormData) => {
    setIsLoading(true);
    setTimeout(() => {
      const newPlan: SubscriptionPlan = {
        id: (plans.length + 1).toString(),
        planId: `plan_${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        currency: 'USD',
        billingCycle: formData.billingCycle,
        features: formData.features,
        subscribers: 0,
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPlans([...plans, newPlan]);
      setIsLoading(false);
    }, 500);
  };

  const handleUpdatePlan = (formData: SubscriptionPlanFormData) => {
    if (!editingPlan) return;
    setIsLoading(true);
    setTimeout(() => {
      setPlans(
        plans.map((p) =>
          p.id === editingPlan.id
            ? {
                ...p,
                name: formData.name,
                description: formData.description,
                price: formData.price,
                billingCycle: formData.billingCycle,
                features: formData.features,
                isActive: formData.isActive,
                updatedAt: new Date().toISOString(),
              }
            : p,
        ),
      );
      setEditingPlan(null);
      setIsLoading(false);
    }, 500);
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter((p) => p.id !== planId));
    setIsDeleteOpen(false);
    setSelectedPlan(null);
  };

  const filteredPlans = plans.filter((plan) => {
    if (filter === 'active') return plan.isActive;
    if (filter === 'inactive') return !plan.isActive;
    return true;
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
            variant={filter === 'active' ? 'default' : 'ghost'}
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            type="button"
            variant={filter === 'inactive' ? 'default' : 'ghost'}
            onClick={() => setFilter('inactive')}
          >
            Inactive
          </Button>
        </div>
        <SubscriptionPlanForm onSubmit={handleCreatePlan} isLoading={isLoading} />
      </div>

      {/* Plans Grid - Modern Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className="flex flex-col overflow-hidden p-0">
            <CardContent className="flex h-full flex-col p-6">
              {/* 1. Title & Description */}
              <div className="mb-4">
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {plan.name}
                  </h3>
                  {/* 2. Status Badge */}
                  <p
                    className={`inline-flex h-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase ${
                      plan.isActive
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${plan.isActive ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                    />
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>

                <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                  {plan.description}
                </p>
              </div>

              {/* 2. Pricing Section */}
              <div className="mb-6 rounded-lg bg-white/5 p-4">
                <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Monthly Price
                </p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-zinc-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-sm font-medium text-zinc-500">/{plan.billingCycle}</span>
                </div>
              </div>

              {/* 3. Features */}
              <div className="mb-6 flex-1">
                <p className="mb-3 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Features Included:
                </p>
                <ul className="space-y-2.5">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400"
                    >
                      <Check className="h-4 w-4 text-emerald-500" strokeWidth={3} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  size="icon-lg"
                  onClick={() => {
                    setSelectedPlan(plan);
                    setIsDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  onClick={() => setEditingPlan(plan)}
                  variant="outline"
                  className="flex-1"
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State - Modernized */}
        {filteredPlans.length === 0 && (
          <Card className="col-span-full border border-zinc-200 bg-transparent dark:border-zinc-800">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Button variant="outline" className="mb-4 size-12 rounded-full">
                <Plus className="size-7" />
              </Button>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                No plans available
              </h3>
              <p className="text-muted-foreground text-center text-sm">
                It seems you haven&apos;t created any plans yet. <br /> Start by adding a new one!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background mx-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg shadow-lg">
            <div className="border-b p-6">
              <h2 className="text-lg font-semibold">Edit Subscription Plan</h2>
            </div>
            <div className="p-6">
              <SubscriptionPlanForm
                plan={editingPlan}
                onSubmit={handleUpdatePlan}
                isLoading={isLoading}
              />
            </div>
            <div className="border-t p-6">
              <Button
                variant="outline"
                onClick={() => setEditingPlan(null)}
                className="w-full"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold">{selectedPlan?.name}</span>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedPlan && handleDeletePlan(selectedPlan.id)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Plan
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubscriptionManagement;
