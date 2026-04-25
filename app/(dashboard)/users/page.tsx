'use client';

import Title from '@/components/common/Title';
import UserTable from '@/components/modules/user/UserTable';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useGetDashboardUserStatsQuery } from '@/store/features/dashboard/dashboardApi';
import { ShieldCheck, UserCheck, Users, UserX } from 'lucide-react';

const UsersPage = () => {
  const { data, isLoading, isFetching } = useGetDashboardUserStatsQuery();
  const statsData = data?.data;

  const stats = [
    {
      title: 'Total Users',
      value: statsData?.totalUsers ?? 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Users',
      value: statsData?.active_user_count ?? 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Inactive Users',
      value: statsData?.inactive_user_count ?? 0,
      icon: UserX,
      color: 'text-gray-600',
      bgColor: 'bg-gray-500/10',
    },
    {
      title: 'Paid Members',
      value: statsData?.paid_members_count ?? 0,
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
      <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                  <h3 className="text-2xl font-bold">{stat.value.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {(isLoading || isFetching) && (
        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
          <Spinner className="size-4" /> Refreshing user stats...
        </div>
      )}

      {/* Users Table */}
      <UserTable />
    </section>
  );
};

export default UsersPage;
