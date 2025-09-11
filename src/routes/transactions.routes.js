const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

// middleware para proteção de rotas
router.use(authMiddleware);

// Buscar todas as transações
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).sort({
      date: -1,
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Deletar uma transação por id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deleted)
      return res.status(404).json({ error: "Transação não encontrada." });

    res.status(200).json({ message: "Transação deletada com sucesso." });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Criar uma transação
// Adicionar data/título para as transações
router.post("/", async (req, res) => {
  try {
    const { title, description, amount, transactionDate, type } = req.body;
    const newTransaction = new Transaction({
      title,
      description,
      amount,
      transactionDate,
      type,
      user: req.userId,
    });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/balance", async (req, res) => {
  try {
    const userTransactions = await Transaction.find({ user: req.userId });

    const balance = userTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") acc.income += transaction.amount;
        else if (transaction.type === "expense") acc.expense += transaction.amount;

        acc.total = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, total: 0 }
    );

    res.status(200).json(balance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
