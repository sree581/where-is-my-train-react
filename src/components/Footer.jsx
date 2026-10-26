
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">🚆 Where Is My Train</Link>
            <p>
              Track your train, check PNR status, find trains between stations
              and see coach positions in one place.
            </p>
          </div>

          <div className="footer-col">
            <h4>Features</h4>
            <ul>
              <li><Link to="/live-status">Live Train Status</Link></li>
              <li><Link to="/pnr">PNR Status</Link></li>
              <li><Link to="/coach">Coach Position</Link></li>
              <li><Link to="/trains">Trains Between Stations</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/helpdesk">Help Desk</Link></li>
              <li><a href="tel:139">Rail Helpline 139</a></li>
              <li><a href="tel:182">RPF Security 182</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>About</h4>
            <ul>
              <li><Link to="/helpdesk#about-data">About the data</Link></li>
              <li><Link to="/helpdesk#faq">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Where Is My Train. All rights reserved.</span>
          <span>Demo project · Sample schedules, not live railway data.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
