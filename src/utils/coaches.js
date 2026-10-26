
// Coach codes → class information and generated berth/seat layouts.

const CLASSES = {
  H: { code: '1A', type: 'First AC', berths: 24, layout: 'first-ac' },
  A: { code: '2A', type: 'AC 2-Tier', berths: 48, layout: 'two-tier' },
  B: { code: '3A', type: 'AC 3-Tier', berths: 72, layout: 'three-tier' },
  S: { code: 'SL', type: 'Sleeper', berths: 72, layout: 'three-tier' },
  C: { code: 'CC', type: 'AC Chair Car', berths: 75, layout: 'chair-car' },
  D: { code: '2S', type: 'Second Sitting', berths: 108, layout: 'second-sitting' }
};

const SPECIAL = {
  GEN: { code: 'GN', type: 'General', description: 'Unreserved general compartment. Seats are not numbered.' },
  SLR: { code: 'SLR', type: 'Luggage & Brake Van', description: 'Guard, parcel and luggage van. Not open to passengers.' },
  EOG: { code: 'EOG', type: 'Power & Brake Van', description: 'Generator car that powers the coaches. Not open to passengers.' },
  PC: { code: 'PC', type: 'Pantry Car', description: 'Kitchen car that prepares meals on board. Not open to passengers.' }
};

export function coachInfo(coach) {
  if (SPECIAL[coach]) return { name: coach, layout: null, ...SPECIAL[coach] };

  const prefix = coach.charAt(0);
  const info = CLASSES[prefix];

  if (!info) return { name: coach, code: coach, type: 'Coach', layout: null };

  return { name: coach, ...info };
}

const THREE_TIER = ['LOWER', 'MIDDLE', 'UPPER', 'LOWER', 'MIDDLE', 'UPPER', 'SIDE LOWER', 'SIDE UPPER'];
const TWO_TIER = ['LOWER', 'UPPER', 'LOWER', 'UPPER', 'SIDE LOWER', 'SIDE UPPER'];

export function berthType(classCode, number) {
  if (classCode === 'SL' || classCode === '3A') return THREE_TIER[(number - 1) % 8];
  if (classCode === '2A') return TWO_TIER[(number - 1) % 6];
  if (classCode === '1A') return number % 2 ? 'LOWER' : 'UPPER';
  if (classCode === 'CC') return ['WINDOW', 'MIDDLE', 'AISLE', 'AISLE', 'WINDOW'][(number - 1) % 5];
  if (classCode === '2S') return ['WINDOW', 'MIDDLE', 'AISLE', 'AISLE', 'MIDDLE', 'WINDOW'][(number - 1) % 6];
  return '';
}

function berth(classCode, number) {
  return { number, label: berthType(classCode, number) };
}

/**
 * Rows for the coach diagram. Each row has `main` berths/seats (left of the
 * aisle) and `side` berths/seats (right of the aisle), matching the bay
 * layout of Indian Railways LHB/ICF coaches.
 */
export function coachLayout(info) {
  const rows = [];
  const total = info.berths;
  const code = info.code;

  if (info.layout === 'three-tier') {
    for (let base = 0; base < total; base += 8) {
      rows.push({ main: [1, 2, 3].map(n => berth(code, base + n)), side: [berth(code, base + 7)] });
      rows.push({ main: [4, 5, 6].map(n => berth(code, base + n)), side: [berth(code, base + 8)] });
    }
  } else if (info.layout === 'two-tier') {
    for (let base = 0; base < total; base += 6) {
      rows.push({ main: [1, 2].map(n => berth(code, base + n)), side: [berth(code, base + 5)] });
      rows.push({ main: [3, 4].map(n => berth(code, base + n)), side: [berth(code, base + 6)] });
    }
  } else if (info.layout === 'first-ac') {
    for (let base = 0; base < total; base += 4) {
      rows.push({ main: [1, 2, 3, 4].map(n => berth(code, base + n)), side: [], cabin: String.fromCharCode(65 + base / 4) });
    }
  } else if (info.layout === 'chair-car') {
    for (let base = 0; base < total; base += 5) {
      rows.push({ main: [1, 2, 3].map(n => berth(code, base + n)), side: [4, 5].map(n => berth(code, base + n)) });
    }
  } else if (info.layout === 'second-sitting') {
    for (let base = 0; base < total; base += 6) {
      rows.push({ main: [1, 2, 3].map(n => berth(code, base + n)), side: [4, 5, 6].map(n => berth(code, base + n)) });
    }
  }

  return rows;
}
