'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Report, ReportReason, ReportStatus } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { GoDotFill } from 'react-icons/go';

export const reasonLabels: Record<ReportReason, string> = {
  OFF_TOPIC: 'Off-topic',
  COPYRIGHT: 'Copyright',
  AI_GENERATED: 'AI-generated image',
  INAPPROPRIATE_CONTENT: 'Inappropriate content',
};

export const statusLabels: Record<ReportStatus, string> = {
  PENDING: 'Pending',
  ACTION_TAKEN: 'Action taken',
  DISMISSED: 'Dismissed',
};

export const statusStyles: Record<ReportStatus, string> = {
  PENDING: 'bg-warning-subtle text-warning',
  ACTION_TAKEN: 'bg-success-subtle text-success',
  DISMISSED: 'bg-surface-tertiary text-muted-foreground',
};

const displayName = (user: Report['reporter']) =>
  user?.fullName || user?.username || user?.email || 'Unknown user';

export const createReportColumns = (
  onViewReport: (report: Report) => void,
): ColumnDef<Report>[] => [
  {
    id: 'sl',
    header: 'SL',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return pageIndex * pageSize + row.index + 1;
    },
  },
  {
    id: 'reportedUser',
    header: 'REPORTED USER',
    cell: ({ row }) => <div className="font-medium">{displayName(row.original.reportedUser)}</div>,
  },
  {
    id: 'reporter',
    header: 'REPORTED BY',
    cell: ({ row }) => (
      <div className="text-muted-foreground">{displayName(row.original.reporter)}</div>
    ),
  },
  {
    accessorKey: 'reason',
    header: 'REASON',
    cell: ({ row }) => {
      const reason = row.getValue('reason') as ReportReason;
      return <div>{reasonLabels[reason] ?? reason}</div>;
    },
  },
  {
    id: 'photo',
    header: 'PHOTO',
    cell: ({ row }) => (row.original.contestPhoto ? 'Linked' : '—'),
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.getValue('status') as ReportStatus;
      return (
        <span
          className={cn(
            'inline-flex w-fit items-center justify-center gap-1 rounded-sm px-[7px] py-0.5 text-[11px] font-medium',
            statusStyles[status],
          )}
        >
          <GoDotFill className="size-2" /> {statusLabels[status]}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'REPORTED',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return <div className="text-xs">{date.toLocaleDateString('en-US')}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onViewReport(row.original);
        }}
        variant="ghost"
        className="size-8 p-0"
      >
        <Eye className="size-4" />
      </Button>
    ),
  },
];
