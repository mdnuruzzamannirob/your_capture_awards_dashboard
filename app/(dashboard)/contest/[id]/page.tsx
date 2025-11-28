'use client';

import DetailsTab from '@/components/modules/content/DetailsTab';
import PrizesTab from '@/components/modules/content/PrizesTab';
import RankTab from '@/components/modules/content/RankTab';
import RulesTab from '@/components/modules/content/RulesTab';
import WinnerTab from '@/components/modules/content/WinnerTab';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

type TabKey = 'details' | 'winners' | 'rules' | 'prizes' | 'rank';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'rules', label: 'Rules' },
  { key: 'prizes', label: 'Prizes' },
  { key: 'rank', label: 'Rank' },
  { key: 'winners', label: 'Winner' },
];

const ContestDetailsPage = () => {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [activeTab, setActiveTab] = useState<TabKey>('details');
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
  });

  const activeIndex = tabs.findIndex((t) => t.key === activeTab);

  useEffect(() => {
    const currentTab = tabRefs.current[activeIndex];

    if (!currentTab) return;

    const { offsetWidth, offsetLeft } = currentTab;

    setIndicatorStyle({
      width: offsetWidth,
      left: offsetLeft,
    });
  }, [activeIndex]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return <DetailsTab />;
      case 'winners':
        return <WinnerTab />;
      case 'rules':
        return <RulesTab />;
      case 'prizes':
        return <PrizesTab />;
      case 'rank':
        return <RankTab />;
      default:
        return null;
    }
  };

  return (
    <section>
      {/* Banner */}
      <div className="h-96 w-full bg-gray-900 p-5" />

      {/* Tabs */}
      <div className="relative flex overflow-x-auto border-b">
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'relative z-10 px-5 py-2 text-sm whitespace-nowrap transition',
              activeTab === tab.key
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:bg-gray-800',
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

      {/* Content */}
      <div className="p-5">{renderTabContent()}</div>
    </section>
  );
};

export default ContestDetailsPage;
