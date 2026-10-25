
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/coach.css';

const TRAIN_DATA = {
  '16301': {
    name: 'Venad Express',
    coaches: [
      { number: 'GEN', type: 'General' },
      { number: 'GEN', type: 'General' },
      { number: 'A1', type: 'AC 2-Tier' },
      { number: 'B1', type: 'AC 3-Tier' },
      { number: 'B2', type: 'AC 3-Tier' },
      { number: 'B3', type: 'AC 3-Tier' },
      { number: 'B4', type: 'AC 3-Tier' },
      { number: 'B5', type: 'AC 3-Tier' },
      { number: 'B6', type: 'AC 3-Tier' },
      { number: 'S1', type: 'Sleeper' },
      { number: 'S2', type: 'Sleeper' },
      { number: 'S3', type: 'Sleeper' },
      { number: 'GEN', type: 'General' },
    ],
  },
  '16603': {
    name: 'Maveli Express',
    coaches: [
      { number: 'GEN', type: 'General' },
      { number: 'A1', type: 'AC 2-Tier' },
      { number: 'B1', type: 'AC 3-Tier' },
      { number: 'B2', type: 'AC 3-Tier' },
      { number: 'S1', type: 'Sleeper' },
      { number: 'S2', type: 'Sleeper' },
      { number: 'S3', type: 'Sleeper' },
      { number: 'GEN', type: 'General' },
    ],
  },
};

const DEFAULT_TRAIN = {
  name: 'Demo Express',
  coaches: [
    { number: 'GEN', type: 'General' },
    { number: 'A1', type: 'AC 2-Tier' },
    { number: 'B1', type: 'AC 3-Tier' },
    { number: 'S1', type: 'Sleeper' },
    { number: 'GEN', type: 'General' },
  ],
};

const LAYOUTS = {
  'AC 3-Tier': [
    [
      { number: 1, label: 'LOWER' },
      { number: 2, label: 'MIDDLE' },
      { number: 3, label: 'UPPER' },
      { number: 7, label: 'S.LOWER', side: true },
    ],
    [
      { number: 4, label: 'LOWER' },
      { number: 5, label: 'MIDDLE' },
      { number: 6, label: 'UPPER' },
      { number: 8, label: 'S.UPPER', side: true },
    ],
    [
      { number: 9, label: 'LOWER' },
      { number: 10, label: 'MIDDLE' },
      { number: 11, label: 'UPPER' },
      { number: 15, label: 'S.LOWER', side: true },
    ],
    [
      { number: 12, label: 'LOWER' },
      { number: 13, label: 'MIDDLE' },
      { number: 14, label: 'UPPER' },
      { number: 16, label: 'S.UPPER', side: true },
    ],
  ],
  'AC 2-Tier': [
    [
      { number: 1, label: 'LOWER' },
      { number: 2, label: 'UPPER' },
      { number: 5, label: 'S.LOWER', side: true },
    ],
    [
      { number: 3, label: 'LOWER' },
      { number: 4, label: 'UPPER' },
      { number: 6, label: 'S.UPPER', side: true },
    ],
    [
      { number: 7, label: 'LOWER' },
      { number: 8, label: 'UPPER' },
      { number: 9, label: 'S.LOWER', side: true },
    ],
    [
      { number: 10, label: 'LOWER' },
      { number: 11, label: 'UPPER' },
      { number: 12, label: 'S.UPPER', side: true },
    ],
  ],
  Sleeper: [
    [
      { number: 1, label: 'LOWER' },
      { number: 2, label: 'MIDDLE' },
      { number: 3, label: 'UPPER' },
      { number: 7, label: 'S.LOWER', side: true },
    ],
    [
      { number: 4, label: 'LOWER' },
      { number: 5, label: 'MIDDLE' },
      { number: 6, label: 'UPPER' },
      { number: 8, label: 'S.UPPER', side: true },
    ],
    [
      { number: 9, label: 'LOWER' },
      { number: 10, label: 'MIDDLE' },
      { number: 11, label: 'UPPER' },
      { number: 15, label: 'S.LOWER', side: true },
    ],
    [
      { number: 12, label: 'LOWER' },
      { number: 13, label: 'MIDDLE' },
      { number: 14, label: 'UPPER' },
      { number: 16, label: 'S.UPPER', side: true },
    ],
  ],
};

export default function StationInfo() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const initialTrainNumber = params.get('train') || '16301';
  const [trainInput, setTrainInput] = useState(initialTrainNumber);
  const [trainNumber, setTrainNumber] = useState(initialTrainNumber);
  const [selectedIndex, setSelectedIndex] = useState(3);

  const train = TRAIN_DATA[trainNumber] || DEFAULT_TRAIN;
  const safeIndex = Math.min(selectedIndex, train.coaches.length - 1);
  const selectedCoach = train.coaches[safeIndex];
  const layout = LAYOUTS[selectedCoach.type];

  function showTrain() {
    const nextNumber = trainInput.trim();
    if (!nextNumber) return;

    setTrainNumber(nextNumber);
    setSelectedIndex(0);
  }

  return (
    <main className="coach-page">
      
<header className="coach-header">
  <button
    className="back-button"
    onClick={() => navigate('/')}
    aria-label="Back to home"
  >
    ←
  </button>

  <div className="selected-heading">
    <h1>
      {selectedCoach.number} - {selectedCoach.type}
    </h1>
    <p>
      {trainNumber} - {train.name}
    </p>
  </div>
</header>

        

      <section className="coach-selector" aria-label="Select a coach">
        <div className="engine-icon" aria-hidden="true">🚂</div>

        <div className="coach-scroller">
          {train.coaches.map((coach, index) => (
            <button
              key={`${coach.number}-${index}`}
              className={`coach-option ${
                index === safeIndex ? 'active' : ''
              }`}
              onClick={() => setSelectedIndex(index)}
              aria-pressed={index === safeIndex}

            >
              <span className="coach-option-name">{coach.number}</span>
              <span className="coach-position">{index + 1}</span>
            </button>
          ))}
        </div>
      </section>

      <aside className="coach-warning">
        <strong>⚠️ &nbsp; WARNING!</strong>
        <p>
          Coach position may not be accurate for certain trains.
          Please check it once at the station.
        </p>
      </aside>

      <section className="layout-section">
        <h2>
          {selectedCoach.number} — {selectedCoach.type} Layout
        </h2>

        {selectedCoach.type === 'General' ? (
          <div className="general-compartment">
            <div className="general-icon">🚃</div>
            <h3>General Compartment</h3>
            <p>
              This demo does not show individual seats for general coaches.
            </p>
          </div>
        ) : (
          <div className="coach-interior">
            <div className="coach-door"></div>

            <div className="berth-layout">
              {layout.map((row, rowIndex) => (
                <div className="berth-row" key={rowIndex}>
                  <div className="main-berths">
                    {row
                      .filter((berth) => !berth.side)
                      .map((berth) => (
                        <div className="berth" key={berth.number}>
                          <span className="berth-number">
                            {berth.number}
                          </span>
                          <span className="berth-label">
                            {berth.label}
                          </span>
                        </div>
                      ))}
                  </div>

                  <div className="side-berths">
                    {row
                      .filter((berth) => berth.side)
                      .map((berth) => (
                        <div className="berth side-berth" key={berth.number}>
                          <span className="berth-number">
                            {berth.number}
                          </span>
                          <span className="berth-label">
                            {berth.label}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <p className="demo-note">
        Sample layout for frontend demonstration only.
      </p>
    </main>
  );
}
