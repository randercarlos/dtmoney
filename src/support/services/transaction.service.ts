import { useApiService } from '@/support/services/api.service';

export function useTransactionService() {
  const transactionService = useApiService('transactions', 'id');

  return transactionService;
}
