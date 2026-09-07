'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  useCreateSocialLinkMutation,
  useDeleteSocialLinkMutation,
  useGetAllSocialLinksQuery,
  useUpdateSocialLinkMutation,
} from '@/store/features/socialLink/socialLinkApi';
import type { SocialLink, SocialPlatform } from '@/store/features/socialLink/types';
import { Pencil, Plus, Share2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { HiOutlineGlobeAlt, HiOutlineMail } from 'react-icons/hi';
import { toast } from 'sonner';

const platformOptions: { value: SocialPlatform; label: string }[] = [
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'X', label: 'X (Twitter)' },
  { value: 'YOUTUBE', label: 'YouTube' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'PINTEREST', label: 'Pinterest' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'WEBSITE', label: 'Website / Other' },
];

const platformLabel: Record<SocialPlatform, string> = Object.fromEntries(
  platformOptions.map((option) => [option.value, option.label]),
) as Record<SocialPlatform, string>;

const platformIcon: Record<SocialPlatform, React.ReactNode> = {
  FACEBOOK: <FaFacebook className="size-4" />,
  INSTAGRAM: <FaInstagram className="size-4" />,
  X: <FaXTwitter className="size-4" />,
  YOUTUBE: <FaYoutube className="size-4" />,
  TIKTOK: <FaTiktok className="size-4" />,
  LINKEDIN: <FaLinkedin className="size-4" />,
  PINTEREST: <FaPinterest className="size-4" />,
  WHATSAPP: <FaWhatsapp className="size-4" />,
  EMAIL: <HiOutlineMail className="size-4" />,
  WEBSITE: <HiOutlineGlobeAlt className="size-4" />,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback;
  if ('data' in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return fallback;
};

type FormState = {
  platform: SocialPlatform;
  url: string;
  isActive: boolean;
};

const emptyForm: FormState = { platform: 'FACEBOOK', url: '', isActive: true };

const SocialLinksTab = () => {
  const { data, isLoading, isFetching } = useGetAllSocialLinksQuery();
  const [createSocialLink, { isLoading: isCreating }] = useCreateSocialLinkMutation();
  const [updateSocialLink, { isLoading: isUpdating }] = useUpdateSocialLinkMutation();
  const [deleteSocialLink, { isLoading: isDeleting }] = useDeleteSocialLinkMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null);

  const links = data?.data ?? [];

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEditForm = (link: SocialLink) => {
    setEditingId(link.id);
    setForm({ platform: link.platform, url: link.url, isActive: link.isActive });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.url.trim()) {
      toast.error('Please enter a URL.');
      return;
    }

    try {
      if (editingId) {
        const response = await updateSocialLink({ id: editingId, ...form }).unwrap();
        toast.success(response.message || 'Social link updated.');
      } else {
        const response = await createSocialLink(form).unwrap();
        toast.success(response.message || 'Social link added.');
      }
      setFormOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save social link.'));
    }
  };

  const handleToggleActive = async (link: SocialLink) => {
    try {
      await updateSocialLink({ id: link.id, isActive: !link.isActive }).unwrap();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update social link.'));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const response = await deleteSocialLink({ id: deleteTarget.id }).unwrap();
      toast.success(response.message || 'Social link removed.');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to remove social link.'));
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="text-primary size-5" />
            Social Links
          </CardTitle>
          <CardDescription>
            Manage the social icons shown in the website footer.
          </CardDescription>
        </div>
        <Button onClick={openCreateForm} size="sm">
          <Plus className="size-4" /> Add Social Link
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading || isFetching ? (
          <p className="text-muted-foreground text-sm">Loading social links...</p>
        ) : links.length ? (
          <ul className="divide-border-subtle divide-y">
            {links.map((link) => (
              <li key={link.id} className="flex items-center gap-3 py-3">
                <span className="bg-primary-soft text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
                  {platformIcon[link.platform]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{platformLabel[link.platform]}</p>
                  <p className="text-muted-foreground truncate text-xs">{link.url}</p>
                </div>
                <Switch checked={link.isActive} onCheckedChange={() => handleToggleActive(link)} />
                <Button variant="ghost" size="icon-sm" onClick={() => openEditForm(link)}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(link)}>
                  <Trash2 className="text-destructive size-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">
            No social links configured yet. Add one to show it in the website footer.
          </p>
        )}
      </CardContent>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Social Link' : 'Add Social Link'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={form.platform}
                onValueChange={(value) => setForm((prev) => ({ ...prev, platform: value as SocialPlatform }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={form.url}
                onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
                placeholder={
                  form.platform === 'EMAIL' ? 'mailto:info@example.com' : 'https://...'
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
              />
              <Label>Show on website</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this social link?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && `${platformLabel[deleteTarget.platform]} will no longer be shown on the website.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SocialLinksTab;
