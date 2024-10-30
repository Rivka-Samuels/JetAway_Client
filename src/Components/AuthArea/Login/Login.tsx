import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import CredentialsModel from "../../../Models/CredentialsModel";
import "./Login.css";

function Login(): JSX.Element {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<CredentialsModel>();
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

    const save = async (credentials: CredentialsModel) => {
        try {
            await authService.login(credentials);
            notifyService.success("Welcome Back!");
            navigate("/home");
        } catch (error: any) {
            const errorMessage = error.message || "Login failed. Please try again.";
            notifyService.error(errorMessage);
        }
    }

    return (
        <div className="Login">
            <form className="box" onSubmit={handleSubmit(save)}>
                <h2>Login</h2>

                <div className="form-control">
                    <label>Email:</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Please enter a valid email address"
                            }
                        })}
                        autoComplete="username"
                    />
                    {errors.email && <p className="error">{errors.email.message}</p>}
                </div>

                <div className="form-control">
                    <label>Password:</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"} // Changes the field type between text and password
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 4,
                                    message: "Password must be at least 4 characters long"
                                }
                            })}
                            autoComplete="current-password"
                        />
                        {/* the eye button that allows you to show or hide the password */}
                        <span
                            onClick={togglePasswordVisibility}
                            className={`toggle-password ${!passwordValue ? "disabled" : ""}`} // adds the disabled class if there is no password
                        >
                            <i
                                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                style={{ fontSize: "24px", color: passwordValue ? "#0033cc" : "gray" }} // Changes color depending on availability
                            ></i>
                        </span>
                    </div>
                    {errors.password && <p className="error">{errors.password.message}</p>}
                </div>

                <button>Login</button>
                <div>Don't have an account?
                    <Link to={`/register`}> Register now</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;
