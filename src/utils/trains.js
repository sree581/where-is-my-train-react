
import trainData from '../data/trains';
import { getStation, stationName } from './stations';

const MINUTE = 60 * 1000;

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Small deterministic hash + PRNG so the simulated delays and platforms are
// stable for a given train and date instead of changing on every render.
export function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function seededRandom(seed) {
  let state = seed || 1;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function platformFor(code, trainNumber) {
  const platforms = getStation(code)?.platforms || 3;
  return (hashString(`${code}-${trainNumber}`) % platforms) + 1;
}

function buildStops(train) {
  return train.stops.map(([code, arrival, departure, day, km], index) => {
    const dayOffset = (day - 1) * 24 * 60;
    const arrMin = arrival ? toMinutes(arrival) + dayOffset : null;
    let depMin = departure ? toMinutes(departure) + dayOffset : null;

    // Halt that crosses midnight, e.g. arrives 23:58 and departs 00:05.
    if (arrMin !== null && depMin !== null && depMin < arrMin) {
      depMin += 24 * 60;
    }

    return {
      index,
      code,
      name: stationName(code),
      arrival,
      departure,
      day,
      km,
      arrMin,
      depMin,
      platform: platformFor(code, train.number)
    };
  });
}

const TRAINS = trainData.map(train => ({
  ...train,
  stops: buildStops(train)
}));

const TRAINS_BY_NUMBER = new Map(TRAINS.map(train => [train.number, train]));

export function getAllTrains() {
  return TRAINS;
}

export function getTrain(number) {
  return TRAINS_BY_NUMBER.get(String(number || '').trim()) || null;
}

export function trainLabel(train) {
  return train ? `${train.number} - ${train.name}` : '';
}

export function trainRoute(train) {
  const first = train.stops[0];
  const last = train.stops[train.stops.length - 1];
  return { from: first, to: last };
}

// Accepts "16302", "16302 - Venad Express" or a train name.
export function findTrain(query) {
  const value = String(query || '').trim();

  if (!value) return null;

  const numberMatch = value.match(/^(\d{5})/);
  if (numberMatch) return getTrain(numberMatch[1]);

  const name = value.toLowerCase();
  return TRAINS.find(train => train.name.toLowerCase() === name) || null;
}

export function searchTrains(query, limit = 8) {
  const value = String(query || '').trim().toLowerCase();

  if (!value) return [];

  return TRAINS.filter(train =>
    train.number.startsWith(value) ||
    train.name.toLowerCase().includes(value) ||
    trainLabel(train).toLowerCase().includes(value)
  ).slice(0, limit);
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}h ${String(rest).padStart(2, '0')}m`;
}

export function formatTime(timestamp) {
  if (timestamp === null || timestamp === undefined) return '--';

  const date = new Date(timestamp);
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')}`;
}

