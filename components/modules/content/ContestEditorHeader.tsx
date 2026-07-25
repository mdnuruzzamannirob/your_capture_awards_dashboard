import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type ContestEditorHeaderProps = {
  mode: 'create' | 'edit';
};

const ContestEditorHeader = ({ mode }: ContestEditorHeaderProps) => {
  const isCreate = mode === 'create';

  return (
    <header className="mb-7 w-full">
      <Link
        href="/contest"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 border-0 bg-transparent p-0 text-[11px] font-bold transition-colors"
      >
        <ArrowLeft className="size-4" />
        All contests
      </Link>
      <h1 className="text-heading mt-[13px] mb-2 font-serif text-[clamp(28px,3vw,40px)] leading-[1.05] font-medium tracking-[-0.04em]">
        {isCreate ? 'Create contest' : 'Update contest'}
      </h1>
      <p className="text-muted-foreground max-w-[570px] text-[13px] leading-[1.5]">
        {isCreate
          ? 'Create and configure a contest with clear rules and awards.'
          : 'Update and configure this contest with clear rules and awards.'}
      </p>
    </header>
  );
};

export default ContestEditorHeader;
