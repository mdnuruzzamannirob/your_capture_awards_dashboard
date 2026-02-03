'use client';

import { useState } from 'react';
import { SubscriptionPlanForm } from './SubscriptionPlanForm';
import { SubscriptionPlan } from '@/types';
import { SubscriptionPlanFormData } from '@/lib/schemas/subscriptionSchema';
import { Card, CardContent } from '@/components/ui/card';
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
import { Trash2, Edit2 } from 'lucide-react';

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
    features: ['Unlimited Photos', 'Advanced Editing', 'Priority Support', 'Portfolio Tools'],
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
    features: ['Unlimited Photos', 'Advanced Editing', 'Priority Support', 'Save 16% vs monthly'],
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
    features: ['Unlimited Photos', 'Professional Tools', '24/7 Support', 'Save 17% vs monthly'],
    subscribers: 320,
    isActive: true,
    stripePriceId: 'price_9988776655',
    createdAt: '2024-05-12T13:20:00Z',
    updatedAt: '2025-01-30T13:20:00Z',
  },
];

const SubscriptionManagement = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">
            <span className="text-foreground font-bold">{plans.length}</span>
            <span className="text-muted-foreground"> subscription plans</span>
          </p>
          <p className="text-muted-foreground text-xs">
            <span className="text-foreground font-semibold">
              {plans.filter((p) => p.isActive).length}
            </span>
            {' active'}
          </p>
        </div>
        <SubscriptionPlanForm onSubmit={handleCreatePlan} isLoading={isLoading} />
      </div>

      {/* Plans Grid - Simple Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className="hover:border-primary/50 transition-all hover:shadow-lg">
            <CardContent className="space-y-4 p-6">
              {/* Plan Name & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>
                <Badge
                  variant={plan.isActive ? 'default' : 'outline'}
                  className={plan.isActive ? 'bg-green-600 text-white' : ''}
                >
                  {plan.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Price */}
              <div className="border-t pt-4">
                <p className="text-muted-foreground text-xs">Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.billingCycle}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 border-t pt-4">
                <p className="text-muted-foreground text-xs font-semibold">FEATURES</p>
                <ul className="space-y-1.5">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="text-muted-foreground flex items-center gap-2 text-sm"
                    >
                      <span className="text-primary h-1.5 w-1.5 rounded-full bg-current" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPlan(plan)}
                  className="flex-1"
                >
                  <Edit2 className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedPlan(plan);
                    setIsDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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
