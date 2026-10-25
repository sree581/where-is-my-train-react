
import { useSearchParams, useNavigate } from 'react-router-dom';

const DUMMY_TRAINS = [
  {
    number: '16301',
    name: 'Venad Express',
    departure: '05:25 AM',
    arrival: '08:10 AM',
    duration: '2h 45m',
    runningDays: 'Daily',
  },
  {
    number: '16603',
    name: 'Maveli Express',
    departure: '06:15 AM',
    arrival: '09:00 AM',
    duration: '2h 45m',
    runningDays: 'Daily',
  },
  {
    number: '12623',
    name: 'Chennai Mail',
    departure: '07:30 AM',
    arrival: '10:20 AM',
    duration: '2h 50m',
    runningDays: 'Daily',
  },
];

export default function TrainStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const from = searchParams.get('from') || 'QLN';
  const to = searchParams.get('to') || 'ERS';

  return (
    <main className="page-container">
      <button onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <h1>Trains Between Stations</h1>

      <p><strong>From:</strong> {from}</p>
      <p><strong>To:</strong> {to}</p>

      <h2>Available Trains</h2>

      <div className="train-results">
        {DUMMY_TRAINS.map((train) => (
          <article className="train-card" key={train.number}>
            <h3>{train.name}</h3>
            <p>Train Number: {train.number}</p>
            <p>
              <strong>{train.departure}</strong>
              {' → '}
              <strong>{train.arrival}</strong>
            </p>
            <p>Journey Duration: {train.duration}</p>
            <p>Running Days: {train.runningDays}</p>
            <button onClick={() => navigate(`/stations?train=${train.number}`)}>
              View Coach Position
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
