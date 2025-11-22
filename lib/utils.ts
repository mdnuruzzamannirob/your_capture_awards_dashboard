import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getServerToken = async () => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get('token')?.value;
  } catch {
    return null;
  }
};

export function decodeToken(token: string | null): any {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split('.')[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
