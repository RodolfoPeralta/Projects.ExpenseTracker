import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config();

const PRIVATE_JWT_KEY = process.env.PRIVATE_JWT_KEY;

class JwtUtils {

    // Public Methods

    static GenerateToken(user) {
        try {
            const token = jwt.sign({user}, PRIVATE_JWT_KEY, { expiresIn: "1h" });

            return token;
        }
        catch(error) {
            throw("[JwtUtils] Error when trying to generate a new token");
        }
    }

    static AuthorizeToken(request, response, next) {
        
        const header = request.headers.authorization;

        if(!header) {
            response.locals.message = "Not Authenticated";
            return response.status(401).json({Status:"Error", Message: "Not Authenticated"});
        }

        const token = header.split(" ")[1];

        try {
            const decoded = jwt.verify(token, PRIVATE_JWT_KEY);

            request.user = decoded.user;

            next();
        }
        catch(error) {
            response.locals.message = "Invalid token";
            return response.status(401).json({Status:"Error", Message: "Invalid token"});
        }
    }
}

export default JwtUtils;