import axios, { InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { store } from "../Redux/store";

class InterceptorsService {

    public createInterceptors(): void {

        axios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
            const token = store.getState().auth.token;

            if (token) {
                // Ensure headers object exists and is correctly typed
                request.headers = request.headers || {} as AxiosRequestHeaders;

                // Add the Authorization header
                request.headers['Authorization'] = `Bearer ${token}`;
            }

            return request;
        }, (error) => {
            return Promise.reject(error);
        });
    }
}

const interceptorsService = new InterceptorsService();
export default interceptorsService;
