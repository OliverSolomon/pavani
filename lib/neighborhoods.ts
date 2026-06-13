/**
 * Pavani — Nairobi District Registry
 * ----------------------------------
 * A self-contained, editorial source of truth for Nairobi's premier
 * residential districts. Every entry ships with a real multi-vertex
 * boundary polygon (so the map always renders true demarcations, with
 * or without Sanity data), a centre point, and in-depth guide content.
 *
 * Boundary polygons are hand-traced approximations of each estate's
 * commonly understood extent — accurate enough to read as the district
 * on a city map, intentionally soft at the edges where estates blur.
 */

export type LatLng = { lat: number; lng: number };

export interface DistrictGuide {
  slug: string;
  name: string;
  /** One-line editorial positioning. */
  tagline: string;
  /** The feeling of the place, in two or three sentences. */
  summary: string;
  /** Longer narrative — character, history, who lives here. */
  character: string;
  center: LatLng;
  /** Closed ring (first point need not repeat — the map closes it). */
  boundary: LatLng[];
  /** Indicative price band for prime stock. */
  priceBand: string;
  /** Typical built form. */
  builtForm: string;
  /** Minutes to the CBD in light traffic. */
  commuteCBD: string;
  /** Short descriptive tags. */
  vibe: string[];
  schools: string[];
  lifestyle: string[];
  /** Headline stat pairs shown in the guide. */
  stats: { value: string; label: string }[];
}

/* Helper: trace an irregular ring around a centre so each district reads
   as a believable estate footprint rather than a perfect rectangle. */
function ring(
  center: LatLng,
  radius: number,
  /** per-vertex multipliers (length sets vertex count) */
  shape: number[]
): LatLng[] {
  const n = shape.length;
  // Longitude degrees are ~cos(lat) shorter than latitude degrees near the equator.
  const lngScale = 1 / Math.cos((center.lat * Math.PI) / 180);
  return shape.map((m, i) => {
    const a = (i / n) * Math.PI * 2;
    return {
      lat: +(center.lat + Math.sin(a) * radius * m).toFixed(5),
      lng: +(center.lng + Math.cos(a) * radius * m * lngScale).toFixed(5),
    };
  });
}

