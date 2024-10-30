import { VacationModel } from './VacationModel';

export interface PaginatedVacationsResponse {
    currentPage: number;
    totalPages: number;  
    total: number;        
    vacations: VacationModel[]; 
}
