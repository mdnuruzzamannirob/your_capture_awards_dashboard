import Title from '@/components/common/Title';
import UserTable from '@/components/modules/user/UserTable';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck, Users, UserX, ShieldCheck } from 'lucide-react';

const UsersPage = () => {
  // Mock stats - replace with actual API data
  const stats = [
    {
      title: 'Total Users',
      value: '751',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Users',
      value: '545',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Inactive Users',
      value: '206',
      icon: UserX,
      color: 'text-gray-600',
      bgColor: 'bg-gray-500/10',
    },
    {
      title: 'Verified',
      value: '612',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <section className="space-y-5 p-5">
      <Title
        title="User Management"
        description="Monitor and manage all users, activity, and verification status"
      />

      {/* Stats Grid */}
      <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="py-4">
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={`flex size-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                >
                  <Icon className={`size-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Users Table */}
      <UserTable />
    </section>
  );
};

export default UsersPage;
