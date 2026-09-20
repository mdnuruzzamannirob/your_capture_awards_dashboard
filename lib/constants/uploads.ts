/**
 * Mirrors the backend's src/shared/uploadFormats.ts and the frontend's
 * src/constants/uploads.ts. All three must stay in sync - if the dashboard
 * offers an admin a format the server rejects, the upload fails after the file
 * has already been chosen.
 */

/** Photography: contest entries, trades and the user's photo pool. */
export const PHOTO_UPLOAD_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/tiff',
] as const;

/** Imagery rendered directly in an <img>: avatars, banners, editor images. */
export const WEB_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

// SVG is intentionally absent: it can carry script and is served from our own
// domain. Never add it to either list.

export type PhotoUploadMimeType = (typeof PHOTO_UPLOAD_MIME_TYPES)[number];
export type WebImageMimeType = (typeof WEB_IMAGE_MIME_TYPES)[number];

const MIME_TYPE_ALIASES: Record<string, string> = {
  'image/jpg': 'image/jpeg',
  'image/pjpeg': 'image/jpeg',
  'image/x-png': 'image/png',
};

export const normalizeImageMimeType = (mimeType: string) => {
  const normalized = mimeType.trim().toLowerCase();
  return MIME_TYPE_ALIASES[normalized] || normalized;
};

const toAcceptAttribute = (mimeTypes: readonly string[]) =>
  [...mimeTypes, 'image/jpg'].join(',');

export const PHOTO_UPLOAD_ACCEPT = toAcceptAttribute(PHOTO_UPLOAD_MIME_TYPES);
export const WEB_IMAGE_ACCEPT = toAcceptAttribute(WEB_IMAGE_MIME_TYPES);

const toLabel = (mimeTypes: readonly string[]) =>
  mimeTypes.map((mimeType) => mimeType.replace('image/', '').toUpperCase()).join(', ');

export const PHOTO_UPLOAD_LABEL = toLabel(PHOTO_UPLOAD_MIME_TYPES);
export const WEB_IMAGE_LABEL = toLabel(WEB_IMAGE_MIME_TYPES);

export const isPhotoUploadFile = (file: File) =>
  (PHOTO_UPLOAD_MIME_TYPES as readonly string[]).includes(normalizeImageMimeType(file.type));

export const isWebImageFile = (file: File) =>
  (WEB_IMAGE_MIME_TYPES as readonly string[]).includes(normalizeImageMimeType(file.type));

export const getImageFileError = (
  file: File,
  accepts: 'photo' | 'web' = 'web',
): string | null => {
  const allowed = accepts === 'photo' ? isPhotoUploadFile(file) : isWebImageFile(file);
  if (allowed) return null;

  const label = accepts === 'photo' ? PHOTO_UPLOAD_LABEL : WEB_IMAGE_LABEL;
  return `Only image files are allowed. Please choose a ${label} file.`;
};

/** Options for the contest SUBMISSION_FORMAT rule editor. */
export const CONTEST_FILE_FORMAT_OPTIONS = PHOTO_UPLOAD_MIME_TYPES.map((value) => ({
  value,
  label: value.replace('image/', '').toUpperCase(),
}));
