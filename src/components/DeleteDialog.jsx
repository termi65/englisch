import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import supabase from "../tools/supabase";
import { useState } from "react";
import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

export default function DeleteDialog() {
    const {id, title, text} = useParams();
    const [show, setShow] = useState(false);
    // const navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleOK = async () => {
        await supabase.from('vokabeln').delete().eq('id', id);
        setShow(false);
    }
    
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{text}</Modal.Body>
                <Modal.Footer>
                    <div>
                        <Button variant="primary" onClick={handleOK}>OK</Button> &nbsp;
                        <Button variant="secondary" onClick={handleClose}>Abbrechen</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}