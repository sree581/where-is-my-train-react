
import { Link, NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/', label: '🏠 Home', end: true },
  { to: '/trains', label: '🔎 Find Trains' },
  { to: '/live-status', label: '📍 Live Status' },
  { to: '/station', label: '🚉 Live Station' },
  { to: '/coach', label: '🚃 Coach Position' },
  { to: '/pnr', label: '🎫 PNR Status' },
  { to: '/helpdesk', label: '❓ Help' }
]

function Header() {
  return (
    <header className="main-navigation">
      <Link to="/" className="nav-brand">
        🚆 Where Is My Train
      </Link>

      <nav className="nav-links" aria-label="Main">
        {LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => (isActive ? 'nav-active' : '')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Header
