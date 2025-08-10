import { useEffect, useRef, useState } from "react";
// import vokabeln from "/woerter.json";

export default function Vokabeln() {
    const [vokabeln, setVokabeln] = useState([]);
    const [columns, setColumns] = useState(["Deutsch", "Englisch"]);

    useEffect(() => {
        fetch('/woerter.json')
        .then (res => res.json())
        .then (json => setVokabeln(json))
        .catch (err => console.error("Fehler beim Laden:", err));
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
        <div className="d-flex flex-column p-4 align-items-center ">
            <h1>Normale Vokabeln</h1>
            <table className="d-table">
                <thead>
                    <tr> <th colSpan={2}><button onClick={() => swapColumns("Deutsch", "Englisch")}><i class="bi bi-arrows"></i></button></th> </tr>
                    <tr> {columns.map(col => <th key={col}><button onClick={handleSort}>{col}</button></th>)} </tr>
                </thead>
                <tbody>
                    {vokabeln.map((row,i) => (
                            <tr key={i}>
                                {columns.map(col => <td key={col}>{row[col]}</td>)}
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {/* <table className="d-table">
                <thead>
                    <th><button onClick={handleSortDeutsch}>Deutsch</button> </th>
                    <th><button onClick={handleSortEnglisch}>Englisch</button></th>
                </thead>
                <tbody>
                    {vokabeln.map(v => (
                        <tr>
                            <td key={v.index}>{v.Deutsch}</td>
                            <td>{v.Englisch}</td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
    )
}