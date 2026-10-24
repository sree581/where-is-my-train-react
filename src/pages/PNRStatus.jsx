
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pnr.css';

const DUMMY_PNR_DATA = {
    '1234567890': {
        trainName: 'Venad Express',
        trainNumber: '16301',
        journeyDate: '25 October 2026',
        from: 'Kollam Junction',
        to: 'Ernakulam Junction',
        passengers: [
            { name: 'Passenger 1', booking: 'CNF', coach: 'S2', seat: '34' },
            { name: 'Passenger 2', booking: 'CNF', coach: 'S2', seat: '35' },
        ],
    },
    '9876543210': {
        trainName: 'Maveli Express',
        trainNumber: '16603',
        journeyDate: '26 October 2026',
        from: 'Kozhikode',
        to: 'Ernakulam Junction',
        passengers: [
            { name: 'Passenger 1', booking: 'RAC', coach: 'S3', seat: '12' },
        ],
    },
};

export default function PNRStatus() {
    const navigate = useNavigate();
    const [pnr, setPnr] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleBack() {
        if (typeof navigate === 'function') {
            navigate('/');
        } else {
            window.location.href = '/';
        }
    }

    function checkPNR(event) {
        event.preventDefault();
        setResult(null);
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

        setLoading(true);

        // Simulate a brief lookup for responsive UX while retaining demo data
        setTimeout(() => {
            const data = DUMMY_PNR_DATA[trimmedPnr];

            if (!data) {
                setError('No demo record found. Try 1234567890 or 9876543210.');
            } else {
                setResult(data);
            }
            setLoading(false);
        }, 300);
    }

    return (
        <main className="pnr-page">
            <button type="button" className="pnr-back" onClick={handleBack}>
                ← Back to Home
            </button>

            <h1>PNR Status</h1>
            <p>Enter your 10-digit PNR number to view sample booking details.</p>

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
            </form>

            {loading && <p className="pnr-loading">Checking PNR status...</p>}
            {error && <p className="pnr-error">{error}</p>}

            {result && (
                <section className="pnr-result">
                    <h2>Booking Details</h2>
                    <p><strong>Train:</strong> {result.trainName || 'N/A'}</p>
                    <p><strong>Train Number:</strong> {result.trainNumber || 'N/A'}</p>
                    <p><strong>Journey Date:</strong> {result.journeyDate || 'N/A'}</p>
                    <p><strong>From:</strong> {result.from || 'N/A'}</p>
                    <p><strong>To:</strong> {result.to || 'N/A'}</p>

                    <h3>Passenger Details</h3>

                    {Array.isArray(result.passengers) && result.passengers.length > 0 ? (
                        result.passengers.map((passenger, index) => (
                            <article
                                className="pnr-passenger"
                                key={passenger?.seat ? `${passenger.name || 'p'}-${passenger.coach || ''}-${passenger.seat}` : index}
                            >
                                <p>{passenger?.name || `Passenger ${index + 1}`}</p>
                                <p>Booking Status: <strong>{passenger?.booking || 'N/A'}</strong></p>
                                <p>Coach: {passenger?.coach || 'N/A'}</p>
                                <p>Seat: {passenger?.seat || 'N/A'}</p>
                            </article>
                        ))
                    ) : (
                        <p className="pnr-demo">No passenger details available for this record.</p>
                    )}

                    <p className="pnr-demo">
                        These are sample details for frontend demonstration only.
                    </p>
                </section>
            )}
        </main>
    );
}

