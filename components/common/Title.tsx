import { cn } from '@/lib/utils';

type TitleProps = {
  title: string;
  description?: string;
  className?: string;
};

const Title = ({ title, description, className }: TitleProps) => {
  return (
    <div className={cn('pb-5', className)}>
      <h1 className="text-2xl leading-tight font-semibold tracking-[-0.025em]">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-5">{description}</p>
      )}
    </div>
  );
};

export default Title;
