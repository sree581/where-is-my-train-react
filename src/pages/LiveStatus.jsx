
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/tracking.css';
import TrainInput from '../components/TrainInput';
import {
  findTrain,
  formatDelay,
  formatTime,
  getLiveStatus,
  getStartOptions,
  getTrain,
  trainLabel
} from '../utils/trains';

const REFRESH_MS = 30 * 1000;

function useNow() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  return [now, () => setNow(Date.now())];
}

function TimeCell({ scheduled, expected, delay }) {
  if (scheduled === null) return <span className="time-empty">--</span>;

  return (
    <>
      <span className="time-scheduled">{formatTime(scheduled)}</span>
      <span className={delay ? 'time-expected late' : 'time-expected'}>
        {formatTime(expected)}
      </span>
    </>
  );
}

export default function LiveStatus() {
  const { trainNumber } = useParams();
  const navigate = useNavigate();
  const train = getTrain(trainNumber);

  const [query, setQuery] = useState(train ? trainLabel(train) : '');
  const [error, setError] = useState(
    trainNumber && !train ? `Train ${trainNumber} was not found.` : ''
  );
  const [now, refresh] = useNow();
  const [selected, setSelected] = useState({ train: null, offset: null });

  function handleSearch(event) {
    event.preventDefault();

    const result = findTrain(query);

    if (!result) {
      setError('Train not found. Pick a train from the suggestions.');
      return;
    }

    setError('');
    navigate(`/live-status/${result.number}`);
  }

  const startInfo = train ? getStartOptions(train, now) : null;
  // Remember the chosen start day per train; fall back to the running journey.
  const offset =
    train && selected.train === train.number && selected.offset !== null
      ? selected.offset
      : startInfo?.defaultOffset ?? 0;
  const startOption = startInfo?.options.find(option => option.offset === offset);
  const status =
    train && startOption?.runs ? getLiveStatus(train, startOption.date, now) : null;

  return (
    <main className="tracking-page">
      <header className="tracking-header">
        <p className="tracking-eyebrow">TRAIN INFORMATION</p>
        <h1>Live Train Status</h1>
        <p>Spot your train: current location, delay, platform and expected arrival at every station.</p>
      </header>

      <section className="tracking-search-card">
        <form onSubmit={handleSearch}>
          <div className="tracking-search-row">
            <TrainInput id="trainNumber" label="Train Number or Name" value={query} onChange={setQuery} />
            <button type="submit">Track Train</button>
          </div>
        </form>
      </section>

      {error && <p className="tracking-error" role="alert">{error}</p>}

      {train && startInfo && (
        <section className="tracking-results">
          <div className="tracking-train-title">
            <div>
              <p className="tracking-eyebrow">TRAIN DETAILS</p>
              <h2>{train.name}</h2>
              <p>
                Train No: {train.number} · {train.stops[0].name} →{' '}
                {train.stops[train.stops.length - 1].name}
              </p>
            </div>
            {status && (
              <span className={`tracking-status state-${status.state}`}>
                {status.state === 'not-started' && 'Yet to start'}
                {status.state === 'running' && 'Running'}
                {status.state === 'at-station' && 'At station'}
                {status.state === 'completed' && 'Reached destination'}
              </span>
            )}
          </div>

          <div className="start-day-picker" role="radiogroup" aria-label="Journey start date">
            <span>Started on:</span>
            {startInfo.options.map(option => (
              <button
                key={option.offset}
                type="button"
                role="radio"
                aria-checked={option.offset === offset}
                className={option.offset === offset ? 'active' : ''}
                onClick={() => setSelected({ train: train.number, offset: option.offset })}
              >
                {option.label}
              </button>
            ))}
          </div>

          {!status && (
            <p className="tracking-error">
              {train.name} does not run on {startOption.date.toLocaleDateString('en-IN', { weekday: 'long' })}.
              It runs on {train.runsOn.join(', ')}.
            </p>
          )}

          {status && (
            <>
              <div className="live-headline">
                <strong>{status.headline}</strong>
                <span>
                  Updated {formatTime(now)} ·{' '}
                  <button type="button" className="link-button" onClick={refresh}>
                    Refresh
                  </button>
                </span>
              </div>

              <div className="tracking-info-grid">
                <article className="tracking-info-card">
                  <span>{status.state === 'running' ? 'Last Station' : 'Current Location'}</span>
                  <h3>
                    {status.state === 'not-started'
                      ? status.stops[0].name
                      : status.stops[status.currentIndex].name}
                  </h3>
                </article>

                <article className="tracking-info-card">
                  <span>Next Station</span>
                  <h3>{status.state === 'completed' ? '—' : (status.next ?? status.stops[0]).name}</h3>
                </article>

                <article className="tracking-info-card">
                  <span>Expected Arrival</span>
                  <h3>
                    {status.state === 'completed' || !status.next
                      ? '—'
                      : formatTime(status.next.expArr)}
                  </h3>
                </article>

                <article className="tracking-info-card">
                  <span>Delay</span>
                  <h3 className={status.delay ? 'late' : 'on-time'}>{formatDelay(status.delay)}</h3>
                </article>
              </div>

              <div className="tracking-progress-section">
                <div className="tracking-progress-heading">
                  <h3>Journey Progress</h3>
                  <strong>
                    {Math.round(status.currentKm)} / {status.totalKm} km · {status.progress}%
                  </strong>
                </div>
                <div
                  className="tracking-progress-track"
                  role="progressbar"
                  aria-valuenow={status.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label="Journey progress"
                >
                  <div className="tracking-progress-fill" style={{ width: `${status.progress}%` }} />
                </div>
              </div>

              <div className="tracking-route-section">
                <h3>Running Status</h3>

                <div className="timeline-head" aria-hidden="true">
                  <span>Station</span>
                  <span>Arrival</span>
                  <span>Departure</span>
                  <span>Delay</span>
                </div>

                <ol className="timeline">
                  {status.stops.map((stop, index) => {
                    const isRunningAfter =
                      status.state === 'running' && index === status.currentIndex;

                    return (
                      <li key={stop.code} className={`timeline-stop ${stop.status}`}>
                        <div className="timeline-station">
                          <span className="timeline-dot" />
                          <div>
                            <Link to={`/station/${stop.code}`} className="timeline-name">
                              {stop.name}
                            </Link>
                            <span className="timeline-meta">
                              {stop.code} · {stop.km} km · PF {stop.platform} · Day {stop.day}
                            </span>
                          </div>
                        </div>
                        <div className="timeline-time">
                          <TimeCell scheduled={stop.schArr} expected={stop.expArr} delay={stop.delay} />
                        </div>
                        <div className="timeline-time">
                          <TimeCell scheduled={stop.schDep} expected={stop.expDep} delay={stop.delay} />
                        </div>
                        <div className={`timeline-delay ${stop.delay ? 'late' : 'on-time'}`}>
                          {formatDelay(stop.delay)}
                        </div>

                        {isRunningAfter && (
                          <div className="timeline-train" style={{ '--fraction': status.fraction }}>
                            🚆 Running · {Math.round((1 - status.fraction) * ((status.next?.km ?? stop.km) - stop.km))} km to {status.next?.name}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>

              <p className="tracking-links">
                <Link to={`/coach?train=${train.number}`}>View coach position →</Link>
              </p>
            </>
          )}

          <p className="tracking-demo-note">
            Note: Running status is simulated from the sample timetable. It
            refreshes every 30 seconds but does not show the actual live
            location of a train.
          </p>
        </section>
      )}
    </main>
  );
}
