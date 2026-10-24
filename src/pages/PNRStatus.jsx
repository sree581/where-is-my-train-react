
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

    function checkPNR(event) {
        event.preventDefault();
        setResult(null);
        setError('');

        if (!/^\d{10}$/.test(pnr)) {
            setError('Please enter a valid 10-digit PNR number.');
            return;
        }

        const data = DUMMY_PNR_DATA[pnr];

        if (!data) {
            setError(
                'No demo record found. Try 1234567890 or 9876543210.'
            );
            return;
        }

        setResult(data);
    }

    return (
        <main className="pnr-page">
            <button className="pnr-back" onClick={() => navigate('/')}>
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
                    onChange={(event) => {
                        setPnr(event.target.value.replace(/\D/g, '').slice(0, 10));
                    }}
                />
                <button type="submit">Check Status</button>
            </form>

            {error && <p className="pnr-error">{error}</p>}

            {result && (
                <section className="pnr-result">
                    <h2>Booking Details</h2>
                    <p><strong>Train:</strong> {result.trainName}</p>
                    <p><strong>Train Number:</strong> {result.trainNumber}</p>
                    <p><strong>Journey Date:</strong> {result.journeyDate}</p>
                    <p><strong>From:</strong> {result.from}</p>
                    <p><strong>To:</strong> {result.to}</p>

                    <h3>Passenger Details</h3>

                    {result.passengers.map((passenger, index) => (
                        <article className="pnr-passenger" key={index}>
                            <p>{passenger.name}</p>
                            <p>Booking Status: <strong>{passenger.booking}</strong></p>
                            <p>Coach: {passenger.coach}</p>
                            <p>Seat: {passenger.seat}</p>
                        </article>
                    ))}

                    <p className="pnr-demo">
                        These are sample details for frontend demonstration only.
                    </p>
                </section>
            )}
        </main>
    );
}
