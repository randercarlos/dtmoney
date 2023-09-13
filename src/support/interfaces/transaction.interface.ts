import { TransactionType } from '@/support/enums/transaction-type.enum';

export interface Transaction {
  id: string | undefined | number;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  createdAt: Date | undefined;
}
