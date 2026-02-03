'use client';

import { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { reportColumns } from './report-columns';
import { Report } from '@/types';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GoDotFill } from 'react-icons/go';
import {
  Calendar,
  Clock,
  Mail,
  User,
  AlertTriangle,
  FileText,
  Shield,
  ExternalLink,
} from 'lucide-react';

// Mock data - replace with actual API call
const mockReports: Report[] = [
  {
    id: '1',
    reportNumber: 'RPT-2025-001',
    reportType: 'user',
    reportedBy: 'John Smith',
    reportedByEmail: 'john.smith@example.com',
    reportedItem: 'User Profile: @suspicious_user',
    reportedItemId: 'user_12345',
    severity: 'high',
    status: 'pending',
    reason: 'Spam/Scam Activity',
    description:
      'This user is posting spam content and trying to scam people by offering fake prizes.',
    createdAt: '2025-02-03T10:30:00Z',
    updatedAt: '2025-02-03T10:30:00Z',
  },
  {
    id: '2',
    reportNumber: 'RPT-2025-002',
    reportType: 'contest',
    reportedBy: 'Sarah Johnson',
    reportedByEmail: 'sarah.j@example.com',
    reportedItem: 'Contest: Summer Photography Awards',
    reportedItemId: 'contest_789',
    severity: 'critical',
    status: 'under-review',
    reason: 'Fraudulent Activity',
    description:
      'The contest organizer is not awarding the prizes to winners and is not responding to messages.',
    createdAt: '2025-02-02T14:20:00Z',
    updatedAt: '2025-02-03T09:15:00Z',
    reviewedBy: 'Admin Team',
  },
  {
    id: '3',
    reportNumber: 'RPT-2025-003',
    reportType: 'content',
    reportedBy: 'Mike Brown',
    reportedByEmail: 'mike.b@example.com',
    reportedItem: 'Photo: Landscape Shot #4523',
    reportedItemId: 'photo_4523',
    severity: 'medium',
    status: 'resolved',
    reason: 'Copyright Infringement',
    description: 'This photo was stolen from my portfolio without permission or credit.',
    createdAt: '2025-02-01T11:00:00Z',
    updatedAt: '2025-02-02T16:30:00Z',
    reviewedBy: 'Content Moderator',
    reviewNote: 'Photo removed and user warned. Original creator credited.',
  },
  {
    id: '4',
    reportNumber: 'RPT-2025-004',
    reportType: 'content',
    reportedBy: 'Emily Davis',
    reportedByEmail: 'emily.d@example.com',
    reportedItem: 'Contest Entry: Wildlife Photography',
    reportedItemId: 'entry_6789',
    severity: 'high',
    status: 'under-review',
    reason: 'Inappropriate Content',
    description: 'The image contains violent and disturbing content that violates guidelines.',
    createdAt: '2025-02-03T08:45:00Z',
    updatedAt: '2025-02-03T10:15:00Z',
    reviewedBy: 'Moderation Team',
  },
  {
    id: '5',
    reportNumber: 'RPT-2025-005',
    reportType: 'payment',
    reportedBy: 'Tom Wilson',
    reportedByEmail: 'tom.w@example.com',
    reportedItem: 'Transaction #TXN-98765',
    reportedItemId: 'txn_98765',
    severity: 'critical',
    status: 'pending',
    reason: 'Payment Not Received',
    description:
      'I won the contest and was supposed to receive $500, but payment has not been processed for 2 weeks.',
    createdAt: '2025-02-03T13:20:00Z',
    updatedAt: '2025-02-03T13:20:00Z',
  },
  {
    id: '6',
    reportNumber: 'RPT-2025-006',
    reportType: 'user',
    reportedBy: 'Lisa Anderson',
    reportedByEmail: 'lisa.a@example.com',
    reportedItem: 'User Profile: @fake_photographer',
    reportedItemId: 'user_56789',
    severity: 'medium',
    status: 'dismissed',
    reason: 'Fake Profile',
    description: 'This user is using stolen photos from other photographers as their own work.',
    createdAt: '2025-01-30T09:30:00Z',
    updatedAt: '2025-02-01T14:00:00Z',
    reviewedBy: 'Admin',
    reviewNote: 'Investigation completed. Profile was legitimate with proper permissions.',
  },
  {
    id: '7',
    reportNumber: 'RPT-2025-007',
    reportType: 'contest',
    reportedBy: 'David Lee',
    reportedByEmail: 'david.l@example.com',
    reportedItem: 'Contest: Best Portrait 2025',
    reportedItemId: 'contest_321',
    severity: 'low',
    status: 'resolved',
    reason: 'Unclear Rules',
    description: 'The contest rules are confusing and contradict each other in multiple places.',
    createdAt: '2025-01-28T16:00:00Z',
    updatedAt: '2025-01-29T10:30:00Z',
    reviewedBy: 'Support Team',
    reviewNote: 'Contest organizer updated rules for clarity.',
  },
  {
    id: '8',
    reportNumber: 'RPT-2025-008',
    reportType: 'other',
    reportedBy: 'Rachel Green',
    reportedByEmail: 'rachel.g@example.com',
    reportedItem: 'Platform Feature: Voting System',
    reportedItemId: 'system_voting',
    severity: 'medium',
    status: 'under-review',
    reason: 'System Bug',
    description:
      'The voting system is allowing multiple votes from the same IP address, which is unfair.',
    createdAt: '2025-02-02T11:00:00Z',
    updatedAt: '2025-02-03T08:00:00Z',
    reviewedBy: 'Tech Team',
  },
  {
    id: '9',
    reportNumber: 'RPT-2025-009',
    reportType: 'content',
    reportedBy: 'Chris Martin',
    reportedByEmail: 'chris.m@example.com',
    reportedItem: 'Comment: On Contest #456',
    reportedItemId: 'comment_999',
    severity: 'high',
    status: 'pending',
    reason: 'Harassment/Bullying',
    description: 'User is posting abusive and threatening comments on contest entries.',
    createdAt: '2025-02-03T15:30:00Z',
    updatedAt: '2025-02-03T15:30:00Z',
  },
  {
    id: '10',
    reportNumber: 'RPT-2025-010',
    reportType: 'payment',
    reportedBy: 'Anna White',
    reportedByEmail: 'anna.w@example.com',
    reportedItem: 'Subscription Charge #SUB-777',
    reportedItemId: 'sub_777',
    severity: 'medium',
    status: 'resolved',
    reason: 'Unauthorized Charge',
    description: 'I was charged for a subscription that I had already cancelled last month.',
    createdAt: '2025-01-31T10:00:00Z',
    updatedAt: '2025-02-01T15:45:00Z',
    reviewedBy: 'Billing Team',
    reviewNote: 'Refund processed. Subscription properly cancelled.',
  },
];

