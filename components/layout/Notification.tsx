'use client';

import { cn } from '@/lib/utils';
import {
  useGetAdminNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from '@/store/features/notification/notificationApi';
import { NotificationItem, NotificationType } from '@/store/features/notification/types';
import { formatDistanceToNow } from 'date-fns';
import { IoCheckmarkDone } from 'react-icons/io5';
import { RiNotification3Line } from 'react-icons/ri';
import { useMemo, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { toast } from 'sonner';

const typeLabel: Record<NotificationType, string> = {
  [NotificationType.DEFAULT]: 'Update',
  [NotificationType.INVITATION]: 'Invitation',
  [NotificationType.PAYMENT]: 'Payment',
  [NotificationType.VOTE]: 'Vote',
  [NotificationType.LIKE]: 'Like',
  [NotificationType.TEAM_JOIN_REQUEST]: 'Team request',
  [NotificationType.TEAM_JOIN_APPROVED]: 'Team approved',
  [NotificationType.TEAM_JOIN_REJECTED]: 'Team rejected',
};

const formatRelative = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
};

const Notification = () => {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isFetching } = useGetAdminNotificationsQuery({ page: 1, limit: 10 });
  const [markAllRead, { isLoading: isMarking }] = useMarkAllNotificationsReadMutation();

  const notifications = data?.data.notifications ?? [];
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const handleMarkAllRead = async () => {
    if (!unreadCount) return;
    try {
      await markAllRead().unwrap();
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark notifications as read');
    }
  };

  const renderNotification = (notification: NotificationItem) => (
    <div
      key={notification.id}
      className={cn(
        'relative flex items-start gap-3 rounded-xl border p-3 transition',
        notification.isRead
          ? 'border-border bg-background'
          : 'border-primary/20 bg-primary/5',
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
          notification.isRead ? 'bg-surface-secondary text-foreground' : 'bg-primary text-white',
        )}
      >
        {typeLabel[notification.type].slice(0, 1)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{notification.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{notification.message}</p>
          </div>
          {!notification.isRead && <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{typeLabel[notification.type]}</span>
          <span>{formatRelative(notification.createdAt)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Open notifications"
          className="group bg-surface-secondary text-muted-foreground hover:bg-surface-tertiary inline-flex h-8.5 items-center justify-center rounded-md px-3 transition"
        >
          <span className="relative flex items-center justify-center">
            <RiNotification3Line className="group-hover:text-foreground size-4 transition-colors" />
            {unreadCount > 0 && (
              <span className="bg-primary ring-background absolute -top-1.5 -right-1.5 h-2.5 w-2.5 rounded-full ring-2" />
            )}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" side="bottom" sideOffset={8} className="w-96 p-0">
        <div className="border-border flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-muted-foreground text-xs">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={!unreadCount || isMarking}
            className="text-primary inline-flex items-center gap-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IoCheckmarkDone className="size-4" />
            Mark all read
          </button>
        </div>

        <div className="max-h-[420px] space-y-2 overflow-y-auto p-3">
          {isLoading || isFetching ? (
            <div className="text-muted-foreground p-4 text-center text-sm">Loading...</div>
          ) : notifications.length > 0 ? (
            notifications.map(renderNotification)
          ) : (
            <div className="text-muted-foreground p-8 text-center text-sm">
              No notifications found.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
