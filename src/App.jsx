import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorUI from './components/ErrorUI';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Vokabeln from './components/Vokabeln';
import Login from './components/Login';

// import Idioms from './components/Idioms';

function App() {
    const navigate = useNavigate();
  return (
    <div >
        <ErrorBoundary fallbackRender={ <ErrorUI /> }>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/vokabeln" element={<Vokabeln />} />
                {/* <Route path="/idioms" element={<Idioms />} /> */}
                <Route path="/login" element={<Login onAnmelden={() => navigate("/")}/>} />
            </Routes>
        </ErrorBoundary>
    </div>
  )
}

export default App

