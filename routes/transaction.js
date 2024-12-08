const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Create a new transaction
router.post('/', async (req, res) => {
    const { userId, type, amount, remark } = req.body;
    const transaction = new Transaction({ userId, type, amount, remark });
    try {
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all transactions for a user
router.get('/:userId', async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.params.userId });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete all transactions for a user
router.delete('/:userId', async (req, res) => {
    try {
        await Transaction.deleteMany({ userId: req.params.userId });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;