const ReportsManagement = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [reviewNote, setReviewNote] = useState('');

  // Simulate loading state
  const isLoading = false;

  // In real app, replace with actual API call
  const data = mockReports;
  const total = mockReports.length;

  const handleStatusUpdate = () => {
    console.log('Update status to:', newStatus);
    console.log('Review note:', reviewNote);
    // Add API call here
    setIsDialogOpen(false);
  };

  return (
    <>
      <DataTable
        columns={reportColumns}
        data={data}
        page={page}
        pageSize={limit}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
        onRowClick={(report) => {
          setSelectedReport(report);
          setNewStatus(report.status);
          setReviewNote(report.reviewNote || '');
          setIsDialogOpen(true);
        }}
        isLoading={isLoading}
        filterableColumns={[{ id: 'reportedItem', placeholder: 'Search by reported item...' }]}
      />

      {/* Report Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[95vh] max-w-3xl overflow-hidden sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="max-h-[75vh] space-y-4 overflow-y-auto pb-1">
              {/* Header */}
              <div className="bg-muted/50 rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedReport.reportedItem}</h3>
                    <p className="text-muted-foreground mt-1 font-mono text-sm">
                      {selectedReport.reportNumber}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        'capitalize',
                        selectedReport.reportType === 'user' &&
                          'border-purple-500/50 bg-purple-500/10 text-purple-600',
                        selectedReport.reportType === 'contest' &&
                          'border-blue-500/50 bg-blue-500/10 text-blue-600',
                        selectedReport.reportType === 'content' &&
                          'border-orange-500/50 bg-orange-500/10 text-orange-600',
                        selectedReport.reportType === 'payment' &&
                          'border-green-500/50 bg-green-500/10 text-green-600',
                        selectedReport.reportType === 'other' &&
                          'border-gray-500/50 bg-gray-500/10 text-gray-600',
                      )}
                    >
                      {selectedReport.reportType}
                    </Badge>
                    <Badge
                      className={cn(
                        'capitalize',
                        selectedReport.severity === 'critical' &&
                          'bg-red-600/20 text-red-700 hover:bg-red-600/30',
                        selectedReport.severity === 'high' &&
                          'bg-red-500/20 text-red-600 hover:bg-red-500/30',
                        selectedReport.severity === 'medium' &&
                          'bg-orange-500/20 text-orange-600 hover:bg-orange-500/30',
                        selectedReport.severity === 'low' &&
                          'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30',
                      )}
                    >
                      {selectedReport.severity === 'critical' && (
                        <AlertTriangle className="mr-1 size-3" />
                      )}
                      {selectedReport.severity}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground size-4" />
                    <span className="font-medium">{selectedReport.reportedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground">{selectedReport.reportedByEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground">
                      {new Date(selectedReport.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground">
                      {new Date(selectedReport.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reported Item Info */}
              <div className="rounded-lg border p-4">
                <h4 className="mb-3 flex items-center gap-2 font-semibold">
                  <ExternalLink className="size-4" />
                  Reported Item
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Item:</span>
                    <span className="font-medium">{selectedReport.reportedItem}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Item ID:</span>
                    <span className="font-mono text-xs">{selectedReport.reportedItemId}</span>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="rounded-lg border p-4">
                <h4 className="mb-3 flex items-center gap-2 font-semibold">
                  <Shield className="size-4" />
                  Status & Review
                </h4>
                <div className="mb-4">
                  <button
                    className={cn(
                      'flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium capitalize',
                      selectedReport.status === 'resolved' && 'bg-green-500/20 text-green-600',
                      selectedReport.status === 'under-review' && 'bg-blue-500/20 text-blue-600',
                      selectedReport.status === 'pending' && 'bg-yellow-500/20 text-yellow-600',
                      selectedReport.status === 'dismissed' && 'bg-gray-500/20 text-gray-600',
                    )}
                  >
                    <GoDotFill /> {selectedReport.status.replace('-', ' ')}
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="status">Update Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under-review">Under Review</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="dismissed">Dismissed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedReport.reviewedBy && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Reviewed by: </span>
                      <span className="font-medium">{selectedReport.reviewedBy}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Reason & Description */}
              <div className="rounded-lg border p-4">
                <h4 className="mb-3 flex items-center gap-2 font-semibold">
                  <FileText className="size-4" />
                  Report Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-semibold">Reason</Label>
                    <p className="text-muted-foreground mt-1 text-sm">{selectedReport.reason}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Description</Label>
                    <p className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">
                      {selectedReport.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Note */}
              <div className="rounded-lg border p-4">
                <Label htmlFor="reviewNote" className="mb-2 block">
                  Review Note {selectedReport.reviewNote && '(Previous Note Below)'}
                </Label>
                {selectedReport.reviewNote && (
                  <div className="bg-muted mb-3 rounded-md p-3">
                    <p className="text-muted-foreground text-sm">{selectedReport.reviewNote}</p>
                  </div>
                )}
                <Textarea
                  id="reviewNote"
                  placeholder="Add review notes or actions taken..."
                  rows={4}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={newStatus === selectedReport.status && !reviewNote}
                >
                  Update Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportsManagement;
