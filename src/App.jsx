import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TrainList from './pages/TrainList';
import LiveStatus from './pages/LiveStatus';
import CoachPosition from './pages/CoachPosition';
import PNRStatus from './pages/PNRStatus';
import HelpDesk from './pages/HelpDesk';
import NotFound from './pages/NotFound';
import './styles/global.css';

// Keeps the query string (e.g. ?from=QLN&to=ERS) when redirecting old URLs.
function Redirect({ to }) {
  const { search } = useLocation();
  return <Navigate to={`${to}${search}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/trains" element={<TrainList />} />
          <Route path="/live-status" element={<LiveStatus />} />
          <Route path="/live-status/:trainNumber" element={<LiveStatus />} />
          <Route path="/coach" element={<CoachPosition />} />
          <Route path="/pnr" element={<PNRStatus />} />
          <Route path="/helpdesk" element={<HelpDesk />} />

          {/* Older links from the individual feature branches */}
          <Route path="/train-status" element={<Redirect to="/trains" />} />
          <Route path="/tracking" element={<Redirect to="/live-status" />} />
          <Route path="/stations" element={<Redirect to="/coach" />} />
          <Route path="/pnr-status" element={<Redirect to="/pnr" />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
