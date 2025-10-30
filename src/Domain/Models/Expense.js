import mongoose from "mongoose";

const expenseCollectionName = "Expense";

const expenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, require: true },
    category: { type: String },
    description: { type: String },
    date: { type: Date, default: Date.now }
});

const Expense = mongoose.model(expenseCollectionName, expenseSchema);

export default Expense;