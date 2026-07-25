'use client';

import ContestDetailsSkeleton from '@/components/modules/content/ContestDetailsSkeleton';
import DetailsTab from '@/components/modules/content/DetailsTab';
import PrizesTab from '@/components/modules/content/PrizesTab';
import RankTab from '@/components/modules/content/RankTab';
import RulesTab from '@/components/modules/content/RulesTab';
import WinnerTab from '@/components/modules/content/WinnerTab';
import { CONTEST_DETAILS_TABS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useGetContestQuery } from '@/store/features/contest/contestApi';
import type { Contest } from '@/store/features/contest/types';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const ContestDetails = () => {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const params = useParams();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'prizes' | 'rules' | 'rank' | 'winners'>(
    'details',
  );
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
    <section className="border-border-subtle bg-surface overflow-hidden rounded-lg border">
      <div className="bg-surface-tertiary relative h-72 w-full overflow-hidden lg:h-96">
        {contest.banner ? (
          <Image
            alt={`${contest.title} banner`}
            src={contest.banner}
            width={1920}
            height={500}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center p-5 text-center">
            <div>
              <p className="text-muted-foreground text-sm">No banner uploaded</p>
              <h1 className="mt-2 text-2xl font-semibold">{contest.title}</h1>
            </div>
          </div>
        )}
      </div>

      <div className="border-border-subtle relative flex overflow-x-auto border-b bg-[var(--bg-inset)]">
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
