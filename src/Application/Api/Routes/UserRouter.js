import express from 'express';
import UserController from '../../Controllers/UserController.js';
import JwtUtils from '../../../Domain/Utils/JwtUtils.js';
import AuthenticationService from '../../Services/AuthenticationService.js';

const router = express.Router();

router.use(JwtUtils.AuthorizeToken);
router.use(await AuthenticationService.AuthenticateByRole("admin"));

router.get("/", async (request, response) => await UserController.GetUsers(request, response));
router.get("/:uid", async (request, response) => await UserController.GetUserById(request, response));
router.post("/", async (request, response) => await UserController.CreateUser(request, response));
router.put("/:uid", async (request, response) => await UserController.UpdateUserById(request, response));
router.delete("/:uid", async (request, response) => await UserController.DeleteUserById(request, response));

export default router;