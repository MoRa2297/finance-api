export interface ICreateTransfer {
  amount: number;
  date: Date;
  description: string;
  note: string;
  userId: number;
  fromAccountId: number;
  toAccountId: number;
}
