import { cn } from '@/lib/utils';

interface TopBarProps {
  isExpanded: boolean;
}

const TopBar = ({ isExpanded }: TopBarProps) => {
  return (
    <header
      className={cn(
        'absolute top-0 right-0 left-0 flex h-[57px] items-center border-b p-4 px-4 transition-all duration-300 ease-in-out',
        isExpanded ? 'pl-[308px]' : 'pl-20',
      )}
    >
      <div className="flex w-full items-center justify-between">
        <p>Logo</p>
        <p>Profile</p>
      </div>
    </header>
  );
};

export default TopBar;
