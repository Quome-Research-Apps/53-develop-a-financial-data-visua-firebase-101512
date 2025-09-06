export interface Transaction {
  date: Date;
  description: string;
  category: string;
  amount: number;
  [key: string]: any;
}
