import DashboardLayout from '@/components/layout/DashboardLayout';
import { JSX, ReactNode } from 'react';
import { LuCalendar, LuLayoutDashboard, LuSettings, LuUsers } from 'react-icons/lu';

export interface SideLinkItem {
  name: string;
  href: string;
  icon: JSX.Element;
  children?: SideLinkItem[]; // recursive
}

export interface SideLinkGroup {
  group: string;
  items: SideLinkItem[];
}

const Layout = ({ children }: { children: ReactNode }) => {
  const sideLinks: SideLinkGroup[] = [
    {
      group: 'Main',
      items: [
        {
          name: 'Dashboard',
          href: '/doctor/dashboard',
          icon: <LuLayoutDashboard className="size-full" />,
          children: [
            {
              name: 'Overview',
              href: '/doctor/dashboard/overview',
              icon: <LuLayoutDashboard className="size-full" />,
              children: [
                {
                  name: 'Stats',
                  href: '/doctor/dashboard/overview/stats',
                  icon: <LuLayoutDashboard className="size-full" />,
                },
                {
                  name: 'Reports',
                  href: '/doctor/dashboard/overview/reports',
                  icon: <LuLayoutDashboard className="size-full" />,
                },
              ],
            },
            {
              name: 'Analytics',
              href: '/doctor/dashboard/analytics',
              icon: <LuLayoutDashboard className="size-full" />,
            },
          ],
        },

        {
          name: 'Next',
          href: '/doctor/overview',
          icon: <LuLayoutDashboard className="size-full" />,
          children: [
            {
              name: 'Overview',
              href: '/doctor/dashboard/overview',
              icon: <LuLayoutDashboard className="size-full" />,
              children: [
                {
                  name: 'Stats',
                  href: '/doctor/dashboard/overview/stats',
                  icon: <LuLayoutDashboard className="size-full" />,
                },
                {
                  name: 'Reports',
                  href: '/doctor/dashboard/overview/reports',
                  icon: <LuLayoutDashboard className="size-full" />,
                },
              ],
            },
            {
              name: 'Analytics',
              href: '/doctor/dashboard/analytics',
              icon: <LuLayoutDashboard className="size-full" />,
            },
          ],
        },
      ],
    },
    {
      group: 'Scheduling',
      items: [
        {
          name: 'Appointments',
          href: '/doctor/appointments',
          icon: <LuCalendar className="size-full" />,
          children: [
            {
              name: 'Upcoming',
              href: '/doctor/appointments/upcoming',
              icon: <LuCalendar className="size-full" />,
              children: [
                {
                  name: 'This Week',
                  href: '/doctor/appointments/upcoming/week',
                  icon: <LuCalendar className="size-full" />,
                },
              ],
            },
            {
              name: 'History',
              href: '/doctor/appointments/history',
              icon: <LuCalendar className="size-full" />,
            },
          ],
        },
        {
          name: 'Appointment',
          href: '/doctor/appointment',
          icon: <LuCalendar className="size-full" />,
          children: [
            {
              name: 'Upcoming',
              href: '/doctor/appointments/upcoming',
              icon: <LuCalendar className="size-full" />,
              children: [
                {
                  name: 'This Week',
                  href: '/doctor/appointments/upcoming/week',
                  icon: <LuCalendar className="size-full" />,
                },
              ],
            },
            {
              name: 'History',
              href: '/doctor/appointments/history',
              icon: <LuCalendar className="size-full" />,
            },
          ],
        },
        {
          name: 'Appoint',
          href: '/doctor/appointment',
          icon: <LuCalendar className="size-full" />,
          children: [
            {
              name: 'Upcoming',
              href: '/doctor/appointments/upcoming',
              icon: <LuCalendar className="size-full" />,
              children: [
                {
                  name: 'This Week',
                  href: '/doctor/appointments/upcoming/week',
                  icon: <LuCalendar className="size-full" />,
                },
              ],
            },
            {
              name: 'History',
              href: '/doctor/appointments/history',
              icon: <LuCalendar className="size-full" />,
            },
          ],
        },
      ],
    },
    {
      group: 'Management',
      items: [
        {
          name: 'Patients',
          href: '/doctor/patients',
          icon: <LuUsers className="size-full" />,
          children: [
            {
              name: 'All Patients',
              href: '/doctor/patients/all',
              icon: <LuUsers className="size-full" />,
              children: [
                {
                  name: 'Active',
                  href: '/doctor/patients/all/active',
                  icon: <LuUsers className="size-full" />,
                },
                {
                  name: 'Inactive',
                  href: '/doctor/patients/all/inactive',
                  icon: <LuUsers className="size-full" />,
                },
              ],
            },
            {
              name: 'Add Patient',
              href: '/doctor/patients/add',
              icon: <LuUsers className="size-full" />,
            },
          ],
        },
      ],
    },
    {
      group: 'Configuration',
      items: [
        {
          name: 'Settings',
          href: '/doctor/settings',
          icon: <LuSettings className="size-full" />,
          children: [
            {
              name: 'Profile',
              href: '/doctor/settings/profile',
              icon: <LuSettings className="size-full" />,
              children: [
                {
                  name: 'Change Password',
                  href: '/doctor/settings/profile/password',
                  icon: <LuSettings className="size-full" />,
                },
              ],
            },
            {
              name: 'Notifications',
              href: '/doctor/settings/notifications',
              icon: <LuSettings className="size-full" />,
            },
          ],
        },
      ],
    },
    {
      group: 'Configurations',
      items: [
        {
          name: 'Setting',
          href: '/doctor/settings',
          icon: <LuSettings className="size-full" />,
        },
      ],
    },
  ];

  return <DashboardLayout sideLinks={sideLinks}>{children}</DashboardLayout>;
};

export default Layout;
