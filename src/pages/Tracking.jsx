
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/tracking.css';

const trains = {
  '16301': {
    name: 'Venad Express',
    number: '16301',
    currentStation: 'Kollam Junction',
    nextStation: 'Kayamkulam Junction',
    eta: '25 minutes',
    delay: '5 minutes',
    progress: 45,
    route: ['Thiruvananthapuram', 'Kollam', 'Kayamkulam', 'Alappuzha', 'Ernakulam'],
  },
  '16603': {
    name: 'Maveli Express',
    number: '16603',
    currentStation: 'Kozhikode',
    nextStation: 'Kannur',
    eta: '40 minutes',
    delay: 'On time',
    progress: 60,
    route: ['Mangaluru', 'Kasaragod', 'Kannur', 'Kozhikode', 'Ernakulam'],
  },
};

export default function Tracking() {
  const [trainNumber, setTrainNumber] = useState('');
  const [train, setTrain] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();

    const result = trains[trainNumber.trim()];

    if (result) {
      setTrain(result);
      setError('');
    } else {
      setTrain(null);
      setError('Train not found. Please try 16301 or 16603.');
    }
  }

  return (
    <main className="tracking-page">
      <button className="tracking-back" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <header className="tracking-header">
        <p className="tracking-eyebrow">TRAIN INFORMATION</p>
        <h1>Live Train Tracking</h1>
        <p>Check a train's simulated location, next station and journey progress.</p>
      </header>

      <section className="tracking-search-card">
        <form onSubmit={handleSearch}>
          <label htmlFor="trainNumber">Train Number</label>
          <div className="tracking-search-row">
            <input
              id="trainNumber"
              type="text"
              value={trainNumber}
              onChange={(event) => setTrainNumber(event.target.value)}
              placeholder="Enter 16301 or 16603"
              required
            />
            <button type="submit">Track Train</button>
          </div>
        </form>

        <p className="tracking-hint">
          Demo data is provided for trains 16301 and 16603.
        </p>
      </section>

      {error && <p className="tracking-error" role="alert">{error}</p>}

      {train && (
        <section className="tracking-results">
          <div className="tracking-train-title">
            <div>
              <p className="tracking-eyebrow">TRAIN DETAILS</p>
              <h2>{train.name}</h2>
              <p>Train No: {train.number}</p>
            </div>
            <span className="tracking-status">Journey in progress</span>
          </div>

          <div className="tracking-info-grid">
            <article className="tracking-info-card">
              <span>Current Location</span>
              <h3>{train.currentStation}</h3>
            </article>

            <article className="tracking-info-card">
              <span>Next Station</span>
              <h3>{train.nextStation}</h3>
            </article>

            <article className="tracking-info-card">
              <span>Estimated Arrival</span>
              <h3>{train.eta}</h3>
            </article>

            <article className="tracking-info-card">
              <span>Train Status</span>
              <h3>{train.delay}</h3>
            </article>
          </div>

          <div className="tracking-progress-section">
            <div className="tracking-progress-heading">
              <h3>Journey Progress</h3>
              <strong>{train.progress}%</strong>
            </div>
            <div
              className="tracking-progress-track"
              role="progressbar"
              aria-valuenow={train.progress}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Journey progress"
            >
              <div
                className="tracking-progress-fill"
                style={{ width: `${train.progress}%` }}
              />
            </div>
          </div>

          <div className="tracking-route-section">
            <h3>Route Overview</h3>
            <ol className="tracking-route-list">
              {train.route.map((station, index) => (
                <li
                  key={station}
                  className={index < Math.ceil(train.route.length * train.progress / 100) ? 'completed' : ''}
                >
                  <span className="tracking-route-dot" />
                  <span>{station}</span>
                </li>
              ))}
            </ol>
          </div>

          <p className="tracking-demo-note">
            Note: This page uses sample data for demonstration. It does not show
            the actual live location of a train.
          </p>
        </section>
      )}
    </main>
  );
}
