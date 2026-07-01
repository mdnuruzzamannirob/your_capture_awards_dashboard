'use client';

import Title from '@/components/common/Title';
import UserTable from '@/components/modules/user/UserTable';
import { Card, CardContent } from '@/components/ui/card';
import { useGetDashboardUserStatsQuery } from '@/store/features/dashboard/dashboardApi';
import { UserCheck, Users, UserX } from 'lucide-react';

const UsersPage = () => {
  const { data } = useGetDashboardUserStatsQuery();
  const statsData = data?.data;

  const stats = [
    {
      title: 'Total Users',
      value: statsData?.totalUsers ?? 0,
      icon: Users,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Active Users',
      value: statsData?.active_user_count ?? 0,
      icon: UserCheck,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Blocked Users',
      value: statsData?.blocked_user_count ?? 0,
      icon: UserX,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/10',
    },
  ];

  return (
    <section className="space-y-5 p-5">
      <Title
        title="User Management"
        description="Monitor and manage all users, activity, and verification status"
      />

      {/* Stats Grid */}
      <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-0">
              <CardContent className="flex items-center gap-4 p-4">
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

      {/* Users Table */}
      <UserTable />
    </section>
  );
};

export default UsersPage;
