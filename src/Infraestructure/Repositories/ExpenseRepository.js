import Expense from "../../Domain/Models/Expense.js";
import MongoDbService from "../Services/MongoDbService.js";

class ExpenseRepository {

    static async GetExpenses(options = {}) {
        try {
            return await MongoDbService.Aggregate(Expense, options);
        }
        catch(error) {
            throw(`[ExpenseRepository] ${error}`);
        }
    }

    static async GetExpenseById(id) {
        try {
            return await MongoDbService.GetItemById(Expense, id);
        }
        catch(error) {
            throw(`[ExpenseRepository] ${error}`);
        }
    }

    static async CreateExpense(expense) {
        try {
            return await MongoDbService.CreateItem(Expense, expense);
        }
        catch(error) {
            throw(`[ExpenseRepository] ${error}`);
        }
    }

    static async UpdateExpenseById(id, expense) {
        try {
            return await MongoDbService.UpdateItemById(Expense, id, expense);
        }
        catch(error) {
            throw(`[ExpenseRepository] ${error}`);
        }
    }

    static async DeleteExpenseById(id) {
        try {
            return await MongoDbService.DeleteItemById(Expense, id);
        }
        catch(error) {
            throw(`[ExpenseRepository] ${error}`);
        }
    }
}

export default ExpenseRepository;