'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, DollarSign, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useMemo } from 'react';
import Title from '@/components/common/Title';

// Monthly revenue data
const revenueData = [
  { month: 'Jan', subscription: 12500, store: 8300, contests: 5200 },
  { month: 'Feb', subscription: 15200, store: 9100, contests: 6800 },
  { month: 'Mar', subscription: 18900, store: 11200, contests: 8400 },
  { month: 'Apr', subscription: 22100, store: 13500, contests: 9200 },
  { month: 'May', subscription: 24800, store: 15800, contests: 10500 },
  { month: 'Jun', subscription: 28300, store: 17200, contests: 12100 },
];

// User growth data
const userGrowthData = [
  { month: 'Jan', users: 250, active: 185 },
  { month: 'Feb', users: 320, active: 248 },
  { month: 'Mar', users: 410, active: 325 },
  { month: 'Apr', users: 520, active: 420 },
  { month: 'May', users: 645, active: 531 },
  { month: 'Jun', users: 751, active: 612 },
];

// Contest distribution
const contestDistribution = [
  { name: 'Active', value: 35, color: '#22c55e' },
  { name: 'Completed', value: 70, color: '#3b82f6' },
  { name: 'Upcoming', value: 15, color: '#f59e0b' },
];

// Recent contests
const recentContests = [
  {
    id: '1',
    title: 'Summer Landscape Photography',
    creator: 'John Doe',
    avatar: '/images/avatar-placeholder.png',
    participants: 245,
    entries: 1230,
    prize: '$5,000',
    status: 'active',
    endDate: '2026-02-15',
  },
  {
    id: '2',
    title: 'Urban Street Photography',
    creator: 'Jane Smith',
    avatar: '/images/avatar-placeholder.png',
    participants: 189,
    entries: 892,
    prize: '$3,500',
    status: 'active',
    endDate: '2026-02-20',
  },
  {
    id: '3',
    title: 'Wildlife Close-ups',
    creator: 'Mike Johnson',
    avatar: '/images/avatar-placeholder.png',
    participants: 312,
    entries: 1567,
    prize: '$7,000',
    status: 'completed',
    endDate: '2026-01-30',
  },
  {
    id: '4',
    title: 'Black & White Portraits',
    creator: 'Sarah Wilson',
    avatar: '/images/avatar-placeholder.png',
    participants: 156,
    entries: 624,
    prize: '$2,500',
    status: 'upcoming',
    endDate: '2026-03-01',
  },
];

const Dashboard = () => {
  // Calculate total stats
  const stats = useMemo(
    () => [
      {
        title: 'Total Revenue',
        value: '$158,340',
        change: '+12.5%',
        changeType: 'positive',
        icon: DollarSign,
        color: 'text-green-600',
        bgColor: 'bg-green-500/10',
      },
      {
        title: 'Total Users',
        value: '751',
        change: '+86 this month',
        changeType: 'positive',
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-500/10',
      },
      {
        title: 'Active Contests',
        value: '35',
        change: '5 ending soon',
        changeType: 'neutral',
        icon: Trophy,
        color: 'text-purple-600',
        bgColor: 'bg-purple-500/10',
      },
      {
        title: 'Store Sales',
        value: '3,480',
        change: '+18.2%',
        changeType: 'positive',
        icon: ShoppingCart,
        color: 'text-amber-600',
        bgColor: 'bg-amber-500/10',
      },
    ],
    [],
  );

  return (
    <section className="space-y-5 p-5">
      {/* Page Header */}
      <Title
        title="Dashboard Overview"
        description="Welcome back! Here's what's happening with your platform today."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

      {/* Charts Row */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue from all sources</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="subscription" fill="#8b5cf6" name="Subscriptions" />
                <Bar dataKey="store" fill="#3b82f6" name="Store" />
                <Bar dataKey="contests" fill="#10b981" name="Contests" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Total and active users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Total Users"
                />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Active Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Contest Distribution and Recent Contests */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Recent Contests */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Contests</CardTitle>
            <CardDescription>Latest contest activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContests.map((contest) => (
                <div
                  key={contest.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
                      <Trophy className="size-6 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold">{contest.title}</h4>
                      <div className="text-muted-foreground flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          {contest.participants} participants
                        </span>
                        <span className="flex items-center gap-1">
                          <ImageIcon className="size-3" />
                          {contest.entries} entries
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{contest.prize}</p>
                      <p className="text-muted-foreground text-xs">{contest.endDate}</p>
                    </div>
                    <Badge
                      variant={
                        contest.status === 'active'
                          ? 'default'
                          : contest.status === 'completed'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {contest.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contest Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Contest Status</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={contestDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contestDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Dashboard;
