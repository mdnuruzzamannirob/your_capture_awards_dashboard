'use client';

import { cn } from '@/lib/utils';
import { FaPersonRunning } from 'react-icons/fa6';
import { IoMdTime } from 'react-icons/io';
import { GoPeople, GoVerified } from 'react-icons/go';
import { BarChart, Bar, Rectangle, Legend, XAxis, ResponsiveContainer } from 'recharts';
import useDashboard from '@/hooks/useDashboard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { DataTable } from './payments/data-table';
import { columns, tableData } from './payments/columns';

const contestHighlightsData = [
  {
    title: 'Running Contest',
    value: '751',
    icon: <FaPersonRunning />,
    id: 1,
  },
  {
    title: 'Completed Contest',
    value: '545',
    icon: <GoVerified />,
    id: 2,
  },
  {
    title: 'Upcoming Contest',
    value: '642',
    icon: <IoMdTime />,
    id: 3,
  },
];

const data = [
  {
    name: 'January',
    premium: 4000,
    pro: 2400,
    amt: 2400,
  },
  {
    name: 'February',
    premium: 3000,
    pro: 1398,
    amt: 2210,
  },
  {
    name: 'March',
    premium: 2000,
    pro: 9800,
    amt: 2290,
  },
  {
    name: 'April',
    premium: 2780,
    pro: 3908,
    amt: 2000,
  },
  {
    name: 'May',
    premium: 1890,
    pro: 4800,
    amt: 2181,
  },
  {
    name: 'June',
    premium: 2390,
    pro: 3800,
    amt: 2500,
  },
  {
    name: 'July',
    premium: 3490,
    pro: 4300,
    amt: 2100,
  },
  {
    name: 'August',
    premium: 4000,
    pro: 2400,
    amt: 2400,
  },
  {
    name: 'September',
    premium: 3000,
    pro: 1398,
    amt: 2210,
  },
  {
    name: 'October',
    premium: 2000,
    pro: 9800,
    amt: 2290,
  },
  {
    name: 'November',
    premium: 2780,
    pro: 3908,
    amt: 2000,
  },
  {
    name: 'December',
    premium: 1890,
    pro: 4800,
    amt: 2181,
  },
];

const Dashboard = () => {
  const { isSidebarVisible } = useDashboard();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <section className="grid grid-cols-3 gap-5 p-5">
      <div className="col-span-2 space-y-5">
        <div className="flex items-center justify-between gap-5">
          {contestHighlightsData.map((highlight, index) => (
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

        <div className="w-full rounded-xl bg-gray-900 p-5">
          <div className="flex items-center justify-between gap-5">
            <h3 className="text-xl font-medium">Member Ratio</h3>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                  {date ? date.toLocaleDateString() : 'Select date'}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <ResponsiveContainer key={String(isSidebarVisible)} width="100%" height={400}>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="oklch(0.707 0.022 261.325)" />
              <Legend verticalAlign="top" />
              <Bar
                dataKey="premium"
                fill="#2467D5"
                radius={[5, 5, 0, 0]}
                animationDuration={300}
                activeBar={<Rectangle fill="oklch(62.3% 0.214 259.815)" />}
              />
              <Bar
                dataKey="pro"
                fill="#C18E04"
                radius={[5, 5, 0, 0]}
                animationDuration={300}
                activeBar={<Rectangle fill="oklch(79.5% 0.184 86.047)" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-5 rounded-xl bg-gray-900 p-5">
          <div className="flex items-center justify-between gap-10">
            <h3 className="flex-1 text-xl font-medium">Paid Members</h3>
            <div className="flex items-center gap-3">
              <GoPeople className="size-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">586</h3>
                <p className="text-xs">Premium member</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GoPeople className="size-8 text-yellow-500" />
              <div>
                <h3 className="font-semibold">1520</h3>
                <p className="text-xs">Pro member</p>
              </div>
            </div>
          </div>

          <DataTable columns={columns} data={tableData} />
        </div>
      </div>
      <div className="space-y-5">
        <div className="space-y-2 rounded-xl bg-gray-900 p-5">
          <h3 className="flex-1 text-xl font-medium">Active Users</h3>

          <DataTable columns={columns} data={tableData} />
        </div>{' '}
        <div className="space-y-2 rounded-xl bg-gray-900 p-5">
          <h3 className="flex-1 text-xl font-medium">Inactive Users</h3>

          <DataTable columns={columns} data={tableData} />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
