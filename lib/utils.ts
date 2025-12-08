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

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;

  // If older than 1 month → show exact date & time
  return date.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

export const formatDateToDayMonYear = (isoString: string) => {
  const date = new Date(isoString);

  const day = date.getUTCDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
};

export const formatDateWithTime = (isoString: string) => {
  // Check for falsy values (null, undefined, empty string)
  if (!isoString) {
    return {};
  }

  const date = new Date(isoString);

  // Check if the Date object is valid (NaN check)
  if (isNaN(date.getTime())) {
    return {};
  }

  // Date Components (UTC)
  const day = date.getUTCDate();
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const year = date.getUTCFullYear();

  // Time Components (UTC)
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  // Combining Date and Time
  return { day, month, year, hours, minutes, timeZone: 'UTC' };
};

export const toPascalCase = (str: string) => {
  return str.replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase());
};
