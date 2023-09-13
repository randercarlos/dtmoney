import { useStore } from '@/stores/index';
import { AfterFetchContext } from '@vueuse/core';

export function useResponseInterceptor(ctx: AfterFetchContext) {
  return { ctx };
}
