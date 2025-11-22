import { cn } from '@/lib/utils';
import UserMenu from './UserMenu';

interface TopBarProps {
  isExpanded: boolean;
}

const TopBar = ({ isExpanded }: TopBarProps) => {
  return (
    <header
      className={cn(
        'absolute top-0 right-0 left-0 flex h-[57px] items-center justify-between border-b p-4 px-4 transition-all duration-300 ease-in-out',
        isExpanded ? 'pl-[260px]' : 'pl-20',
      )}
    >
      <p>Logo</p>
      <div className="flex items-center gap-5">
        <UserMenu />
      </div>
    </header>
  );
};

export default TopBar;
