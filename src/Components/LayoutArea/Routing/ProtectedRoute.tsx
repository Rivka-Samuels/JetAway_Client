import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";

interface ProtectedRouteProps {
    isAdminRequired: boolean;
}

function ProtectedRoute({ isAdminRequired }: ProtectedRouteProps) {
    const token = useSelector((state: RootState) => state.auth.token);
    const user = useSelector((state: RootState) => state.auth.userWithoutPassword);

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (isAdminRequired && (!user || user.role !== "Admin")) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
