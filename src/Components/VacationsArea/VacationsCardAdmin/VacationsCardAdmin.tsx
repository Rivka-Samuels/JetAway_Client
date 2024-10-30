import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { VacationModel } from "../../../Models/VacationModel";
import vacationsService from "../../../Services/VacationsService"; // Import your service
import notifyService from "../../../Services/NotifyService"; // Import your NotifyService
import "./VacationsCardAdmin.css";
import { useNavigate } from "react-router-dom";

interface VacationsCardProps {
    vacation: VacationModel;
}

const VacationsCardAdmin = ({ vacation }: VacationsCardProps): JSX.Element => {
    const { imageFileName, destination, description, price, startDate, endDate, id } = vacation;
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false); // Modal state

    const formatDateToShort = (dateString: string): string => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const handleEdit = () => {
        navigate(`/vacations/edit/${id}`);
    };

    const handleDelete = async () => {
        try {
            await vacationsService.deleteVacation(String(id));
            notifyService.success('Vacation deleted successfully!');
            setShowModal(false); // Close the modal
            window.location.reload(); // Reload the page to reflect changes
        } catch (error) {
            console.error("Error deleting vacation:", error);
            notifyService.error(error);
        }
    };

    return (
        <div className="VacationsCardAdmin">
            <div className="VacationsCardAdmin-info">
                <img src={`https://rivkabucket.s3.us-east-1.amazonaws.com/JetAway/${imageFileName}`} alt="vacation-image" className="VacationsCardUser-image" />
                <p className="VacationsCardAdmin-destination">{destination}</p>

                <div className="VacationsCardAdmin-actions">
                    <button className="edit-button" onClick={handleEdit}>
                        <i className="material-icons">&#xe3c9;</i><b>Edit</b>
                    </button>
                    <button className="delete-button" onClick={() => setShowModal(true)}>
                        <i className="material-icons">&#xe872;</i><b>Delete</b>
                    </button>
                </div>
            </div>
            <p className="VacationsCardAdmin-date">{formatDateToShort(startDate)} - {formatDateToShort(endDate)}</p>
            <p className="VacationsCardAdmin-description">{description}</p>
            <p className="VacationsCardAdmin-price">$ {price}</p>

            {/* Delete Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title><strong>Delete Confirmation</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this vacation?</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                        className="modal-button secondary">
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        className="modal-button primary">
                        Delete
                    </Button>
                </Modal.Footer>

            </Modal>
        </div>
    );
};

export default VacationsCardAdmin;
