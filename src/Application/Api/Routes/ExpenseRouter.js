import express from 'express';
import ExpenseController from '../../Controllers/ExpenseController.js';
import JwtUtils from '../../../Domain/Utils/JwtUtils.js';

const router = express.Router();

router.use(JwtUtils.AuthorizeToken);

router.get("/", async (request, response) => await ExpenseController.GetExpenses(request, response));
router.get("/:eid", async (request, response) => await ExpenseController.GetExpenseById(request, response));
router.post("/", async (request, response) => await ExpenseController.CreateExpense(request, response));
router.put("/:eid", async (request, response) => await ExpenseController.UpdateExpenseById(request, response));
router.delete("/:eid", async (request, response) => await ExpenseController.DeleteExpenseById(request, response));

export default router;