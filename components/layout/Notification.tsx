'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { RiNotification3Fill } from 'react-icons/ri';
import { IoCheckmarkDone } from 'react-icons/io5';
import { cn, formatTime } from '@/lib/utils';
import Image from 'next/image';

const Notification = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('');

  const notifyData = [
    {
      text: 'New message received',
      unread: true,
      date: '2025-11-28T14:32:12.000Z',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    },
    {
      text: 'Your file is ready to download',
      unread: true,
      date: '2025-11-28T14:29:03.000Z',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    {
      text: 'Payment processed successfully',
      unread: false,
      date: '2025-11-28T14:21:55.000Z',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    },

    {
      text: 'System scan completed',
      unread: false,
      date: '2025-11-28T12:40:18.000Z',
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
    },
    {
      text: 'New login from Chrome',
      unread: true,
      date: '2025-11-28T09:28:49.000Z',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    },
    {
      text: 'Security alert on your account',
      unread: false,
      date: '2025-11-28T07:12:33.000Z',
      image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
    },

    {
      text: 'Server maintenance completed',
      unread: true,
      date: '2025-11-27T18:22:10.000Z',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    },
    {
      text: 'Password changed successfully',
      unread: false,
      date: '2025-11-26T10:05:44.000Z',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    },
    {
      text: 'Backup completed',
      unread: false,
      date: '2025-11-24T16:55:02.000Z',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    },
    {
      text: 'New device connected',
      unread: true,
      date: '2025-11-22T09:14:31.000Z',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    },

    {
      text: 'Weekly report ready',
      unread: false,
      date: '2025-11-18T08:27:22.000Z',
      image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126',
    },
    {
      text: 'Subscription updated',
      unread: false,
      date: '2025-11-08T17:40:55.000Z',
      image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c',
    },
    {
      text: 'Profile updated',
      unread: false,
      date: '2025-10-29T12:12:11.000Z',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    },
    {
      text: 'New feature available',
      unread: true,
      date: '2025-10-13T15:44:02.000Z',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
    },
    {
      text: 'Your post received new comments',
      unread: false,
      date: '2025-09-28T11:31:49.000Z',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    },

    {
      text: 'Email verified successfully',
      unread: false,
      date: '2025-08-30T09:14:07.000Z',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    },
    {
      text: 'You earned a new badge',
      unread: false,
      date: '2025-05-28T18:50:41.000Z',
      image: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe',
    },
    {
      text: 'Account setup completed',
      unread: false,
      date: '2025-03-12T13:05:29.000Z',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91',
    },

    {
      text: 'Welcome to our platform!',
      unread: false,
      date: '2024-11-25T07:22:18.000Z',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
    },
  ];

  const filteredNotifications = tab === 'unread' ? notifyData.filter((n) => n.unread) : notifyData;

  const tabContent = () => {
    if (filteredNotifications.length === 0) {
      return (
        <div className="py-6 text-center text-sm text-gray-500">
          No {tab === 'unread' ? 'unread' : ''} notifications
        </div>
      );
    }

    return (
      <div className="scrollbar-thin h-full max-h-[400px] space-y-1.5 overflow-y-auto">
        {filteredNotifications?.map((notify, index) => (
          <div
            className={cn(
              'relative flex items-center gap-2 rounded-sm border border-transparent p-3.5',
              notify.unread ? 'border-gray-700/60 bg-gray-800/80' : 'bg-gray-900',
            )}
            key={index}
          >
            <Image
              alt="User Avatar"
              src={notify?.image}
              width={28}
              height={28}
              className="size-9 min-w-9 overflow-hidden rounded-full object-cover"
            />

            <div className="flex flex-1 flex-col gap-1">
              <div className="text-sm font-medium">{notify.text}</div>
              <div className="text-muted-foreground text-xs">{formatTime(notify.date)}</div>
            </div>
            <div className="h-8 w-16 rounded-full bg-gray-700"></div>
            {/* unread badge */}
            {notify.unread && (
              <div className="bg-primary absolute top-1/2 left-1 size-1.5 -translate-y-1/2 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative flex size-8 min-w-8 items-center justify-center rounded-full bg-gray-900 transition hover:bg-gray-800">
          <RiNotification3Fill />

          {/* Unread dot */}
          {notifyData.some((n) => n.unread) && (
            <span className="bg-primary absolute top-0 right-0 h-2.5 w-2.5 rounded-full border border-gray-900" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-sm space-y-2 rounded-md border border-gray-800 bg-gray-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Notifications</h3>

          <button className="flex items-center gap-1 text-sm text-blue-500">
            <IoCheckmarkDone className="size-5" /> Mark all as read
          </button>
        </div>

        {/* Tabs */}
        <div className="relative flex items-center border-b border-gray-700">
          <button
            onClick={() => setTab('')}
            className={cn(
              'relative z-10 h-7 flex-1 text-xs transition',
              tab === '' ? 'font-medium' : 'text-muted-foreground hover:bg-gray-800',
            )}
          >
            All
          </button>

          <button
            onClick={() => setTab('unread')}
            className={cn(
              'relative z-10 h-7 flex-1 text-xs transition',
              tab === 'unread' ? 'font-medium' : 'text-muted-foreground hover:bg-gray-800',
            )}
          >
            Unread
          </button>

          {/* Animated underline */}
          <div
            className={cn(
              'bg-primary absolute bottom-0 left-0 h-0.5 w-1/2 transition-transform duration-300',
              tab === 'unread' ? 'translate-x-full' : 'translate-x-0',
            )}
          />
        </div>

        {/* Content */}
        {tabContent()}
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
