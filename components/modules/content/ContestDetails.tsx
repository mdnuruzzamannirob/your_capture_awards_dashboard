'use client';

import ContestDetailsSkeleton from '@/components/modules/content/ContestDetailsSkeleton';
import DetailsTab from '@/components/modules/content/DetailsTab';
import ParticipantsTab from '@/components/modules/content/ParticipantsTab';
import PhotosTab from '@/components/modules/content/PhotosTab';
import PrizesTab from '@/components/modules/content/PrizesTab';
import RankTab from '@/components/modules/content/RankTab';
import RulesTab from '@/components/modules/content/RulesTab';
import WinnerTab from '@/components/modules/content/WinnerTab';
import { CONTEST_DETAILS_TABS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useGetContestQuery } from '@/store/features/contest/contestApi';
import type { Contest } from '@/store/features/contest/types';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { GoDotFill } from 'react-icons/go';

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

  const { data, isLoading, isFetching } = useGetContestQuery({ id: params?.id as string });
  const contest = data?.data as Contest | undefined;

  const isUpcoming = contest?.status === 'UPCOMING';
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

  const renderTabContent = (currentContest: Contest) => {
    switch (activeTab) {
      case 'details':
        return (
          <DetailsTab
            contest={currentContest}
            canEdit={isUpcoming}
            onEditClick={() => router.push(`/contest/${params?.id}/edit`)}
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
      <div className="bg-surface-tertiary relative h-40 w-full overflow-hidden sm:h-48 lg:h-56">
        {contest.banner ? (
          <Image
            alt={`${contest.title} banner`}
            src={contest.banner}
            fill
            unoptimized
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="bg-surface-tertiary flex size-full items-center justify-center">
            <ImageOff className="text-muted-foreground size-8" />
          </div>
        )}

        {/* Title + status sit on the banner itself so the page always has a clear
            identity, banner or not. */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold text-white drop-shadow sm:text-2xl">
              {contest.title}
            </h1>
            {contest.category && (
              <p className="mt-1 truncate text-xs text-white/70">
                {typeof contest.category === 'string' ? contest.category : contest.category.name}
              </p>
            )}
          </div>

          <span
            className={cn(
              'flex w-fit shrink-0 items-center gap-1 rounded-sm px-[7px] py-0.5 text-[11px] font-medium capitalize',
              contest.status === 'ACTIVE' && 'bg-success-subtle text-success',
              (contest.status === 'CLOSED' || contest.status === 'COMPLETED') &&
                'bg-error-subtle text-destructive',
              contest.status === 'UPCOMING' && 'bg-warning-subtle text-warning',
            )}
          >
            <GoDotFill className="size-2" /> {contest.status}
          </span>
        </div>
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
    </section>
  );
};

export default ContestDetails;
