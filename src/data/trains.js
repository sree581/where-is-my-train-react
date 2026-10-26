
// Sample timetables used across the app. Every page (trains between stations,
// live status, live station, coach position and PNR) reads from this list so
// the same train always shows the same route and coaches.
//
// stops: [stationCode, arrival, departure, day, distanceKm]
//   - arrival is null at the origin and departure is null at the destination
//   - day is the journey day (1 = day the train starts from its origin)
//
// coaches: coach order from the engine, using Indian Railways coach codes
//   SLR/EOG luggage & brake van, GEN unreserved, S sleeper, B AC 3-tier,
//   A AC 2-tier, H first AC, C AC chair car, D second sitting, PC pantry car

const DAILY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function range(prefix, count) {
  return Array.from({ length: count }, (_, index) => `${prefix}${index + 1}`);
}

const trains = [
  {
    number: '16302',
    name: 'Venad Express',
    type: 'Express',
    runsOn: DAILY,
    coaches: ['SLR', 'GEN', 'GEN', ...range('D', 10), 'PC', 'C1', 'C2', 'GEN', 'GEN', 'SLR'],
    stops: [
      ['TVC', null, '05:25', 1, 0],
      ['VAK', '06:00', '06:01', 1, 41],
      ['QLN', '06:27', '06:30', 1, 65],
      ['KYJ', '07:00', '07:02', 1, 106],
      ['MVLK', '07:12', '07:13', 1, 116],
      ['CNGR', '07:25', '07:27', 1, 129],
      ['TRVL', '07:37', '07:38', 1, 138],
      ['CGY', '07:48', '07:49', 1, 147],
      ['KTYM', '08:05', '08:08', 1, 160],
      ['ERN', '09:20', '09:25', 1, 225],
      ['AWY', '09:50', '09:52', 1, 247],
      ['AFK', '10:05', '10:06', 1, 257],
      ['TCR', '10:50', '10:53', 1, 301],
      ['SRR', '11:45', null, 1, 334]
    ]
  },
  {
    number: '16301',
    name: 'Venad Express',
    type: 'Express',
    runsOn: DAILY,
    coaches: ['SLR', 'GEN', 'GEN', 'C2', 'C1', 'PC', ...range('D', 10).reverse(), 'GEN', 'GEN', 'SLR'],
    stops: [
      ['SRR', null, '14:25', 1, 0],
      ['TCR', '15:10', '15:13', 1, 33],
      ['AFK', '15:58', '16:00', 1, 77],
      ['AWY', '16:12', '16:14', 1, 87],
      ['ERN', '16:50', '16:55', 1, 109],
      ['KTYM', '18:00', '18:03', 1, 174],
      ['CGY', '18:20', '18:21', 1, 187],
      ['TRVL', '18:31', '18:32', 1, 196],
      ['CNGR', '18:43', '18:45', 1, 205],
      ['MVLK', '18:57', '18:58', 1, 218],
      ['KYJ', '19:10', '19:12', 1, 228],
      ['QLN', '19:50', '19:53', 1, 269],
      ['VAK', '20:18', '20:19', 1, 293],
      ['TVC', '21:15', null, 1, 334]
    ]
  },
  {
    number: '16603',
    name: 'Maveli Express',
    type: 'Express',
    runsOn: DAILY,
    coaches: ['SLR', 'GEN', 'GEN', ...range('S', 9), 'PC', ...range('B', 5), 'A1', 'GEN', 'GEN', 'SLR'],
    stops: [
      ['MAQ', null, '18:15', 1, 0],
      ['KGQ', '18:52', '18:54', 1, 46],
      ['KZE', '19:13', '19:14', 1, 69],
      ['PAY', '19:40', '19:41', 1, 101],
      ['CAN', '20:12', '20:15', 1, 133],
      ['TLY', '20:38', '20:40', 1, 154],
      ['BDJ', '21:04', '21:05', 1, 180],
      ['CLT', '21:50', '21:55', 1, 228],
      ['TIR', '22:40', '22:42', 1, 270],
      ['SRR', '23:35', '23:45', 1, 314],
      ['TCR', '00:25', '00:28', 2, 347],
      ['AWY', '01:25', '01:27', 2, 401],
      ['ERS', '01:55', '02:00', 2, 422],
      ['ALLP', '02:55', '02:58', 2, 479],
      ['KYJ', '03:45', '03:47', 2, 524],
      ['QLN', '04:20', '04:23', 2, 565],
      ['VAK', '04:50', '04:51', 2, 589],
      ['TVC', '05:55', null, 2, 630]
    ]
  },
  {
    number: '16604',
    name: 'Maveli Express',
    type: 'Express',
    runsOn: DAILY,
    coaches: ['SLR', 'GEN', 'GEN', 'A1', ...range('B', 5).reverse(), 'PC', ...range('S', 9).reverse(), 'GEN', 'GEN', 'SLR'],
    stops: [
      ['TVC', null, '19:15', 1, 0],
      ['VAK', '19:58', '19:59', 1, 41],
      ['QLN', '20:25', '20:28', 1, 65],
      ['KYJ', '21:02', '21:04', 1, 106],
      ['ALLP', '21:58', '22:01', 1, 151],
      ['ERS', '23:00', '23:05', 1, 208],
      ['AWY', '23:30', '23:32', 1, 229],
      ['TCR', '00:30', '00:33', 2, 283],
      ['SRR', '01:20', '01:30', 2, 316],
      ['TIR', '02:15', '02:17', 2, 360],
      ['CLT', '03:05', '03:10', 2, 402],
      ['BDJ', '03:50', '03:51', 2, 450],
      ['TLY', '04:15', '04:17', 2, 476],
      ['CAN', '04:45', '04:48', 2, 497],
      ['PAY', '05:15', '05:16', 2, 529],
      ['KZE', '05:42', '05:43', 2, 561],
      ['KGQ', '06:05', '06:07', 2, 584],
      ['MAQ', '07:30', null, 2, 630]
    ]
  },
  {
    number: '12624',
    name: 'Chennai Mail',
    type: 'Superfast',
    runsOn: DAILY,
    coaches: ['SLR', 'GEN', 'GEN', ...range('S', 8), 'PC', ...range('B', 5), 'A1', 'A2', 'H1', 'GEN', 'SLR'],
    stops: [
      ['TVC', null, '15:00', 1, 0],
      ['QLN', '15:55', '15:58', 1, 65],
      ['KYJ', '16:32', '16:34', 1, 106],
      ['CNGR', '16:56', '16:58', 1, 129],
      ['KTYM', '17:35', '17:38', 1, 160],
      ['ERN', '18:45', '18:50', 1, 225],
      ['AWY', '19:12', '19:14', 1, 247],
      ['TCR', '20:05', '20:08', 1, 301],
      ['PGT', '21:30', '21:35', 1, 381],
      ['CBE', '22:35', '22:40', 1, 435],
      ['TUP', '23:28', '23:30', 1, 486],
      ['ED', '00:20', '00:25', 2, 536],
      ['SA', '01:25', '01:28', 2, 596],
      ['JTJ', '03:15', '03:17', 2, 715],
      ['KPD', '04:25', '04:30', 2, 798],
      ['MAS', '06:45', null, 2, 925]
    ]
  },
  {
    number: '12623',
    name: 'Chennai Mail',
    type: 'Superfast',
    runsOn: DAILY,
    coaches: ['SLR', 'GEN', 'H1', 'A2', 'A1', ...range('B', 5).reverse(), 'PC', ...range('S', 8).reverse(), 'GEN', 'GEN', 'SLR'],
    stops: [
      ['MAS', null, '19:45', 1, 0],
      ['KPD', '21:25', '21:30', 1, 127],
      ['JTJ', '22:40', '22:42', 1, 210],
      ['SA', '00:35', '00:40', 2, 329],
      ['ED', '01:40', '01:45', 2, 389],
      ['TUP', '02:30', '02:32', 2, 439],
      ['CBE', '03:25', '03:30', 2, 490],
      ['PGT', '04:40', '04:45', 2, 544],
      ['TCR', '06:05', '06:08', 2, 624],
      ['AWY', '07:00', '07:02', 2, 678],
      ['ERN', '07:35', '07:40', 2, 700],
      ['KTYM', '08:40', '08:43', 2, 765],
      ['CNGR', '09:20', '09:22', 2, 796],
      ['KYJ', '09:45', '09:47', 2, 819],
      ['QLN', '10:30', '10:33', 2, 860],
      ['TVC', '11:55', null, 2, 925]
    ]
  },
  {
    number: '12076',
    name: 'Jan Shatabdi Express',
    type: 'Jan Shatabdi',
    runsOn: DAILY,
    coaches: ['SLR', 'GEN', ...range('D', 12), 'C1', 'C2', 'GEN', 'SLR'],
    stops: [
      ['CLT', null, '13:45', 1, 0],
      ['TIR', '14:22', '14:24', 1, 42],
      ['SRR', '15:05', '15:10', 1, 86],
      ['TCR', '15:42', '15:45', 1, 119],
      ['AFK', '16:22', '16:23', 1, 163],
      ['AWY', '16:35', '16:37', 1, 173],
      ['ERS', '17:15', '17:20', 1, 194],
      ['CHTS', '17:52', '17:53', 1, 225],
      ['ALLP', '18:15', '18:18', 1, 251],
      ['KYJ', '19:00', '19:02', 1, 296],
      ['QLN', '19:35', '19:38', 1, 337],
      ['VAK', '20:02', '20:03', 1, 361],
      ['TVC', '21:30', null, 1, 402]
    ]
  },
  {
    number: '12075',
    name: 'Jan Shatabdi Express',
    type: 'Jan Shatabdi',
    runsOn: DAILY,
    coaches: ['SLR', 'GEN', 'C2', 'C1', ...range('D', 12).reverse(), 'GEN', 'SLR'],
    stops: [
      ['TVC', null, '05:55', 1, 0],
      ['VAK', '06:25', '06:26', 1, 41],
      ['QLN', '06:50', '06:53', 1, 65],
      ['KYJ', '07:25', '07:27', 1, 106],
      ['ALLP', '08:10', '08:13', 1, 151],
      ['CHTS', '08:35', '08:36', 1, 177],
      ['ERS', '09:10', '09:15', 1, 208],
      ['AWY', '09:48', '09:50', 1, 229],
      ['AFK', '10:02', '10:03', 1, 239],
      ['TCR', '10:45', '10:48', 1, 283],
      ['SRR', '11:25', '11:30', 1, 316],
      ['TIR', '12:10', '12:12', 1, 360],
      ['CLT', '13:00', null, 1, 402]
    ]
  },
  {
    number: '16605',
    name: 'Ernad Express',
    type: 'Express',
    runsOn: DAILY,
    coaches: ['SLR', 'GEN', 'GEN', 'GEN', ...range('S', 6), ...range('D', 2), 'GEN', 'GEN', 'SLR'],
    stops: [
      ['MAQ', null, '07:20', 1, 0],
      ['KGQ', '07:58', '08:00', 1, 46],
      ['CAN', '09:05', '09:08', 1, 133],
      ['CLT', '10:45', '10:50', 1, 228],
      ['SRR', '12:40', '12:50', 1, 314],
      ['TCR', '13:30', '13:33', 1, 347],
      ['ERS', '15:05', '15:10', 1, 422],
      ['ALLP', '16:15', '16:18', 1, 479],
      ['KYJ', '17:05', '17:07', 1, 524],
      ['QLN', '17:45', '17:48', 1, 565],
      ['TVC', '19:15', '19:20', 1, 630],
      ['NCJ', '21:00', null, 1, 700]
    ]
  },
  {
    number: '22207',
    name: 'Chennai - Thiruvananthapuram AC Superfast',
    type: 'AC Superfast',
    runsOn: ['Tue', 'Fri'],
    coaches: ['EOG', ...range('B', 10), 'PC', 'A1', 'A2', 'A3', 'H1', 'EOG'],
    stops: [
      ['MAS', null, '19:30', 1, 0],
      ['KPD', '21:05', '21:07', 1, 127],
      ['SA', '00:05', '00:08', 2, 329],
      ['ED', '01:05', '01:08', 2, 389],
      ['CBE', '02:45', '02:48', 2, 490],
      ['PGT', '03:50', '03:55', 2, 544],
      ['TCR', '05:15', '05:18', 2, 624],
      ['ERN', '06:35', '06:40', 2, 700],
      ['KTYM', '07:40', '07:43', 2, 765],
      ['QLN', '09:15', '09:18', 2, 860],
      ['TVC', '10:35', null, 2, 925]
    ]
  },
  {
    number: '12678',
    name: 'Ernakulam - Bengaluru Intercity',
    type: 'Superfast',
    runsOn: DAILY,
    coaches: ['SLR', 'GEN', ...range('D', 8), 'C1', 'C2', 'C3', 'GEN', 'SLR'],
    stops: [
      ['ERS', null, '09:10', 1, 0],
      ['AWY', '09:35', '09:37', 1, 21],
      ['TCR', '10:28', '10:30', 1, 75],
      ['PGT', '11:50', '11:55', 1, 155],
      ['CBE', '13:00', '13:05', 1, 209],
      ['TUP', '13:50', '13:52', 1, 260],
      ['ED', '14:40', '14:45', 1, 310],
      ['SA', '15:40', '15:45', 1, 370],
      ['SBC', '20:00', null, 1, 588]
    ]
  }
];

export default trains;
