'use client';

import { Button } from '@/components/ui/button';
import { Info, Pencil } from 'lucide-react';

const DetailsTab = () => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-5">
        <h1 className="flex h-9 items-center gap-2 text-lg font-semibold">
          <Info className="size-5" /> Details
        </h1>

        <Button className="text-white">
          <Pencil /> Edit
        </Button>
      </div>

      <div className="space-y-5 rounded-xl border p-5">
        <div className="space-y-1 text-sm">
          <h1 className="text-muted-foreground font-medium">Creator</h1>
          <div className="flex items-center gap-2">
            <p className="size-8 rounded-full bg-gray-500"></p>
            <p className="text-base font-medium">Md. Nuruzzaman</p>
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <h1 className="text-muted-foreground font-medium">Title</h1>
          <h1 className="text-base font-semibold">Lorem ipsum dolor sit amet</h1>
        </div>

        <div className="space-y-1 text-sm">
          <h1 className="text-muted-foreground font-medium">Description</h1>
          <p className="text-base">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem deserunt vero inventore
            illum sapiente ipsum, doloremque, nulla modi officia veniam sit. Praesentium aliquid
            asperiores animi perferendis ducimus. Commodi, quo iure?
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 text-sm">
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Money Contest</h1>
            <p className="text-base font-semibold">True</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Vote</h1>
            <p className="text-base font-semibold">7500</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Participant</h1>
            <p className="text-base font-semibold">55</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Status</h1>
            <p className="text-base font-semibold">ACTIVE</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Mode</h1>
            <p className="text-base font-semibold">Solo</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Max Upload</h1>
            <p className="text-base font-semibold">4</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Min Prize</h1>
            <p className="text-base font-semibold">$200</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Max Prize</h1>
            <p className="text-base font-semibold">$4000</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Start Date</h1>
            <p className="text-base font-semibold">16 Jan 2025</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">End Date</h1>
            <p className="text-base font-semibold">20 Jan 2025</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Updated At</h1>
            <p className="text-base font-semibold">16 Jan 2025</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-muted-foreground font-medium">Created At</h1>
            <p className="text-base font-semibold">15 Jan 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
