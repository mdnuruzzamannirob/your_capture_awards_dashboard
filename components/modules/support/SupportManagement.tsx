'use client';

import { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { supportColumns } from './support-columns';
import { SupportTicket } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GoDotFill } from 'react-icons/go';
import { Calendar, Clock, Mail, User } from 'lucide-react';

// Mock data - replace with actual API call
const mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    ticketNumber: 'TCK-2025-001',
    subject: 'Unable to upload contest images',
    email: 'john.doe@example.com',
    priority: 'high',
    status: 'pending',
    message:
      'I am having trouble uploading images for my contest. Every time I try to upload, I get an error message saying "Upload failed". Please help.',
    createdAt: '2025-02-01T10:30:00Z',
    updatedAt: '2025-02-01T10:30:00Z',
    userName: 'John Doe',
  },
  {
    id: '2',
    ticketNumber: 'TCK-2025-002',
    subject: 'Payment gateway not working',
    email: 'jane.smith@example.com',
    priority: 'high',
    status: 'in-progress',
    message:
      'The payment gateway is showing an error when I try to purchase a subscription plan. I have tried multiple cards but none of them work.',
    createdAt: '2025-02-02T14:20:00Z',
    updatedAt: '2025-02-02T16:45:00Z',
    userName: 'Jane Smith',
    assignedTo: 'Admin',
  },
  {
    id: '3',
    ticketNumber: 'TCK-2025-003',
    subject: 'How to create a new contest?',
    email: 'bob.johnson@example.com',
    priority: 'low',
    status: 'resolved',
    message:
      'I am new to the platform and would like to know the steps to create a new contest. Is there a tutorial available?',
    createdAt: '2025-01-28T09:15:00Z',
    updatedAt: '2025-01-29T11:30:00Z',
    userName: 'Bob Johnson',
    assignedTo: 'Support Team',
  },
  {
    id: '4',
    ticketNumber: 'TCK-2025-004',
    subject: 'Account verification issue',
    email: 'alice.williams@example.com',
    priority: 'medium',
    status: 'pending',
    message:
      'I have not received the verification email after signing up. I have checked my spam folder as well. Please resend it.',
    createdAt: '2025-02-03T08:45:00Z',
    updatedAt: '2025-02-03T08:45:00Z',
    userName: 'Alice Williams',
  },
  {
    id: '5',
    ticketNumber: 'TCK-2025-005',
    subject: 'Feature request: Dark mode',
    email: 'mike.brown@example.com',
    priority: 'low',
    status: 'closed',
    message:
      'I would love to see a dark mode option in the dashboard. It would be great for working late at night.',
    createdAt: '2025-01-25T16:00:00Z',
    updatedAt: '2025-01-30T10:00:00Z',
    userName: 'Mike Brown',
  },
  {
    id: '6',
    ticketNumber: 'TCK-2025-006',
    subject: 'Cannot delete my contest',
    email: 'sarah.davis@example.com',
    priority: 'medium',
    status: 'in-progress',
    message:
      'I created a contest by mistake and want to delete it, but the delete button is not working. Please help me remove it.',
    createdAt: '2025-02-02T13:20:00Z',
    updatedAt: '2025-02-03T09:15:00Z',
    userName: 'Sarah Davis',
    assignedTo: 'Tech Team',
  },
  {
    id: '7',
    ticketNumber: 'TCK-2025-007',
    subject: 'Wallet balance not updating',
    email: 'tom.wilson@example.com',
    priority: 'high',
    status: 'pending',
    message:
      'I added funds to my wallet but the balance is not showing. The transaction was successful from my bank side.',
    createdAt: '2025-02-03T11:30:00Z',
    updatedAt: '2025-02-03T11:30:00Z',
    userName: 'Tom Wilson',
  },
  {
    id: '8',
    ticketNumber: 'TCK-2025-008',
    subject: 'Question about subscription benefits',
    email: 'emily.jones@example.com',
    priority: 'low',
    status: 'resolved',
    message:
      'What are the differences between the free and premium subscription plans? I want to know all the features before upgrading.',
    createdAt: '2025-01-30T10:00:00Z',
    updatedAt: '2025-01-31T14:20:00Z',
    userName: 'Emily Jones',
    assignedTo: 'Sales Team',
  },
];

const SupportManagement = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');

  // Simulate loading state
  const isLoading = false;

  // In real app, replace with actual API call
  const data = mockSupportTickets;
  const total = mockSupportTickets.length;

  const handleStatusUpdate = () => {
    console.log('Update status to:', newStatus);
    // Add API call here
    setIsDialogOpen(false);
  };

  return (
    <>
      <DataTable
        columns={supportColumns}
        data={data}
        page={page}
        pageSize={limit}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
        onRowClick={(ticket) => {
          setSelectedTicket(ticket);
          setNewStatus(ticket.status);
          setIsDialogOpen(true);
        }}
        isLoading={isLoading}
        filterableColumns={[{ id: 'subject', placeholder: 'Search by subject...' }]}
      />

      {/* Ticket Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[95vh] max-w-2xl overflow-hidden sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Support Ticket Details</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="max-h-[75vh] space-y-4 overflow-y-auto pb-1">
              {/* Header */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedTicket.subject}</h3>
                    <p className="text-muted-foreground mt-1 font-mono text-sm">
                      {selectedTicket.ticketNumber}
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      'capitalize',
                      selectedTicket.priority === 'high' &&
                        'bg-red-500/20 text-red-600 hover:bg-red-500/30',
                      selectedTicket.priority === 'medium' &&
                        'bg-orange-500/20 text-orange-600 hover:bg-orange-500/30',
                      selectedTicket.priority === 'low' &&
                        'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30',
                    )}
                  >
                    {selectedTicket.priority} Priority
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground size-4" />
                    <span className="font-medium">{selectedTicket.userName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground">{selectedTicket.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground">
                      {new Date(selectedTicket.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground">
                      {new Date(selectedTicket.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="rounded-lg border p-4">
                <h4 className="mb-3 font-semibold">Current Status</h4>
                <div className="mb-4">
                  <button
                    className={cn(
                      'flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium capitalize',
                      selectedTicket.status === 'resolved' && 'bg-green-500/20 text-green-600',
                      selectedTicket.status === 'in-progress' && 'bg-blue-500/20 text-blue-600',
                      selectedTicket.status === 'pending' && 'bg-yellow-500/20 text-yellow-600',
                      selectedTicket.status === 'closed' && 'bg-gray-500/20 text-gray-600',
                    )}
                  >
                    <GoDotFill /> {selectedTicket.status.replace('-', ' ')}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Update Status</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message Section */}
              <div className="rounded-lg border p-4">
                <h4 className="mb-3 font-semibold">Message</h4>
                <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                  {selectedTicket.message}
                </p>
              </div>

              {/* Assigned To */}
              {selectedTicket.assignedTo && (
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold">Assigned To</h4>
                  <p className="text-muted-foreground text-sm">{selectedTicket.assignedTo}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={handleStatusUpdate} disabled={newStatus === selectedTicket.status}>
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportManagement;
