const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// Buscar todas as transações
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Buscar uma transação por id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await Transaction.findById(id);

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Criar uma transação
router.post("/", async (req, res) => {
  try {
    const { description, amount, type } = req.body;
    const newTransaction = new Transaction({ description, amount, type });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Deletar uma transação por id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: "Transação deletada com sucesso!" });
  } catch (error) {
    res.status(500).send(message.error);
  }
});

module.exports = router;
