import { toast } from 'react-toastify';

class NotifyService {

    public success(message: string) {
        toast.success(`${message}`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    public error(error: any) {
        const message = this.extractMessage(error);
        toast.error(` ${message}`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    private extractMessage(error: any): string {
        // Front: throw "Error!":
        if (typeof error === "string") return error;

        // BackEnd: throw "Error!" (string):
        if (typeof error.response?.data === "string") return error.response.data;

        // Back: throw [] validation:
        if (Array.isArray(error.response?.data)) return error.response.data[0];

        // Front: throw new Error("Some Error..."):
        if (typeof error.message === "string") return error.message;

        // else:
        return "Something went wrong...";
    }
}

// Create an instance of the service
const notifyService = new NotifyService();
export default notifyService;
