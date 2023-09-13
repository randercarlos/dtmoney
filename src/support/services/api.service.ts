import { useServiceBase } from '@/support/services/base.service';
import { encodeQueryString } from '@/support/utils/url';
import { toRefs } from 'vue';

export function useApiService(resource: string = '', fieldId: string = 'id') {
  const apiServiceBase = useServiceBase();

  const all = async (
    params: Record<string, any> = {},
    options: Record<string, any> = {}
  ): Promise<any> => {
    return await apiServiceBase(`${resource}${encodeQueryString(params)}`, options)
      .get()
      .json();
  };

  const create = async (
    record: Record<string, any>,
    options: Record<string, any> = {}
  ): Promise<any> => {
    return await apiServiceBase(resource, options).post(record).json();
  };

  const update = async (
    record: Record<string, any>,
    options: Record<string, any> = {}
  ): Promise<any> => {
    return await apiServiceBase(`${resource}/${getId(record)}`, options)
      .put(record)
      .json();
  };

  const save = async (
    record: Record<string, any>,
    options: Record<string, any> = {}
  ): Promise<any> => {
    if (
      record.hasOwnProperty(fieldId) &&
      ![null, undefined, '', 0].includes((record as any)[fieldId as string])
    ) {
      return await update(record, options);
    }

    return await create(record, options);
  };

  const show = async (id: string | number, options: Record<string, any> = {}): Promise<any> => {
    return await apiServiceBase(`${resource}/${id}`, options).get().json();
  };

  const destroy = async (id: string | number, options: Record<string, any> = {}): Promise<any> => {
    return await apiServiceBase(`${resource}/${id}`, options).delete().json();
  };

  const getId = (record: object | string | number): string => {
    if (typeof record === 'object') {
      return (record as any)[fieldId];
    }

    return String(record);
  };

  return { apiServiceBase, all, create, update, save, show, destroy };
}
