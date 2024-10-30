import "./AddVacation.css";
import { useForm } from "react-hook-form";
import { VacationModel } from "../../../Models/VacationModel";
import VacationsService from "../../../Services/VacationsService";
import { useNavigate } from "react-router-dom";
import notifyService from "../../../Services/NotifyService";
import { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";

function AddVacation(): JSX.Element {
    const { register, handleSubmit, formState, watch, setError } = useForm<VacationModel>();
    const navigate = useNavigate();
    const [fileName, setFileName] = useState<string>("No file chosen");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [descriptionLength, setDescriptionLength] = useState<number>(0);

    const save = async (vacation: VacationModel) => {
        setLoading(true);
        try {
// Checks on the dates and the price
            if (new Date(vacation.startDate) >= new Date(vacation.endDate)) {
                setError("endDate", { message: "End date must be after start date" });
                return;
            }

            if (vacation.price <= 0 || vacation.price > 10000) {
                setError("price", { message: "Price must be a positive number and not exceed 10,000" });
                return;
            }

            const today = new Date().toISOString().split('T')[0];
            if (vacation.startDate < today || vacation.endDate < today) {
                setError("startDate", { message: "Start date cannot be in the past" });
                setError("endDate", { message: "End date cannot be in the past" });
                return;
            }

            const fileInput = document.getElementById('image-upload') as HTMLInputElement;
            const file = fileInput.files?.[0];

            if (file) {
                vacation.imageFileName = file.name; // Added the name of the vacation file
                await VacationsService.saveOneVacation(vacation, file);// delivering the file
                notifyService.success("Vacation has been successfully added");
                navigate("/vacations");
            } else {
                notifyService.error("No image file selected.");
            }
        } catch (error: any) {
            notifyService.error("Failed to add vacation: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const isImage = file.type.startsWith('image/');
            const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB limit

            if (!isImage) {
                notifyService.error("Uploaded file is not an image.");
                setFileName("No file chosen");
                setImagePreview(null);
                return;
            }

            if (!isValidSize) {
                notifyService.error("File size exceeds 2MB.");
                setFileName("No file chosen");
                setImagePreview(null);
                return;
            }

            setFileName(file.name);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setFileName("No file chosen");
            setImagePreview(null);
        }
    };

    const handleImageClick = () => {
        const input = document.getElementById('image-upload') as HTMLInputElement;
        input.click();
    };

    const descriptionValue = watch("description", "");
    useEffect(() => {
        setDescriptionLength(descriptionValue.length);
    }, [descriptionValue]);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <div className="AddVacation">
            <form className="box" onSubmit={handleSubmit(save)}>
                <h2>Add Vacation</h2>

                <div className="form-control">
                    <label htmlFor="destination">Destination:</label>
                    <input
                        type="text"
                        id="destination"
                        {...register("destination", { required: "Destination is required" })}
                    />
                    <span className="err">{formState.errors.destination?.message}</span>
                </div>

                <div className="form-control">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        {...register("description", {
                            required: "Description is required",
                            maxLength: {
                                value: 117,
                                message: "Maximum length is 117 characters"
                            }
                        })}
                        maxLength={117} 
                        className="fixed-textarea"
                    />
                    <span className="err">{formState.errors.description?.message}</span>
                    <div className="char-count">
                        {descriptionLength}/117 characters
                    </div>
                </div>

                <div className="form-control">
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        {...register("price", { required: "Price is required", valueAsNumber: true,  min: { value: 0, message: "Price cannot be negative" } })}
                    />
                    <span className="err">{formState.errors.price?.message}</span>
                </div>

                <div className="form-control">
                    <label htmlFor="startDate">Start on:</label>
                    <input
                        type="date"
                        id="startDate"
                        {...register("startDate", { required: "Start Date is required" })}
                    />
                    <span className="err">{formState.errors.startDate?.message}</span>
                </div>

                <div className="form-control">
                    <label htmlFor="endDate">End on:</label>
                    <input
                        type="date"
                        id="endDate"
                        {...register("endDate", { required: "End Date is required" })}
                    />
                    <span className="err">{formState.errors.endDate?.message}</span>
                </div>

                <div className="form-control">
                    <label>Cover image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        id="image-upload"
                        {...register("imageFileName")}
                        onChange={handleFileChange}
                        style={{ display: "none" }} 
                    />
                    <img
                        src={imagePreview || "https://rivkabucket.s3.amazonaws.com/JetAway/uplaod+img.jpg"}
                        alt="Upload"
                        className="upload-image"
                        onClick={handleImageClick}
                    />
                    <div className="file-name">{fileName}</div>
                </div>

                <Button type="submit" disabled={loading} className="btnSubmit">
                    Add Vacation&nbsp;
                    {loading ? (
                        <Spinner animation="border" variant="light" size="sm" role="status" className="spinner-border">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : (
                        <span className="material-icons"></span>
                    )}
                </Button>
                <button type="button" className="btnCancel" onClick={() => navigate("/vacations")}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default AddVacation;
