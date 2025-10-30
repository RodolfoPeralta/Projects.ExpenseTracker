import UserService from "../../Domain/Services/UserService.js";
import JwtUtils from "../../Domain/Utils/JwtUtils.js";
import UserDto from "../Api/Dtos/UserDto.js";

class SessionController {

    static async RegisterUser(request, response) {
        try {
            const { first_name, last_name, email, password } = request.body;

            if(!first_name || !last_name) {
                response.locals.message = "Complete name is required";
                return response.status(400).json({Status: "Error", Message: "Complete name is required"});
            }

            if(!email) {
                response.locals.message = "Email is required";
                return response.status(400).json({Status: "Error", Message: "Email is required"});
            }

            if(!password) {
                response.locals.message = "Password is required";
                return response.status(400).json({Status: "Error", Message: "Password is required"});
            }

            const oldUser = await UserService.GetUserByEmail(email);

            if(oldUser) {
                response.locals.message = `User with email '${email}' is already exists`;
                return response.status(400).json({ Status: "Error", Message: `User with email '${email}' is already exists`});
            }

            const user = {
                first_name,
                last_name,
                email,
                password
            }

            const newUser = await UserService.CreateUser(user); 

            if(newUser) {
                const token = JwtUtils.GenerateToken(newUser);
                const userDto = new UserDto(newUser);
                return response.status(201).json({ Status: "Success", Token: token, Payload: userDto });
            }
        }
        catch(error) {
            response.locals.message = error;
            return response.status(500).json({ Status: "Error", Message: `${error}`});
        }
    }

    static async LoginUser(request, response) {
        try {
            const { email, password } = request.body;

            if(!email) {
                response.locals.message = "Email is required";
                return response.status(400).json({Status: "Error", Message: "Email is required"});
            }

            if(!password) {
                response.locals.message = "Password is required";
                return response.status(400).json({Status: "Error", Message: "Password is required"});
            }

            const user = await UserService.GetUserByEmail(email);

            if(!user) {
                response.locals.message = `User with email '${email}' not found`;
                return response.status(404).json({Status: "Error", Message: `User with email '${email}' not found`});
            }
            
            const isValidPassword = await UserService.ValidateUserPassword(password, user.password);

            if(!isValidPassword) {
                response.locals.message = "Wrong password";
                return response.status(400).json({Status: "Error", Message: "Wrong password"});
            }

            const token = JwtUtils.GenerateToken(user);
            const userDto = new UserDto(user);

            return response.status(200).json({ Status: "Success", Token: token, Payload: userDto });
        }
        catch(error) {
            response.locals.message = error;
            return response.status(500).json({ Status: "Error", Message: `${error}`});
        }
    }
}

export default SessionController;