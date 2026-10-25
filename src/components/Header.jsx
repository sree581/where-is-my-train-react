
import { Link, NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <span className="brand-icon">🚆</span>
        <span>RailTrack</span>
      </Link>

      <nav className="main-nav">
        <NavLink to="/" end>
          Train Search
        </NavLink>

        <NavLink to="/train-status">
          Train Status
        </NavLink>

        <NavLink to="/stations">
          Stations
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
