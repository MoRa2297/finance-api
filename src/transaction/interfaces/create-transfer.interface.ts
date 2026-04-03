export interface ICreateTransfer {
  amount: number;
  date: string;
  description: string;
  note?: string;
  fromAccountId: number;
  toAccountId: number;
}
