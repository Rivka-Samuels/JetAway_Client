import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { logout } from "../../../Redux/authSlice";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import './AuthMenu.css';

function AuthMenu(): JSX.Element {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Added useNavigate
    const userWithoutPassword = useSelector((state: RootState) => state.auth.userWithoutPassword);

    const logoutUser = async () => {
        try {
            await authService.logout();
            notifyService.success("We will miss you...");
            dispatch(logout());
            navigate('/'); // Move the user home
        } catch (error) {
            notifyService.error("Logout failed. Please try again.");
        }
    }

    return (
        <div className="AuthMenu">
            {
                !userWithoutPassword ? (
                    <>
                        <span>Hello Guest </span> 
                        <NavLink to="/login">Login</NavLink> 
                        <NavLink to="/register">Register</NavLink>
                    </>
                ) : (
                    <>
                        <span>Hello {userWithoutPassword.firstName} {userWithoutPassword.lastName} </span> 
                        <span onClick={logoutUser} className="link">Logout</span>
                    </>
                )
            }
        </div>
    );
}

export default AuthMenu;