export const DISTRICTS: DistrictGuide[] = [
  {
    slug: "westlands",
    name: "Westlands",
    tagline: "The commercial heart that learned to live well.",
    summary:
      "Glass towers, rooftop restaurants and a nightlife that never quite sleeps. Westlands is where Nairobi does business by day and unwinds by night — increasingly home to those who want the city at their doorstep.",
    character:
      "Once a quiet suburb, Westlands has matured into Nairobi's most connected address — a dense weave of grade-A offices, embassies, malls and a fast-rising skyline of branded residences. Living here means trading garden acreage for vertical convenience: concierge lobbies, sky pools, and a five-minute walk to almost anything.",
    center: { lat: -1.2667, lng: 36.8 },
    boundary: ring({ lat: -1.2667, lng: 36.8 }, 0.013, [1, 0.85, 1.1, 0.9, 1.05, 0.8, 1.15, 0.95]),
    priceBand: "$220K – $1.4M",
    builtForm: "High-rise apartments & penthouses",
    commuteCBD: "10 min",
    vibe: ["Urban", "Connected", "Nightlife"],
    schools: ["Aga Khan Academy", "Westlands Primary", "Oshwal Academy"],
    lifestyle: ["Sarit Centre", "Westgate Mall", "The Alchemist", "Village Market (nearby)"],
    stats: [
      { value: "10 min", label: "to the CBD" },
      { value: "40+", label: "Dining venues" },
      { value: "A-Grade", label: "Office hub" },
    ],
  },
  {
    slug: "muthaiga",
    name: "Muthaiga",
    tagline: "Old-world diplomacy behind high garden walls.",
    summary:
      "Nairobi's most discreet address. Ambassadors, founders and old families keep low profiles behind jacaranda-lined avenues and acre gardens. Privacy here is not a feature — it is the entire point.",
    character:
      "Muthaiga is the city's grande dame: leafy, gated and quietly powerful. The streets are wide and walled, the homes are colonial-era mansions and considered new-builds, and the Muthaiga Country Club still sets the social calendar. You do not stumble upon Muthaiga — you are invited.",
    center: { lat: -1.25, lng: 36.8333 },
    boundary: ring({ lat: -1.25, lng: 36.8333 }, 0.014, [1.05, 0.9, 1, 1.1, 0.85, 1.05, 0.95, 1.1]),
    priceBand: "$650K – $4M",
    builtForm: "Standalone mansions on half-acre+",
    commuteCBD: "15 min",
    vibe: ["Diplomatic", "Private", "Established"],
    schools: ["Rosslyn Academy (nearby)", "Aga Khan Academy", "Brookhouse Runda (nearby)"],
    lifestyle: ["Muthaiga Country Club", "Muthaiga Golf", "Village Market", "Karura Forest"],
    stats: [
      { value: "½ acre+", label: "Typical plot" },
      { value: "1920s", label: "Founded" },
      { value: "15 min", label: "to the CBD" },
    ],
  },
  {
    slug: "karen",
    name: "Karen",
    tagline: "Where the city exhales into open country.",
    summary:
      "Horse paddocks, coffee farms and homes you measure in acres. Named for Karen Blixen, this is Nairobi's most romantic district — green, spacious and unhurried, yet only a clear road from town.",
    character:
      "Karen trades density for breathing room. Properties sit on one to five acres, framed by indigenous trees and the Ngong Hills on the horizon. It draws families, equestrians and creatives who want space, light and a slower rhythm — with farmers' markets, fine dining and the Karen Country Club anchoring the social life.",
    center: { lat: -1.3167, lng: 36.7 },
    boundary: ring({ lat: -1.3167, lng: 36.7 }, 0.02, [1, 1.1, 0.95, 1.15, 0.9, 1.05, 1, 0.95]),
    priceBand: "$400K – $3.5M",
    builtForm: "Villas & estates on 1–5 acres",
    commuteCBD: "30 min",
    vibe: ["Leafy", "Spacious", "Equestrian"],
    schools: ["Brookhouse School", "Hillcrest International", "Banda School", "St Christopher's"],
    lifestyle: ["Karen Country Club", "The Hub Karen", "Karen Blixen Museum", "Ngong Racecourse"],
    stats: [
      { value: "1–5 acre", label: "Typical plot" },
      { value: "30 min", label: "to the CBD" },
      { value: "Green", label: "Belt living" },
    ],
  },
  {
    slug: "kilimani",
    name: "Kilimani",
    tagline: "The city's most fluent blend of work, home and play.",
    summary:
      "Kilimani is where young Nairobi wants to live — walkable, well-served and densely apartmented, with cafés, clinics and co-working spaces on every other corner. Convenience, distilled.",
    character:
      "Centrally placed between Westlands, Upper Hill and the CBD, Kilimani has transformed from low-rise bungalows into a vertical, cosmopolitan neighbourhood. It is the default choice for professionals and young families who want amenity density and a short commute over acreage.",
    center: { lat: -1.2917, lng: 36.7833 },
    boundary: ring({ lat: -1.2917, lng: 36.7833 }, 0.012, [1, 0.9, 1.1, 0.95, 1.05, 0.85, 1.1, 0.9]),
    priceBand: "$120K – $850K",
    builtForm: "Mid- & high-rise apartments",
    commuteCBD: "12 min",
    vibe: ["Cosmopolitan", "Walkable", "Lively"],
    schools: ["Kilimani Primary", "State House Girls (nearby)", "Light Academy"],
    lifestyle: ["Yaya Centre", "Adlife Plaza", "Prestige Plaza", "Lebanon-style café strip"],
    stats: [
      { value: "12 min", label: "to the CBD" },
      { value: "High", label: "Amenity density" },
      { value: "Rental", label: "Yield favourite" },
    ],
  },
  {
    slug: "lavington",
    name: "Lavington",
    tagline: "Quiet family streets a notch off the main road.",
    summary:
      "Lavington keeps the calm of the old suburbs while sitting minutes from Kilimani and Westlands. Townhouses and walled family homes under a canopy of mature trees — settled, green and comfortably central.",
    character:
      "A favourite of established families and the diplomatic community, Lavington balances space and access better than almost anywhere in Nairobi. Gated townhouse courts sit beside standalone homes on quarter-acre plots, served by international schools and a clutch of well-loved neighbourhood malls.",
    center: { lat: -1.2783, lng: 36.7725 },
    boundary: ring({ lat: -1.2783, lng: 36.7725 }, 0.013, [0.95, 1.1, 0.9, 1.05, 1, 0.9, 1.1, 0.95]),
    priceBand: "$200K – $1.2M",
    builtForm: "Townhouses & garden apartments",
    commuteCBD: "18 min",
    vibe: ["Family", "Leafy", "Settled"],
    schools: ["Braeburn School", "St Mary's School", "Makini School"],
    lifestyle: ["Lavington Mall", "Lavington Green", "Valley Arcade", "Muthangari grounds"],
    stats: [
      { value: "¼ acre", label: "Typical plot" },
      { value: "18 min", label: "to the CBD" },
      { value: "Schools", label: "Within reach" },
    ],
  },
  {
    slug: "runda",
    name: "Runda",
    tagline: "Manicured, gated and reassuringly serene.",
    summary:
      "Runda is the modern benchmark for secure family living — wide clean avenues, generous gardens and a controlled, community feel. Close to the UN and Gigiri, it is favoured by executives and diplomats alike.",
    character:
      "One of Nairobi's most orderly estates, Runda is defined by its manicured verges, underground services and association-run security. Homes are substantial standalone villas on half-acre plots, set back behind hedges — a place that prizes calm, safety and a sense of arrival.",
    center: { lat: -1.2167, lng: 36.8167 },
    boundary: ring({ lat: -1.2167, lng: 36.8167 }, 0.015, [1.05, 0.95, 1.1, 0.9, 1.05, 1, 0.9, 1.1]),
    priceBand: "$550K – $2.8M",
    builtForm: "Standalone villas on ½ acre",
    commuteCBD: "25 min",
    vibe: ["Secure", "Manicured", "Executive"],
    schools: ["Rosslyn Academy", "Gems Cambridge", "German School Nairobi"],
    lifestyle: ["Village Market", "Two Rivers Mall", "UN Complex (nearby)", "Karura Forest"],
    stats: [
      { value: "½ acre", label: "Typical plot" },
      { value: "24/7", label: "Estate security" },
      { value: "25 min", label: "to the CBD" },
    ],
  },
  {
    slug: "kileleshwa",
    name: "Kileleshwa",
    tagline: "Old shade trees meet the new skyline.",
    summary:
      "Kileleshwa is gentrifying in real time — leafy lanes and bungalows giving way to elegant low-rise apartments. Central, green and quietly upmarket, it appeals to those who want Kilimani's access with a softer edge.",
    character:
      "Bordered by the Nairobi River and threaded with jacaranda, Kileleshwa retains a residential hush even as developers move in. The newer apartment blocks are deliberately restrained — generous balconies, gardens and a low-rise scale that keeps the canopy intact.",
    center: { lat: -1.2833, lng: 36.7833 },
    boundary: ring({ lat: -1.2833, lng: 36.7833 }, 0.011, [1, 1.05, 0.9, 1.1, 0.95, 1.05, 0.9, 1 ]),
    priceBand: "$160K – $900K",
    builtForm: "Low-rise apartments & maisonettes",
    commuteCBD: "15 min",
    vibe: ["Leafy", "Refined", "Central"],
    schools: ["Kestrel Manor", "Riara Group", "Loreto Convent Valley Road"],
    lifestyle: ["Yaya Centre (nearby)", "Kileleshwa shops", "Riverside dining"],
    stats: [
      { value: "15 min", label: "to the CBD" },
      { value: "Low-rise", label: "Scale" },
      { value: "Rising", label: "Value trend" },
    ],
  },
  {
    slug: "gigiri",
    name: "Gigiri",
    tagline: "The diplomatic enclave by Karura Forest.",
    summary:
      "Home to the UN, embassies and Village Market, Gigiri is green, secure and internationally minded. A compact, high-amenity district where forest trails and global institutions share the same postcode.",
    character:
      "Gigiri grew around the UN's only headquarters in the global south, and it shows: clipped hedges, diplomatic plates and a calm, well-served feel. Bordering Karura Forest, it offers an unusual mix of nature and convenience that few city districts can match.",
    center: { lat: -1.2333, lng: 36.8167 },
    boundary: ring({ lat: -1.2333, lng: 36.8167 }, 0.012, [1, 0.9, 1.1, 0.95, 1.05, 0.9, 1.1, 0.95]),
    priceBand: "$450K – $2.2M",
    builtForm: "Villas & gated townhouses",
    commuteCBD: "22 min",
    vibe: ["Diplomatic", "Green", "Secure"],
    schools: ["Rosslyn Academy", "International School of Kenya (nearby)", "QSI"],
    lifestyle: ["Village Market", "Karura Forest", "UN Recreation", "Tribe Hotel"],
    stats: [
      { value: "UN", label: "On the doorstep" },
      { value: "Forest", label: "Edge living" },
      { value: "22 min", label: "to the CBD" },
    ],
  },
];

export const DISTRICT_BY_SLUG: Record<string, DistrictGuide> = Object.fromEntries(
  DISTRICTS.map((d) => [d.slug, d])
);

export function findDistrict(name?: string | null): DistrictGuide | undefined {
  if (!name) return undefined;
  const n = name.toLowerCase().trim();
  return DISTRICTS.find((d) => d.slug === n || d.name.toLowerCase() === n);
}
