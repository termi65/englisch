import { useEffect, useRef, useState } from "react";
// import vokabeln from "/woerter.json";
import supabase from "../tools/supabase";
import { useNavigate } from "react-router-dom";

export default function Vokabeln() {
    const [vokabeln, setVokabeln] = useState([]);
    const [columns, setColumns] = useState(["deutsch", "englisch", "Bearbeiten"]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();

    const ladeVokabeln = async () => {
        setLoading(true);
        const {data, error} = await supabase.from("vokabeln").select("*");
        setVokabeln(data);
        setLoading(false);
    }

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     let error;
    //     if (selectedRow) {
    //         error = await supabase
    //         .from("vokabeln")
    //         .update({ deutsch: selectedRow.deutsch, englisch: selectedRow.englisch })
    //         .eq("id", selectedRow.id);
    //         }
    //     else {
    //         error = await supabase
    //         .from("vokablen")
    //         .insert({ deutsch: selectedRow.deutsch, englisch: selectedRow.englisch  });
    //     }
    //     if (!error.error) {
    //         setSelectedRow(null);
    //     }
    // }

    useEffect(() => {
        try {
            ladeVokabeln();
        }
        catch(error) {
            console.log("Fehler:", error);
        }
    },[]);
    
    const richtung = useRef('aufsteigend');
    
    const handleSort = (e) => {
        const nextList = [...vokabeln];
        if (richtung.current === 'aufsteigend') {
            if (e.target.innerHTML === "Englisch") {
            nextList.sort((a,b) => a.englisch.localeCompare(b.englisch));
            } else {
                nextList.sort((a,b) => a.deutsch.localeCompare(b.deutsch));
            }
            richtung.current = 'absteigend';
        } else {
            if (e.target.innerHTML === "Englisch") {
                nextList.sort((a,b) => b.englisch.localeCompare(a.englisch));
            } else {
                nextList.sort((a,b) => b.deutsch.localeCompare(a.deutsch));
            }
            richtung.current = 'aufsteigend';
        }
        setVokabeln(nextList);
    }

    const swapColumns = (col1, col2) => {
        const newCols = [...columns];
        const idx1 = newCols.indexOf(col1);
        const idx2 = newCols.indexOf(col2);
        [newCols[idx1], newCols[idx2]] = [newCols[idx2], newCols[idx1]];
        setColumns(newCols);
    };

    const deleteVokabel = async (id) => {
        try {
            const { error } = await supabase.from('vokabeln').delete().eq('id', id);
            if (error) {
                console.error("Fehler beim Löschen:", error);
                alert("Fehler beim Löschen der Vokabel!");
            } 
        } catch (err) {
            console.error("Unerwarteter Fehler:", err);
            alert("Unerwarteter Fehler beim Löschen!");
        }
        ladeVokabeln();
    }

    if (loading) return (<div>Lade Vokabeln ...</div>);

    return (
        <div className="container border border-secondary d-flex flex-column p-1 align-items-center">
            <h1>Vokabeln:</h1>
            <div className="w-100 border border-secondary">
                <h2>Liste</h2>
                <table className="d-table">
                    <thead>
                        <tr> 
                            <th><button onClick={() => swapColumns("Deutsch", "Englisch")}><i class="bi bi-arrows"></i></button></th>
                            <th><button onClick={() => navigate(`/vokabel/0`)}><i class="bi bi-clipboard-plus"></i></button></th> 
                        </tr>
                        <tr> {columns.map(col => <th key={col}> <button onClick={handleSort}>{col}</button> </th>)} </tr>
                    </thead>
                    <tbody>
                        {vokabeln.map((row,i) => (
                            <tr key={i}>
                                {columns.map(col => <td key={col}>{row[col]}</td>)}
                                <td><button onClick={() => navigate(`/vokabel/${row.id}`)}><i class="bi bi-pencil"></i></button></td>
                                <td><button onClick={() => deleteVokabel(row.id)}><i class="bi bi-x-square"></i></button></td>
                            </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}