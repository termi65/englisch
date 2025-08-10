import { Route, Routes } from 'react-router-dom';
import './App.css';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorUI from './components/ErrorUI';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Vokabeln from './components/Vokabeln';
// import Idioms from './components/Idioms';

function App() {

  return (
    <div >
        <ErrorBoundary fallbackRender={ <ErrorUI /> }>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/vokabeln" element={<Vokabeln />} />
                {/* <Route path="/idioms" element={<Idioms />} /> */}
            </Routes>
        </ErrorBoundary>
    </div>
  )
}

export default App

