import { Ref, unref } from 'vue';
import Toaster from './toaster';
import HttpStatusCode from '@/support/utils/HttpStatusCode';

export function handleResponseError(
  response: Ref<Response | null> | Response,
  data: any = null
): void {
  if (unref(response)?.status === HttpStatusCode.UNPROCESSABLE_ENTITY) {
    showWarnings(unref(data)?.errors);
  }
}

export function showWarnings(errors: string[]): void {
  if (errors && errors.length > 0) {
    for (const error of errors) {
      Toaster.warn(error);
    }
  }
}

export function showErrors(errors: string[]): void {
  if (errors && errors.length > 0) {
    for (const error of errors) {
      Toaster.error(error);
    }
  }
}
