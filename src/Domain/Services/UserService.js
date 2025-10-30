import UserRepository from "../../Infraestructure/Repositories/UserRepository.js";
import Budget from "../Models/Budget.js";
import BcryptUtils from "../Utils/BcryptUtils.js";
import BudgetService from "./BudgetService.js";

class UserService {

    static async GetUsers() {
        try {
            return await UserRepository.GetUsers();
        }
        catch(error) {
            throw(`[UserService] ${error}`);
        }
    }

    static async GetUserById(id) {
        try {
            return await UserRepository.GetUserById(id);
        }
        catch(error) {
            throw(`[UserService] ${error}`);
        }
    }

    static async GetUserByEmail(email) {
        try {
            return await UserRepository.GetUserByEmail(email);
        }
        catch(error) {
            throw(`[UserService] ${error}`);
        }
    }

    static async CreateUser(user) {
        try {

            user = {
                ...user,
                budget: new Budget(user.budget),
                password: BcryptUtils.CreateHash(user.password)
            }

            return await UserRepository.CreateUser(user);
        }
        catch(error) {
            throw(`[UserService] ${error}`);
        }
    }

    static async ValidateUserPassword(password, hash) {
        try {
            return BcryptUtils.ComparePassword(password, hash);
        }
        catch(error) {
            throw(`[UserService] ${error}`);
        }
    }

    static async UpdateUserById(id, user, skipBudgetCheck = false) {
        try {
            let updated = {
                ...user
            }

            if (user.password) {
                updated.password = BcryptUtils.CreateHash(user.password);
            }
            
            const result = await UserRepository.UpdateUserById(id, updated);

            if(result && !skipBudgetCheck) {
                await BudgetService.CheckBudget(result._id);
            }

            return result;
        }
        catch(error) {
            throw(`[UserService] ${error}`);
        }
    }

    static async DeleteUserById(id) {
        try {
            return await UserRepository.DeleteUserById(id);
        }
        catch(error) {
            throw(`[UserService] ${error}`);
        }
    }
}

export default UserService;