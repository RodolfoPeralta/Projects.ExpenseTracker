import mongoose from "mongoose";
import ExpenseService from "./ExpenseService.js";
import UserService from "./UserService.js";

class BudgetService {

    static async CheckBudget(uid) {
        try {
            // Obtains expenses by user id
            const expenses = await ExpenseService.GetExpenses({ query: { user: new mongoose.Types.ObjectId(uid) } });

            // Retrieves user 
            const user = await UserService.GetUserById(uid);

            if(!user) {
                throw new Error(`[BudgetService] User with id '${uid}' not found`);
            }

            // Obtains only the expenses in the budget month
            const newExpenses = expenses.filter(e => {
                                const expenseMonth = new Date(e.date).getMonth() + 1;
                                return expenseMonth == user.budget.month;
                                });

            // Calculates total expenses
            const total = newExpenses.reduce((acc, e) => acc + e.amount, 0);

            user.budget.status = "normal";
            
            if(total > user.budget.amount) {
                user.budget.status = "exceeded";
            }

            if(total == user.budget.amount) {
                user.budget.status = "warning";
            }

            await UserService.UpdateUserById(uid, user, true);
        }
        catch(error) {
            throw(`[BudgetService] ${error}`);
        }
    }

}

export default BudgetService;