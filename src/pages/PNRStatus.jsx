
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/pnr.css';
import { lookupPNR } from '../utils/pnr';
import { formatDate, formatDuration } from '../utils/trains';

export default function PNRStatus() {
    const [params, setParams] = useSearchParams();
    const pnrParam = params.get('pnr') || '';
    const [pnr, setPnr] = useState(pnrParam);
    const [lookup, setLookup] = useState({ pnr: '', result: null });
    const [error, setError] = useState('');

    const validParam = /^\d{10}$/.test(pnrParam);
    const loading = validParam && lookup.pnr !== pnrParam;
    const result = validParam && lookup.pnr === pnrParam ? lookup.result : null;

    // Run the lookup whenever the PNR in the URL changes (form submit or a
    // link from the home page).
    useEffect(() => {
        if (!validParam) return undefined;

        // Simulate a brief lookup for responsive UX while retaining demo data
        const timer = setTimeout(() => {
            setLookup({ pnr: pnrParam, result: lookupPNR(pnrParam) });
        }, 300);

        return () => clearTimeout(timer);
    }, [pnrParam, validParam]);

    function checkPNR(event) {
        event.preventDefault();
        setError('');

        const trimmedPnr = pnr.trim();

        if (!trimmedPnr) {
            setError('Please enter a 10-digit PNR number.');
            return;
        }

        if (!/^\d{10}$/.test(trimmedPnr)) {
            setError('Please enter a valid 10-digit PNR number.');
            return;
        }

        setParams({ pnr: trimmedPnr });
    }

    return (
        <main className="pnr-page">
            <h1>PNR Status</h1>
            <p>Enter your 10-digit PNR number to view booking and berth details.</p>

            <form className="pnr-form" onSubmit={checkPNR}>
                <label htmlFor="pnr">PNR Number</label>
                <input
                    id="pnr"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter 10-digit PNR"
                    value={pnr}
                    disabled={loading}
                    onChange={(event) => {
                        const cleanVal = event.target.value.replace(/\D/g, '').slice(0, 10);
                        setPnr(cleanVal);
                        if (error) setError('');
                    }}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Checking Status...' : 'Check Status'}
                </button>
                <p className="pnr-hint">Try 1234567890 or 9876543210.</p>
            </form>

            {loading && <p className="pnr-loading">Checking PNR status...</p>}
            {error && <p className="pnr-error" role="alert">{error}</p>}

            {result && (
                <section className="pnr-result">
                    <div className="pnr-result-head">
                        <div>
                            <span className="pnr-label">PNR {result.pnr}</span>
                            <h2>
                                {result.train.number} - {result.train.name}
                            </h2>
                        </div>
                        <span className={`pnr-chart ${result.chartStatus === 'Chart Prepared' ? 'prepared' : ''}`}>
                            {result.chartStatus}
                        </span>
                    </div>

                    <div className="pnr-journey">
                        <div>
                            <strong>{result.fromStop.departure}</strong>
                            <span>{result.fromStop.name} ({result.fromStop.code})</span>
                        </div>
                        <div className="pnr-journey-mid">
                            {formatDuration(result.toStop.arrMin - result.fromStop.depMin)}
                            <span>→</span>
                        </div>
                        <div>
                            <strong>{result.toStop.arrival}</strong>
                            <span>{result.toStop.name} ({result.toStop.code})</span>
                        </div>
                    </div>

                    <div className="pnr-facts">
                        <p><span>Journey Date</span>{formatDate(result.journeyDate)}</p>
                        <p><span>Class</span>{result.classCode}</p>
                        <p><span>Boarding</span>{result.fromStop.code} · PF {result.fromStop.platform}</p>
                        <p><span>Quota</span>General</p>
                    </div>

                    <h3>Passenger Details</h3>

                    {result.passengers.map((passenger, index) => (
                        <article className="pnr-passenger" key={index}>
                            <p className="pnr-passenger-name">{passenger.name}</p>
                            <p>Booking Status: <strong>{passenger.bookingStatus}</strong></p>
                            <p>
                                Current Status:{' '}
                                <strong className={passenger.confirmed ? 'status-cnf' : 'status-wait'}>
                                    {passenger.currentStatus}
                                </strong>
                            </p>
                            {passenger.confirmed && (
                                <p>
                                    Coach {passenger.coach} · Berth {passenger.berth} ({passenger.berthType}){' '}
                                    <Link to={`/coach?train=${result.train.number}&coach=${passenger.coach}&berth=${passenger.berth}`}>
                                        Find my coach →
                                    </Link>
                                </p>
                            )}
                        </article>
                    ))}

                    <p className="pnr-actions">
                        <Link to={`/live-status/${result.train.number}`}>Live running status →</Link>
                    </p>

                    <p className="pnr-demo">
                        These are sample details for frontend demonstration only.
                    </p>
                </section>
            )}
        </main>
    );
}
