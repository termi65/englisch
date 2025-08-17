import { useEffect, useRef, useState } from "react";
// import vokabeln from "/woerter.json";
import supabase from "../tools/supabase";

export default function Vokabeln() {
    const [vokabeln, setVokabeln] = useState([]);
    const [columns, setColumns] = useState(["deutsch", "englisch", "Bearbeiten"]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loading, setLoading] = useState(true);

    const ladeVokabeln = async () => {
        setLoading(true);
        const {data, error} = await supabase.from("vokabeln").select("*");
        setVokabeln(data);
        setLoading(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let error;
        if (selectedRow) {
            error = await supabase
            .from("vokabeln")
            .update({ deutsch: selectedRow.deutsch, englisch: selectedRow.englisch })
            .eq("id", selectedRow.id);
            }
        else {
            error = await supabase
            .from("vokablen")
            .insert({ deutsch: selectedRow.deutsch, englisch: selectedRow.englisch  });
        }
        if (!error.error) {
            setSelectedRow(null);
        }
    }

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

    if (loading) return (<div>Lade Vokabeln ...</div>);

    return (
        <div className="container border border-secondary d-flex flex-column p-1 align-items-center">
            <h1>Vokabeln:</h1>
            {!selectedRow && (
                <div className="w-100 border border-secondary">
                    <h2>Liste</h2>
                    <table className="d-table">
                        <thead>
                            <tr> <th colSpan={2}><button onClick={() => swapColumns("Deutsch", "Englisch")}><i class="bi bi-arrows"></i></button></th> </tr>
                            <tr> {columns.map(col => <th key={col}> <button onClick={handleSort}>{col}</button> </th>)} </tr>
                        </thead>
                        <tbody>
                            {vokabeln.map((row,i) => (
                                <tr key={i}>
                                    {columns.map(col => <td key={col}>{row[col]}</td>)}
                                    <td><button onClick={() => setSelectedRow(row)}><i class="bi bi-pencil"></i></button></td>
                                </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>)}
            {selectedRow && (
                <form className="container " onSubmit={handleSubmit}>
                    <h3 className="">Vokabel</h3>
                    <div>
                        <label className="d-flex p-2 mb-1 border border-secondary">Deutsch</label>
                        <input className="p-2 w-100" type="text" value={selectedRow.deutsch} id="deutsch"
                            onChange={(e) => setSelectedRow({ ...selectedRow, deutsch: e.target.value })} />
                    </div>
                    <div>
                        <label className="d-flex p-2 my-1 border border-secondary">Englisch</label>
                        <input className="p-2 w-100" type="text" value={selectedRow.englisch} id="englisch"
                            onChange={(e) => setSelectedRow({ ...selectedRow, englisch: e.target.value })} />
                    </div>
                    <p></p>
                    <button>Speichern</button>
                    <button onClick={() => setSelectedRow(null)}>Abbrechen</button>
                </form>
                )

            }
        </div>
    )
}