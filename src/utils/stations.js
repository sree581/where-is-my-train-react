
// Single station directory for the whole app (station search, trains between
// stations, live status and live station). `platforms` is used to assign
// sample platform numbers.
export const STATIONS = [
  // Kerala and neighbouring routes
  { code: 'TVC', name: 'Thiruvananthapuram Central', platforms: 5 },
  { code: 'KCVL', name: 'Kochuveli', platforms: 5 },
  { code: 'NCJ', name: 'Nagercoil Junction', platforms: 3 },
  { code: 'VAK', name: 'Varkala Sivagiri', platforms: 2 },
  { code: 'QLN', name: 'Kollam Junction', platforms: 6 },
  { code: 'KYJ', name: 'Kayamkulam Junction', platforms: 3 },
  { code: 'MVLK', name: 'Mavelikara', platforms: 2 },
  { code: 'CNGR', name: 'Chengannur', platforms: 3 },
  { code: 'TRVL', name: 'Tiruvalla', platforms: 2 },
  { code: 'CGY', name: 'Changanassery', platforms: 2 },
  { code: 'KTYM', name: 'Kottayam', platforms: 3 },
  { code: 'ALLP', name: 'Alappuzha', platforms: 3 },
  { code: 'CHTS', name: 'Cherthala', platforms: 2 },
  { code: 'ERS', name: 'Ernakulam Junction', platforms: 6 },
  { code: 'ERN', name: 'Ernakulam Town', platforms: 3 },
  { code: 'AWY', name: 'Aluva', platforms: 3 },
  { code: 'AFK', name: 'Angamaly', platforms: 2 },
  { code: 'TCR', name: 'Thrissur', platforms: 3 },
  { code: 'SRR', name: 'Shoranur Junction', platforms: 7 },
  { code: 'PGT', name: 'Palakkad Junction', platforms: 5 },
  { code: 'TIR', name: 'Tirur', platforms: 3 },
  { code: 'CLT', name: 'Kozhikode', platforms: 4 },
  { code: 'BDJ', name: 'Vadakara', platforms: 2 },
  { code: 'TLY', name: 'Thalassery', platforms: 2 },
  { code: 'CAN', name: 'Kannur', platforms: 4 },
  { code: 'PAY', name: 'Payyanur', platforms: 2 },
  { code: 'KZE', name: 'Kanhangad', platforms: 2 },
  { code: 'KGQ', name: 'Kasaragod', platforms: 3 },
  { code: 'MAQ', name: 'Mangaluru Central', platforms: 4 },
  { code: 'CBE', name: 'Coimbatore Junction', platforms: 6 },
  { code: 'TUP', name: 'Tiruppur', platforms: 2 },
  { code: 'ED', name: 'Erode Junction', platforms: 4 },
  { code: 'SA', name: 'Salem Junction', platforms: 5 },
  { code: 'JTJ', name: 'Jolarpettai Junction', platforms: 5 },
  { code: 'KPD', name: 'Katpadi Junction', platforms: 5 },
  { code: 'MAS', name: 'Chennai Central', platforms: 12 },
  { code: 'SBC', name: 'KSR Bengaluru', platforms: 10 },

  // Major stations across India
  { code: 'NDLS', name: 'New Delhi', platforms: 16 },
  { code: 'HWH', name: 'Howrah Junction', platforms: 23 },
  { code: 'BCT', name: 'Mumbai Central', platforms: 9 },
  { code: 'LTT', name: 'Lokmanya Tilak Terminus', platforms: 5 },
  { code: 'SDAH', name: 'Sealdah', platforms: 20 },
  { code: 'SC', name: 'Secunderabad Junction', platforms: 10 },
  { code: 'YPR', name: 'Yesvantpur Junction', platforms: 6 },
  { code: 'PUNE', name: 'Pune Junction', platforms: 6 },
  { code: 'ADI', name: 'Ahmedabad Junction', platforms: 12 },
  { code: 'JP', name: 'Jaipur Junction', platforms: 7 },
  { code: 'LKO', name: 'Lucknow NR', platforms: 9 },
  { code: 'CNB', name: 'Kanpur Central', platforms: 10 },
  { code: 'BSB', name: 'Varanasi Junction', platforms: 9 },
  { code: 'GKP', name: 'Gorakhpur Junction', platforms: 10 },
  { code: 'PNBE', name: 'Patna Junction', platforms: 10 },
  { code: 'RNC', name: 'Ranchi Junction', platforms: 6 },
  { code: 'BBS', name: 'Bhubaneswar', platforms: 6 },
  { code: 'VSKP', name: 'Visakhapatnam', platforms: 8 },
  { code: 'BZA', name: 'Vijayawada Junction', platforms: 10 },
  { code: 'TPTY', name: 'Tirupati', platforms: 6 },
  { code: 'JBP', name: 'Jabalpur', platforms: 6 },
  { code: 'BPL', name: 'Bhopal Junction', platforms: 6 },
  { code: 'INDB', name: 'Indore Junction', platforms: 6 },
  { code: 'NGP', name: 'Nagpur Junction', platforms: 8 },
  { code: 'SUR', name: 'Solapur', platforms: 5 }
];

const STATIONS_BY_CODE = new Map(
  STATIONS.map(station => [station.code, station])
);

export function getStation(code) {
  return STATIONS_BY_CODE.get(String(code || '').toUpperCase()) || null;
}

export function stationName(code) {
  return getStation(code)?.name || code;
}

export function stationLabel(station) {
  if (!station) return '';

  return `${station.name} (${station.code})`;
}

// Matches a station by code, by name, or by the "Name (CODE)" label that the
// autocomplete writes back into the input.
export function findStation(query) {
  if (!query) return null;

  const value = query.trim().toLowerCase();
  const codeMatch = value.match(/\(([a-z0-9]+)\)$/);

  if (codeMatch) return getStation(codeMatch[1]);

  return STATIONS.find(
    station =>
      station.code.toLowerCase() === value ||
      station.name.toLowerCase() === value
  ) || null;
}

export function resolveStationCode(query) {
  return findStation(query)?.code || '';
}

export function searchStations(query, limit = 8) {
  const value = query.trim().toLowerCase();

  if (!value) return [];

  // Exact code matches first, then codes/names starting with the query.
  const score = station => {
    const code = station.code.toLowerCase();
    const name = station.name.toLowerCase();

    if (code === value) return 0;
    if (code.startsWith(value)) return 1;
    if (name.startsWith(value)) return 2;
    return 3;
  };

  return STATIONS.filter(station =>
    station.name.toLowerCase().includes(value) ||
    station.code.toLowerCase().includes(value)
  )
    .sort((a, b) => score(a) - score(b))
    .slice(0, limit);
}
