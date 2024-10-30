import { useForm } from "react-hook-form";
import { useState } from "react";
import "./Register.css";
import authService from "../../../Services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import notifyService from "../../../Services/NotifyService";
import UserModel from "../../../Models/UserModel";

function Register(): JSX.Element {

    const { register, handleSubmit, formState: { errors }, watch } = useForm<UserModel>();
    const navigate = useNavigate();

// Manage password status (visible or hidden)
    const [showPassword, setShowPassword] = useState(false);

// watching the value of the password field
    const passwordValue = watch("password");

    const togglePasswordVisibility = () => {
        if (passwordValue) {
            setShowPassword(!showPassword);
        }
    };

    const save = async (user: UserModel) => {
        try {
            await authService.register(user);
            notifyService.success("Welcome!");
            navigate("/vacations");
        } catch (error: any) {
            notifyService.error(error.message || "Registration failed.");
        }
    }

    return (
        <div className="Register">
            <form className="box" onSubmit={handleSubmit(save)}>
                <h2>Register</h2>

                <div className="form-control">
                    <label>First Name:</label>
                    <input 
                        type="text" 
                        {...register("firstName", { required: "First name is required" })} 
                        autoComplete="given-name" 
                    />
                    {errors.firstName && <span className="error">{errors.firstName.message}</span>}
                </div>

                <div className="form-control">
                    <label>Last Name:</label>
                    <input 
                        type="text" 
                        {...register("lastName", { required: "Last name is required" })} 
                        autoComplete="family-name" 
                    />
                    {errors.lastName && <span className="error">{errors.lastName.message}</span>}
                </div>

                <div className="form-control">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        {...register("email", { 
                            required: "Email is required", 
                            pattern: { 
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                                message: "Email is not valid" 
                            } 
                        })} 
                        autoComplete="email" 
                    />
                    {errors.email && <span className="error">{errors.email.message}</span>}
                </div>

                <div className="form-control">
                    <label>Password:</label>
                    <div className="password-wrapper">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            {...register("password", { 
                                required: "Password is required", 
                                minLength: { 
                                    value: 4, 
                                    message: "Password must be at least 4 characters long" 
                                } 
                            })} 
                            autoComplete="new-password" 
                        />
                        {/*Eye icon to display the password*/}
                        <span 
                            onClick={togglePasswordVisibility} 
                            className={`toggle-password ${!passwordValue ? "disabled" : ""}`} // Adds the disabled class if there is no password
                        >
                            <i 
                                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} 
                                style={{ fontSize: "24px", color: passwordValue ? "#0033cc" : "gray" }} // Change color depending on availability
                            ></i>
                        </span>
                    </div>
                    {errors.password && <span className="error">{errors.password.message}</span>}
                </div>

                <button type="submit">Register</button>
                <div>Already a member?
                    <Link to={`/login`}> Login</Link>
                </div>
            </form>
        </div>
    );
}

export default Register;
