'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Info, Pencil } from 'lucide-react';
import { format } from 'date-fns';

const DetailsTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Lorem ipsum dolor sit amet',
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem deserunt vero inventore',
    moneyContest: true,
    vote: 7500,
    participant: 55,
    status: 'ACTIVE',
    mode: 'Solo',
    maxUpload: 4,
    minPrize: 200,
    maxPrize: 4000,
    startDate: new Date('2025-01-16'),
    startTime: '10:00',
    endDate: new Date('2025-01-20'),
    endTime: '18:00',
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    console.log('Updated Data:', formData);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-5">
        <h1 className="flex h-9 items-center gap-2 text-lg font-semibold">
          <Info className="size-5" /> Details
        </h1>

        <Button onClick={() => setIsDialogOpen(true)} className="text-white">
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="flex max-h-[95vh] max-w-[95vw] flex-col overflow-hidden border-2 sm:max-h-[80vh] sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Details</DialogTitle>
          </DialogHeader>
          <form className="size-full overflow-y-auto">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-5 space-y-5">
              {/* Money Contest */}
              <div className="flex flex-col gap-2">
                <Label>Money Contest</Label>
                <Switch
                  checked={formData.moneyContest}
                  onCheckedChange={(val) => handleChange('moneyContest', val)}
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => handleChange('status', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                    <SelectItem value="CLOSED">CLOSED</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mode */}
              <div className="flex flex-col gap-2">
                <Label>Mode</Label>
                <Select value={formData.mode} onValueChange={(val) => handleChange('mode', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solo">Solo</SelectItem>
                    <SelectItem value="Team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Numbers */}
              {['maxUpload', 'participant', 'minPrize', 'maxPrize'].map((key) => (
                <div key={key} className="flex flex-col gap-2">
                  <Label>{key}</Label>
                  <Input
                    type="number"
                    value={formData[key as keyof typeof formData] as number}
                    onChange={(e) => handleChange(key, parseInt(e.target.value) || 0)}
                  />
                </div>
              ))}

              {/* Dates */}
              <div className="flex flex-col gap-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      {format(formData.startDate, 'PPP')}
                      <CalendarIcon className="ml-2 size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleChange('startDate', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      {format(formData.endDate, 'PPP')}
                      <CalendarIcon className="ml-2 size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleChange('endDate', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailsTab;
