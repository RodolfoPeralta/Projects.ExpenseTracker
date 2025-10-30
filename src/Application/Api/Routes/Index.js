import express from 'express';
import userRouter from './UserRouter.js';
import expenseRouter from './ExpenseRouter.js';
import sessionRouter from './SessionRouter.js';

const router = express.Router();

router.use("/users", userRouter);
router.use("/expenses", expenseRouter);
router.use("/sessions", sessionRouter);

export default router;