import { cn } from '@/lib/utils';

type TitleProps = {
  title: string;
  description?: string;
  className?: string;
};

const Title = ({ title, description, className }: TitleProps) => {
  return (
    <div className={cn('space-y-1', className)}>
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
};

export default Title;
