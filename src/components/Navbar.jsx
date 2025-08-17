import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import supabase from "../tools/supabase";

export default function Navbar({user}) {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
    const closeNav = () => {
        setIsNavCollapsed(true);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) 
            console.error('Fehler beim Abmelden:', error.message);
        //onRefresh();
    }

    

    return (
        <div className="d-flex flex-column p-4 align-items-center bg-dark">
            <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top navbar-on-top">
                <div className="container ">
                    <button className="navbar-toggler" 
                            type="button"
                            data-bs-toggle="collapse" 
                            data-bs-target="#togglerData" 
                            aria-controls="togglerData" 
                            aria-expanded={!isNavCollapsed ? true : false}
                            aria-label="Toggle navigation"
                            onClick={handleNavCollapse}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="togglerData">
                        <ul className="navbar-nav me-auto">
                            <li><p> </p></li>
                            <li className="nav-item" key={1}>
                                <Link to="/" className="px-2 text-info" onClick={closeNav}><i className="bi bi-house-door"></i> Start</Link>
                            </li>
                            <li><p> </p></li>
                            <li className="nav-item" key={2}>
                                <Link to="/vokabeln" className="px-2 text-info" onClick={closeNav}><i className="bi bi-fuel-pump"></i> Vokabeln</Link>
                            </li>
                            {user ? 
                                <li className="nav-item" key={5}>
                                    <Link to="/" className="px-2 text-info" onClick={() => {closeNav(); handleLogout();}}><i className="bi bi-lock"></i>Logout</Link>
                                </li>
                                :
                                <li className="nav-item" key={4}>
                                    <Link to="/login" className="px-2 text-info" onClick={closeNav}><i className="bi bi-unlock"></i>Login</Link>
                                </li> 
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}