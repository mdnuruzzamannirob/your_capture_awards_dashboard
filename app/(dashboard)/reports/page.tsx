import Title from '@/components/common/Title';
import ReportsManagement from '@/components/modules/reports/ReportsManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';

const Reports = () => {
  // Mock stats - replace with actual API data
  const stats = [
    {
      title: 'Total Reports',
      value: '234',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Pending',
      value: '45',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Under Review',
      value: '23',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Resolved',
      value: '145',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Dismissed',
      value: '21',
      icon: XCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-500/10',
    },
    {
      title: 'Critical Reports',
      value: '8',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-500/10',
    },
  ];

  return (
    <section className="space-y-5 p-5">
      <Title
        title="Reports Management"
        description="Monitor and manage all user reports, complaints, and violations"
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

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
          <CardDescription>View and manage all submitted reports</CardDescription>
        </CardHeader>
        <CardContent>
          <ReportsManagement />
        </CardContent>
      </Card>
    </section>
  );
};

export default Reports;
