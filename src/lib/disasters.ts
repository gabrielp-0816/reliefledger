export type Disaster = {
  id: string;
  title: string;
  type: "Typhoon" | "Flood" | "Earthquake" | "Wildfire" | "Landslide";
  location: string;
  organizer: string;
  organizerType: "Local Government" | "Verified NGO" | "Community Coalition";
  urgency: "Critical" | "High" | "Ongoing";
  raised: number;
  goal: number;
  donors: number;
  startedDaysAgo: number;
  story: string;
  image: string;
  beneficiaries: number;
  updates: { date: string; title: string; body: string }[];
  timeline: { phase: string; status: "done" | "active" | "upcoming"; spend: number; detail: string }[];
  allocation: { label: string; pct: number }[];
  topDonors: { name: string; amount: number; note?: string; anonymous?: boolean }[];
};

const img = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1600&q=70`;

export const disasters: Disaster[] = [
  {
    id: "typhoon-mira-luzon",
    title: "Typhoon Mira — Northern Luzon Relief",
    type: "Typhoon",
    location: "Cagayan, Philippines",
    organizer: "Cagayan Provincial Disaster Office",
    organizerType: "Local Government",
    urgency: "Critical",
    raised: 184500,
    goal: 350000,
    donors: 2418,
    startedDaysAgo: 3,
    beneficiaries: 12400,
    image: img("photo-1547683905-f686c993aae5"),
    story:
      "Typhoon Mira made landfall on Tuesday with sustained winds of 195 km/h, displacing more than 12,400 families across 14 municipalities. Local evacuation centers are at capacity. Funds will be released in coordinated phases to verified barangay captains and on-site NGOs.",
    updates: [
      { date: "Today", title: "Food packs reached 8 barangays", body: "First convoy of 1,200 family food packs delivered to Sta. Ana and Aparri." },
      { date: "Yesterday", title: "Medical team deployed", body: "Two mobile clinics operating in Lal-lo with tetanus and water-borne disease supplies." },
      { date: "2 days ago", title: "Fund verified & launched", body: "Provincial DRRMO credentials confirmed. Public ledger opened." },
    ],
    timeline: [
      { phase: "Phase 1 — Emergency Food & Water", status: "done", spend: 62000, detail: "1,200 food packs, 18,000 L potable water distributed." },
      { phase: "Phase 2 — Medical & Shelter", status: "active", spend: 48500, detail: "Tarpaulin shelters, medical kits, mobile clinics." },
      { phase: "Phase 3 — Rebuilding Materials", status: "upcoming", spend: 0, detail: "Roofing, tools, and skilled-labor stipends." },
      { phase: "Phase 4 — Livelihood Recovery", status: "upcoming", spend: 0, detail: "Fishing nets, seedlings, micro-grants." },
    ],
    allocation: [
      { label: "Food & Water", pct: 30 },
      { label: "Medical & Shelter", pct: 28 },
      { label: "Rebuilding Materials", pct: 25 },
      { label: "Livelihood Recovery", pct: 12 },
      { label: "Logistics & Audit", pct: 5 },
    ],
    topDonors: [
      { name: "Maria S.", amount: 5000, note: "Stay strong, kababayan." },
      { name: "Anonymous", amount: 3500, anonymous: true },
      { name: "Northwind Logistics", amount: 10000, note: "Trucks available — contact us." },
      { name: "Anonymous", amount: 250, anonymous: true, note: "Praying for everyone." },
    ],
  },
  {
    id: "flood-jakarta-utara",
    title: "Jakarta Utara Flash Flood Response",
    type: "Flood",
    location: "North Jakarta, Indonesia",
    organizer: "Yayasan Bantu Bersama",
    organizerType: "Verified NGO",
    urgency: "High",
    raised: 92300,
    goal: 200000,
    donors: 1104,
    startedDaysAgo: 6,
    beneficiaries: 5800,
    image: img("photo-1547683905-3d3c4e8d4f4a"),
    story:
      "Three days of rainfall overwhelmed the Ciliwung river system. 5,800 residents are sheltering on elevated roads. Funds support clean water, cholera prevention, and school resumption.",
    updates: [
      { date: "Today", title: "Water filters distributed", body: "320 household-scale filters now in Penjaringan." },
      { date: "3 days ago", title: "School-in-a-box kits prepared", body: "60 kits ready once schools reopen." },
    ],
    timeline: [
      { phase: "Phase 1 — Clean Water & Sanitation", status: "active", spend: 41000, detail: "Filters, chlorine tablets, latrines." },
      { phase: "Phase 2 — Children & Schools", status: "upcoming", spend: 0, detail: "School kits, psychosocial support." },
      { phase: "Phase 3 — Home Cleanup", status: "upcoming", spend: 0, detail: "Cleaning supplies, mold remediation." },
    ],
    allocation: [
      { label: "Water & Sanitation", pct: 40 },
      { label: "Children & Schools", pct: 25 },
      { label: "Home Cleanup", pct: 20 },
      { label: "Medical", pct: 10 },
      { label: "Logistics & Audit", pct: 5 },
    ],
    topDonors: [
      { name: "PT. Sinar Cahaya", amount: 7500 },
      { name: "Anonymous", amount: 1200, anonymous: true, note: "Semangat!" },
    ],
  },
  {
    id: "earthquake-anatolia",
    title: "Anatolia 6.4 Earthquake Recovery",
    type: "Earthquake",
    location: "Malatya, Türkiye",
    organizer: "Anadolu Relief Coalition",
    organizerType: "Community Coalition",
    urgency: "Critical",
    raised: 412000,
    goal: 600000,
    donors: 5240,
    startedDaysAgo: 11,
    beneficiaries: 21000,
    image: img("photo-1604881991720-f91add269bed"),
    story:
      "A 6.4 magnitude quake collapsed 380 buildings in three districts. Coalition partners are running 24-hour search, shelter, and warming stations as temperatures drop.",
    updates: [
      { date: "Today", title: "Winter tents installed", body: "240 insulated tents up before nightfall." },
      { date: "4 days ago", title: "Search & rescue concluded", body: "All accounted-for residents reunited. Focus shifts to shelter." },
    ],
    timeline: [
      { phase: "Phase 1 — Search & Rescue", status: "done", spend: 120000, detail: "Equipment, K9 units, fuel." },
      { phase: "Phase 2 — Warming Shelters", status: "active", spend: 180000, detail: "Insulated tents, heaters, blankets." },
      { phase: "Phase 3 — Permanent Rehousing", status: "upcoming", spend: 0, detail: "Modular homes pilot." },
    ],
    allocation: [
      { label: "Shelter & Warmth", pct: 45 },
      { label: "Search & Rescue", pct: 20 },
      { label: "Medical & Trauma Care", pct: 15 },
      { label: "Rehousing", pct: 15 },
      { label: "Logistics & Audit", pct: 5 },
    ],
    topDonors: [
      { name: "Kıvanç A.", amount: 8000, note: "Geçmiş olsun." },
      { name: "Diaspora Fund EU", amount: 25000 },
      { name: "Anonymous", amount: 500, anonymous: true },
    ],
  },
  {
    id: "wildfire-rogue-valley",
    title: "Rogue Valley Wildfire — Family Aid",
    type: "Wildfire",
    location: "Oregon, USA",
    organizer: "Rogue Valley Mutual Aid",
    organizerType: "Verified NGO",
    urgency: "High",
    raised: 67800,
    goal: 150000,
    donors: 812,
    startedDaysAgo: 8,
    beneficiaries: 1900,
    image: img("photo-1602491453631-e2a5ad90a131"),
    story:
      "The Cascade-Siskiyou fire destroyed 210 homes. Funds support displaced families with hotel vouchers, air purifiers, and clothing.",
    updates: [
      { date: "2 days ago", title: "Hotel partnerships secured", body: "Vouchers issued to 84 families." },
    ],
    timeline: [
      { phase: "Phase 1 — Emergency Lodging", status: "active", spend: 52000, detail: "Hotel vouchers, transport." },
      { phase: "Phase 2 — Air Quality & Health", status: "upcoming", spend: 0, detail: "HEPA purifiers, N95 masks." },
      { phase: "Phase 3 — Rebuild Grants", status: "upcoming", spend: 0, detail: "Direct family rebuild grants." },
    ],
    allocation: [
      { label: "Lodging", pct: 40 },
      { label: "Air Quality", pct: 15 },
      { label: "Rebuild Grants", pct: 35 },
      { label: "Mental Health", pct: 5 },
      { label: "Logistics & Audit", pct: 5 },
    ],
    topDonors: [
      { name: "Anonymous", amount: 2500, anonymous: true, note: "We see you." },
      { name: "Cascadia Outdoors Co.", amount: 4000 },
    ],
  },
  {
    id: "landslide-darjeeling",
    title: "Darjeeling Landslide Community Fund",
    type: "Landslide",
    location: "West Bengal, India",
    organizer: "Hill District Council",
    organizerType: "Local Government",
    urgency: "Ongoing",
    raised: 28400,
    goal: 90000,
    donors: 433,
    startedDaysAgo: 14,
    beneficiaries: 1200,
    image: img("photo-1518709268805-4e9042af2176"),
    story:
      "Monsoon-triggered landslides cut off 12 hillside villages. Funds support helicopter resupply, road clearance, and temporary classrooms.",
    updates: [
      { date: "5 days ago", title: "Road clearance underway", body: "Two of five routes reopened." },
    ],
    timeline: [
      { phase: "Phase 1 — Air Resupply", status: "done", spend: 12000, detail: "Helicopter sorties with food/medicine." },
      { phase: "Phase 2 — Road Clearance", status: "active", spend: 9400, detail: "Heavy equipment rental, crew stipends." },
      { phase: "Phase 3 — Temporary Schools", status: "upcoming", spend: 0, detail: "Prefab classrooms for 4 villages." },
    ],
    allocation: [
      { label: "Air Resupply", pct: 20 },
      { label: "Road Clearance", pct: 35 },
      { label: "Temporary Schools", pct: 25 },
      { label: "Medical", pct: 15 },
      { label: "Logistics & Audit", pct: 5 },
    ],
    topDonors: [
      { name: "Anonymous", amount: 800, anonymous: true },
      { name: "Himalayan Trust", amount: 5000 },
    ],
  },
  {
    id: "flood-rhine-valley",
    title: "Rhine Valley Flood — Family Support",
    type: "Flood",
    location: "Rhineland, Germany",
    organizer: "Rhein Hilfe e.V.",
    organizerType: "Verified NGO",
    urgency: "Ongoing",
    raised: 145000,
    goal: 220000,
    donors: 1980,
    startedDaysAgo: 21,
    beneficiaries: 4200,
    image: img("photo-1583077874340-79db6564672e"),
    story:
      "Sustained flooding damaged 1,400 homes along the Rhine. Funds focus on home cleanup, mold remediation, and small-business restart grants.",
    updates: [
      { date: "Today", title: "Cleanup crews active in 6 towns", body: "Volunteer teams supported by stipends." },
    ],
    timeline: [
      { phase: "Phase 1 — Emergency Pumps", status: "done", spend: 35000, detail: "Industrial pumps deployed." },
      { phase: "Phase 2 — Cleanup & Mold", status: "active", spend: 62000, detail: "Crews, protective gear, dehumidifiers." },
      { phase: "Phase 3 — Small Business Restart", status: "upcoming", spend: 0, detail: "Direct grants to 40 shops." },
    ],
    allocation: [
      { label: "Cleanup & Mold", pct: 40 },
      { label: "Business Restart", pct: 30 },
      { label: "Home Repairs", pct: 20 },
      { label: "Health & Safety", pct: 5 },
      { label: "Logistics & Audit", pct: 5 },
    ],
    topDonors: [
      { name: "Müller Bau GmbH", amount: 12000 },
      { name: "Anonymous", amount: 400, anonymous: true, note: "Alles Gute!" },
    ],
  },
];

export const disasterById = (id: string) => disasters.find((d) => d.id === id);
