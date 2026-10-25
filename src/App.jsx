
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import StationInfo from './pages/StationInfo.jsx';
import './App.css';

function Home() {
  return (
    <main style={{
      maxWidth: '700px',
      margin: '60px auto',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1>Where Is My Train</h1>
      <p>Train information demo</p>
      <Link to="/coach?train=16301">
        <button style={{
          background: '#1769e0',
          color: '#fff',
          padding: '12px 20px',
          border: 0,
          borderRadius: '6px',
          cursor: 'pointer',
        }}>
          View Coach Position
        </button>
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coach" element={<StationInfo />} />
      </Routes>
    </BrowserRouter>
  );
}
