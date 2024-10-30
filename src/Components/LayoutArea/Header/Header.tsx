import { NavLink } from "react-router-dom";
import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import "./Header.css";

function Header(): JSX.Element {
    return (
        <div className="Header">
            <nav>
                <NavLink to="/home" className={({ isActive }) => isActive ? "active" : undefined}>
                    <img src="https://rivkabucket.s3.amazonaws.com/JetAway/JetAwayLogoH.png" alt="JetAway Logo" className="logo" />
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? "active" : undefined}>About</NavLink>
                <NavLink to="/vacations" className={({ isActive }) => isActive ? "active" : undefined}>Vacations</NavLink>
                <NavLink to="/contact-us" className={({ isActive }) => isActive ? "active" : undefined}>Contact Us</NavLink>
            </nav>
            <div className="auth-menu">
                <AuthMenu />
            </div>
        </div>
    );
}

export default Header;
