'use client';

import Title from '@/components/common/Title';
import MetricCard from '@/components/common/MetricCard';
import UserTable from '@/components/modules/user/UserTable';
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
    },
    {
      title: 'Active Users',
      value: statsData?.active_user_count ?? 0,
      icon: UserCheck,
    },
    {
      title: 'Blocked Users',
      value: statsData?.blocked_user_count ?? 0,
      icon: UserX,
    },
  ];

  return (
    <section className="space-y-8">
      <Title
        title="User Management"
        description="Monitor and manage all users, activity, and verification status"
      />

      {/* Stats Grid */}
      <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <MetricCard
            key={stat.title}
            label={stat.title}
            value={stat.value.toLocaleString()}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Users Table */}
      <UserTable />
    </section>
  );
};

export default UsersPage;
