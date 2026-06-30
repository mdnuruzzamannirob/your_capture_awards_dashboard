'use client';

import Title from '@/components/common/Title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { useGetMeQuery } from '@/store/features/auth/authApi';
import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useGetSitePolicyQuery,
  useUpdateSitePolicyMutation,
} from '@/store/features/settings/settingsApi';
import { useEffect, useState, useTransition, Suspense } from 'react';
import { toast } from 'sonner';
import { useSearchParams, useRouter } from 'next/navigation';
import { Camera, ShieldCheck, UserCheck, FileText } from 'lucide-react';
import { TipTapEditor } from '@/components/common/tiptap-editor/TipTapEditor';
import Image from 'next/image';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback;

  if ('data' in error) {
    const data = (error as { data?: { message?: string; error?: { message?: string } } }).data;
    if (data?.message) return data.message;
    if (data?.error?.message) return data.error.message;
  }

  if ('message' in error && typeof (error as { message?: string }).message === 'string') {
    return (error as { message: string }).message;
  }

  return fallback;
};

// Independent Site Policy Editor component (handles its own state, lifecycle, and API queries)
const PolicyEditor = ({
  type,
  title,
  description,
}: {
  type: 'ABOUT' | 'TERMS' | 'POLICY';
  title: string;
  description: string;
}) => {
  const { data: policyData, isLoading: isPolicyLoading, isFetching: isPolicyFetching } =
    useGetSitePolicyQuery({ type });
  const [updateSitePolicy, { isLoading: isUpdatingPolicy }] = useUpdateSitePolicyMutation();
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    if (policyData?.data && policyData.data.length > 0) {
      setEditorContent(policyData.data[0].content);
    } else {
      setEditorContent('');
    }
  }, [policyData]);

  const handlePolicySave = async () => {
    try {
      const response = await updateSitePolicy({
        type,
        content: editorContent,
      }).unwrap();
      toast.success(response.message || `${title} updated successfully.`);
    } catch (error) {
      toast.error(getErrorMessage(error, `Failed to update ${title.toLowerCase()}.`));
    }
  };

  if (isPolicyLoading || isPolicyFetching) {
    return (
      <Card className="border-border bg-surface/50 animate-pulse">
        <CardHeader className="space-y-2">
          <div className="bg-muted h-6 w-32 rounded" />
          <div className="bg-muted h-4 w-64 rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Skeleton Editor */}
          <div className="overflow-hidden rounded-md border border-border bg-background">
            <div className="bg-surface/50 flex h-11 items-center gap-2 border-b border-border px-3">
              <div className="bg-muted h-6 w-6 rounded" />
              <div className="bg-muted h-6 w-6 rounded" />
              <div className="bg-muted h-6 w-6 rounded" />
              <div className="bg-muted mx-1 h-6 w-1" />
              <div className="bg-muted h-6 w-6 rounded" />
              <div className="bg-muted h-6 w-6 rounded" />
              <div className="bg-muted h-6 w-6 rounded" />
            </div>
            <div className="bg-background min-h-[120px] space-y-3 p-4">
              <div className="bg-muted h-4 w-2/3 rounded" />
              <div className="bg-muted h-4 w-4/5 rounded" />
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-muted h-10 w-28 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-surface/50 animate-fadeIn">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TipTapEditor value={editorContent} onChange={setEditorContent} />
        <div className="flex justify-end">
          <Button onClick={handlePolicySave} disabled={isUpdatingPolicy}>
            {isUpdatingPolicy ? 'Saving...' : `Save ${title}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Site Policy Manager Sub-tab
const SitePolicyTab = () => {
  const [selectedSubTab, setSelectedSubTab] = useState<'ABOUT' | 'TERMS' | 'POLICY'>('ABOUT');

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant={selectedSubTab === 'ABOUT' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedSubTab('ABOUT')}
          className="rounded-full"
        >
          About Us
        </Button>
        <Button
          variant={selectedSubTab === 'TERMS' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedSubTab('TERMS')}
          className="rounded-full"
        >
          Terms & Conditions
        </Button>
        <Button
          variant={selectedSubTab === 'POLICY' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedSubTab('POLICY')}
          className="rounded-full"
        >
          Privacy Policy
        </Button>
      </div>

      {selectedSubTab === 'ABOUT' && (
        <PolicyEditor
          key="ABOUT"
          type="ABOUT"
          title="About Us"
          description="Edit the content describing your organization."
        />
      )}
      {selectedSubTab === 'TERMS' && (
        <PolicyEditor
          key="TERMS"
          type="TERMS"
          title="Terms & Conditions"
          description="Edit the terms and conditions policy of your site."
        />
      )}
      {selectedSubTab === 'POLICY' && (
        <PolicyEditor
          key="POLICY"
          type="POLICY"
          title="Privacy Policy"
          description="Edit the privacy policy and data statement of your site."
        />
      )}
    </div>
  );
};

// Profile Sub-component
const ProfileTab = ({ user, refetch }: { user: any; refetch: () => void }) => {
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');

  // Avatar Upload State
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setLocation(user.location || '');
    setPreviewUrl(user.avatar || null);
    setAvatarFile(null);
  }, [user]);

  const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await updateProfile({
        firstName,
        lastName,
        location,
      }).unwrap();
      toast.success(response.message || 'Profile updated successfully.');
      refetch();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update profile.'));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const response = await uploadAvatar(formData).unwrap();
      toast.success(response.message || 'Avatar uploaded successfully.');
      setAvatarFile(null);
      refetch();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to upload avatar.'));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 animate-fadeIn lg:grid-cols-3">
      {/* Left side: Avatar Manager */}
      <Card className="border-border bg-surface/50 flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="size-5 text-primary" />
            Profile Picture
          </CardTitle>
          <CardDescription>Update your profile picture.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 pb-6">
          <div className="relative size-32 overflow-hidden rounded-full border-4 border-border bg-surface-tertiary">
            {previewUrl ? (
              <Image
                alt="Avatar Preview"
                src={previewUrl}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-muted-foreground">
                {firstName?.charAt(0) || 'U'}
              </div>
            )}
            <label
              htmlFor="avatarInput"
              className="bg-overlay absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity hover:opacity-100"
            >
              <Camera className="text-foreground size-8" />
            </label>
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('avatarInput')?.click()}
              disabled={isUploading}
              className="w-full"
            >
              Choose Photo
            </Button>
            {avatarFile && (
              <Button
                variant="default"
                size="sm"
                onClick={handleAvatarUpload}
                disabled={isUploading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isUploading ? 'Uploading...' : 'Save Avatar'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Right side: profile info form */}
      <Card className="border-border bg-surface/50 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="size-5 text-primary" />
            Profile Details
          </CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isUpdating}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isUpdating}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={user?.email || ''} disabled className="opacity-60" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location (e.g. Bangladesh)"
                disabled={isUpdating}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Password Sub-component
const PasswordTab = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    try {
      const response = await changePassword({ oldPassword, newPassword }).unwrap();
      toast.success(response.message || 'Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update password.'));
    }
  };

  return (
    <Card className="border-border bg-surface/50 animate-fadeIn">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          Change Password
        </CardTitle>
        <CardDescription>Secure your account with a strong password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Current Password</Label>
            <Input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter your current password"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter a new strong password"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const SettingsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentTab = searchParams.get('tab') || 'profile';

  const { data: userData, isLoading: isUserLoading, refetch } = useGetMeQuery();
  const user = userData?.data;

  const handleTabChange = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('tab', value);
      router.push(`/settings?${params.toString()}`);
    });
  };

  if (isUserLoading) {
    return (
      <section className="space-y-5 p-5 animate-pulse">
        <Title title="Settings" description="Manage your account profile, security, and policies." />
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-10 justify-center">
          <Spinner className="size-6" /> Loading settings dashboard...
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5 p-5">
      <Title title="Settings" description="Manage your account profile, security, and policies." />

      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full space-y-5">
        <TabsList className="grid w-full max-w-md grid-cols-3 border border-border bg-surface">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="change-password">Password</TabsTrigger>
          <TabsTrigger value="site-policy">Site Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 outline-none">
          <ProfileTab user={user} refetch={refetch} />
        </TabsContent>

        <TabsContent value="change-password" className="space-y-4 outline-none">
          <PasswordTab />
        </TabsContent>

        <TabsContent value="site-policy" className="space-y-4 outline-none">
          <SitePolicyTab />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <section className="space-y-5 p-5">
        <Title title="Settings" description="Loading..." />
        <div className="flex items-center justify-center py-10">
          <Spinner className="size-6" />
        </div>
      </section>
    }>
      <SettingsContent />
    </Suspense>
  );
}
