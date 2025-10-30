import mongoose from "mongoose";
import ExpenseService from "../../Domain/Services/ExpenseService.js";
import UserService from "../../Domain/Services/UserService.js";
import ExpenseDto from "../Api/Dtos/ExpenseDto.js";

class ExpenseController {

    static async GetExpenses(request, response) {
        try {
            let { category, user_id, from, to } = request.query;

            const filter = {};

            if(request.user.role == "admin") {
                if(user_id) {
                    if (!mongoose.Types.ObjectId.isValid(user_id)) {
                        response.locals.message = "Invalid User id";
                        return response.status(400).json({ Status: "Error", Message: "Invalid User id" });
                    }

                    const user = await UserService.GetUserById(user_id);

                    if(!user) {
                        response.locals.message = `User with id '${user_id}' not found`;
                        return response.status(404).json({Status: "Error", Message: `User with id '${user_id}' not found`});
                    }

                    filter.user = new mongoose.Types.ObjectId(user_id);
                }
            }
            else {
                filter.user = new mongoose.Types.ObjectId(request.user._id);
            }

            if(category) {
                filter.category = category;
            }

            if(from) {
                filter.from = from;
            }

            if(to) {
                filter.to = to;
            }

            const options = { query: filter };

            const expenses = await ExpenseService.GetExpenses(options);

            if(expenses) {
                const expensesList = expenses.map(e => new ExpenseDto(e));
                return response.status(200).json({Status: "Success", Payload: expensesList });
            }
        }
        catch(error) {
            response.locals.message = error;
            return response.status(500).json({ Status: "Error", Message: `${error}`});
        }
    }

    static async GetExpenseById(request, response) {
        try {
            const eid = request.params.eid;

            if(!eid) {
                response.locals.message = "Expense id is required";
                return response.status(400).json({Status: "Error", Message: "Expense id is required"});
            }

            const expense = await ExpenseService.GetExpenseById(eid);

            if(!expense) {
                response.locals.message = `Expense with id '${eid}' not found`;
                return response.status(404).json({Status: "Error", Message: `Expense with id '${eid}' not found` });
            }

            const isOwner = expense.user.toString() == request.user._id;
            const isAdmin = request.user.role == "admin";

            if(!isOwner && !isAdmin) {
                response.locals.message = "Unauthorized to view this expense";
                response.status(403).json({Status: "Error", Message: "Unauthorized to view this expense"});
            }
           
            const e = new ExpenseDto(expense);
            return response.status(200).json({Status: "Success", Payload: e });
        }
        catch(error) {
            response.locals.message = error;
            return response.status(500).json({ Status: "Error", Message: `${error}`});
        }
    }

    static async CreateExpense(request, response) {
        try {
            const { uid, amount, category, description } = request.body;
           
            if(!amount || !category || !description) {
                response.locals.message = "Some expense parameter is null or empty";
                return response.status(400).json({Status: "Error", Message: "Some expense parameter is null or empty"});
            }

            if(amount < 0) {
                response.locals.message = "Amount must be a positive number";
                return response.status(400).json({Status: "Error", Message: "Amount must be a positive number"});
            }

            // User to whom the expense is assigned
            let uidToAssign = request.user._id;

            if(uid) {
                // Only "admin" users can assign expenses to others
                if(request.user.role != "admin" && uid != request.user._id) {
                    response.locals.message = "You cannot create expenses for another user";
                    return response.status(403).json({Status: "Error", Message: "You cannot create expenses for another user"});
                }

                uidToAssign = uid;
            }

            const user = await UserService.GetUserById(uidToAssign);

            if(!user) {
                response.locals.message = `User with id '${uidToAssign}' not found`;
                return response.status(404).json({Status: "Error", Message: `User with id '${uidToAssign}' not found`});
            }

            const expense = {
                amount,
                category,
                description,
                user: uidToAssign
            }

            const created = await ExpenseService.CreateExpense(expense);

            if(created) {
                const expenseDto = new ExpenseDto(created);
                return response.status(201).json({Status: "Success", Payload: expenseDto });
            }
            
        }
        catch(error) {
            response.locals.message = error;
            return response.status(500).json({ Status: "Error", Message: `${error}`});
        }
    }

    static async UpdateExpenseById(request, response) {
        try {
            const eid = request.params.eid;
            const { uid, amount, category, description } = request.body;

            if(!eid) {
                response.locals.message = "Expense id is required";
                return response.status(400).json({Status: "Error", Message: "Expense id is required"});
            }

            const expense = await ExpenseService.GetExpenseById(eid);

            if (!expense) {
                response.locals.message = `Expense with id '${eid}' not found`;
                return response.status(404).json({ Status: "Error", Message: `Expense with id '${eid}' not found` });
            }

            const isOwner = existingExpense.user.toString() == request.user._id;
            const isAdmin = request.user.role == "admin";

            if (!isOwner && !isAdmin) {
                response.locals.message = "Unauthorized to modify this expense";
                return response.status(403).json({ Status: "Error", Message: "Unauthorized to modify this expense" });
            }

            const updatedFields = {};

            if (amount) updatedFields.amount = amount;
            if (category) updatedFields.category = category;
            if (description) updatedFields.description = description;

            if (isAdmin && uid) {
                const user = await UserService.GetUserById(uid);

                if (!user) {
                    response.locals.message = `User with id '${uid}' not found`;
                    return response.status(404).json({ Status: "Error", Message: `User with id '${uid}' not found` });
                }

                updatedFields.user = uid;
            }

            const updated = await ExpenseService.UpdateExpenseById(eid, updatedFields);

            if(updated) {
                response.locals.message = "Expense updated successfully";
                return response.status(200).json({Status: "Success", Message: "Expense updated successfully"});
            }
            else {
                response.locals.message = `Expense with id '${eid}' not found`;
                return response.status(404).json({Status: "Error", Message: `Expense with id '${eid}' not found`});
            }
        }
        catch(error) {
            response.locals.message = error;
            return response.status(500).json({ Status: "Error", Message: `${error}`});
        }
    }

    static async DeleteExpenseById(request, response) {
        try {
            const eid = request.params.eid;
            const { uid } = request.body || {};

            if(!eid) {
                response.locals.message = "Expense id is required";
                return response.status(400).json({Status: "Error", Message: "Expense id is required"});
            }

            const expense = await ExpenseService.GetExpenseById(eid);

            if (!expense) {
                return response.status(404).json({ Status: "Error", Message: `Expense with id '${eid}' not found` });
            }

            const isOwner = expense.user.toString() == request.user._id;
            const isAdmin = request.user.role == "admin";

            if (!isOwner && !isAdmin) {
                return response.status(403).json({ Status: "Error", Message: "Unauthorized to delete this expense" });
            }

            if (isAdmin && uid && uid !== expense.user.toString()) {
                return response.status(403).json({ Status: "Error", Message: "Admins can only delete the specified expense owner" });
            }

            const deleted = await ExpenseService.DeleteExpenseById(eid);

            if(deleted) {
                response.locals.message = "Expense deleted successfully";
                return response.status(200).json({Status: "Success", Message: "Expense deleted successfully" });
            }
            else {
                response.locals.message = `Expense with id '${eid}' not found`;
                return response.status(404).json({Status: "Error", Message: `Expense with id '${eid}' not found` });
            }
        }
        catch(error) {
            response.locals.message = error;
            return response.status(500).json({ Status: "Error", Message: `${error}`});
        }
    }

}

export default ExpenseController;