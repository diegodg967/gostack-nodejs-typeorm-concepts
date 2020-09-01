import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  try {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactions = await transactionsRepository.find();
    const balance = await transactionsRepository.getBalance();

    return response.json({
      transactions: transactions,
      balance: balance
    });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  
  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    categoryTitle: category
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();
  const transaction = await deleteTransaction.execute(id);

  return response.status(204).json({});
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const importTransactions = new ImportTransactionsService();

  const transactions = await importTransactions.execute(request.file.path);

  return response.json(transactions);
});

export default transactionsRouter;
