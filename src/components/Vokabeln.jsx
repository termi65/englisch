import { useEffect, useRef, useState } from "react";
// import vokabeln from "/woerter.json";
import supabase from "../tools/supabase";

export default function Vokabeln() {
    const [vokabeln, setVokabeln] = useState([]);
    const [columns, setColumns] = useState(["Deutsch", "Englisch", "Bearbeiten"]);
    const [selected, setSelected] = useState(null);

    const ladeVokabeln = async () => {
        const {daten} = await supabase.from("Vokabeln").select("*");
        setVokabeln(daten);

    }

    useEffect(() => {
        // fetch('/woerter.json')
        // .then (res => res.json())
        // .then (json => setVokabeln(json))
        // .catch (err => console.error("Fehler beim Laden:", err));
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
            nextList.sort((a,b) => a.Englisch.localeCompare(b.Englisch));
            } else {
                nextList.sort((a,b) => a.Deutsch.localeCompare(b.Deutsch));
            }
            richtung.current = 'absteigend';
        } else {
            if (e.target.innerHTML === "Englisch") {
                nextList.sort((a,b) => b.Englisch.localeCompare(a.Englisch));
            } else {
                nextList.sort((a,b) => b.Deutsch.localeCompare(a.Deutsch));
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

    if (vokabeln.length === 0) return (<div>Lade Vokabeln ...</div>);

    return (
        <div className="container border border-secondary d-flex flex-column p-1 align-items-center">
            {!selected && (
                <div className="w-100 border border-secondary">
                    <h1>Normale Vokabeln</h1>
                    <table className="d-table">
                        <thead>
                            <tr> <th colSpan={2}><button onClick={() => swapColumns("Deutsch", "Englisch")}><i class="bi bi-arrows"></i></button></th> </tr>
                            <tr> {columns.map(col => <th key={col}><button onClick={handleSort}>{col}</button></th>)} 
                            </tr>
                        </thead>
                        <tbody>
                            {vokabeln.map((row,i) => (
                                    <tr key={i}>
                                        {columns.map(col => <td key={col}>{row[col]}</td>)}
                                        <td><button onClick={() => setSelected(row)}><i class="bi bi-pencil"></i></button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>)}
            {selected && (
                <form className="container " onSubmit={() => setSelected(null)}>
                    <h3 className="">Vokabel</h3>
                    <div>
                        <label className="d-flex p-2 mb-1 border border-secondary">Deutsch</label>
                        <input className="p-2 w-100" type="text" value={selected.Deutsch} />
                    </div>
                    <div>
                        <label className="d-flex p-2 my-1 border border-secondary">Englisch</label>
                        <input className="p-2 w-100" type="text" value={selected.Englisch} />
                    </div>
                    <p></p>
                    <button>Zurück</button>
                </form>
                )

            }
        </div>
    )
}