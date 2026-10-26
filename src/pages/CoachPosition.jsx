import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/coach.css';
import TrainInput from '../components/TrainInput';
import { findTrain, getTrain, trainLabel } from '../utils/trains';
import { coachInfo, coachLayout } from '../utils/coaches';

const DEFAULT_TRAIN = '16302';

// Pick a passenger coach (not the luggage van) to show first.
function firstPassengerCoach(train) {
  const index = train.coaches.findIndex(coach => coachInfo(coach).layout);
  return index === -1 ? 0 : index;
}

export default function CoachPosition() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const train = getTrain(params.get('train')) || getTrain(DEFAULT_TRAIN);
  const requestedCoach = params.get('coach');

  const [trainInput, setTrainInput] = useState(trainLabel(train));
  const [selected, setSelected] = useState({ train: null, index: 0 });
  const [error, setError] = useState('');

  const requestedIndex = requestedCoach ? train.coaches.indexOf(requestedCoach) : -1;
  const selectedIndex =
    selected.train === train.number
      ? selected.index
      : requestedIndex !== -1
        ? requestedIndex
        : firstPassengerCoach(train);
  const selectedCoach = coachInfo(train.coaches[selectedIndex]);
  const layout = coachLayout(selectedCoach);
  const highlightBerth = Number(params.get('berth')) || null;

  function showTrain(event) {
    event.preventDefault();

    const next = findTrain(trainInput);

    if (!next) {
      setError('Train not found. Pick a train from the suggestions.');
      return;
    }

    setError('');
    setParams({ train: next.number });
  }

  const renderBerth = (berth, side) => (
    <div
      className={`berth ${side ? 'side-berth' : ''} ${
        berth.number === highlightBerth ? 'berth-highlight' : ''
      }`}
      key={berth.number}
    >
      <span className="berth-number">{berth.number}</span>
      <span className="berth-label">{berth.label}</span>
    </div>
  );

  return (
    <main className="coach-page">
      <header className="coach-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ←
        </button>

        <div className="selected-heading">
          <h1>
            {selectedCoach.name} - {selectedCoach.type}
          </h1>
          <p>
            {train.number} - {train.name}
          </p>
        </div>

        <form className="train-search-controls" onSubmit={showTrain}>
          <TrainInput id="coach-train" value={trainInput} onChange={setTrainInput} />
          <button type="submit">Show</button>
        </form>
      </header>

      {error && <p className="coach-error" role="alert">{error}</p>}

      <section className="coach-selector" aria-label="Select a coach">
        <div className="engine-icon" aria-hidden="true">🚂</div>

        <div className="coach-scroller">
          {train.coaches.map((coach, index) => (
            <button
              key={`${coach}-${index}`}
              className={`coach-option ${index === selectedIndex ? 'active' : ''}`}
              onClick={() => setSelected({ train: train.number, index })}
              aria-pressed={index === selectedIndex}
            >
              <span className="coach-option-name">{coach}</span>
              <span className="coach-position">{index + 1}</span>
            </button>
          ))}
        </div>
      </section>

      <aside className="coach-warning">
        <strong>⚠️ &nbsp; WARNING!</strong>
        <p>
          Coach position may not be accurate for certain trains.
          Please check it once at the station. Positions are counted from the
          engine; the order reverses if the train changes direction.
        </p>
      </aside>

      <section className="layout-section">
        <h2>
          {selectedCoach.name} — {selectedCoach.type} Layout
          {selectedCoach.berths && ` · ${selectedCoach.berths} ${selectedCoach.code === 'CC' || selectedCoach.code === '2S' ? 'seats' : 'berths'}`}
        </h2>

        {!selectedCoach.layout ? (
          <div className="general-compartment">
            <div className="general-icon">🚃</div>
            <h3>{selectedCoach.type}</h3>
            <p>{selectedCoach.description}</p>
          </div>
        ) : (
          <div className="coach-interior">
            <div className="coach-door"></div>

            <div className="berth-layout">
              {layout.map((row, rowIndex) => (
                <div
                  className={`berth-row ${
                    !row.side.length ? 'cabin-row' : row.side.length > 1 ? 'seat-row' : ''
                  }`}
                  key={rowIndex}
                >
                  <div className="main-berths" style={{ '--cols': row.main.length }}>
                    {row.main.map(berth => renderBerth(berth, false))}
                  </div>

                  {row.side.length > 0 && (
                    <div
                      className={`side-berths ${row.side.length > 1 ? 'seat-group' : ''}`}
                      style={{ '--cols': row.side.length }}
                    >
                      {row.side.map(berth => renderBerth(berth, true))}
                    </div>
                  )}

                  {row.cabin && <span className="cabin-label">Cabin {row.cabin}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <p className="demo-note">
        Sample coach composition for frontend demonstration only.
      </p>
    </main>
  );
}
