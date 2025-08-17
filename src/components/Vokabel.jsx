import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import supabase from "../tools/supabase";

export default function Vokabel() {
    const {id} = useParams();
    const [vokabel, setVokabel] = useState({deutsch:'', englisch:''});
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
            .insert({deutsch: vokabel.deutsch, englisch: vokabel.englisch});

        console.log("data:", data);
        console.log("error:", error);
    }

    const update = async () => {
        await supabase
            .from("vokabeln")
            .update({deutsch: vokabel.deutsch, englisch: vokabel.englisch})
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
        navigate("/vokabeln");
    }

    const cancel = async () => {
        console.log("Canceled");
        navigate("/vokabeln");
    }

    useEffect(() => {
        // beim Bearbeiten!
        if (id != 0) 
            ladeVokabel();

    }, []);

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="deutsch">Deutsch</label>
                <input id="deutsch" value={vokabel.deutsch} 
                    type="text"
                    required
                    placeholder="deutsch"
                    onChange={(e) => setVokabel({ ...vokabel, deutsch: e.target.value })} 
                />
            </div>
            <div>
                <label htmlFor="englisch">Englisch</label>
                <input id="englisch" value={vokabel.englisch}
                    type="text"
                    required
                    placeholder="englisch"
                    onChange={(e) => setVokabel({ ...vokabel, englisch: e.target.value })} 
                />

            </div>
            <div>
                <button type="submit">Speichern</button>
                <button onClick={cancel}>Abbrechen</button>               
            </div>
        </form>
    )
}