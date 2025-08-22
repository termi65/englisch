import { useEffect, useState } from "react";
import supabase from "../tools/supabase";

export default function Home() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data?.user);
        };
        
        checkUser();
        
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => authListener?.subscription.unsubscribe();
    }, []);
    return(
        <div className="d-flex flex-column  align-items-center mt-3">
            <h1><i className="bi bi-file-person"></i> <span className="text-decoration-underline">OGV-DM</span> <i className="bi bi-pencil-square"></i></h1>
            <h2 className="text-center">Willkommen zu Englisch für Fortschrittene</h2>
            <div><p className="text-decoration-underline">{user ? `angemeldet als ${user.identities[0].email}` : 'Gast'}</p></div>
            <section>Mit dieser App kannst du schnell Vokabeln oder Redewendungen lernen oder neue anlegen.</section>
        </div>
    );
}