import Title from '@/components/common/Title';
import SupportManagement from '@/components/modules/support/SupportManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';

const Support = () => {
  // Mock stats - replace with actual API data
  const stats = [
    {
      title: 'Total Tickets',
      value: '156',
      icon: TicketCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Pending',
      value: '23',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'In Progress',
      value: '12',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Resolved',
      value: '98',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Closed',
      value: '23',
      icon: XCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-500/10',
    },
    {
      title: 'Avg Response Time',
      value: '2.5h',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <section className="space-y-5 p-5">
      <Title
        title="Support Management"
        description="Manage and track all support tickets from your users"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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

      {/* Support Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>View and manage all support tickets submitted by users</CardDescription>
        </CardHeader>
        <CardContent>
          <SupportManagement />
        </CardContent>
      </Card>
    </section>
  );
};

export default Support;
