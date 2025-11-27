'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Info, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const PrizesTab = () => {
  const [rule1Open, setRule1Open] = useState(true);
  const [rule2Open, setRule2Open] = useState(true);

  return (
    <div className="space-y-5">
      {' '}
      <div className="flex items-center justify-between gap-5">
        <h1 className="flex h-9 items-center gap-2 text-lg font-semibold">
          <Info className="size-5" /> Prizes
        </h1>

        <Button className="text-white">
          <Plus /> Add
        </Button>
      </div>
      <div className="rounded-xl border">
        <div
          onClick={() => setRule1Open(!rule1Open)}
          className={cn(
            'flex cursor-pointer items-center justify-between gap-3 p-3 select-none',
            rule1Open && 'border-b',
          )}
        >
          <h1 className="flex-1 font-medium">Top Photo Award</h1>
          <Button
            onClick={(event) => event.stopPropagation()}
            variant="outline"
            className="text-white"
          >
            <Pencil />
          </Button>
          <Button
            onClick={(event) => event.stopPropagation()}
            variant="destructive"
            className="text-white"
          >
            <Trash2 />
          </Button>
        </div>

        {rule1Open && (
          <div className="flex gap-3 p-3">
            <p className="size-12 min-w-12 rounded-xl bg-gray-700"></p>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Lorem ipsum dolor sit amet.</h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga ipsum voluptates
                provident molestiae quos in? Lorem ipsum dolor, sit amet consectetur adipisicing
                elit. Sint sit fugit, omnis natus doloribus labore deserunt ullam modi dolorum autem
                cupiditate itaque soluta quia ab vero quas ipsam corporis? Odit.
              </p>

              <div className="flex items-center gap-5 text-sm">
                <div className="space-y-1">
                  <h3 className="text-muted-foreground font-medium">Swap</h3>
                  <p className="text-base font-semibold">40</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-muted-foreground font-medium">Boost</h3>
                  <p className="text-base font-semibold">40</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-muted-foreground font-medium">Key</h3>
                  <p className="text-base font-semibold">40</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="rounded-xl border">
        <div
          onClick={() => setRule2Open(!rule2Open)}
          className={cn(
            'flex cursor-pointer items-center justify-between gap-3 p-3 select-none',
            rule2Open && 'border-b',
          )}
        >
          <h1 className="flex-1 font-medium">Top Photographer Award</h1>
          <Button
            onClick={(event) => event.stopPropagation()}
            variant="outline"
            className="text-white"
          >
            <Pencil />
          </Button>
          <Button
            onClick={(event) => event.stopPropagation()}
            variant="destructive"
            className="text-white"
          >
            <Trash2 />
          </Button>
        </div>

        {rule2Open && (
          <div className="flex gap-3 p-3">
            <p className="size-12 min-w-12 rounded-xl bg-gray-700"></p>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Lorem ipsum dolor sit amet.</h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga ipsum voluptates
                provident molestiae quos in? Lorem ipsum dolor, sit amet consectetur adipisicing
                elit. Sint sit fugit, omnis natus doloribus labore deserunt ullam modi dolorum autem
                cupiditate itaque soluta quia ab vero quas ipsam corporis? Odit.
              </p>

              <div className="flex items-center gap-5 text-sm">
                <div className="space-y-1">
                  <h3 className="text-muted-foreground font-medium">Swap</h3>
                  <p className="text-base font-semibold">40</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-muted-foreground font-medium">Boost</h3>
                  <p className="text-base font-semibold">40</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-muted-foreground font-medium">Key</h3>
                  <p className="text-base font-semibold">40</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrizesTab;