export function formatDelay(minutes) {
  if (!minutes) return 'On time';
  if (minutes < 60) return `${minutes} min late`;
  return `${formatDuration(minutes)} late`;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function startOfDay(date = new Date()) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

export function addDays(date, days) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

export function runsOnDate(train, date) {
  return train.runsOn.includes(WEEKDAYS[new Date(date).getDay()]);
}

// Coach classes a passenger can book on this train.
export function trainClasses(train) {
  const order = ['1A', '2A', '3A', 'SL', 'CC', '2S'];
  const prefixes = { H: '1A', A: '2A', B: '3A', S: 'SL', C: 'CC', D: '2S' };
  const classes = new Set();

  train.coaches.forEach(coach => {
    const match = coach.match(/^([HABSCD])\d+$/);
    if (match) classes.add(prefixes[match[1]]);
  });

  return order.filter(item => classes.has(item));
}

/**
 * Trains running from one station to another. When a travel date is given,
 * only trains that actually depart the boarding station on that date are kept.
 */
export function findTrainsBetween(fromCode, toCode, travelDate) {
  const results = [];

  TRAINS.forEach(train => {
    const fromStop = train.stops.find(
      stop => stop.code === fromCode && stop.depMin !== null
    );
    if (!fromStop) return;

    const toStop = train.stops.find(
      stop =>
        stop.code === toCode &&
        stop.arrMin !== null &&
        stop.index > fromStop.index
    );
    if (!toStop) return;

    // Days after the origin start that the train leaves the boarding station.
    const dayShift = Math.floor(fromStop.depMin / (24 * 60));
    const runsOn = WEEKDAYS.filter((_, dayIndex) =>
      train.runsOn.includes(WEEKDAYS[(dayIndex - dayShift + 7) % 7])
    );

    if (travelDate) {
      const weekday = WEEKDAYS[new Date(travelDate).getDay()];
      if (!runsOn.includes(weekday)) return;
    }

    results.push({
      train,
      fromStop,
      toStop,
      runsOn,
      duration: toStop.arrMin - fromStop.depMin,
      distance: toStop.km - fromStop.km,
      classes: trainClasses(train),
      arrivalDayOffset:
        Math.floor(toStop.arrMin / (24 * 60)) - dayShift
    });
  });

  return results.sort(
    (a, b) => (a.fromStop.depMin % 1440) - (b.fromStop.depMin % 1440)
  );
}

function delayProfile(train, startDate) {
  const dateKey = startOfDay(startDate).toDateString();
  const random = seededRandom(hashString(`${train.number}-${dateKey}`));
  const count = train.stops.length;
  const startDelay = Math.round(random() * 6);
  const finalDelay = Math.round(random() ** 2 * 75);

  return train.stops.map((_, index) => {
    if (index === 0) return startDelay;

    const trend = startDelay + (finalDelay - startDelay) * (index / (count - 1));
    const jitter = (random() - 0.5) * 8;
    return Math.max(0, Math.round(trend + jitter));
  });
}

/**
 * Simulates the running status of one journey of a train that started from
 * its origin on `startDate`. Returns each stop with scheduled and expected
 * times plus where the train is at `now`.
 */
export function getLiveStatus(train, startDate, now = Date.now()) {
  const start = startOfDay(startDate).getTime();
  const delays = delayProfile(train, startDate);

  const stops = train.stops.map((stop, index) => {
    const delay = delays[index];
    const schArr = stop.arrMin === null ? null : start + stop.arrMin * MINUTE;
    const schDep = stop.depMin === null ? null : start + stop.depMin * MINUTE;
    const expArr = schArr === null ? null : schArr + delay * MINUTE;
    let expDep = schDep === null ? null : schDep + delay * MINUTE;

    if (expArr !== null && expDep !== null && expDep <= expArr) {
      expDep = expArr + MINUTE;
    }

    return { ...stop, delay, schArr, schDep, expArr, expDep };
  });

  const first = stops[0];
  const last = stops[stops.length - 1];
  const totalKm = last.km || 1;

  let state = 'running';
  let currentIndex = 0;
  let fraction = 0;

  if (now < first.expDep) {
    state = 'not-started';
  } else if (now >= last.expArr) {
    state = 'completed';
    currentIndex = stops.length - 1;
  } else {
    for (let index = 0; index < stops.length - 1; index += 1) {
      const stop = stops[index];
      const next = stops[index + 1];

      if (stop.expArr !== null && now >= stop.expArr && now < stop.expDep) {
        state = 'at-station';
        currentIndex = index;
        break;
      }

      if (now >= stop.expDep && now < next.expArr) {
        state = 'running';
        currentIndex = index;
        fraction = (now - stop.expDep) / (next.expArr - stop.expDep);
        break;
      }
    }
  }

  const current = stops[currentIndex];
  const next = stops[currentIndex + 1] || null;
  const currentKm =
    state === 'running' && next
      ? current.km + (next.km - current.km) * fraction
      : state === 'not-started'
        ? 0
        : current.km;

  const stopsWithStatus = stops.map(stop => {
    let status = 'upcoming';

    if (state === 'completed' || stop.index < currentIndex) {
      status = 'passed';
    } else if (stop.index === currentIndex) {
      if (state === 'at-station') status = 'current';
      else if (state === 'running') status = 'passed';
    }

    return { ...stop, status };
  });

  let headline;
  if (state === 'not-started') {
    headline = `Yet to start from ${first.name}. Scheduled departure ${first.departure}`;
  } else if (state === 'completed') {
    headline = `Reached ${last.name} at ${formatTime(last.expArr)} (${formatDelay(last.delay)})`;
  } else if (state === 'at-station') {
    headline = `At ${current.name}, platform ${current.platform}. ${formatDelay(current.delay)}`;
  } else {
    headline = `Departed ${current.name} at ${formatTime(current.expDep)}. ${formatDelay(current.delay)}`;
  }

  return {
    train,
    startDate: new Date(start),
    stops: stopsWithStatus,
    state,
    currentIndex,
    next: state === 'running' ? next : stopsWithStatus[currentIndex + 1] || null,
    fraction,
    currentKm,
    totalKm,
    progress: Math.floor((currentKm / totalKm) * 100),
    delay: state === 'not-started' ? first.delay : current.delay,
    headline
  };
}

// Number of days a journey spans, e.g. 2 for an overnight train.
export function journeyDays(train) {
  const last = train.stops[train.stops.length - 1];
  return Math.floor(last.arrMin / (24 * 60)) + 1;
}

/**
 * Start-date options shown on the live status page ("Today", "Yesterday",
 * ...), and the one that is most likely the journey the user is asking about:
 * the run that is currently on the move, otherwise today's run.
 */
export function getStartOptions(train, now = Date.now()) {
  const today = startOfDay(new Date(now));
  const options = [];

  for (let offset = 0; offset < Math.max(2, journeyDays(train) + 1); offset += 1) {
    const date = addDays(today, -offset);
    options.push({
      offset,
      date,
      runs: runsOnDate(train, date),
      label:
        offset === 0 ? 'Today' : offset === 1 ? 'Yesterday' : formatDate(date)
    });
  }

  const running = options.find(option => {
    if (!option.runs) return false;
    const status = getLiveStatus(train, option.date, now);
    return status.state === 'running' || status.state === 'at-station';
  });

  return {
    options,
    defaultOffset: running ? running.offset : 0
  };
}

/**
 * Live station board: every train arriving at or departing from a station
 * between one hour ago and `hours` from now.
 */
export function getStationBoard(code, hours = 4, now = Date.now()) {
  const today = startOfDay(new Date(now));
  const from = now - 60 * MINUTE;
  const to = now + hours * 60 * MINUTE;
  const entries = [];

  TRAINS.forEach(train => {
    const stop = train.stops.find(item => item.code === code);
    if (!stop) return;

    for (let offset = -1; offset <= journeyDays(train); offset += 1) {
      const startDate = addDays(today, -offset);
      if (!runsOnDate(train, startDate)) continue;

      const status = getLiveStatus(train, startDate, now);
      const live = status.stops[stop.index];
      const time = live.expArr ?? live.expDep;

      if (time < from || time > to) continue;

      let label;
      if (live.expDep !== null && now >= live.expDep) label = 'Departed';
      else if (live.expArr !== null && now >= live.expArr) {
        label = live.expDep === null ? 'Arrived' : 'On platform';
      } else {
        const minutes = Math.max(1, Math.round((time - now) / MINUTE));
        label = minutes < 60 ? `In ${minutes} min` : `In ${formatDuration(minutes)}`;
      }

      entries.push({
        key: `${train.number}-${startDate.toDateString()}`,
        train,
        stop: live,
        status,
        time,
        label,
        isOrigin: stop.index === 0,
        isDestination: stop.index === train.stops.length - 1
      });
    }
  });

  return entries.sort((a, b) => a.time - b.time);
}
