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
  StoreBundleItemType,
  StoreProduct,
  StoreProductCategory,
  StoreProductStatus,
} from '@/store/features/store/types';
import { Check, ImageIcon, Plus, Trash2, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

interface StoreProductFormProps {
  onSubmit: (data: CreateStoreProductBody) => Promise<void>;
  triggerLabel?: string;
  title?: string;
  description?: string;
  initialValues?: StoreProduct;
  defaultCategory?: StoreProductCategory;
  isLoading?: boolean;
}

type BundleItemDraft = { type: StoreBundleItemType; quantity: number };

type FormState = {
  title: string;
  description: string;
  category: StoreProductCategory;
  quantity: number;
  amount: number;
  currency: string;
  status: StoreProductStatus;
  image: File | null;
  imagePreview: string;
  items: BundleItemDraft[];
};

type FormErrors = Partial<
  Record<
    | 'title'
    | 'category'
    | 'description'
    | 'status'
    | 'quantity'
    | 'amount'
    | 'currency'
    | 'items'
    | 'image',
    string
  >
>;

const bundleTypes: StoreBundleItemType[] = ['KEY', 'BOOST', 'SWAP'];
const emptyItem = (type: StoreBundleItemType = 'KEY'): BundleItemDraft => ({ type, quantity: 1 });

const normalizeItems = (items?: StoreProduct['items']) => {
  const existing = items ?? [];
  if (!existing.length) return [emptyItem()];
  return existing.slice(0, 3).map((i) => ({ type: i.type, quantity: i.quantity }));
};

const mapInitialValues = (
  product?: StoreProduct,
  fallbackCategory: StoreProductCategory = 'COINS',
): FormState => {
  const category = product?.category ?? fallbackCategory;

  return {
    title: product?.title ?? '',
    description: product?.description ?? '',
    category,
    quantity: category === 'BUNDLES' ? 1 : (product?.quantity ?? 1),
    amount: product?.amount ?? 0,
    currency: product?.currency ?? (category === 'BUNDLES' ? 'COINS' : 'USD'),
    status: product?.status ?? 'ACTIVE',
    image: null,
    imagePreview: product?.image ?? '',
    items: category === 'BUNDLES' ? normalizeItems(product?.items) : [],
  };
};

const statusOptions: Array<{ value: StoreProductStatus; label: string }> = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const schema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  description: z.string().trim().optional(),
  category: z.enum(['COINS', 'BUNDLES']),
  quantity: z.number().gt(0, 'Quantity is required.').optional(),
  amount: z.number().gt(0, 'Amount is required.'),
  currency: z.string().trim().min(1, 'Currency is required.'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  image: z
    .any()
    .refine((v) => !!v || (typeof v === 'string' && v.length > 0), 'Image is required.'),
  items: z.array(
    z.object({
      type: z.enum(['KEY', 'BOOST', 'SWAP']),
      quantity: z.number().gt(0, 'Qty is required.'),
    }),
  ),
});

