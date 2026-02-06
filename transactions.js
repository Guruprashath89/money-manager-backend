import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();
console.log("📦 transactions route file loaded");


// POST /transactions
router.post("/", async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ GET all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE /transactions/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Transaction.findByIdAndDelete(id);

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// UPDATE /transactions/:id (12-hour rule)
router.put("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // ⏱️ 12-hour rule
    const now = new Date();
    const createdAt = new Date(transaction.createdAt);
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);

    if (hoursDiff > 12) {
      return res.status(403).json({
        message: "Editing allowed only within 12 hours"
      });
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




export default router;
