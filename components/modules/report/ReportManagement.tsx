'use client';

import { DataTable } from '@/components/common/DataTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAdminDeleteContestPhotoMutation } from '@/store/features/contest/contestApi';
import { useGetReportsQuery, useReviewReportMutation } from '@/store/features/report/reportApi';
import { useToggleUserBlockMutation } from '@/store/features/user/userApi';
import type { Report, ReportStatus } from '@/types';
import { Calendar, ImageOff, ShieldBan, Trash2, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { createReportColumns, reasonLabels, statusLabels, statusStyles } from './report-columns';

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

const ReportManagement = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('ALL');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [confirmAction, setConfirmAction] = useState<'remove-photo' | 'ban-user' | null>(null);

  const reportsQuery = useGetReportsQuery({ page, limit, status: statusFilter });
  const [reviewReport, { isLoading: isReviewing }] = useReviewReportMutation();
  const [adminDeletePhoto, { isLoading: isDeletingPhoto }] = useAdminDeleteContestPhotoMutation();
  const [toggleUserBlock, { isLoading: isBanning }] = useToggleUserBlockMutation();

  const reports = reportsQuery.data?.data ?? [];
  const meta = reportsQuery.data?.meta;

  function handleViewReport(report: Report) {
    setSelectedReport(report);
    setResolutionNote(report.resolutionNote ?? '');
    setIsDialogOpen(true);
  }

  const handleDismiss = async () => {
    if (!selectedReport) return;
    try {
      const response = await reviewReport({
        reportId: selectedReport.id,
        status: 'DISMISSED',
        resolutionNote: resolutionNote.trim() || undefined,
      }).unwrap();
      toast.success(response.message || 'Report dismissed.');
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to dismiss report.'));
    }
  };

  const handleRemovePhoto = async () => {
    if (!selectedReport?.contestPhoto) return;
    try {
      const response = await adminDeletePhoto({
        photoId: selectedReport.contestPhoto.id,
        contestId: selectedReport.contestPhoto.contestId,
        reason: resolutionNote.trim() || undefined,
        reportId: selectedReport.id,
      }).unwrap();
      toast.success(response.message || 'Photo removed and report resolved.');
      setConfirmAction(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to remove photo.'));
    }
  };

  const handleBanUser = async () => {
    if (!selectedReport?.reportedUser) return;
    try {
      const response = await toggleUserBlock({ userId: selectedReport.reportedUser.id }).unwrap();
      toast.success(response.message || 'User block status updated.');
      setConfirmAction(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update user block status.'));
    }
  };

  const columns = createReportColumns(handleViewReport);
  const isPending = selectedReport?.status === 'PENDING';

  return (
    <>
      <div className="space-y-4">
        {reportsQuery.isError && (
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-destructive text-sm">
                {getErrorMessage(reportsQuery.error, 'Failed to load reports.')}
              </p>
              <Button variant="outline" size="sm" onClick={() => reportsQuery.refetch()}>
                Retry
              </Button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as ReportStatus | 'ALL');
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ACTION_TAKEN">Action taken</SelectItem>
              <SelectItem value="DISMISSED">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={reports}
          page={meta?.page ?? page}
          pageSize={meta?.limit ?? limit}
          total={meta?.total ?? 0}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setLimit(size);
            setPage(1);
          }}
          onRowClick={handleViewReport}
          isLoading={reportsQuery.isLoading || reportsQuery.isFetching}
          hideViewOptions
          hideSearch
        />
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedReport(null);
        }}
      >
        <DialogContent className="max-h-[95vh] max-w-2xl overflow-hidden sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="max-h-[75vh] space-y-4 overflow-y-auto pb-1">
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {reasonLabels[selectedReport.reason] ?? selectedReport.reason}
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Reported {new Date(selectedReport.createdAt).toLocaleString('en-US')}
                    </p>
                  </div>
                  <Badge className={statusStyles[selectedReport.status]}>
                    {statusLabels[selectedReport.status]}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground size-4" />
                    <span>
                      Reported user:{' '}
                      <strong>
                        {selectedReport.reportedUser?.fullName ||
                          selectedReport.reportedUser?.username ||
                          selectedReport.reportedUser?.email}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground size-4" />
                    <span>
                      Reported by:{' '}
                      {selectedReport.reporter?.fullName ||
                        selectedReport.reporter?.username ||
                        selectedReport.reporter?.email}
                    </span>
                  </div>
                  {selectedReport.reviewedAt && (
                    <div className="col-span-full flex items-center gap-2">
                      <Calendar className="text-muted-foreground size-4" />
                      <span>
                        Reviewed {new Date(selectedReport.reviewedAt).toLocaleString('en-US')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {selectedReport.details && (
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold">Reporter&apos;s note</h4>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {selectedReport.details}
                  </p>
                </div>
              )}

              {selectedReport.contestPhoto?.contest && (
                <div className="overflow-hidden rounded-lg border">
                  <div className="bg-muted relative h-32 w-full">
                    {selectedReport.contestPhoto.contest.banner && (
                      <Image
                        src={selectedReport.contestPhoto.contest.banner}
                        alt={selectedReport.contestPhoto.contest.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3">
                      <h4 className="truncate font-semibold text-white">
                        {selectedReport.contestPhoto.contest.title}
                      </h4>
                      <Link
                        href={`/contest/${selectedReport.contestPhoto.contestId}`}
                        target="_blank"
                        className="shrink-0 text-xs font-medium text-white underline underline-offset-2"
                      >
                        View contest
                      </Link>
                    </div>
                  </div>
                  {selectedReport.contestPhoto.contest.description && (
                    <p className="text-muted-foreground line-clamp-3 p-4 text-sm">
                      {selectedReport.contestPhoto.contest.description}
                    </p>
                  )}
                </div>
              )}

              <div className="rounded-lg border p-4">
                <h4 className="mb-3 font-semibold">Submitted photo</h4>
                {selectedReport.contestPhoto?.photo ? (
                  <div className="flex items-center gap-3">
                    <div className="bg-muted relative size-20 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={selectedReport.contestPhoto.photo.url}
                        alt={selectedReport.contestPhoto.photo.title || 'Submitted photo'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {selectedReport.contestPhoto.photo.title || selectedReport.contestPhoto.title}
                    </p>
                  </div>
                ) : (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <ImageOff className="size-4" /> No photo linked to this report.
                  </div>
                )}
              </div>

              {isPending && (
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold">Resolution note (optional)</h4>
                  <Textarea
                    value={resolutionNote}
                    onChange={(event) => setResolutionNote(event.target.value)}
                    placeholder="Add a note about the action taken..."
                    rows={3}
                  />
                </div>
              )}

              {!isPending && selectedReport.resolutionNote && (
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold">Resolution note</h4>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {selectedReport.resolutionNote}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="size-4" /> Close
                </Button>
                {isPending && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setConfirmAction('ban-user')}
                      disabled={isBanning}
                    >
                      <ShieldBan className="size-4" /> Ban User
                    </Button>
                    {selectedReport.contestPhoto && (
                      <Button
                        variant="destructive"
                        onClick={() => setConfirmAction('remove-photo')}
                        disabled={isDeletingPhoto}
                      >
                        <Trash2 className="size-4" /> Remove Photo
                      </Button>
                    )}
                    <Button onClick={handleDismiss} disabled={isReviewing}>
                      {isReviewing ? 'Dismissing...' : 'Dismiss'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmAction === 'remove-photo'} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              The photo will be permanently removed from the contest and the owner will be
              notified by email with the reason you provided. This does not block their account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingPhoto}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemovePhoto} disabled={isDeletingPhoto}>
              {isDeletingPhoto ? 'Removing...' : 'Remove Photo'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmAction === 'ban-user'} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedReport?.reportedUser?.isBlocked ? 'Unblock this user?' : 'Ban this user?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedReport?.reportedUser?.isBlocked
                ? 'This will restore their access to the platform.'
                : 'This will block the reported user from accessing the platform. This is a separate action from resolving the report.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBanning}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBanUser} disabled={isBanning}>
              {isBanning ? 'Updating...' : selectedReport?.reportedUser?.isBlocked ? 'Unblock' : 'Ban'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReportManagement;