export default function StoreProductForm({
  onSubmit,
  triggerLabel,
  title,
  description,
  initialValues,
  defaultCategory = 'COINS',
  isLoading = false,
}: StoreProductFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormState>(() =>
    mapInitialValues(initialValues, defaultCategory),
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditMode = Boolean(initialValues);
  const isBundle = formData.category === 'BUNDLES';

  const formTitle = useMemo(
    () => title || (isEditMode ? 'Update Store Product' : 'Create Store Product'),
    [isEditMode, title],
  );

  const resetForm = (nextCategory = defaultCategory) => {
    setFormData(mapInitialValues(initialValues, nextCategory));
    setErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleCategoryChange = (nextCategory: StoreProductCategory) => {
    setFormData((prev) => ({
      ...prev,
      category: nextCategory,
      quantity: nextCategory === 'BUNDLES' ? 1 : prev.quantity || 1,
      currency: nextCategory === 'COINS' ? 'USD' : 'COINS',
      items:
        nextCategory === 'BUNDLES'
          ? prev.items.length
            ? prev.items.slice(0, 3)
            : [emptyItem()]
          : [],
    }));
    setErrors((prev) => ({ ...prev, category: undefined }));
  };

  const handleImageChange = (file?: File | null) => {
    setFormData((prev) => {
      if (prev.imagePreview.startsWith('blob:')) URL.revokeObjectURL(prev.imagePreview);
      return {
        ...prev,
        image: file ?? null,
        imagePreview: file ? URL.createObjectURL(file) : (initialValues?.image ?? ''),
      };
    });
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  useEffect(() => {
    return () => {
      if (formData.imagePreview.startsWith('blob:')) URL.revokeObjectURL(formData.imagePreview);
    };
  }, [formData.imagePreview]);

  const availableTypes = bundleTypes.filter(
    (type) => !formData.items.some((item) => item.type === type),
  );

  const handleAddBundleItem = () => {
    if (formData.items.length >= 3 || availableTypes.length === 0) return;
    setFormData((prev) => ({ ...prev, items: [...prev.items, emptyItem(availableTypes[0])] }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      quantity: isBundle ? 1 : formData.quantity,
      amount: formData.amount,
      currency: formData.currency,
      status: formData.status,
      image: formData.image,
      items: isBundle ? formData.items : [],
    };

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      const nextErrors: FormErrors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormErrors | undefined;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      });
      if (isBundle && formData.items.length < 1) nextErrors.items = 'Add at least one bundle item.';
      setErrors(nextErrors);
      return;
    }

    await onSubmit({
      ...payload,
      quantity: isBundle ? 1 : payload.quantity,
      items: isBundle ? payload.items : [],
    });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) resetForm(initialValues?.category ?? defaultCategory);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={triggerLabel ? 'outline' : 'default'} className="max-sm:w-full">
          {!triggerLabel && <Plus className="size-4" />} {triggerLabel || 'Add New Item'}
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[95vh] max-w-[95vw] flex-col overflow-hidden border-2 max-sm:p-3 sm:max-h-[85vh] sm:max-w-[500px]">
        <DialogHeader className="shrink-0">
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>
            {description || 'Create or update a coin pack or bundle offer.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto pb-3">
            <div className="space-y-4 py-1 pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, title: e.target.value }));
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }}
                    placeholder="e.g. Yc Max Pro"
                    required
                  />
                  {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => handleCategoryChange(v as StoreProductCategory)}
                    disabled={isEditMode}
                  >
                    <SelectTrigger id="category" className="h-11! w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COINS">COINS</SelectItem>
                      <SelectItem value="BUNDLES">BUNDLES</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-destructive text-xs">{errors.category}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, description: e.target.value }));
                    setErrors((prev) => ({ ...prev, description: undefined }));
                  }}
                  placeholder="Write product description"
                  className="min-h-20 resize-none"
                />
                {errors.description && (
                  <p className="text-destructive text-xs">{errors.description}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Status *</Label>
                <div className="inline-flex w-full rounded-lg border p-1">
                  {statusOptions.map((opt) => {
                    const active = formData.status === opt.value;
                    return (
                      <Button
                        key={opt.value}
                        type="button"
                        variant={active ? 'default' : 'ghost'}
                        size="sm"
                        className="flex-1 gap-1.5"
                        onClick={() => {
                          setFormData((p) => ({ ...p, status: opt.value }));
                          setErrors((prev) => ({ ...prev, status: undefined }));
                        }}
                      >
                        {active && <Check className="size-3.5" />}
                        {opt.label}
                      </Button>
                    );
                  })}
                </div>
                {errors.status && <p className="text-destructive text-xs">{errors.status}</p>}
              </div>

              {isBundle ? (
                <div className="space-y-1.5">
                  <Label htmlFor="amount">Coin *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min={0}
                    value={formData.amount}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, amount: Number(e.target.value) || 0 }));
                      setErrors((prev) => ({ ...prev, amount: undefined }));
                    }}
                    required
                  />
                  {errors.amount && <p className="text-destructive text-xs">{errors.amount}</p>}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={0}
                      value={formData.quantity}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, quantity: Number(e.target.value) || 0 }));
                        setErrors((prev) => ({ ...prev, quantity: undefined }));
                      }}
                      required
                    />
                    {errors.quantity && (
                      <p className="text-destructive text-xs">{errors.quantity}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min={0}
                      value={formData.amount}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, amount: Number(e.target.value) || 0 }));
                        setErrors((prev) => ({ ...prev, amount: undefined }));
                      }}
                      required
                    />
                    {errors.amount && <p className="text-destructive text-xs">{errors.amount}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="currency">Currency *</Label>
                    <Input
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, currency: e.target.value.toUpperCase() }));
                        setErrors((prev) => ({ ...prev, currency: undefined }));
                      }}
                      required
                    />
                    {errors.currency && (
                      <p className="text-destructive text-xs">{errors.currency}</p>
                    )}
                  </div>
                </div>
              )}

              {isBundle && (
                <div className="space-y-3 rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Bundle Items</p>
                      <p className="text-muted-foreground text-xs">
                        Up to 3 - KEY, BOOST, and SWAP can each appear once.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddBundleItem}
                      disabled={formData.items.length >= 3 || availableTypes.length === 0}
                    >
                      <Plus className="mr-1 size-3.5" />
                      Add item
                    </Button>
                  </div>

                  <div className="grid grid-cols-[1fr_100px_36px] gap-3 px-1">
                    <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                      Type
                    </span>
                    <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                      Qty
                    </span>
                    <span />
                  </div>

                  <div className="space-y-2">
                    {formData.items.map((item, index) => {
                      const options: StoreBundleItemType[] = [
                        item.type,
                        ...availableTypes.filter((t) => t !== item.type),
                      ];

                      return (
                        <div
                          key={`${item.type}-${index}`}
                          className="grid grid-cols-[1fr_100px_36px] items-center gap-3"
                        >
                          <Select
                            value={item.type}
                            onValueChange={(v) =>
                              setFormData((prev) => {
                                const next = [...prev.items];
                                next[index] = { ...next[index], type: v as StoreBundleItemType };
                                return { ...prev, items: next };
                              })
                            }
                          >
                            <SelectTrigger className="h-11! w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const next = [...prev.items];
                                next[index] = {
                                  ...next[index],
                                  quantity: Number(e.target.value) || 1,
                                };
                                return { ...prev, items: next };
                              })
                            }
                            placeholder="Qty"
                            required
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive size-9 shrink-0"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                items: prev.items.filter((_, i) => i !== index),
                              }))
                            }
                            disabled={formData.items.length <= 1}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  {errors.items && <p className="text-destructive text-xs">{errors.items}</p>}
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Image</Label>
                <div className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
                  <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md border">
                    {formData.imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formData.imagePreview}
                        alt="Product"
                        className="size-10 rounded-md object-cover"
                      />
                    ) : (
                      <ImageIcon className="text-muted-foreground size-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-tight font-medium">
                      {formData.imagePreview ? 'Image selected' : 'No image selected'}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      JPG, PNG or WEBP - displayed on the product card.
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {formData.imagePreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive text-xs"
                        onClick={() => handleImageChange(null)}
                      >
                        Remove
                      </Button>
                    )}
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="mr-1.5 size-3.5" />
                          Upload
                        </span>
                      </Button>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                    />
                  </div>
                </div>
                {errors.image && <p className="text-destructive text-xs">{errors.image}</p>}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
