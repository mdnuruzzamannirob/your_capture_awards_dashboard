'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Info, Pencil } from 'lucide-react';
import { useState } from 'react';

const DetailsTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Lorem ipsum dolor sit amet',
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem deserunt vero inventore illum sapiente ipsum, doloremque, nulla modi officia veniam sit. Praesentium aliquid asperiores animi perferendis ducimus. Commodi, quo iure?',
    moneyContest: true,
    vote: 7500,
    participant: 55,
    status: 'ACTIVE',
    mode: 'Solo',
    maxUpload: 4,
    minPrize: 200,
    maxPrize: 4000,
    startDate: '2025-01-16',
    endDate: '2025-01-20',
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter contest title"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter contest description"
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Money Contest</Label>
                <Select
                  value={formData.moneyContest ? 'true' : 'false'}
                  onValueChange={(val) => handleChange('moneyContest', val === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
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

              <div>
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

              <div>
                <Label>Max Upload</Label>
                <Input
                  type="number"
                  value={formData.maxUpload}
                  onChange={(e) => handleChange('maxUpload', parseInt(e.target.value))}
                  placeholder="Max upload per participant"
                />
              </div>

              <div>
                <Label>Vote</Label>
                <Input
                  type="number"
                  value={formData.vote}
                  onChange={(e) => handleChange('vote', parseInt(e.target.value))}
                  placeholder="Vote count"
                />
              </div>

              <div>
                <Label>Participant</Label>
                <Input
                  type="number"
                  value={formData.participant}
                  onChange={(e) => handleChange('participant', parseInt(e.target.value))}
                  placeholder="Number of participants"
                />
              </div>

              <div>
                <Label>Min Prize</Label>
                <Input
                  type="number"
                  value={formData.minPrize}
                  onChange={(e) => handleChange('minPrize', parseInt(e.target.value))}
                  placeholder="Minimum prize"
                />
              </div>

              <div>
                <Label>Max Prize</Label>
                <Input
                  type="number"
                  value={formData.maxPrize}
                  onChange={(e) => handleChange('maxPrize', parseInt(e.target.value))}
                  placeholder="Maximum prize"
                />
              </div>

              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="mt-2 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailsTab;
