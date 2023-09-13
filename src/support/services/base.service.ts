import { useStore } from '@/stores/index';
import {
  AfterFetchContext,
  BeforeFetchContext,
  createFetch,
  OnFetchErrorContext,
} from '@vueuse/core';
import { useRequestInterceptor } from '@/support/interceptors/request.interceptor';
import { useResponseInterceptor } from '@/support/interceptors/response.interceptor';
import { handleResponseError } from '../utils/handle-response';

export function useServiceBase() {
  const apiServiceBase = createFetch({
    baseUrl: import.meta.env.VITE_API_URL,
    options: {
      immediate: true,
      refetch: true,
      beforeFetch(ctx: BeforeFetchContext) {
        const { options } = useRequestInterceptor(ctx.options);

        return { options };
      },
      afterFetch(ctx: AfterFetchContext) {
        const { ctx: updateCtx } = useResponseInterceptor(ctx);

        return updateCtx;
      },
      // onFetchError(ctx: OnFetchErrorContext) {
      //   // @ts-ignore
      //   if (!ctx?.response?.ok) {
      //     // @ts-ignore
      //     handleResponseError(ctx?.response, ctx.data);
      //   }

      //   return ctx;
      // },
    },
    fetchOptions: {
      mode: 'cors',
    },
  });

  return apiServiceBase;
}
