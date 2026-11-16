'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CURRENCY_LABELS, SUPPORTED_CURRENCIES } from '@/lib/currency';
import type { ContestFinalValues } from '@/lib/schemas/contestSchema';
import { useFormContext } from 'react-hook-form';

const labelClass = 'text-xs font-medium text-label-foreground data-[error=true]:text-destructive';

// The contest's currency. The entry fee is charged in it through Stripe and
// cash prizes are shown in it.
const ContestCurrencyField = ({ disabled = false }: { disabled?: boolean }) => {
  const form = useFormContext<ContestFinalValues>();

  return (
    <FormField
      control={form.control}
      name="prizes.currency"
      render={({ field }) => (
        <FormItem className="gap-1.5">
          <FormLabel className={labelClass}>Currency</FormLabel>
          <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
            <FormControl>
              <SelectTrigger className="h-8 w-full text-[13px]">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {SUPPORTED_CURRENCIES.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {CURRENCY_LABELS[currency]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-[9px]" />
        </FormItem>
      )}
    />
  );
};

export default ContestCurrencyField;
