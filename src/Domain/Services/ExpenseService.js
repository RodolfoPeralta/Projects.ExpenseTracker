import ExpenseRepository from "../../Infraestructure/Repositories/ExpenseRepository.js";
import BudgetService from "./BudgetService.js";

class ExpenseService {

    static async GetExpenses(options = {}) {
        try {
            return await ExpenseRepository.GetExpenses(options);
        }
        catch(error) {
            throw(`[ExpenseService] ${error}`);
        }
    }

    static async GetExpenseById(id) {
        try {
            return await ExpenseRepository.GetExpenseById(id);
        }
        catch(error) {
            throw(`[ExpenseService] ${error}`);
        }
    }

    static async CreateExpense(expense) {
        try {
            const created = await ExpenseRepository.CreateExpense(expense);

            if(created) {
                await BudgetService.CheckBudget(expense.user);
                return created;
            }
        }
        catch(error) {
            throw(`[ExpenseService] ${error}`);
        }
    }

    static async UpdateExpenseById(id, expense) {
        try {

            expense.date = Date.now();

            const updated = await ExpenseRepository.UpdateExpenseById(id, expense);

            if(updated) {
                BudgetService.CheckBudget(expense.user);
                return updated;
            }
        }
        catch(error) {
            throw(`[ExpenseService] ${error}`);
        }
    }

    static async DeleteExpenseById(id) {
        try {
            return await ExpenseRepository.DeleteExpenseById(id);
        }
        catch(error) {
            throw(`[ExpenseService] ${error}`);
        }
    }
}

export default ExpenseService;