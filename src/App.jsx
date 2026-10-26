import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TrainStatus from './pages/TrainStatus';
import StationInfo from './pages/StationInfo';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/train-status" element={<TrainStatus />} />
        <Route path="/stations" element={<StationInfo />} />
        <Route path="/coach" element={<StationInfo />} />
      </Routes>
    </BrowserRouter>
  );
}
