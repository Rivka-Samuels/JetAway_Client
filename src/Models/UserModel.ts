class UserModel {
    public id: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public role: "Admin" | "User";

    constructor(
        id: number,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        role: "Admin" | "User"
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}

export default UserModel;
