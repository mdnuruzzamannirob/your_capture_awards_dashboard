'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubscriptionPlan } from '@/types';
import { subscriptionPlanSchema, SubscriptionPlanFormData } from '@/lib/schemas/subscriptionSchema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface SubscriptionPlanFormProps {
  plan?: SubscriptionPlan;
  onSubmit: (data: SubscriptionPlanFormData) => void;
  isLoading?: boolean;
}

const SubscriptionPlanForm = ({ plan, onSubmit, isLoading = false }: SubscriptionPlanFormProps) => {
  const [open, setOpen] = useState(false);
  const [features, setFeatures] = useState<string[]>(plan?.features || []);
  const [featureInput, setFeatureInput] = useState('');

  const form = useForm<SubscriptionPlanFormData>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues: {
      name: plan?.name || '',
      description: plan?.description || '',
      price: plan?.price || 0,
      billingCycle: plan?.billingCycle || 'monthly',
      features: plan?.features || [],
      isActive: plan?.isActive ?? true,
    },
  });

  const handleAddFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      const newFeatures = [...features, featureInput.trim()];
      setFeatures(newFeatures);
      form.setValue('features', newFeatures);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    form.setValue('features', newFeatures);
  };

  const handleSubmit = async (data: SubscriptionPlanFormData) => {
    data.features = features;
    onSubmit(data);
    setOpen(false);
    setFeatures([]);
    setFeatureInput('');
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/90 max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl border p-0 shadow-xl">
        <div className="border-b px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {plan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
            </DialogTitle>
            <DialogDescription>
              {plan
                ? 'Update the subscription plan details below'
                : 'Fill in the details to create a new subscription plan'}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Plan Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Pro Plan, Premium Plan"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what this plan offers..."
                        disabled={isLoading}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Brief description of the plan benefits</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price & Billing */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="9.99"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingCycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Cycle</FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Storage & Photo Limits */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="maxStorage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Storage (GB)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="50"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxPhotos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Photos</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1000"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Features */}
              <FormItem>
                <FormLabel>Features</FormLabel>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    placeholder="Add a feature..."
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    disabled={isLoading || features.length >= 10}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddFeature}
                    disabled={!featureInput.trim() || isLoading || features.length >= 10}
                    className="sm:w-24"
                  >
                    Add
                  </Button>
                </div>
                {features.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="ml-1 hover:opacity-70"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                {features.length === 0 && (
                  <p className="text-muted-foreground text-xs">Add at least one feature</p>
                )}
                {features.length >= 10 && (
                  <p className="text-destructive text-xs">Maximum 10 features reached</p>
                )}
              </FormItem>

              {/* Active Status */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="bg-muted/60 flex flex-row items-center justify-between rounded-xl border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Plan</FormLabel>
                      <FormDescription>Enable this plan for users to subscribe</FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Saving...' : plan ? 'Update Plan' : 'Create Plan'}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionPlanForm;
export { SubscriptionPlanForm };
