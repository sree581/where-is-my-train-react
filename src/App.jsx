import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PNRStatus from './pages/PNRStatus';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PNRStatus />} />
        <Route path="/pnr" element={<PNRStatus />} />
        <Route path="/pnr-status" element={<PNRStatus />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;