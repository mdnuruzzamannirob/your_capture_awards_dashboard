import UserTable from '@/components/modules/user/UserTable';
import { cn } from '@/lib/utils';
import { UserCheck, Users, UserX } from 'lucide-react';

const UsersPage = () => {
  const usersSummery = [
    {
      title: 'Total Users',
      value: '751',
      icon: <Users />,
      id: 1,
    },
    {
      title: 'Active Users',
      value: '545',
      icon: <UserCheck />,
      id: 2,
    },
    {
      title: 'Inactive Users',
      value: '642',
      icon: <UserX />,
      id: 3,
    },
  ];

  return (
    <section className="space-y-5 p-5">
      <div className="flex items-center justify-between gap-5">
        {usersSummery.map((highlight, index) => (
          <div
            key={index}
            className={cn(
              'flex h-36 w-full items-center gap-3 rounded-xl p-5',
              highlight.id === 1
                ? 'bg-blue-500/80'
                : highlight.id === 2
                  ? 'bg-green-500/80'
                  : 'bg-yellow-500/80',
            )}
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-white/10 text-3xl">
              {highlight.icon}
            </span>
            <div className="space-y-1">
              <p className="text-3xl font-semibold">{highlight.value}</p>
              <p>{highlight.title}</p>
            </div>
          </div>
        ))}
      </div>

      <UserTable />
    </section>
  );
};

export default UsersPage;
