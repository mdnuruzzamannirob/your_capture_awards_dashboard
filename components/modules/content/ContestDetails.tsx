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
  const contest = data?.data ?? {};

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <DetailsTab
            contest={contest}
            canEdit={isUpcoming}
            onEditClick={() => router.push(`/contest/${params?.id}/edit`)}
          />
        );
      case 'prizes':
        return <PrizesTab contest={contest} />;
      case 'rules':
        return <RulesTab contest={contest} />;
      case 'rank':
        return <RankTab contest={contest} />;
      case 'winners':
        return <WinnerTab contest={contest} />;
      default:
        return null;
    }
  };

  if (isLoading || isFetching) {
    return <ContestDetailsSkeleton tabs={CONTEST_DETAILS_TABS} />;
  }

  if (!contest?.banner) {
    return <div className="text-muted-foreground p-5 text-sm">Contest not found.</div>;
  }

  if (!isMounted) {
    return null;
  }

  return (
    <section>
      <div className="h-96 w-full">
        <Image
          alt="banner"
          src={contest.banner}
          width={1920}
          height={500}
          className="size-full bg-surface object-cover"
        />
      </div>

      <div className="relative flex overflow-x-auto border-b">
        {CONTEST_DETAILS_TABS.map((tab, index) => (
          <button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'relative z-10 px-5 py-3 text-sm whitespace-nowrap transition',
              activeTab === tab.key
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:bg-surface-tertiary',
            )}
          >
            {tab.label}
          </button>
        ))}

        <span
          className="bg-primary absolute bottom-0 h-0.5 transition-all duration-300"
          style={{
            width: indicatorStyle.width,
            transform: `translateX(${indicatorStyle.left}px)`,
          }}
        />
      </div>

      <div className="w-full p-5">{renderTabContent()}</div>
    </section>
  );
};

export default ContestDetails;
