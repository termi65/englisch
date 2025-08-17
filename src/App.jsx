import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorUI from './components/ErrorUI';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Vokabeln from './components/Vokabeln';
import Login from './components/Login';
import supabase from './tools/supabase';
import Vokabel from './components/Vokabel';

// import Idioms from './components/Idioms';

function App() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data?.session?.user || null);
            setLoading(false);
        };

        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    },[])

    if (loading) return (<div>Lade Daten...</div>);
 
    return (
        <div >
            <ErrorBoundary fallbackRender={ <ErrorUI /> }>
                <Navbar user={user} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/vokabeln" element={<Vokabeln />} />
                    <Route path="/vokabel/:id" element={<Vokabel />} />
                    {/* <Route path="/idioms" element={<Idioms />} /> */}
                    {!user && <Route path="/login" element={<Login onAnmelden={() => navigate("/")} />} />}
                </Routes>
            </ErrorBoundary>
        </div>
    )
}

export default App

