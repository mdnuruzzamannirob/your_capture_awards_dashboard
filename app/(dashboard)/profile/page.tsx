'use client';

import Title from '@/components/common/Title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useGetMeQuery } from '@/store/features/auth/authApi';
import {
  useUpdateUserProfileMutation,
  useUploadUserAvatarMutation,
} from '@/store/features/user/userApi';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

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

const Profile = () => {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetMeQuery();
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [uploadUserAvatar, { isLoading: isUploading }] = useUploadUserAvatarMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');

  const user = data?.data;

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setLocation(user.location || '');
  }, [user]);

  const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id) {
      toast.error('User not found. Please refresh and try again.');
      return;
    }

    try {
      const response = await updateUserProfile({
        userId: user.id,
        firstName,
        lastName,
        location,
      }).unwrap();
      toast.success(response.message || 'Profile updated successfully.');
      refetch();
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError, 'Failed to update profile.'));
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await uploadUserAvatar(formData).unwrap();
      toast.success(response.message || 'Avatar updated successfully.');
      refetch();
      event.target.value = '';
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError, 'Failed to upload avatar.'));
    }
  };

  return (
    <section className="space-y-5 p-5">
      <Title title="Profile" description="Update your account details and avatar." />

      {(isLoading || isFetching) && (
        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
          <Spinner className="size-4" /> Loading profile...
        </div>
      )}

      {isError && (
        <Card>
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <p className="text-destructive text-sm">
              {getErrorMessage(error, 'Failed to load profile details.')}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ''} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar</Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
              <p className="text-muted-foreground text-xs">
                Upload a new profile photo. Field key is <span className="font-medium">avatar</span>
                .
              </p>
            </div>

            <Button type="submit" disabled={isUpdating || isLoading || isFetching}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default Profile;
