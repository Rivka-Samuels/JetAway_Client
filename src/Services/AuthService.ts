import axios from "axios";
import appConfig from "../Utils/Config";
import { store } from "../Redux/store";
import { login, logout, register } from "../Redux/authSlice";
import CredentialsModel from "../Models/CredentialsModel";
import UserModel from "../Models/UserModel";
// import { jwtDecode } from "jwt-decode";

class AuthService {


    public async register(user: UserModel): Promise<void> {
        try {
            const response = await axios.post<string>(appConfig.registerUrl, user);
            const token = response.data;
            localStorage.setItem("token", token);
            store.dispatch(register(token));
        } catch (error: any) {
            // Make sure the error includes a response from the server
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error("Registration failed:", error.response.data);
                    throw new Error(error.response.data); // זרוק את הודעת השגיאה מהשרת
                } else {
                    console.error("No response received:", error.message);
                    throw new Error("Registration failed. Please try again later.");
                }
            } else {
                console.error("An unexpected error occurred:", error);
                throw new Error("Registration failed. Please try again later.");
            }
        }
    }



    public async login(credentials: CredentialsModel): Promise<void> {
        try {
            const response = await axios.post<string>(appConfig.loginUrl, credentials);
            const token = response.data;
    
            // Save the token in localStorage
            localStorage.setItem("token", token);
            
            // Update the state in the Redux store
            store.dispatch(login(token));
            
            // You can decode the token if needed
            // const decodedToken = jwtDecode(token) as { userWithoutPassword: UserModel };
            
        } catch (error: any) {
            // Check if the error is an Axios error
            if (axios.isAxiosError(error) && error.response) {
                // Extract the error message from the response
                const errorMessage = error.response.data || "Login failed. Please try again.";
                console.error("Login failed:", errorMessage);
                throw new Error(errorMessage); // Throw the server error message
            } else {
                console.error("An unexpected error occurred:", error);
                throw new Error("Login failed. Please try again later.");
            }
        }
    }
    

    public logout(): void {
        localStorage.removeItem("token");
        store.dispatch(logout());
    }

    // Check if user is authenticated
    public isAuthenticated(): boolean {
        const token = localStorage.getItem("token");
        // You can add additional checks here to verify the token if needed
        return !!token; // Return true if token exists, false otherwise
    }
}

const authService = new AuthService();
export default authService;
