import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const incomeArray: number[] = [];
    const outcomeArray: number[] = [];

    transactions.map(transaction => {
      // @ts-ignore
      if (transaction.type === 'income') {incomeArray.push(parseInt(transaction.value));}
      // @ts-ignore
      if (transaction.type === 'outcome') outcomeArray.push(parseInt(transaction.value));
    });

    const income = incomeArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
    const outcome = outcomeArray.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);

    const balance = {
      "income": income,
      "outcome": outcome,
      "total": income - outcome
    }

    return balance;
  }
}

export default TransactionsRepository;
