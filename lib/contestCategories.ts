export const MAX_CONTEST_CATEGORIES = 10;

type CategorySource = {
  categories?: string[] | null;
  category?: string | { id?: string; name?: string } | null;
};

// Contests created before multi-category support only have the single legacy
// `category` field, so fall back to it when `categories` is missing or empty.
export function getContestCategories(contest?: CategorySource | null): string[] {
  if (!contest) return [];
  const categories = (contest.categories ?? [])
    .map((category) => category?.trim())
    .filter((category): category is string => Boolean(category));
  if (categories.length) return categories;

  const legacy =
    typeof contest.category === 'string' ? contest.category : contest.category?.name;
  return legacy?.trim() ? [legacy.trim()] : [];
}

// Case-insensitive de-duplication that keeps the first spelling, matching the API.
export function dedupeCategories(categories: string[]): string[] {
  const seen = new Set<string>();
  return categories
    .map((category) => category.trim())
    .filter((category) => {
      const key = category.toLowerCase();
      if (!category || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
