import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);
    const checkTransactionExists = await transactionsRepository.findOne({
      where: { id },
    });

    if (checkTransactionExists) {
      await transactionsRepository.delete(id);
      return;
    } else {
      throw new AppError('Transaction doens\'t exists.', 400);
    }  
  }
}

export default DeleteTransactionService;
