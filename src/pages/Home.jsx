
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/home.css';
import StationInput from '../components/StationInput';
import TrainInput from '../components/TrainInput';
import { resolveStationCode } from '../utils/stations';
import { findTrain } from '../utils/trains';

const TABS = [
  { id: 'find-trains', label: '🔎 Find Trains' },
  { id: 'live-status', label: '📍 Live Status' },
  { id: 'pnr-status', label: '🎫 PNR Status' },
  { id: 'coach-position', label: '🚃 Coach Position' }
];

const POPULAR_TRAINS = ['16302', '16603', '12624', '12076'];

export default function Home() {
  const navigate = useNavigate();
  const { hash } = useLocation();

  const initialTab = TABS.some(tab => `#${tab.id}` === hash)
    ? hash.slice(1)
    : 'find-trains';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [trainQuery, setTrainQuery] = useState('');
  const [pnr, setPnr] = useState('');
  const [message, setMessage] = useState('');

  function changeTab(tab) {
    setActiveTab(tab);
    setMessage('');
    window.history.replaceState(null, '', `#${tab}`);
  }

  function searchTrains(event) {
    event.preventDefault();

    const fromCode = resolveStationCode(from);
    const toCode = resolveStationCode(to);

    if (!fromCode || !toCode) {
      setMessage('Choose valid departure and destination stations from the suggestions.');
      return;
    }

    if (fromCode === toCode) {
      setMessage('Please select two different stations.');
      return;
    }

    navigate(`/trains?from=${fromCode}&to=${toCode}`);
  }

  function swapStations() {
    setFrom(to);
    setTo(from);
  }

  function searchTrain(event, path) {
    event.preventDefault();

    const train = findTrain(trainQuery);

    if (!train) {
      setMessage('Train not found. Pick a train from the suggestions.');
      return;
    }

    navigate(path(train.number));
  }

  function searchPNR(event) {
    event.preventDefault();

    if (!/^\d{10}$/.test(pnr)) {
      setMessage('Enter a valid 10-digit PNR number.');
      return;
    }

    navigate(`/pnr?pnr=${pnr}`);
  }

  return (
    <>
      <section className="search-section" id="search-section">
        <div className="search-tabs" role="tablist">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`search-tab ${activeTab === tab.id ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => changeTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'find-trains' && (
          <form className="search-form active" onSubmit={searchTrains}>
            <div className="station-inputs">
              <StationInput id="home-from" label="From" value={from} onChange={setFrom} />

              <button
                type="button"
                className="swap-btn"
                onClick={swapStations}
                aria-label="Swap stations"
                title="Swap stations"
              >
                ⇅
              </button>

              <StationInput id="home-to" label="To" value={to} onChange={setTo} />

              <button type="submit" className="search-btn">
                Search
              </button>
            </div>
          </form>
        )}

        {activeTab === 'live-status' && (
          <form
            className="search-form active"
            onSubmit={event => searchTrain(event, number => `/live-status/${number}`)}
          >
            <div className="pnr-input-row">
              <TrainInput id="home-live" label="Train" value={trainQuery} onChange={setTrainQuery} />
              <button type="submit" className="search-btn">
                Track Train
              </button>
            </div>
          </form>
        )}

        {activeTab === 'pnr-status' && (
          <form className="search-form active" onSubmit={searchPNR}>
            <div className="pnr-input-row">
              <div className="input-group">
                <label htmlFor="home-pnr">PNR Number</label>
                <div className="input-wrapper">
                  <input
                    id="home-pnr"
                    value={pnr}
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="Enter 10-digit PNR number"
                    onChange={event => setPnr(event.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <button type="submit" className="search-btn">
                Check PNR
              </button>
            </div>
          </form>
        )}

        {activeTab === 'coach-position' && (
          <form
            className="search-form active"
            onSubmit={event => searchTrain(event, number => `/coach?train=${number}`)}
          >
            <div className="pnr-input-row">
              <TrainInput id="home-coach" label="Train" value={trainQuery} onChange={setTrainQuery} />
              <button type="submit" className="search-btn">
                View Coach &amp; Seat Layout
              </button>
            </div>
          </form>
        )}

        {message && (
          <p className="form-error" role="alert">
            {message}
          </p>
        )}

        <div className="quick-links">
          <span>Popular:</span>
          {POPULAR_TRAINS.map(number => {
            const train = findTrain(number);
            return (
              <Link key={number} to={`/live-status/${number}`} className="chip">
                {number} {train.name}
              </Link>
            );
          })}
        </div>
      </section>

      <main className="page-content">
        <article className="how-section" id="how-it-works">
          <div className="section-header">
            <div className="section-icon blue">i</div>
            <h2>How Where Is My Train Works – Your Complete Railway Companion</h2>
          </div>
          <p>
            Where is My Train is an online tool that lets you track your live
            train status without any complex process. This tracker shows you
            train locations, expected delays, and platform information in one
            place.
          </p>
          <p>
            Ever asked yourself, <strong>Where is my train right now?</strong>{' '}
            Search by train number to see the running status station by
            station, find trains between two stations, look up your PNR and
            find where your coach stops on the platform.
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
    </>
  );
}
