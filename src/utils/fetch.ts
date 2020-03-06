import fetch, { RequestInit } from 'node-fetch';

import parse from 'parse-link-header';

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  const res = await fetch(url, options);
  if (res.status === 200) {
    return res.json();
  }
  return null;
}
/** Only works if the response is an array. */
export async function fetchJsonAllPages<T extends any[]>(
  url: string,
  options?: RequestInit,
  response: T = ([] as unknown) as T
): Promise<T | null> {
  const res = await fetch(url, options);
  const LinkHeader = res.headers.get('Link');
  const link = parse(LinkHeader || '');
  if (res.status === 200) {
    const data = await res.json();
    if (!Array.isArray(data)) {
      return null;
    }
    response = response.concat(data) as T;
    if (link && link.next) {
      return fetchJsonAllPages(link.next.url, options, response);
    }
    return response;
  }
  return null;
}
