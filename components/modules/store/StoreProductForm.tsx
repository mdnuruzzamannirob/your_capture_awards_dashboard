'use client';

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
  CreateStoreProductBody,
  StoreProduct,
  StoreProductStatus,
  StoreProductType,
} from '@/store/features/store/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface StoreProductFormProps {
  onSubmit: (data: CreateStoreProductBody) => Promise<void>;
  triggerLabel?: string;
  title?: string;
  description?: string;
  initialValues?: StoreProduct;
  isLoading?: boolean;
}

const defaultValues: CreateStoreProductBody = {
  title: '',
  description: '',
  type: 'KEY',
  quantity: 1,
  amount: 0,
  currency: 'USD',
  status: 'ACTIVE',
};

const mapInitialValues = (product?: StoreProduct): CreateStoreProductBody => ({
  title: product?.title ?? defaultValues.title,
  description: product?.description ?? defaultValues.description,
  type: product?.productType ?? defaultValues.type,
  quantity: product?.quantity ?? defaultValues.quantity,
  amount: product?.amount ?? defaultValues.amount,
  currency: product?.currency ?? defaultValues.currency,
  status: product?.status ?? defaultValues.status,
});

export default function StoreProductForm({
  onSubmit,
  triggerLabel,
  title,
  description,
  initialValues,
  isLoading = false,
}: StoreProductFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateStoreProductBody>(mapInitialValues(initialValues));

  const handleClose = () => {
    setOpen(false);
    setFormData(mapInitialValues(initialValues));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(formData);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) setFormData(mapInitialValues(initialValues));
      }}
    >
      <DialogTrigger asChild>
        <Button variant={triggerLabel ? 'outline' : 'default'} className="max-sm:w-full">
          {!triggerLabel && <Plus className="size-4" />} {triggerLabel || 'Add New Item'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title || 'Create Store Product'}</DialogTitle>
          <DialogDescription>
            {description || 'Create a new purchasable store item.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="e.g. Bucket of Keys"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="Write product description"
              className="min-h-24"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value as StoreProductType }))
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KEY">KEY</SelectItem>
                  <SelectItem value="BOOST">BOOST</SelectItem>
                  <SelectItem value="SWAP">SWAP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as StoreProductStatus }))
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                  <SelectItem value="DISCONTINUED">DISCONTINUED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min={0}
                value={formData.quantity}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, quantity: Number(event.target.value) || 0 }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min={0}
                value={formData.amount}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, amount: Number(event.target.value) || 0 }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Input
                id="currency"
                value={formData.currency}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, currency: event.target.value.toUpperCase() }))
                }
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : initialValues ? 'Update Product' : 'Create Product'}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
