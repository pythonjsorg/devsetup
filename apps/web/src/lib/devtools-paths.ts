// Single source of truth for devtools URL prefixing.
// Next.js auto-prefixed every internal href with basePath '/devtools'; after the
// migration to Astro there is no basePath, so links are prefixed explicitly here.

export const DEVTOOLS_BASE = '/devtools';

export const homeHref = DEVTOOLS_BASE;
export const changelogHref = `${DEVTOOLS_BASE}/changelog`;
export const toolHref = (id: string) => `${DEVTOOLS_BASE}/tools/${id}`;
