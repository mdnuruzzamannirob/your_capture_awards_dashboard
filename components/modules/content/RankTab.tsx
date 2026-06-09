'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

const RankTab = ({ contest }: { contest: any }) => {
  const [activeRankTab, setActiveRankTab] = useState<'top-photo' | 'top-photographer'>('top-photo');
  const rankPhotos = contest?.rankPhotos ?? contest?.rank?.photos ?? [];
  const rankPhotographers = contest?.rankPhotographers ?? contest?.rank?.photographers ?? [];

  return (
    <div className="w-full space-y-6">
      <Tabs value={activeRankTab} onValueChange={(value) => setActiveRankTab(value as any)}>
        <TabsList className="grid grid-cols-2 rounded-md bg-white/5">
          <TabsTrigger value="top-photo" className="">
            Top Photo
          </TabsTrigger>
          <TabsTrigger value="top-photographer" className="">
            Top Photographer
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeRankTab === 'top-photo' ? (
        <div className="rounded-2xl border p-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rankPhotos.length ? (
              rankPhotos.map((photo: any, index: number) => (
                <div key={photo?.id ?? index} className="rounded-xl border p-4">
                  <p className="text-muted-foreground text-sm">#{index + 1}</p>
                  <p className="mt-1 font-medium">{photo?.user?.fullName ?? 'Unknown user'}</p>
                  <p className="text-muted-foreground text-sm">{photo?.voteCount ?? 0} votes</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No ranked photos available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border p-5">
          <div className="space-y-4">
            {rankPhotographers.length ? (
              rankPhotographers.map((item: any, index: number) => (
                <div key={item?.id ?? index} className="rounded-xl border p-4">
                  <p className="font-medium">
                    #{index + 1} {item?.user?.fullName ?? 'Unknown user'}
                  </p>
                  <p className="text-muted-foreground text-sm">{item?.totalVotes ?? 0} votes</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No ranked photographers available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RankTab;
