import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import followService from "../Services/FollowService";
import { getUserId } from "../Utils/authUtils";

interface FollowsState {
    followedVacations: number[];
}

const initialState: FollowsState = {
    followedVacations: [],
};

// Async thunk to fetch followed vacations
export const fetchFollowedVacations = createAsyncThunk(
    'follows/fetchFollowedVacations',
    async () => {
        const userId = getUserId();
        if (!userId) throw new Error("User ID not found");
        const followedVacations = await followService.getLikedVacations(userId);
        return followedVacations;
    }
);

// Async thunk to add a follow
export const addFollow = createAsyncThunk(
    'follows/addFollow',
    async (vacationId: number) => {
        const userId = getUserId();
        if (!userId) throw new Error("User ID not found");
        await followService.addFollow(userId, vacationId);
        return vacationId;
    }
);

// Async thunk to remove a follow
export const removeFollow = createAsyncThunk(
    'follows/removeFollow',
    async (vacationId: number) => {
        const userId = getUserId();
        if (!userId) throw new Error("User ID not found");
        await followService.deleteFollow(userId, vacationId);
        return vacationId;
    }
);

const followsSlice = createSlice({
    name: 'follows',
    initialState,
    reducers: {
        clearFollows(state) {
            state.followedVacations = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFollowedVacations.fulfilled, (state, action: PayloadAction<number[]>) => {
                state.followedVacations = action.payload;
            })
            .addCase(addFollow.fulfilled, (state, action: PayloadAction<number>) => {
                state.followedVacations.push(action.payload);
            })
            .addCase(removeFollow.fulfilled, (state, action: PayloadAction<number>) => {
                state.followedVacations = state.followedVacations.filter(id => id !== action.payload);
            });
    },
});

export const { clearFollows } = followsSlice.actions;

export default followsSlice.reducer;
