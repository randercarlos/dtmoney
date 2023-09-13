import { useStore } from '@/stores/index';

export function useRequestInterceptor(options: RequestInit) {
  const myToken = null;
  if (myToken) {
    // @ts-ignore
    options.headers.Authorization = `Bearer ${myToken}`;
  }

  return { options };
}
