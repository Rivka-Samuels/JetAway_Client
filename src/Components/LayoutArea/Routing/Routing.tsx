import { Navigate, Route, Routes } from "react-router-dom";
import "./Routing.css";
import Vacations from "../../VacationsArea/Vacations/Vacations";
import AddVacation from "../../VacationsArea/AddVacation/AddVacation";
import EditVacation from "../../VacationsArea/EditVacation/EditVacation";
import PageNotFound from "../PageNotFound/PageNotFound";
import Home from "../../Home/Home";
import Register from "../../AuthArea/Register/Register";
import Login from "../../AuthArea/Login/Login";
import About from "../About/About";
import ContactUs from "../ContactUs/ContactUs";
import VacationsReport from "../../VacationsArea/ReportPage/VacationsReport";
import ProtectedRoute from "../../../Components/LayoutArea/Routing/ProtectedRoute"; 

function Routing(): JSX.Element {
    return (
        <div className="Routing">
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />

                {/* Vacations */}
                <Route path="/vacations" element={<Vacations />} />
                
                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute isAdminRequired={true} />}>
                    <Route path="/vacations/add" element={<AddVacation />} />
                    <Route path="/vacations/edit/:vacationID" element={<EditVacation />} />
                    <Route path="/vacations/report" element={<VacationsReport />} />
                </Route>

                {/* Auth */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* ContactUs */}
                <Route path="/contact-us" element={<ContactUs />} />

                <Route path="/about" element={<About />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    );
}

export default Routing;
