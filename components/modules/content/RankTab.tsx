'use client';

import { Info } from 'lucide-react';

const RankTab = () => {
  return (
    <div className="space-y-5">
      {' '}
      <div className="flex items-center justify-between gap-5">
        <h1 className="flex h-9 items-center gap-2 text-lg font-semibold">
          <Info className="size-5" /> Rank
        </h1>
      </div>
      <div className="space-y-5 rounded-xl border p-5"></div>
    </div>
  );
};

export default RankTab;
