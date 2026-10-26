
import { Link } from 'react-router-dom';
import '../styles/help.css';

export default function NotFound() {
  return (
    <main className="help-page not-found">
      <div className="not-found-icon" aria-hidden="true">🚉</div>
      <h1>Page not found</h1>
      <p className="help-intro">This page has left the station. Try one of these instead:</p>
      <p className="not-found-links">
        <Link to="/">Home</Link>
        <Link to="/live-status">Live Status</Link>
        <Link to="/trains">Find Trains</Link>
        <Link to="/pnr">PNR Status</Link>
      </p>
    </main>
  );
}
