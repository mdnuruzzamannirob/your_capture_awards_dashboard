'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { StoreProduct, StoreProductType } from '@/types';
import { Plus, Edit2 } from 'lucide-react';

interface StoreProductFormProps {
  product?: StoreProduct;
  onCreate?: (data: Partial<StoreProduct>) => void;
  onUpdate?: (data: Partial<StoreProduct>) => void;
  onClose?: () => void;
  defaultType?: StoreProductType;
  isLoading?: boolean;
}

export default function StoreProductForm({
  product,
  onCreate,
  onUpdate,
  onClose,
  defaultType = 'key',
  isLoading = false,
}: StoreProductFormProps) {
  const [open, setOpen] = useState(!!product);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    productType: product?.productType || (defaultType as StoreProductType),
    price: product?.price || 0,
    isActive: product?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product && onUpdate) {
      onUpdate(formData);
    } else if (!product && onCreate) {
      onCreate(formData);
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) handleClose();
      }}
    >
      <DialogTrigger asChild>
        <Button variant={product ? 'outline' : 'default'}>
          {product ? (
            <>
              <Edit2 className="size-4" />
              Edit Item
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Add New Item
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Purchasable Item' : 'Add New Purchasable Item'}
          </DialogTitle>
          <DialogDescription>
            {product ? 'Update item details' : 'Create a new store item for users to purchase'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Gold Key, Vote Boost, Category Swap"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this item does for users..."
              className="min-h-24"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Item Type *</Label>
              <Select
                value={formData.productType}
                onValueChange={(value) =>
                  setFormData({ ...formData, productType: value as StoreProductType })
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="key">Key </SelectItem>
                  <SelectItem value="boost">Boost </SelectItem>
                  <SelectItem value="swap">Swap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">$</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="9.99"
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
            <div className="flex items-start gap-3">
              <div className="text-2xl text-blue-600 dark:text-blue-400">ℹ️</div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Unlimited Purchase Item
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  This item has no quantity limit. Users can purchase it as many times as they want.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted flex items-center gap-2 rounded-lg p-3">
            <input
              type="checkbox"
              id="active"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="border-input rounded border"
            />
            <Label htmlFor="active" className="flex-1 cursor-pointer">
              Active Item (visible to users)
            </Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : product ? 'Update Item' : 'Create Item'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
