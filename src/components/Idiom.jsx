import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import supabase from "../tools/supabase";

export default function Idiom() {
    const {id, sortierung} = useParams();
    const ref = useRef(null);
    const [idiom, setIdiom] = useState({Deutsch:'', Englisch:''});
    const navigate = useNavigate();

    const ladeVokabel = async () => {
        const  {data, error} = await supabase.from("idioms").select("*").eq("id",id).single();
        if (!error)
            setIdiom(data);
        else
            console.log("Fehler beim Lesen der Vokabel!", error);
    }

    const add = async () => {
        const {data, error} = await supabase
            .from("idioms")
            .insert({Deutsch: idiom.Deutsch, Englisch: idiom.Englisch});

        console.log("data:", data);
        console.log("error:", error);
    }

    const update = async () => {
        await supabase
            .from("idioms")
            .update({Deutsch: idiom.Deutsch, Englisch: idiom.Englisch})
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
        navigate(`/idioms?sortierung=${sortierung}`);
    }

    const cancel = async () => {
        console.log("Canceled");
        navigate(`/idioms?sortierung=${sortierung}`);
    }

    useEffect(() => {
        // beim Bearbeiten!
        if (id != 0) 
            ladeVokabel();
        ref.current.focus();
        const handleKeyDown = (e) => {
            console.log(e.key);
            if (e.key === "Escape") {
                e.preventDefault(); // Prevent default browser behavior
                cancel();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="container border border-secondary d-flex flex-column p-1 align-items-center">
            <form className="w-100 border border-primary" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="Deutsch" className="w-100 bg-secondary p-1">Deutsch: 

                    </label>
                    <input id="Deutsch" value={idiom.Deutsch} 
                        ref = {ref}
                        className="w-100 bg-body p-1"
                        type="text"
                        required
                        placeholder="Deutsch"
                        onChange={(e) => setIdiom({ ...idiom, Deutsch: e.target.value })} 
                    />
                </div>
                <div>
                    <label htmlFor="Englisch" className="w-100 bg-secondary p-1">Englisch: </label>
                    <input id="Englisch" value={idiom.Englisch}
                        className="w-100 bg-body p-1"
                        type="text"
                        required
                        placeholder="Englisch"
                        onChange={(e) => setIdiom({ ...idiom, Englisch: e.target.value })} 
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