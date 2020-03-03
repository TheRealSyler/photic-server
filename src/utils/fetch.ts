import fetch, { RequestInit } from 'node-fetch';

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  const res = await fetch(url, options);
  if (res.status === 200) {
    return res.json();
  }
  return null;
}
