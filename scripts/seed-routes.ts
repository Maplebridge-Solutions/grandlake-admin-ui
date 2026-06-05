/**
 * One-time seeder — run with:
 *   npx tsx scripts/seed-routes.ts
 *
 * Creates the 3 real Grandlake Transit routes with stops and weekly schedules.
 */

import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api-dev.grandlakemunicipality.ca/api/v1";
const TOKEN = process.env.SEED_TOKEN; // set this before running: SEED_TOKEN=<your_jwt> npx tsx scripts/seed-routes.ts

if (!TOKEN) {
  console.error("❌  Set SEED_TOKEN=<your jwt token> before running this script.");
  process.exit(1);
}

const client = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
});

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function weekdaySchedule(start: string, end: string) {
  return WEEKDAYS.map((date) => ({ date, startTime: start, endTime: end, is24hoursService: false }));
}

function allDaySchedule(wdStart: string, wdEnd: string, satStart: string, satEnd: string) {
  return [
    ...WEEKDAYS.map((date) => ({ date, startTime: wdStart, endTime: wdEnd, is24hoursService: false })),
    { date: "Saturday", startTime: satStart, endTime: satEnd, is24hoursService: false },
  ];
}

const routes = [
  {
    name: "Minto – Chipman via Gaspereau Forks",
    routeNumber: 1,
    origin: { name: "Minto" },
    destination: { name: "Chipman" },
    stops: [
      { name: "Minto (Convenience Store / Bus Stop)" },
      { name: "Gaspereau Forks (Route 695 & 10 Junction)" },
      { name: "Chipman (Village Centre)" },
    ],
    frequency: 3,
    schedules: allDaySchedule("07:00", "17:10", "09:00", "13:40"),
  },
  {
    name: "Cambridge-Narrows Loop via Coles Island, Jemseg & Sheffield",
    routeNumber: 2,
    origin: { name: "Cambridge-Narrows" },
    destination: { name: "Cambridge-Narrows" },
    stops: [
      { name: "Cambridge-Narrows (Community Centre)" },
      { name: "Coles Island (Route 715 Junction)" },
      { name: "Jemseg (Route 1 & 715 Junction)" },
      { name: "Sheffield (Village Centre)" },
    ],
    frequency: 3,
    schedules: allDaySchedule("08:00", "17:48", "09:30", "14:48"),
  },
  {
    name: "Waterborough – Minto via Canning",
    routeNumber: 3,
    origin: { name: "Waterborough" },
    destination: { name: "Minto" },
    stops: [
      { name: "Waterborough (Route 10 Stop)" },
      { name: "Canning (Community Stop)" },
      { name: "Minto (Convenience Store / Bus Stop)" },
    ],
    frequency: 2,
    schedules: allDaySchedule("08:15", "15:00", "10:00", "10:45"),
  },
];

async function seed() {
  for (const route of routes) {
    try {
      const res = await client.post("routes", route);
      console.log(`✅  Created: ${route.name} (id: ${res.data.data._id})`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(`❌  Failed: ${route.name} —`, err.response?.data?.message ?? err.message);
      } else {
        console.error(`❌  Failed: ${route.name} —`, err);
      }
    }
  }
}

seed();
