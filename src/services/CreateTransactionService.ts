import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({ title, type, value, categoryTitle }: Request): Promise<Transaction> {
    const transactionsRepository = getRepository(Transaction);
    const transactionsCustomRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const balance = await transactionsCustomRepository.getBalance();
    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Your balance is smaller than outcome.', 400);
    }    

    const checkCategoryExists = await categoriesRepository.findOne({
      where: { title: categoryTitle },
    });    

    const category = await categoriesRepository.create({
      title: categoryTitle
    });

    let category_id;
    if (checkCategoryExists) {
      category_id = checkCategoryExists.id;
    } else {
      const savedCategory = await categoriesRepository.save(category);    
      category_id = savedCategory.id;
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
