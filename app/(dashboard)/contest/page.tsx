import Title from '@/components/common/Title';
import ContestTable from '@/components/modules/content/ContestTable';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trophy, Clock, CheckCircle2, XCircle } from 'lucide-react';

const ContestPage = () => {
  const stats = [
    {
      title: 'Total Contests',
      value: '120',
      icon: Trophy,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Contests',
      value: '35',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Upcoming Contests',
      value: '10',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Closed Contests',
      value: '70',
      icon: XCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-500/10',
    },
  ];

  return (
    <section className="space-y-5 p-5">
      <div className="flex flex-row items-center justify-between">
        <Title
          title="Contest Management"
          description="Monitor and manage all contests, participants, and results"
        />
        <Link href="/contest/create-contest">
          <Button className="text-white">Create Contest</Button>
        </Link>
      </div>

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

      {/* Contest Table */}
      <ContestTable />
    </section>
  );
};

export default ContestPage;
