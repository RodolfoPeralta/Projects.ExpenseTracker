class AuthenticationService {

    static async AuthenticateByRole(role) {
        return async(request, response, next) => {
            if(!request.user) {
                return response.status(401).json({Status: "Error", Message: "Unauthorized"});
            }

            if(request.user.role != role) {
                return response.status(403).json({Status: "Error", Message: "No Permissions"});
            }

            next();
        }
    }

}

export default AuthenticationService;