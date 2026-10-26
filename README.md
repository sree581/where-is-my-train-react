# Where Is My Train (React)

A React + Vite clone of the *Where Is My Train* app: live running status,
trains between stations, PNR status and coach position.

> Demo project. All timetables, running status, platforms, coach compositions
> and PNR results are generated from sample data in `src/data/trains.js`.
> Nothing is fetched from Indian Railways / NTES.

## Features

| Route | Page | What it does |
| --- | --- | --- |
| `/` | Home | Search tabs for trains, live status, PNR and coach position |
| `/trains?from=QLN&to=ERS&date=YYYY-MM-DD` | Find Trains | Trains between two stations, timings, duration, classes and running days |
| `/live-status/:trainNumber` | Live Status | Station-by-station running status with delay, platform, progress and start-day picker; refreshes every 30 s |
| `/coach?train=12624&coach=B2&berth=12` | Coach Position | Coach order from the engine and full berth/seat maps for 1A, 2A, 3A, SL, CC and 2S |
| `/pnr?pnr=1234567890` | PNR Status | Booking and current status per passenger, with links to coach and live status |
| `/helpdesk` | Help Desk | Helplines and FAQ |

Try PNRs `1234567890` and `9876543210`; any other 10-digit PNR returns a
generated sample booking.

## Project structure

```
src/
  components/   Layout, Header, Footer and the shared station/train autocomplete
  data/         trains.js - sample timetables and coach compositions
  pages/        one component per route
  styles/       global.css (tokens, nav, footer, inputs) + one file per page
  utils/        stations.js, trains.js (search + live-status simulation),
                coaches.js (berth layouts), pnr.js
```

## Running

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

## Credits

Built by merging the team's feature branches: React foundation & home page,
train tracking (Rashmi), train list (Keerthana), coach position (Sana) and
PNR status (Athira).
