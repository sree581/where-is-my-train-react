import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TrainList from './pages/TrainList';
import StationInfo from './pages/StationInfo';
import PNRStatus from './pages/PNRStatus';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/train-status" element={<TrainList />} />
        <Route path="/stations" element={<StationInfo />} />
        <Route path="/coach" element={<StationInfo />} />
        <Route path="/pnr" element={<PNRStatus />} />
      </Routes>
    </BrowserRouter>
  );
}
