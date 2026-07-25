import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type MetricCardProps = {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  className?: string;
};

const MetricCard = ({ label, value, icon: Icon, className }: MetricCardProps) => (
  <Card className={cn('gap-0 overflow-hidden py-0', className)}>
    <CardContent className="flex min-h-24 items-center gap-3.5 p-5">
      <div className="border-border-subtle bg-surface-tertiary text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md border">
        <Icon className="size-3.5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-caption-foreground mb-1 text-[11px] font-medium">{label}</p>
        <p className="text-foreground truncate text-2xl leading-none font-semibold tracking-[-0.035em]">
          {value}
        </p>
      </div>
    </CardContent>
  </Card>
);

export default MetricCard;
