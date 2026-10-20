
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function StationInfo() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const train = searchParams.get('train') || '';

  return (
    <main style={{ maxWidth: 1140, margin: '40px auto', padding: 24 }}>
      <button onClick={() => navigate('/')}>← Back to Home</button>

      <h1 style={{ color: '#2962FF', marginTop: 24 }}>
        Coach Position
      </h1>

      <p>
        Train Number: <strong>{train || 'Not provided'}</strong>
      </p>

      <p style={{ marginTop: 20 }}>
        Coach layout will appear here.
      </p>
    </main>
  );
}
