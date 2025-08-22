import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import supabase from "../tools/supabase";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Idioms() {
    const [sortierung] = useSearchParams();
    const [idioms, setIdioms] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [columns, setColumns] = useState(["Deutsch", "Englisch", ""]);
    const [currentVokabelId, setCurrentVokabelId] = useState(null);
    // modales Fenster anzeigen?
    const [modalDelete, setModalDelete] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();

    const ladeVokabeln = async (sortOrder) => {
        setLoading(true);
        let {data, error} = {data: null, error: null};
        switch (sortOrder) {
            case "dauf":
                ({data, error} = await supabase.from("idioms").select("*").order("Deutsch", {ascending: true}));
                break;
            case "dab":
                ({data, error} = await supabase.from("idioms").select("*").order("Deutsch", {ascending: false}));
                break;
            case "eauf":
                ({data, error} = await supabase.from("idioms").select("*").order("Englisch", {ascending: true}));
                break;
            case "eab":
                ({data, error} = await supabase.from("idioms").select("*").order("Englisch", {ascending: false}));
                break;
            default:
                ({data, error} = await supabase.from("idioms").select("*"));
        }
        
        setIdioms(data);
        setLoading(false);
    }

    useEffect(() => {
        try {
            const s = sortierung.get("sortierung");
            setCurrentOrder(s);
            ladeVokabeln(s);
        }
        catch(error) {
            console.log("Fehler:", error);
        }

        const handleKeyDown = (e) => {
            if (e.shiftKey && e.key === "*") {
                e.preventDefault(); // Prevent default browser behavior
                navigate(`/idiom/0/${currentOrder}`);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

    },[sortierung, modalDelete]);
    
    
    const handleSort = (e) => {
        const nextList = [...idioms];
        // falls Englisch-Spaltenheader und aktuelle Sortierung englisch aufsteigend oder none
        if (e.target.innerHTML === "Englisch") {
            if (currentOrder === 'eauf') {
                navigate("/idioms/?sortierung=eab");
            } else {
                navigate("/idioms/?sortierung=eauf");
            }
        } else {
            if (currentOrder === "dauf") {
                    navigate("/idioms/?sortierung=dab");
                } else {
                    navigate("/idioms/?sortierung=dauf");
                }
            }
        setIdioms(nextList);
    }

    const swapColumns = (col1, col2) => {
        const newCols = [...columns];
        const idx1 = newCols.indexOf(col1);
        const idx2 = newCols.indexOf(col2);
        [newCols[idx1], newCols[idx2]] = [newCols[idx2], newCols[idx1]];
        setColumns(newCols);
    };

    const showModalDelete = (id) => {
        setModalDelete(true);
        setCurrentVokabelId(id);
    }
    
    const deleteVokabel = async () => {
        try {
            const { error } = await supabase.from('idioms').delete().eq('id', currentVokabelId);
            if (error) {
                console.error("Fehler beim Löschen:", error);
                alert("Fehler beim Löschen der Idiom!");
            } else {
                setCurrentVokabelId(null);
            }
        } catch (err) {
            console.error("Unerwarteter Fehler:", err);
            alert("Unerwarteter Fehler beim Löschen!");
        }
        ladeVokabeln();
        setModalDelete(false);
    }

    if (loading) return (<div>Lade Vokabeln ...</div>);

    return (
        <div className="container border border-secondary d-flex flex-column p-1 align-items-center">
            <h1>Idiome (Redewendungen):</h1>
            <div className="w-100 border border-primary">
                <h2>Liste</h2>
                <div className="row">
                    <div className="col-md-3">
                        <button title="Spalten tauschen" onClick={() => swapColumns("Deutsch", "Englisch")}><i className="bi bi-arrows"></i></button>
                    </div>
                    <div className="col-md-9">
                        <button title="Eine Idiom hinzufügen (Shift-+)" onClick={() => navigate(`/idiom/0/${currentOrder}`)}><i className="bi bi-clipboard-plus"></i></button>
                    </div>
                    <div className="row">
                        <div className="col-md-5">
                            <button title="Nach dieser Spalte sortieren" onClick={handleSort}>{columns[0]}</button>
                        </div>
                        <div className="col-md-5">
                            <button title="Nach dieser Spalte sortieren" onClick={handleSort}>{columns[1]}</button>
                        </div>
                        <div className="col-md-2">
                            
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className="container">
                    {idioms.map((row, i) => (
                        <div className="row">
                            <p className="col-md-5">{row[columns[0]]}</p>
                            <p className="col-md-5">{row[columns[1]]}</p>
                            <p className="col-md-2">
                                <button title="Idiom bearbeiten" onClick={() => navigate(`/idiom/${row.id}/${currentOrder}`)}><i className="bi bi-pencil"></i></button>
                                <button title="Idiom löschen" onClick={() => showModalDelete(row.id)}><i className="bi bi-x-square"></i></button>
                            </p>
                        </div>
                        ))
                    }
                </div>

                <Modal show={modalDelete} onHide={() => setModalDelete(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Achtung</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Wollen Sie die Idiom wirklich löschen?</Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button variant="primary" onClick={deleteVokabel}>OK</Button> &nbsp;
                            <Button variant="secondary" onClick={() => setModalDelete(false)}>Abbrechen</Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
            
        </div>
    )
}