'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  CreateSubscriptionPlanBody,
  PlanName,
  PlanRecurring,
  PlanStatus,
  SubscriptionPlan,
} from '@/store/features/subscription/types';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

export interface SubscriptionPlanFormValues {
  planName: PlanName;
  features: string[];
  description: string;
  amount: number;
  recurring: PlanRecurring;
  currency: string;
  status: PlanStatus;
  stripe_price_id?: string | null;
  stripe_product_id?: string | null;
}

interface SubscriptionPlanFormProps {
  triggerLabel?: string;
  title: string;
  description: string;
  initialValues?: SubscriptionPlan;
  onSubmit: (values: SubscriptionPlanFormValues) => Promise<void>;
  isLoading?: boolean;
}

export const SubscriptionPlanForm = ({
  triggerLabel,
  title,
  description,
  initialValues,
  onSubmit,
  isLoading = false,
}: SubscriptionPlanFormProps) => {
  const [open, setOpen] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [formData, setFormData] = useState<SubscriptionPlanFormValues>({
    planName: initialValues?.planName ?? 'FREE',
    features: initialValues?.features ?? [],
    description: initialValues?.description ?? '',
    amount: initialValues?.amount ?? 0,
    recurring: initialValues?.recurring ?? 'MONTHLY',
    currency: initialValues?.currency ?? 'USD',
    status: initialValues?.status ?? 'ACTIVE',
    stripe_price_id: initialValues?.stripe_price_id ?? null,
    stripe_product_id: initialValues?.stripe_product_id ?? null,
  });

  const addFeature = () => {
    const value = featureInput.trim();
    if (!value || formData.features.includes(value)) return;
    setFormData((prev) => ({ ...prev, features: [...prev.features, value] }));
    setFeatureInput('');
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, featureIndex) => featureIndex !== index),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerLabel ? 'outline' : 'default'}>
          {!triggerLabel && <Plus className="size-4" />} {triggerLabel || 'Add Plan'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Plan Name *</Label>
              <Select
                value={formData.planName}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, planName: value as PlanName }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">FREE</SelectItem>
                  <SelectItem value="PRO">PRO</SelectItem>
                  <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as PlanStatus }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, description: event.target.value }))
              }
              className="min-h-24"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={formData.amount}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, amount: Number(event.target.value) || 0 }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Recurring *</Label>
              <Select
                value={formData.recurring}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, recurring: value as PlanRecurring }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONETIME">ONETIME</SelectItem>
                  <SelectItem value="MONTHLY">MONTHLY</SelectItem>
                  <SelectItem value="YEARLY">YEARLY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency *</Label>
              <Input
                value={formData.currency}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, currency: event.target.value.toUpperCase() }))
                }
                required
              />
            </div>
          </div>

          {initialValues && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Stripe Price ID</Label>
                <Input
                  value={formData.stripe_price_id || ''}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      stripe_price_id: event.target.value || null,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Stripe Product ID</Label>
                <Input
                  value={formData.stripe_product_id || ''}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      stripe_product_id: event.target.value || null,
                    }))
                  }
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={featureInput}
                onChange={(event) => setFeatureInput(event.target.value)}
                placeholder="Add feature"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addFeature();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
                disabled={!featureInput.trim()}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.features.map((feature, index) => (
                <Badge key={`${feature}-${index}`} variant="secondary" className="gap-1">
                  {feature}
                  <button type="button" onClick={() => removeFeature(index)}>
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialValues ? 'Update Plan' : 'Create Plan'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const toCreatePlanBody = (
  values: SubscriptionPlanFormValues,
): CreateSubscriptionPlanBody => ({
  planName: values.planName,
  features: values.features,
  description: values.description,
  amount: values.amount,
  recurring: values.recurring,
  currency: values.currency,
  status: values.status,
});

export default SubscriptionPlanForm;
