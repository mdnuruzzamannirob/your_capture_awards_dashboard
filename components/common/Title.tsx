import { cn } from '@/lib/utils';

type TitleProps = {
  title: string;
  description?: string;
  className?: string;
};

const Title = ({ title, description, className }: TitleProps) => {
  return (
    <div className={cn('border-border-subtle border-b pb-5', className)}>
      <p className="font-token text-caption-foreground mb-2 text-[10px] tracking-[0.08em] uppercase">
        Admin console <span className="text-muted-foreground">/ Workspace</span>
      </p>
      <h1 className="text-[clamp(1.5rem,2.5vw,2rem)] leading-tight font-semibold tracking-[-0.035em]">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground mt-1.5 max-w-2xl text-[13px]">{description}</p>
      )}
    </div>
  );
};

export default Title;
