import express from 'express';
import SessionController from '../../Controllers/SessionController.js';

const router = express.Router();

router.post("/login", async (request, response) => await SessionController.LoginUser(request, response));
router.post("/register", async (request, response) => await SessionController.RegisterUser(request, response));

export default router;