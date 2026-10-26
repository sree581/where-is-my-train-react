
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/tracking.css';
import StationInput from '../components/StationInput';
import { findStation, getStation, stationLabel } from '../utils/stations';
import { formatDelay, formatTime, getStationBoard } from '../utils/trains';

const WINDOWS = [2, 4, 8, 12];

export default function LiveStation() {
  const { code } = useParams();
  const navigate = useNavigate();
  const station = getStation(code);

  const [query, setQuery] = useState(stationLabel(station));
  const [hours, setHours] = useState(4);
  const [error, setError] = useState(code && !station ? `Station ${code} was not found.` : '');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30 * 1000);
    return () => clearInterval(timer);
  }, []);

  function handleSearch(event) {
    event.preventDefault();

    const result = findStation(query);

    if (!result) {
      setError('Station not found. Pick a station from the suggestions.');
      return;
    }

    setError('');
    navigate(`/station/${result.code}`);
  }

  const board = station ? getStationBoard(station.code, hours, now) : [];

  return (
    <main className="tracking-page">
      <header className="tracking-header">
        <p className="tracking-eyebrow">STATION INFORMATION</p>
        <h1>Live Station</h1>
        <p>Trains arriving at and departing from a station in the next few hours.</p>
      </header>

      <section className="tracking-search-card">
        <form onSubmit={handleSearch}>
          <div className="tracking-search-row">
            <StationInput id="station" label="Station" value={query} onChange={setQuery} />
            <button type="submit">Show Trains</button>
          </div>
        </form>
      </section>

      {error && <p className="tracking-error" role="alert">{error}</p>}

      {station && (
        <section className="tracking-results">
          <div className="tracking-train-title">
            <div>
              <p className="tracking-eyebrow">LIVE STATION</p>
              <h2>{station.name}</h2>
              <p>
                {station.code} · {station.platforms} platforms · Updated {formatTime(now)}
              </p>
            </div>
          </div>

          <div className="start-day-picker" role="radiogroup" aria-label="Time window">
            <span>Next:</span>
            {WINDOWS.map(item => (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={item === hours}
                className={item === hours ? 'active' : ''}
                onClick={() => setHours(item)}
              >
                {item} hours
              </button>
            ))}
          </div>

          {!board.length && (
            <p className="tracking-hint">
              No trains at {station.name} in the next {hours} hours. Try a longer
              time window.
            </p>
          )}

          <ul className="station-board">
            {board.map(entry => {
              const { train, stop } = entry;
              const departed = entry.label === 'Departed' || entry.label === 'Arrived';

              return (
                <li key={entry.key} className={departed ? 'board-row departed' : 'board-row'}>
                  <div className="board-train">
                    <Link to={`/live-status/${train.number}`}>
                      <strong>{train.number}</strong> {train.name}
                    </Link>
                    <span>
                      {train.stops[0].code} → {train.stops[train.stops.length - 1].code}
                      {entry.isOrigin && ' · Starts here'}
                      {entry.isDestination && ' · Ends here'}
                    </span>
                  </div>

                  <div className="board-times">
                    <span>
                      Arr <strong>{stop.expArr === null ? '--' : formatTime(stop.expArr)}</strong>
                    </span>
                    <span>
                      Dep <strong>{stop.expDep === null ? '--' : formatTime(stop.expDep)}</strong>
                    </span>
                  </div>

                  <div className="board-platform">
                    <span>PF</span>
                    <strong>{stop.platform}</strong>
                  </div>

                  <div className="board-status">
                    <strong>{entry.label}</strong>
                    <span className={stop.delay ? 'late' : 'on-time'}>{formatDelay(stop.delay)}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="tracking-demo-note">
            Note: Timings are simulated from sample timetables and are not live
            railway information.
          </p>
        </section>
      )}
    </main>
  );
}
