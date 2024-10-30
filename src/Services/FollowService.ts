import axios from "axios";
import appConfig from "../Utils/Config";
import { Follow } from "../Models/FollowModel";

// Add a follow
export const addFollow = async (userId: number, vacationId: number): Promise<void> => {
    const followData: Follow = { userId, vacationId };
    try {
        await axios.post(appConfig.getFollowsUrl(userId, vacationId), followData);
    } catch (error: any) { // Set type to error
        console.error("Error adding follow:", error.response?.data || error.message);
        throw error;// throws the error up
    }
};

// Delete a follow
export const deleteFollow = async (userId: number, vacationId: number): Promise<void> => {
    try {
        await axios.delete(appConfig.getFollowsUrl(userId, vacationId));
    } catch (error: any) {
        console.error("Error deleting follow:", error.response?.data || error.message);
        throw error;
    }
};

// Get followers for a vacation
export const getFollowers = async (vacationId: number): Promise<number[]> => {
    const response = await axios.get<number[]>(appConfig.getFollowsUrl(undefined, vacationId));
    return response.data;
};

// Get liked vacations for a user
export const getLikedVacations = async (userId: number): Promise<number[]> => {
    const response = await axios.get<number[]>(appConfig.getFollowsUrl(userId));
    return response.data; // Expected to return an array of vacation IDs
};

// Exporting all functions together
const followService = {
    addFollow,
    deleteFollow,
    getFollowers,
    getLikedVacations,
};

export default followService;
