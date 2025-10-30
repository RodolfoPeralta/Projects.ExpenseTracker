class UserDto {

    constructor(user) {
        this.id = user._id,
        this.name = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.role = user.role;
        this.budget = user.budget;
    }
}

export default UserDto;