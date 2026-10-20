
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import {
  STATIONS,
  resolveStationCode
} from '../utils/stations';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const TABS = [
  { id: 'find-trains', label: 'Search Train' },
  { id: 'pnr-status', label: 'PNR Status' },
  { id: 'coach-position', label: 'Coach Position' }
];

function StationInput({ label, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);

  const matches = STATIONS.filter(station => {
    const query = value.trim().toLowerCase();
    return query && (
      station.name.toLowerCase().includes(query) ||
      station.code.toLowerCase().includes(query)
    );
  }).slice(0, 6);

  return (
    <div className="input-group">
      <label>{label}</label>
      <div className="input-wrapper" style={{ position: 'relative' }}>
        <input
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onChange={event => onChange(event.target.value)}
        />
        {focused && matches.length > 0 && (
          <div
            className="autocomplete-dropdown"
            role="listbox"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 20,
              background: '#fff',
              border: '1px solid #dee2e6',
              borderRadius: 8
            }}
          >
            {matches.map(station => (
              <button
                key={station.code}
                type="button"
                role="option"
                onMouseDown={() =>
                  onChange(`${station.name} (${station.code})`)
                }
                style={{
                  display: 'block',
                  width: '100%',
                  padding: 12,
                  textAlign: 'left',
                  background: '#fff'
                }}
              >
                {station.name} ({station.code})
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('find-trains');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [pnr, setPnr] = useState('');
  const [train, setTrain] = useState('');
  const [message, setMessage] = useState('');
  const [pnrResult, setPnrResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function changeTab(tab) {
    setActiveTab(tab);
    setMessage('');
    setPnrResult(null);
    window.history.replaceState(null, '', `#${tab}`);
  }

  function searchTrains() {
    const fromCode = resolveStationCode(from);
    const toCode = resolveStationCode(to);

    if (!fromCode || !toCode) {
      setMessage('Enter valid departure and destination station names or codes.');
      return;
    }

    if (fromCode === toCode) {
      setMessage('Please select two different stations.');
      return;
    }

    navigate(
      `/train-status?from=${encodeURIComponent(fromCode)}&to=${encodeURIComponent(toCode)}`
    );
  }

  function swapStations() {
    setFrom(to);
    setTo(from);
  }

  async function searchPNR() {
    const value = pnr.trim();

    if (!/^\d{10}$/.test(value)) {
      setMessage('Enter a valid 10-digit PNR number.');
      return;
    }

    setLoading(true);
    setMessage('');
    setPnrResult(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/pnr/${encodeURIComponent(value)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to retrieve PNR status.');
      }

      setPnrResult(data);
    } catch (error) {
      setMessage(error.message || 'Unable to connect to the backend.');
    } finally {
      setLoading(false);
    }
  }

  function searchCoach() {
    const value = train.trim();

    if (/^\d{5}$/.test(value)) {
      navigate(`/stations?train=${encodeURIComponent(value)}`);
      return;
    }

    setMessage(
      'Enter a valid 5-digit train number. Train-name lookup can be connected next.'
    );
  }

  return (
    <>
      <header className="app-header">
        <h1>🚆 Where Is My Train</h1>
        <div className="header-actions" style={{ marginLeft: 'auto' }}>
          <button
            className="header-icon-btn"
            title="Help Desk"
            aria-label="Help Desk"
            onClick={() => navigate('/helpdesk')}
            style={{ color: '#fff' }}
          >
            ?
          </button>
        </div>
      </header>

      <section className="search-section" id="search-section">
        <div className="search-tabs" role="tablist">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`search-tab ${
                activeTab === tab.id ? 'active' : ''
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => changeTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'find-trains' && (
          <div className="search-form active">
            <div className="station-inputs">
              <StationInput
                label="From"
                value={from}
                onChange={setFrom}
                placeholder="Station name or code (e.g. QLN)"
              />

              <button
                className="swap-btn"
                onClick={swapStations}
                aria-label="Swap stations"
                title="Swap stations"
              >
                ⇅
              </button>

              <StationInput
                label="To"
                value={to}
                onChange={setTo}
                placeholder="Station name or code (e.g. ERS)"
              />

              <button className="search-btn" onClick={searchTrains}>
                Search
              </button>
            </div>

            <p style={{ textAlign: 'center', marginTop: 12 }}>
              Know your train number?{' '}
              <button
                onClick={() => navigate('/train-status')}
                style={{ color: '#1a73e8', fontWeight: 600 }}
              >
                Track live status
              </button>
            </p>
          </div>
        )}

        {activeTab === 'pnr-status' && (
          <div className="search-form active">
            <div className="pnr-input-row">
              <div className="input-group">
                <label>PNR Number</label>
                <div className="input-wrapper">
                  <input
                    value={pnr}
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="Enter 10-digit PNR number"
                    onChange={event =>
                      setPnr(event.target.value.replace(/\D/g, ''))
                    }
                  />
                </div>
              </div>

              <button
                className="search-btn"
                onClick={searchPNR}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {pnrResult && (
              <pre style={{ marginTop: 16, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(pnrResult, null, 2)}
              </pre>
            )}
          </div>
        )}

        {activeTab === 'coach-position' && (
          <div className="search-form active">
            <div className="pnr-input-row">
              <div className="input-group">
                <label>Train Number or Train Name</label>
                <div className="input-wrapper">
                  <input
                    value={train}
                    placeholder="Eg: 12625 or Kerala Express"
                    onChange={event => setTrain(event.target.value)}
                  />
                </div>
              </div>

              <button className="search-btn" onClick={searchCoach}>
                View Coach &amp; Seat Layout
              </button>
            </div>
          </div>
        )}

        {message && (
          <p role="alert" style={{ color: '#c62828', marginTop: 12 }}>
            {message}
          </p>
        )}
      </section>

      <main className="page-content">
        <article className="how-section" id="how-it-works">
          <div className="section-header">
            <div className="section-icon blue">i</div>
            <h2>
              How Where Is My Train Works – Your Complete Railway Companion
            </h2>
          </div>
          <p>
            Where is My Train is an online tool that lets you track your live
            train status without any complex process. This tracker shows you
            train locations, expected delays, and platform information in one
            place.
          </p>
          <p>
            Ever asked yourself, <strong>Where is my train right now?</strong>{' '}
            Our project aims to make railway information easier to access.
          </p>
        </article>

        <section className="benefits-section" id="benefits">
          <div className="section-header">
            <div className="section-icon blue">♥</div>
            <h2>Why Passengers Love Train Status?</h2>
          </div>

          <div className="benefits-grid">
            {[
              ['Saves Time', 'Avoid unnecessary waiting at platforms.'],
              ['Reduces Anxiety', 'Stay updated and travel with peace of mind.'],
              ['Better Planning', 'Plan your journey with available train data.'],
              ['Everyone Can Use', 'Useful for commuters, tourists, and families.']
            ].map(([title, description]) => (
              <article className="benefit-card" key={title}>
                <div className="benefit-icon">✓</div>
                <h4>{title}</h4>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="impact-section" id="impact">
          <div className="section-header">
            <div className="section-icon green">✓</div>
            <h2>The Bigger Impact</h2>
          </div>

          <div className="impact-grid">
            {[
              ['Less Crowd at Stations', 'Passengers reach only when needed.'],
              ['Better Punctuality Awareness', 'Helps passengers adjust their plans.'],
              ['Digital Inclusion', 'Helps people in smaller towns too.'],
              ['Smarter Rail Travel', 'Supports a better travel ecosystem.']
            ].map(([title, description]) => (
              <div className="impact-card" key={title}>
                <div className="impact-icon">✓</div>
                <div className="impact-text">
                  <h4>{title}</h4>
                  <p>{description}</p>
                </div>
                <span className="impact-arrow">›</span>
              </div>
            ))}
          </div>
        </section>

        <section className="smart-banner" id="smart-banner">
          <div className="section-icon">🚆</div>
          <div>
            <h3>India's Journey, Now Smarter</h3>
            <p>
              With tracking tools and accessible railway information, train
              travel can become more transparent and passenger-friendly.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="/" className="logo">🚆 Where Is My Train</a>
              <p>
                Track your train and access railway information through our
                project.
              </p>
            </div>

            <div className="footer-col">
              <h4>Features</h4>
              <ul>
                <li><a href="/train-status">Live Train Status</a></li>
                <li><a href="/#pnr-status">PNR Status</a></li>
                <li><a href="/stations">Coach Position</a></li>
                <li><a href="/train-status">Trains Between Stations</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="/helpdesk">Help Desk</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#site-footer">Privacy Policy</a></li>
                <li><a href="#site-footer">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Where Is My Train. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
