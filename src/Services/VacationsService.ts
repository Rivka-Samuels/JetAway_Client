import axios from "axios";
import appConfig from "../Utils/Config";
import { store } from "../Redux/store";
import { addVacation, deleteVacation, fetchVacations, updateVacation } from "../Redux/vacationsSlice";
import { VacationModel } from "../Models/VacationModel";
import { PaginatedVacationsResponse } from "../Models/PaginatedVacationsResponse";
import interceptorsService from "./InterceptorsService";

class VacationsService {
    constructor() {
        interceptorsService.createInterceptors(); 
    }

    public async getAllPaginatedVacations(): Promise<PaginatedVacationsResponse> {
        const url = appConfig.allPaginatedUrl; 
        try {
            console.log("Fetching vacations with URL:", url);
            const res = await axios.get(url);
            console.log("Received data:", res.data);
            return res.data; 
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error fetching paginated vacations:", error.response?.data);
            } else {
                console.error("Unexpected error:", error);
            }
            throw new Error("Failed to fetch paginated vacations.");
        }
    }

    public async getPaginatedVacations(page: number, limit: number = Number.MAX_SAFE_INTEGER): Promise<PaginatedVacationsResponse> {
        const url = appConfig.getPaginatedUrl(page, limit);
        try {
            console.log("Fetching vacations with URL:", url);
            const res = await axios.get(url);
            console.log("Received data:", res.data); 
            return res.data; 
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error fetching paginated vacations:", error.response?.data);
            } else {
                console.error("Unexpected error:", error);
            }
            throw new Error("Failed to fetch paginated vacations.");
        }
    }

    public async getAllVacations(): Promise<VacationModel[]> {
        let vacations = store.getState().vacations.vacationsList;

        if (!vacations.length) {
            try {
                const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl);
                vacations = response.data;
                store.dispatch(fetchVacations(vacations));
            } catch (error) {
                console.error("Error fetching vacations:", error);
                throw new Error("Failed to fetch vacations.");
            }
        }

        return vacations;
    }

    public async getOneVacation(id: string): Promise<VacationModel> {
        let vacations = store.getState().vacations.vacationsList;
        let vacation = vacations.find(v => v.id === +id);

        if (!vacation) {
            try {
                const response = await axios.get<VacationModel>(`${appConfig.vacationsUrl}/${id}`);
                vacation = response.data;
            } catch (error) {
                console.error(`Error fetching vacation with ID ${id}:`, error);
                throw new Error(`Failed to fetch vacation with ID ${id}.`);
            }
        }
        return vacation;
    }

    public async saveOneVacation(vacation: VacationModel, imageFile: File): Promise<void> {
        const myData = new FormData();
        myData.append("destination", vacation.destination);
        myData.append("description", vacation.description);
        myData.append("price", vacation.price.toString());
        myData.append("startDate", vacation.startDate);
        myData.append("endDate", vacation.endDate);
        myData.append("image", imageFile); 
        
        console.log("Submitting vacation data:", {
            destination: vacation.destination,
            description: vacation.description,
            price: vacation.price,
            startDate: vacation.startDate,
            endDate: vacation.endDate,
            imageFileName: imageFile.name 
        });
        
        try {
            const response = await axios.post<VacationModel>(appConfig.vacationsUrl, myData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            console.log("Vacation added successfully:", response.data);
            store.dispatch(addVacation(response.data));
        } catch (error) {
            console.error("Error adding vacation:", error);
            const errorMessage = (error as Error).message || "Unknown error occurred.";
            console.error("Error message:", errorMessage);
            throw new Error("Failed to add vacation.");
        }
    }

    public async updateVacation(vacation: VacationModel, imageFile?: FileList): Promise<void> {
        const myData = new FormData();
        myData.append("destination", vacation.destination);
        myData.append("description", vacation.description);
        myData.append("price", vacation.price.toString());
        myData.append("startDate", vacation.startDate);
        myData.append("endDate", vacation.endDate);
        
        if (imageFile && imageFile.length > 0) {
            myData.append("imageFile", imageFile[0]);
        }
        
        console.log("Submitting vacation data:", {
            destination: vacation.destination,
            description: vacation.description,
            price: vacation.price,
            startDate: vacation.startDate,
            endDate: vacation.endDate,
            imageFile: imageFile ? imageFile[0]?.name : null 
        });
        
        try {
            const response = await axios.put<VacationModel>(`${appConfig.vacationsUrl}/${vacation.id}`, myData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        
            const updatedVacation = response.data;
            store.dispatch(updateVacation(updatedVacation));
        } catch (error) {
            console.error("Error updating vacation:", error);
            throw new Error("Failed to update vacation.");
        }
    }

    public async deleteVacation(id: string): Promise<void> {
        try {
            await axios.delete<void>(`${appConfig.vacationsUrl}/${id}`);
            store.dispatch(deleteVacation(+id));
        } catch (error) {
            console.error(`Error deleting vacation with ID ${id}:`, error);
            throw new Error("Failed to delete vacation.");
        }
    }
}

const vacationsService = new VacationsService(); // Singleton
export default vacationsService;
