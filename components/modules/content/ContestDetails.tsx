'use client';

import ContestDetailsSkeleton from '@/components/modules/content/ContestDetailsSkeleton';
import DetailsTab from '@/components/modules/content/DetailsTab';
import ParticipantsTab from '@/components/modules/content/ParticipantsTab';
import PhotosTab from '@/components/modules/content/PhotosTab';
import PrizesTab from '@/components/modules/content/PrizesTab';
import RankTab from '@/components/modules/content/RankTab';
import RulesTab from '@/components/modules/content/RulesTab';
import WinnerTab from '@/components/modules/content/WinnerTab';
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
import { CONTEST_DETAILS_TABS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useDeleteContestMutation, useGetContestQuery } from '@/store/features/contest/contestApi';
import type { Contest } from '@/store/features/contest/types';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

function getErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Something went wrong!';
  if ('data' in error) {
    const data = error.data as { message?: string; error?: { message?: string } } | undefined;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }
  if ('message' in error && typeof error.message === 'string') return error.message;
  return 'Something went wrong!';
}

const ContestDetails = () => {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const params = useParams();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'details' | 'prizes' | 'rules' | 'rank' | 'winners' | 'participants' | 'photos'
  >('details');
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isLoading, isFetching } = useGetContestQuery({ id: params?.id as string });
  const [deleteContest, { isLoading: isDeleting }] = useDeleteContestMutation();
  const contest = data?.data as Contest | undefined;

  const isUpcoming = contest?.status === 'UPCOMING' || contest?.status === 'NEW';
  const canManageUpcomingContest = Boolean(isUpcoming && !contest?.deletedAt);
  const activeIndex = CONTEST_DETAILS_TABS.findIndex((t) => t.key === activeTab);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const currentTab = tabRefs.current[activeIndex];
    if (!currentTab) return;
    const { offsetWidth, offsetLeft } = currentTab;

    setIndicatorStyle({
      width: offsetWidth,
      left: offsetLeft,
    });
  }, [activeIndex, isLoading]);

  const handleDeleteContest = async () => {
    if (!contest?.id) return;

    try {
      const response = await deleteContest({ id: contest.id }).unwrap();
      toast.success(response.message || 'Contest deleted successfully');
      setDeleteDialogOpen(false);
      router.push('/contest');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const renderTabContent = (currentContest: Contest) => {
    switch (activeTab) {
      case 'details':
        return (
          <DetailsTab
            contest={currentContest}
            canEdit={canManageUpcomingContest}
            onEditClick={() => router.push(`/contest/${params?.id}/edit`)}
            canDelete={canManageUpcomingContest}
            onDeleteClick={() => setDeleteDialogOpen(true)}
            isDeleting={isDeleting}
          />
        );
      case 'prizes':
        return <PrizesTab contest={currentContest} />;
      case 'rules':
        return <RulesTab contest={currentContest} />;
      case 'rank':
        return <RankTab contest={currentContest} />;
      case 'winners':
        return <WinnerTab contest={currentContest} />;
      case 'participants':
        return <ParticipantsTab contest={currentContest} />;
      case 'photos':
        return <PhotosTab contest={currentContest} />;
      default:
        return null;
    }
  };

  if (isLoading || isFetching) {
    return <ContestDetailsSkeleton tabs={CONTEST_DETAILS_TABS} />;
  }

  if (!contest?.id) {
    return <div className="text-muted-foreground p-5 text-sm">Contest not found.</div>;
  }

  if (!isMounted) {
    return null;
  }

  return (
    <section className="">
      {/* The header is much wider than it is tall, so `object-cover` would crop a
          banner down to a thin slice. The image is contained instead, over a blurred
          copy of itself that fills the leftover width. */}
      <div className="bg-surface-tertiary relative h-56 w-full overflow-hidden sm:h-72 lg:h-80">
        {contest.banner ? (
          <>
            <Image
              alt=""
              aria-hidden
              src={contest.banner}
              fill
              unoptimized
              sizes="100vw"
              className="scale-110 object-cover blur-2xl brightness-[0.35]"
            />
            <Image
              alt={`${contest.title} banner`}
              src={contest.banner}
              fill
              unoptimized
              priority
              sizes="100vw"
              className="object-contain"
            />
          </>
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageOff className="text-muted-foreground size-8" />
          </div>
        )}
      </div>

      <div className="border-border-subtle border-b bg-(--bg-inset) px-5 py-3">
        <h1 className="truncate text-lg font-semibold">{contest.title}</h1>
        {contest.category && (
          <p className="text-muted-foreground mt-0.5 truncate text-xs">
            {typeof contest.category === 'string' ? contest.category : contest.category.name}
          </p>
        )}
      </div>

      <div className="border-border-subtle relative flex overflow-x-auto border-b bg-(--bg-inset)">
        {CONTEST_DETAILS_TABS.map((tab, index) => (
          <button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'relative z-10 px-3 py-2 text-[13px] whitespace-nowrap transition-colors duration-150',
              activeTab === tab.key
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}

        <span
          className="bg-primary absolute bottom-0 h-px transition-all duration-240"
          style={{
            width: indicatorStyle.width,
            transform: `translateX(${indicatorStyle.left}px)`,
          }}
        />
      </div>

      <div className="w-full p-5">{renderTabContent(contest)}</div>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) setDeleteDialogOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete upcoming contest?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="text-foreground font-medium">{contest.title}</span> will be archived
              and hidden from contest lists. This is only allowed before participation starts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleDeleteContest();
              }}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete contest'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default ContestDetails;
