import { Link, Navigate } from "react-router-dom";
import vacationsService from "../../../Services/VacationsService";
import VacationsCardAdmin from "../VacationsCardAdmin/VacationsCardAdmin";
import VacationsCardUser from "../VacationCardUser/VacationsCardUser";
import "./Vacations.css";
import { useEffect, useState, useCallback } from "react";
import Loader from "../../ToolsArea/Loader/Loader";
import notifyService from "../../../Services/NotifyService";
import { VacationModel } from "../../../Models/VacationModel";
import { isAuthenticated, getUserRole, getUserId } from "../../../Utils/authUtils";
import followService from "../../../Services/FollowService";

const Vacations = (): JSX.Element => {
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [filteredVacations, setFilteredVacations] = useState<VacationModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [likedVacationIds, setLikedVacationIds] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const vacationsPerPage = 9;
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const isAuthenticatedUser = isAuthenticated();
    const userRole = isAuthenticatedUser ? getUserRole() : null;

    useEffect(() => {
        if (!isAuthenticatedUser) return;

        const loadVacations = async () => {
            await fetchVacations();
            await fetchLikedVacations();
        };

        loadVacations();
    }, [isAuthenticatedUser, activeFilter]);

    const fetchVacations = async () => {
        setLoading(true);
        try {
            const response = await vacationsService.getPaginatedVacations(0, undefined);
            setVacations(response.vacations);
            setTotalPages(response.totalPages);
        } catch (error) {
            notifyService.error("Failed to load vacations.");
            console.error("Error fetching vacations:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLikedVacations = async () => {
        const userId = getUserId();
        if (!userId) return;

        try {
            const likedVacations = await followService.getLikedVacations(userId);
            setLikedVacationIds(likedVacations.map((vacation: any) => vacation.id));
        } catch (error) {
            console.error("Failed to fetch liked vacations:", error);
        }
    };

    const filterVacations = (vacations: VacationModel[], likedIds: number[], filter: string | null) => {
        const currentDate = new Date();
        const endOfToday = new Date(currentDate);
        endOfToday.setHours(23, 59, 59, 999);

        if (filter === "following") {
            return vacations.filter(vacation => likedIds.includes(vacation.id));
        } else if (filter === "upcoming") {
            return vacations.filter(vacation => new Date(vacation.startDate) > endOfToday);
        } else if (filter === "active") {
            return vacations.filter(vacation => {
                const startDate = new Date(vacation.startDate);
                const endDate = new Date(vacation.endDate);
                return startDate <= endOfToday && endDate >= currentDate;
            });
        }
        return vacations; // If there is no filter, all vacations are returned
    };

    const applyFilter = useCallback(() => {
        const filtered = filterVacations(vacations, likedVacationIds, activeFilter);
        setFilteredVacations(filtered);
        const filteredTotalPages = Math.ceil(filtered.length / vacationsPerPage);
        setTotalPages(filteredTotalPages);
        if (currentPage > filteredTotalPages) {
            setCurrentPage(1);
        }
    }, [vacations, likedVacationIds, activeFilter, vacationsPerPage, currentPage]);

    useEffect(() => {
        applyFilter();
    }, [vacations, activeFilter, likedVacationIds, applyFilter]);

    const getPaginatedVacations = () => {
        const startIndex = (currentPage - 1) * vacationsPerPage;
        return filteredVacations.slice(startIndex, startIndex + vacationsPerPage);
    };

    const generatePaginationNumbers = (totalPages: number, currentPage: number) => {
        const paginationNumbers: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                paginationNumbers.push(i);
            }
        } else {
            if (currentPage > 3) {
                paginationNumbers.push(1);
                if (currentPage > 4) paginationNumbers.push('...');
            }
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                paginationNumbers.push(i);
            }
            if (currentPage < totalPages - 2) {
                if (currentPage < totalPages - 3) paginationNumbers.push('...');
                paginationNumbers.push(totalPages);
            }
        }

        return paginationNumbers;
    };

    if (!isAuthenticatedUser) {
        return <Navigate to="/login" />;
    }

    if (loading) return <Loader />;

    return (
        <div className="Vacations">
            {userRole === "Admin" && (
                <div className="add-vacation-container" style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="/vacations/add" className="add-vacation-button">
                        <i className="fas fa-plus" style={{ fontSize: '18px' }}></i>
                        <b>Add New Vacation</b>
                    </Link>

                    <div style={{ borderLeft: '2px solid #e0e0e0', height: '30px', margin: '0 20px', opacity: '0.6' }}></div>

                    <Link to="/vacations/report" className="add-vacation-button">
                        <i className="fas fa-chart-bar" style={{ fontSize: '18px' }}></i>
                        <b>Vacation Report Page</b>
                    </Link>
                </div>
            )}

            {userRole === "User" && (
                <div className="filters">
                    {["all", "following", "upcoming", "active"].map(filter => (
                        <label key={filter}>
                            <input
                                type="radio"
                                name="vacationFilter"
                                checked={activeFilter === (filter === "all" ? null : filter)}
                                onChange={() => {
                                    setActiveFilter(filter === "all" ? null : filter);
                                    setCurrentPage(1);
                                }}
                            />
                            Show {filter.charAt(0).toUpperCase() + filter.slice(1)} Vacations
                        </label>
                    ))}
                </div>
            )}

            <div className="vacation-list">
                {getPaginatedVacations().length > 0 ? (
                    getPaginatedVacations().map(vacation => (
                        userRole === "Admin" ? (
                            <VacationsCardAdmin key={vacation.id} vacation={vacation} />
                        ) : (
                            <VacationsCardUser key={vacation.id} vacation={vacation} />
                        )
                    ))
                ) : (
                    <p>No vacations found for the selected filter. Please try a different filter.</p>
                )}
            </div>

            {filteredVacations.length > 0 && (
                <div className="pagination">
                    <button onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))} disabled={currentPage === 1}>
                        Previous
                    </button>

                    {generatePaginationNumbers(totalPages, currentPage).map((number, index) => (
                        typeof number === 'string' ? (
                            <span key={index} className="ellipsis">{number}</span>
                        ) : (
                            <span
                                key={number}
                                className={`page-number ${currentPage === number ? 'active' : ''}`}
                                onClick={() => setCurrentPage(number)}
                            >
                                {number}
                            </span>
                        )
                    ))}

                    <button onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Vacations;
