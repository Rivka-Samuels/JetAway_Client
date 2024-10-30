import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacationModel } from "../Models/VacationModel";

// Declare interface for initialState object:
interface VacationsState {
    vacationsList: VacationModel[];
}

// Define initialState object:
const initialState: VacationsState = {
    vacationsList: [],
};

// Create Slice:
const vacationsSlice = createSlice({
    name: "vacations",  // Name of the slice
    initialState,       // initialState object
    reducers: {         // List of reducers functions

        // Fetch vacations from the API or data source
        fetchVacations: (state, action: PayloadAction<VacationModel[]>) => {
            state.vacationsList = action.payload;
        },

        // Add a new vacation to the list
        addVacation: (state, action: PayloadAction<VacationModel>) => {
            state.vacationsList.push(action.payload);
        },

        // Update an existing vacation
        updateVacation: (state, action: PayloadAction<VacationModel>) => {
            const indexToUpdate = state.vacationsList.findIndex(v => v.id === action.payload.id);
            if (indexToUpdate >= 0) {
                state.vacationsList[indexToUpdate] = action.payload; // Update the vacation details
            }
        },
        
        // Delete a vacation from the list
        deleteVacation: (state, action: PayloadAction<number>) => {
            const indexToDelete = state.vacationsList.findIndex(v => v.id === action.payload);
            if (indexToDelete >= 0) {
                state.vacationsList.splice(indexToDelete, 1); // Remove the vacation from the list
            }
        }
    }
});

// Export all reducers functions for later use in the app
export const { fetchVacations, addVacation, updateVacation, deleteVacation } = vacationsSlice.actions;
export default vacationsSlice.reducer;
