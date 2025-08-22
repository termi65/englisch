import { Modal, Button } from "react-bootstrap";

function ErrorUI({ show, msg, handleClose }) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Fehler</Modal.Title>
            </Modal.Header>
            <Modal.Body>{msg}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                Schließen
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ErrorUI;
