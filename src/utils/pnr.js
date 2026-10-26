
import {
  addDays,
  getAllTrains,
  getTrain,
  hashString,
  seededRandom,
  startOfDay,
  trainClasses
} from './trains';
import { berthType, coachInfo } from './coaches';

// Fixed records from the original PNR page, kept so they can be used in demos.
const DEMO_RECORDS = {
  '1234567890': {
    trainNumber: '16302',
    from: 'QLN',
    to: 'ERN',
    classCode: '2S',
    daysAhead: 0,
    passengers: [
      { booking: 'CNF/D2/34', current: 'CNF', coach: 'D2', berth: 34 },
      { booking: 'CNF/D2/35', current: 'CNF', coach: 'D2', berth: 35 }
    ]
  },
  '9876543210': {
    trainNumber: '16603',
    from: 'CLT',
    to: 'ERS',
    classCode: 'SL',
    daysAhead: 1,
    passengers: [
      { booking: 'RAC 14', current: 'RAC', coach: 'S3', berth: 12 }
    ]
  }
};

const CLASS_PREFIX = { '1A': 'H', '2A': 'A', '3A': 'B', SL: 'S', CC: 'C', '2S': 'D' };

function coachesOfClass(train, classCode) {
  return train.coaches.filter(
    coach => coach.startsWith(CLASS_PREFIX[classCode]) && /\d$/.test(coach)
  );
}

function stopsFor(train, from, to) {
  const fromStop = train.stops.find(stop => stop.code === from);
  const toStop = train.stops.find(stop => stop.code === to);
  return { fromStop, toStop };
}

function buildPassenger(passenger, index, classCode) {
  const confirmed = passenger.current === 'CNF';

  return {
    name: `Passenger ${index + 1}`,
    bookingStatus: passenger.booking,
    currentStatus: confirmed
      ? `CNF/${passenger.coach}/${passenger.berth}`
      : passenger.current,
    confirmed,
    coach: passenger.coach,
    berth: passenger.berth,
    berthType: passenger.berth ? berthType(classCode, passenger.berth) : ''
  };
}

function generateRecord(pnr) {
  const random = seededRandom(hashString(pnr));
  const trains = getAllTrains();
  const train = trains[Math.floor(random() * trains.length)];
  const classes = trainClasses(train);
  const classCode = classes[Math.floor(random() * classes.length)];
  const fromIndex = Math.floor(random() * (train.stops.length - 2));
  const toIndex =
    fromIndex + 1 + Math.floor(random() * (train.stops.length - fromIndex - 1));
  const coaches = coachesOfClass(train, classCode);
  const totalBerths = coachInfo(coaches[0]).berths;
  const count = 1 + Math.floor(random() * 4);
  const outcome = random();

  const passengers = Array.from({ length: count }, () => {
    const coach = coaches[Math.floor(random() * coaches.length)];
    const berth = 1 + Math.floor(random() * totalBerths);

    if (outcome < 0.6) {
      return { booking: `CNF/${coach}/${berth}`, current: 'CNF', coach, berth };
    }

    if (outcome < 0.8) {
      const rac = 1 + Math.floor(random() * 30);
      return { booking: `RAC ${rac}`, current: `RAC ${Math.max(1, rac - 5)}`, coach: '', berth: null };
    }

    const wl = 1 + Math.floor(random() * 60);
    return { booking: `GNWL ${wl}`, current: `WL ${Math.max(1, wl - 12)}`, coach: '', berth: null };
  });

  return {
    trainNumber: train.number,
    from: train.stops[fromIndex].code,
    to: train.stops[toIndex].code,
    classCode,
    daysAhead: Math.floor(random() * 30),
    passengers
  };
}

/**
 * Returns booking details for a 10-digit PNR. Demo only: there is no
 * connection to the railway reservation system, so records are generated
 * deterministically from the PNR number.
 */
export function lookupPNR(pnr) {
  const record = DEMO_RECORDS[pnr] || generateRecord(pnr);
  const train = getTrain(record.trainNumber);
  const { fromStop, toStop } = stopsFor(train, record.from, record.to);
  // Travel date at the boarding station.
  const date = addDays(startOfDay(), record.daysAhead);
  const chartPrepared = record.daysAhead === 0;

  return {
    pnr,
    train,
    fromStop,
    toStop,
    classCode: record.classCode,
    journeyDate: date,
    chartStatus: chartPrepared ? 'Chart Prepared' : 'Chart Not Prepared',
    passengers: record.passengers.map((passenger, index) =>
      buildPassenger(passenger, index, record.classCode)
    )
  };
}
