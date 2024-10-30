import { useState, useEffect } from "react";
import { VacationModel } from "../../../Models/VacationModel";
import { getUserId } from "../../../Utils/authUtils";
import followService from "../../../Services/FollowService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../Redux/store";
import { addFollow, removeFollow, fetchFollowedVacations } from "../../../Redux/followsSlice";
import "./VacationsCardUser.css";
import authService from "../../../Services/AuthService";

interface VacationsCardProps {
    vacation: VacationModel;
}

const VacationsCardUser = ({ vacation }: VacationsCardProps): JSX.Element => {
    const { id, imageFileName, destination, description, price, startDate, endDate } = vacation;

    const [isLiked, setIsLiked] = useState(false);
    const [followersCount, setFollowersCount] = useState<number>(0);
    const dispatch: AppDispatch = useDispatch();

    const formatDateToShort = (dateString: string): string => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchFollowersCount = async () => {
            try {
                const followersResponse = await followService.getFollowers(vacation.id);
                if (Array.isArray(followersResponse)) {
                    setFollowersCount(followersResponse.length);

                    // Check if the user is tracking the vacation
                    const userId = getUserId();
                    if (userId !== null) {
                        const isUserLiked = followersResponse.includes(userId);
                        setIsLiked(isUserLiked);
                    }
                } else {
                    setFollowersCount(0);
                    setIsLiked(false);
                }
            } catch (error) {
                console.error("Error fetching followers count:", error);
                setFollowersCount(0);
                setIsLiked(false);
            }
        };

        fetchFollowersCount();
        dispatch(fetchFollowedVacations() as any);
    }, [id, vacation.id, dispatch]);

    const handleLikeClick = async () => {
        if (!authService.isAuthenticated()) {
            alert("Please log in to like vacations.");
            return;
        }

        const userId = getUserId();
        if (!userId) {
            console.error("User ID not found");
            return;
        }

        try {
            if (!isLiked) {
                await followService.addFollow(userId, id);
                dispatch(addFollow(id) as any);
                setIsLiked(true);
                setFollowersCount(prevCount => prevCount + 1);
            } else {
                await followService.deleteFollow(userId, id);
                dispatch(removeFollow(id) as any);
                setIsLiked(false);
                setFollowersCount(prevCount => prevCount - 1);
            }
        } catch (error) {
            console.error("Error updating like status:", error);
        }
    };

    return (
        <div className="VacationsCardUser">
            <div className="VacationsCardUser-info">
                <img src={`https://rivkabucket.s3.us-east-1.amazonaws.com/JetAway/${imageFileName}`} alt="vacation-image" className="VacationsCardUser-image" />
                <p className="VacationsCardUser-destination">{destination}</p>
                <div className="VacationsCardUser-actions">
                    <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={handleLikeClick}>
                        <i className={isLiked ? "fas fa-heart icon" : "far fa-heart icon"}>&nbsp;</i>
                        <b><span>Like {followersCount}</span></b>
                    </button>
                </div>
            </div>
            <p className="VacationsCardUser-date">{formatDateToShort(startDate)} - {formatDateToShort(endDate)}</p>
            <p className="VacationsCardUser-description">{description}</p>
            <p className="VacationsCardUser-price">$ {price}</p>
        </div>
    );
};

export default VacationsCardUser;
