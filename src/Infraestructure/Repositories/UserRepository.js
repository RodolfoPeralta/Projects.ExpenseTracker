import User from "../../Domain/Models/User.js";
import MongoDbService from "../Services/MongoDbService.js";

class UserRepository {

    static async GetUsers() {
        try {
            return await MongoDbService.GetItems(User);
        }
        catch(error) {
            throw(error);
        }
    }

    static async GetUserById(id) {
        try {
            return await MongoDbService.GetItemById(User, id);
        }
        catch(error) {
            throw(`[UserRepository] ${error}`);
        }
    }

    static async GetUserByEmail(email) {
        try {
            const options = {
                query: {email: email}
            }

            const results = await MongoDbService.Aggregate(User, options);

            return results[0] || null;
            
        }
        catch(error) {
            throw(`[UserRepository] ${error}`);
        }
    }

    static async CreateUser(user) {
        try {
            return await MongoDbService.CreateItem(User, user);
        }
        catch(error) {
            throw(`[UserRepository] ${error}`);
        }
    }

    static async UpdateUserById(id, user) {
        try {
            return await MongoDbService.UpdateItemById(User, id, user);
        }
        catch(error) {
            throw(`[UserRepository] ${error}`);
        }
    }

    static async DeleteUserById(id) {
        try {
            return await MongoDbService.DeleteItemById(User, id);
        }
        catch(error) {
            throw(`[UserRepository] ${error}`);
        }
    }
}

export default UserRepository;