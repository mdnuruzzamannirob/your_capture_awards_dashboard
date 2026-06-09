'use client';

import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
  useGetSupportTicketQuery,
  useGetSupportTicketsQuery,
  useUpdateSupportTicketStatusMutation,
} from '@/store/features/support/supportApi';
import type { SupportTicket, SupportTicketStatus } from '@/types';
import { Calendar, Clock, Mail, Ticket, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createSupportColumns } from './support-columns';

const statusLabels: Record<SupportTicketStatus, string> = {
  pending: 'Pending',
  'in_progress': 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const statusStyles: Record<SupportTicketStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-600',
  'in_progress': 'bg-blue-500/20 text-blue-600',
  resolved: 'bg-green-500/20 text-green-600',
  closed: 'bg-gray-500/20 text-gray-600',
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback;

  if ('data' in error) {
    const data = (error as { data?: { message?: string; error?: { message?: string } } }).data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }

  if ('message' in error && typeof (error as { message?: string }).message === 'string') {
    return (error as { message: string }).message;
  }

  return fallback;
};

const SupportManagement = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draftStatus, setDraftStatus] = useState<SupportTicketStatus>('pending');

  const ticketsQuery = useGetSupportTicketsQuery({ page, limit });
  const singleTicketQuery = useGetSupportTicketQuery(
    { ticketId: selectedTicketId ?? '' },
    { skip: !selectedTicketId || !isDialogOpen },
  );
  const [updateStatus, { isLoading: isUpdating }] = useUpdateSupportTicketStatusMutation();

  const tickets = ticketsQuery.data?.data ?? [];
  const meta = ticketsQuery.data?.meta;
  const selectedTicket = singleTicketQuery.data?.data ?? null;

  function handleViewTicket(ticket: SupportTicket) {
    setSelectedTicketId(ticket.id);
    setDraftStatus(ticket.status);
    setIsDialogOpen(true);
  }

  useEffect(() => {
    if (selectedTicket && isDialogOpen) {
      setDraftStatus(selectedTicket.status);
    }
  }, [selectedTicket, isDialogOpen]);

  const handleStatusUpdate = async () => {
    if (!selectedTicket || draftStatus === selectedTicket.status) return;

    try {
      const response = await updateStatus({
        ticketId: selectedTicket.id,
        status: draftStatus,
      }).unwrap();

      toast.success(response.message || 'Support ticket status updated successfully.');
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError, 'Failed to update support ticket status.'));
    }
  };

  const currentTicket =
    selectedTicket ?? tickets.find((ticket) => ticket.id === selectedTicketId) ?? null;
  const columns = createSupportColumns(handleViewTicket);

  return (
    <>
      <div className="space-y-4">
        {ticketsQuery.isError && (
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-destructive text-sm">
                {getErrorMessage(ticketsQuery.error, 'Failed to load support tickets.')}
              </p>
              <Button variant="outline" size="sm" onClick={() => ticketsQuery.refetch()}>
                Retry
              </Button>
            </div>
          </div>
        )}

        <DataTable
          columns={columns}
          data={tickets}
          page={meta?.page ?? page}
          pageSize={meta?.limit ?? limit}
          total={meta?.total ?? 0}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setLimit(size);
            setPage(1);
          }}
          onRowClick={handleViewTicket}
          isLoading={ticketsQuery.isLoading || ticketsQuery.isFetching}
          filterableColumns={[{ id: 'subject', placeholder: 'Search by subject...' }]}
        />
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedTicketId(null);
        }}
      >
        <DialogContent className="max-h-[95vh] max-w-2xl overflow-hidden sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Support Ticket Details</DialogTitle>
          </DialogHeader>

          {singleTicketQuery.isLoading ? (
            <div className="space-y-4 py-2">
              <div className="bg-muted h-24 animate-pulse rounded-lg" />
              <div className="bg-muted h-32 animate-pulse rounded-lg" />
              <div className="bg-muted h-24 animate-pulse rounded-lg" />
            </div>
          ) : currentTicket ? (
            <div className="max-h-[75vh] space-y-4 overflow-y-auto pb-1">
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{currentTicket.subject}</h3>
                    <p className="text-muted-foreground mt-1 font-mono text-sm">
                      {currentTicket.ticketNumber}
                    </p>
                  </div>
                  <Badge className={statusStyles[currentTicket.status]}>
                    {statusLabels[currentTicket.status]}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground size-4" />
                    <span className="font-medium">{currentTicket.userName || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground">{currentTicket.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground">
                      {new Date(currentTicket.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground">
                      {new Date(currentTicket.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="mb-3 font-semibold">Current Status</h4>
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium capitalize ${statusStyles[currentTicket.status]}`}
                  >
                    <Ticket className="size-4" />
                    {statusLabels[currentTicket.status]}
                  </span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ticket-status">Update Status</Label>
                  <Select
                    value={draftStatus}
                    onValueChange={(value) => setDraftStatus(value as SupportTicketStatus)}
                  >
                    <SelectTrigger id="ticket-status">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="mb-3 font-semibold">Message</h4>
                <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                  {currentTicket.message}
                </p>
              </div>

              {currentTicket.assignedTo && (
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold">Assigned To</h4>
                  <p className="text-muted-foreground text-sm">{currentTicket.assignedTo}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 border-t pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating || draftStatus === currentTicket.status}
                >
                  {isUpdating ? <Spinner className="size-4" /> : 'Update Status'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground py-10 text-center text-sm">
              No ticket selected.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportManagement;
