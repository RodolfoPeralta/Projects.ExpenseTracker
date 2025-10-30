import UserService from "../../Domain/Services/UserService.js";
import UserDto from "../Api/Dtos/UserDto.js";

class UserController {

    static async GetUsers(request, response) {
        try {
            const users = await UserService.GetUsers();

            if(users) {
                const userList = users.map(u => new UserDto(u)); 
                return response.status(200).json({ Status: "Success", Payload: userList });
            }
        }
        catch(error) {
            response.locals.message = error;
            return response.status(500).json({ Status: "Error", Message: `${error}`});
        }
    }

    static async GetUserById(request, response) {
        try {
            const uid = request.params.uid;

            if(!uid) {
                response.locals.message = "User id is required";
                return response.status(400).json({ Status: "Error", Message: "User id is required"});
            }

            const user = await UserService.GetUserById(uid);

            if(user) {
                const userDto = new UserDto(user);
                return response.status(200).json({Status: "Success", Payload: userDto });
            }
            else {
                response.locals.message = `User with id '${uid}' not found`;
                return response.status(404).json({Status: "Error", Message: `User with id '${uid}' not found`});
            }
        }
        catch(error) {
            response.locals.message = error;
            return response.status(500).json({ Status: "Error", Message: `${error}`});
        }
    }

    static async UpdateUserById(request, response) {
        try {
            const uid = request.params.uid;
            const { first_name, last_name, email, password, budget } = request.body;

            if(!uid) {
                response.locals.message = "User id is required";
                return response.status(400).json({Status: "Error", Message: "User id is required"});
            }

            const user = await UserService.GetUserById(uid);

            if(!user) {
                response.locals.message = `User with id '${uid}' not found`;
                return response.status(404).json({Status: "Error", Message: `User with id '${uid}' not found`});
            }

            if(password) {
                const isSamePassword = await UserService.ValidateUserPassword(password, user.password);

                if(isSamePassword) {
                    response.locals.message = "Password must be different from the current one";
                    return response.status(400).json({Status: "Error", Message: "Password must be different from the current one"});
                }
            }

            if(budget.amount < 0) {
                response.locals.message = "Budget amount must be a positive number";
                return response.status(400).json({Status: "Error", Message: "Budget amount must be a positive number"});
            }

            const updated = {};

            if (first_name) updated.first_name = first_name;
            if (last_name) updated.last_name = last_name;
            if (email) updated.email = email;
            if (password) updated.password = password;
            if (budget) updated.budget = { ...user.budget, ...budget };

            const updatedUser = await UserService.UpdateUserById(uid, updated);

            if(updatedUser) {
                response.locals.message = "User updated successfully";
                return response.status(200).json({Status: "Success", Message: "User updated successfully"});
            }
            else {
                response.locals.message = `User with id '${uid}' not found`;
                return response.status(404).json({Status: "Error", Message: `User with id '${uid}' not found`});
            }
        }
        catch(error) {
            response.locals.message = error;
            return response.status(500).json({ Status: "Error", Message: `${error}`});
        }
    }

    static async DeleteUserById(request, response) {
        try {
            const uid = request.params.uid;

            if(!uid) {
                response.locals.message = "User id is required";
                return response.status(400).json({Status: "Error", Message: "User id is required"});
            }

            const deleted = await UserService.DeleteUserById(uid);

            if(deleted) {
                response.locals.message = "User deleted successfully";
                return response.status(200).json({Status: "Success", Message: "User deleted successfully"});
            }
            else {
                response.locals.message = `User with id '${uid}' not found`;
                return response.status(404).json({Status: "Error", Message: `User with id '${uid}' not found`});
            }
        }
        catch(error) {
            response.locals.message = error;
            return response.status(500).json({ Status: "Error", Message: `${error}`});
        }
    }

}

export default UserController;