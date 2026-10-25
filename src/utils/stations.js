
export const STATIONS = [
  { code: 'NDLS', name: 'New Delhi' },
  { code: 'HWH', name: 'Howrah Junction' },
  { code: 'BCT', name: 'Mumbai Central' },
  { code: 'MAS', name: 'Chennai Central' },
  { code: 'SDAH', name: 'Sealdah' },
  { code: 'TVC', name: 'Thiruvananthapuram Central' },
  { code: 'SC', name: 'Secunderabad Junction' },
  { code: 'ERS', name: 'Ernakulam Junction' },
  { code: 'KTYM', name: 'Kottayam' },
  { code: 'QLN', name: 'Kollam Junction' },
  { code: 'CLT', name: 'Kozhikode' },
  { code: 'CAN', name: 'Kannur' },
  { code: 'TCR', name: 'Thrissur' },
  { code: 'SRR', name: 'Shoranur Junction' },
  { code: 'KCVL', name: 'Kochuveli' },
  { code: 'ALP', name: 'Alappuzha' },
  { code: 'AWY', name: 'Aluva' },
  { code: 'PGT', name: 'Palakkad Junction' },
  { code: 'CBE', name: 'Coimbatore Junction' },
  { code: 'SBC', name: 'KSR Bengaluru' },
  { code: 'YPR', name: 'Yesvantpur Junction' },
  { code: 'PUNE', name: 'Pune Junction' },
  { code: 'ADI', name: 'Ahmedabad Junction' },
  { code: 'JP', name: 'Jaipur Junction' },
  { code: 'LKO', name: 'Lucknow NR' },
  { code: 'CNB', name: 'Kanpur Central' },
  { code: 'BSB', name: 'Varanasi Junction' },
  { code: 'GKP', name: 'Gorakhpur Junction' },
  { code: 'PNBE', name: 'Patna Junction' },
  { code: 'RNC', name: 'Ranchi Junction' },
  { code: 'BBS', name: 'Bhubaneswar' },
  { code: 'VSKP', name: 'Visakhapatnam' },
  { code: 'Vijayawada', name: 'Vijayawada Junction' },
  { code: 'TPTY', name: 'Tirupati' },
  { code: 'JBP', name: 'Jabalpur' },
  { code: 'BPL', name: 'Bhopal Junction' },
  { code: 'INDB', name: 'Indore Junction' },
  { code: 'NGP', name: 'Nagpur Junction' },
  { code: 'SUR', name: 'Solapur' },
  { code: 'LTT', name: 'Lokmanya Tilak Terminus' }
];

export function findStation(query) {
  if (!query) return null;

  const value = query.trim().toLowerCase();

  return STATIONS.find(
    station =>
      station.code.toLowerCase() === value ||
      station.name.toLowerCase() === value
  ) || null;
}

export function stationLabel(station) {
  if (!station) return '';

  return `${station.name} (${station.code})`;
}

export function resolveStationCode(query) {
  if (!query) return '';

  const value = query.trim();
  const station = findStation(value);

  if (station) return station.code;

  const codeMatch = value.match(/\(([A-Za-z0-9]+)\)$/);

  if (codeMatch) return codeMatch[1].toUpperCase();

  return value.toUpperCase();
}
