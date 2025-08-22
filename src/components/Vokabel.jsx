import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import supabase from "../tools/supabase";

export default function Vokabel() {
    const {id, sortierung} = useParams();
    const ref = useRef(null);
    const [vokabel, setVokabel] = useState({Deutsch:'', Englisch:''});
    const navigate = useNavigate();

    const ladeVokabel = async () => {
        const  {data, error} = await supabase.from("vokabeln").select("*").eq("id",id).single();
        if (!error)
            setVokabel(data);
        else
            console.log("Fehler beim Lesen der Vokabel!", error);
    }

    const add = async () => {
        const {data, error} = await supabase
            .from("vokabeln")
            .insert({Deutsch: vokabel.Deutsch, Englisch: vokabel.Englisch});

        console.log("data:", data);
        console.log("error:", error);
    }

    const update = async () => {
        await supabase
            .from("vokabeln")
            .update({Deutsch: vokabel.Deutsch, Englisch: vokabel.Englisch})
            .eq("id",id);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
                if (id != 0) {
                    update();
                } else {
                    add();
                }
        } catch (err)
        {
            console.log("Fehler!!!", err);
        }
        navigate(`/vokabeln?sortierung=${sortierung}`);
    }

    const cancel = async () => {
        console.log("Canceled");
        navigate(`/vokabeln?sortierung=${sortierung}`);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            cancel();
        }
    }

    useEffect(() => {
        // beim Bearbeiten!
        if (id != 0) 
            ladeVokabel();
        ref.current.focus();
    }, []);

    return (
        <div className="container border border-secondary d-flex flex-column p-1 align-items-center" onKeyDown={handleKeyDown}>
            <form className="w-100 border border-primary" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="Deutsch" className="w-100 bg-secondary p-1">Deutsch: 

                    </label>
                    <input id="Deutsch" value={vokabel.Deutsch} 
                        ref = {ref}
                        className="w-100 bg-body p-1"
                        type="text"
                        required
                        placeholder="Deutsch"
                        onChange={(e) => setVokabel({ ...vokabel, Deutsch: e.target.value })} 
                    />
                </div>
                <div>
                    <label htmlFor="Englisch" className="w-100 bg-secondary p-1">Englisch: </label>
                    <input id="Englisch" value={vokabel.Englisch}
                        className="w-100 bg-body p-1"
                        type="text"
                        required
                        placeholder="Englisch"
                        onChange={(e) => setVokabel({ ...vokabel, Englisch: e.target.value })} 
                    />

                </div>
                <div>
                    <button type="submit" id="speichern">Speichern</button>
                    <button onClick={cancel} id="abbrechen">Abbrechen</button>
                </div>
            </form>
        </div>
    )
}