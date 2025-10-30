import mongoose from 'mongoose';
import Expense from './Expense.js';

const userCollectionName = "User";

const userSchema = new mongoose.Schema({
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, require: true, default: "user" },
    budget: {
        amount: { type: Number, require: true, default: null },
        status: { type: String, default: "unknown" },
        month: { type: String, default: null }
    }
});

// Middleware para eliminar "expenses" asociadas
userSchema.pre("findOneAndDelete", async function (next) {
    const user = await this.model.findOne(this.getQuery());
    if (user) {
        await Expense.deleteMany({ user: user._id });
    }
    next();
});

const User = mongoose.model(userCollectionName, userSchema);

export default User;