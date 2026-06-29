'use client';

import { redirect } from 'next/navigation';

export default function ChangePasswordPage() {
  redirect('/settings?tab=change-password');
  return null;
}
