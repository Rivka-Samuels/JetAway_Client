import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./EditVacation.css";
import { VacationModel } from "../../../Models/VacationModel";
import { useNavigate, useParams } from "react-router-dom";
import VacationsService from "../../../Services/VacationsService";
import notifyService from "../../../Services/NotifyService";
import { Button, Spinner } from "react-bootstrap";

function EditVacation(): JSX.Element {
    const { register, handleSubmit, formState, setValue } = useForm<VacationModel>();
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState<FileList | null>(null);
    const params = useParams();
    const { vacationID } = params;
    const [charCount, setCharCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState<string>("");

    useEffect(() => {
        if (vacationID) {
            VacationsService.getOneVacation(vacationID)
                .then(vacation => {
                    setValue("id", vacation.id);
                    setValue("destination", vacation.destination);
                    setValue("description", vacation.description);
                    setValue("price", vacation.price);

                    const startDate = new Date(vacation.startDate);
                    const endDate = new Date(vacation.endDate);
                    setValue("startDate", startDate.toISOString().split("T")[0]);
                    setValue("endDate", endDate.toISOString().split("T")[0]);

                    setImageUrl(vacation.imageFileName ? `https://rivkabucket.s3.us-east-1.amazonaws.com/JetAway/${vacation.imageFileName}` : "");
                    setCharCount(vacation.description.length);
                    setStartDate(startDate.toISOString().split("T")[0]);
                })
                .catch(error => notifyService.error("Failed to load vacation: " + error.message));
        }
    }, [vacationID, setValue]);

    const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

            // Validate file type
            if (!validImageTypes.includes(selectedFile.type)) {
                notifyService.error("Only JPEG, PNG, and GIF files are allowed.");
                return;
            }

            // Validate file size (max 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                notifyService.error("File size should not exceed 5MB.");
                return;
            }

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(selectedFile);
            setImageFile(dataTransfer.files);

            const fileUrl = URL.createObjectURL(selectedFile);
            setImageUrl(fileUrl);
        } else {
            setImageFile(null);
            setImageUrl("");
        }
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        setCharCount(value.length);
        setValue("description", value);
    };

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = event.target.value;
        setStartDate(newDate);
        setValue("startDate", newDate);
    };

    const update = async (vacation: VacationModel) => {
        try {
            setLoading(true);
            vacation.startDate = new Date(vacation.startDate).toISOString();
            vacation.endDate = new Date(vacation.endDate).toISOString();

            await VacationsService.updateVacation(vacation, imageFile ?? undefined);
            notifyService.success("Vacation has been successfully updated");
            navigate("/vacations");
        } catch (error: any) {
            console.error("Error updating vacation:", error.response?.data || error.message);
            notifyService.error("Failed to update vacation: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setImageUrl("");
        setImageFile(null);
        navigate("/vacations");
    };

    return (
        <div className="EditVacation">
            <form className="box" onSubmit={handleSubmit(update)}>
                <h2>Edit Vacation</h2>

                <div className="form-control">
                    <label>Destination:</label>
                    <input
                        type="text"
                        {...register("destination", { required: "Destination is required" })}
                        disabled={loading} // Disable input while loading
                    />
                    <span className="err">{formState.errors.destination?.message}</span>
                </div>

                <div className="form-control">
                    <label>Description:</label>
                    <textarea
                        {...register("description", { required: "Description is required", maxLength: 117 })}
                        maxLength={117}
                        className="fixed-textarea"
                        onChange={handleDescriptionChange}
                        disabled={loading} // Disable input while loading
                    />
                    <span className="err">{formState.errors.description?.message}</span>
                    <small>{`${charCount}/117 characters`}</small>
                </div>

                <div className="form-control">
                    <label>Price:</label>
                    <input
                        type="number"
                        {...register("price", { required: "Price is required", valueAsNumber: true, min: { value: 0, message: "Price cannot be negative" } })}
                        disabled={loading} // Disable input while loading
                    />
                    <span className="err">{formState.errors.price?.message}</span>
                </div>

                <div className="form-control">
                    <label>Start Date:</label>
                    <input
                        type="date"
                        {...register("startDate", { required: "Start Date is required" })}
                        onChange={handleStartDateChange}
                        disabled={loading} // Disable input while loading
                    />
                    <span className="err">{formState.errors.startDate?.message}</span>
                </div>

                <div className="form-control">
                    <label>End Date:</label>
                    <input
                        type="date"
                        {...register("endDate", { required: "End Date is required" })}
                        min={startDate} // Set minimum end date to the selected start date
                        disabled={loading} // Disable input while loading
                    />
                    <span className="err">{formState.errors.endDate?.message}</span>
                </div>

                <div className="form-control image-upload">
                    <label>Image Preview:</label>
                    {imageUrl && (
                        <div className="image-preview">
                            <img src={imageUrl} alt="Vacation" />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onChangeFile}
                        disabled={loading} // Disable input while loading
                    />
                    <small className="image-info">Supported formats: JPEG, PNG, GIF (max 5MB)</small>
                </div>

                <Button disabled={loading} className="btnSubmit" type="submit">
                    Edit Vacation&nbsp;
                    {loading ? (
                        <Spinner animation="border" variant="light" size="sm" role="status" className="spinner-border">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : (
                        <span className="material-icons"></span>
                    )}
                </Button>

                <button type="button" className="btnCancel"  onClick={cancelEdit}>Cancel</button>
            </form>
        </div>
    );
}

export default EditVacation;
