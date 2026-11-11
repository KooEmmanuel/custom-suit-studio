// Real Custom Suit Studio pieces (side / front / back cut-outs) from the clothing-rail prototype.
export const PRODUCTS = [
  {
    "id": "the-navy-two-button",
    "name": "The Navy Two-Button",
    "price": 480,
    "cat": "Single-breasted · Notch lapel",
    "sizes": [
      "36R",
      "38R",
      "40R",
      "42R",
      "44R",
      "46R"
    ],
    "front": "assets/rail/the-navy-two-button-front.webp",
    "back": "assets/rail/the-navy-two-button-back.webp",
    "side": "assets/rail/the-navy-two-button-side.webp",
    "color": "#1f222f",
    "w": 583,
    "h": 1000
  },
  {
    "id": "the-cream-linen",
    "name": "The Cream Linen",
    "price": 420,
    "cat": "Single-breasted · Linen",
    "sizes": [
      "36R",
      "38R",
      "40R",
      "42R",
      "44R",
      "46R"
    ],
    "front": "assets/rail/the-cream-linen-front.webp",
    "back": "assets/rail/the-cream-linen-back.webp",
    "side": "assets/rail/the-cream-linen-side.webp",
    "color": "#dbd1c1",
    "w": 595,
    "h": 1000
  },
  {
    "id": "the-charcoal-pinstripe",
    "name": "The Charcoal Pinstripe",
    "price": 540,
    "cat": "Single-breasted · Peak lapel",
    "sizes": [
      "36R",
      "38R",
      "40R",
      "42R",
      "44R",
      "46R"
    ],
    "front": "assets/rail/the-charcoal-pinstripe-front.webp",
    "back": "assets/rail/the-charcoal-pinstripe-back.webp",
    "side": "assets/rail/the-charcoal-pinstripe-side.webp",
    "color": "#39393a",
    "w": 540,
    "h": 1000
  },
  {
    "id": "the-camel-double-breasted",
    "name": "The Camel Double-Breasted",
    "price": 640,
    "cat": "Double-breasted · Peak lapel",
    "sizes": [
      "36R",
      "38R",
      "40R",
      "42R",
      "44R",
      "46R"
    ],
    "front": "assets/rail/the-camel-double-breasted-front.webp",
    "back": "assets/rail/the-camel-double-breasted-back.webp",
    "side": "assets/rail/the-camel-double-breasted-side.webp",
    "color": "#9c6f49",
    "w": 511,
    "h": 1000
  },
  {
    "id": "the-black-peak-lapel",
    "name": "The Black Peak Lapel",
    "price": 520,
    "cat": "Single-breasted · Peak lapel",
    "sizes": [
      "36R",
      "38R",
      "40R",
      "42R",
      "44R",
      "46R"
    ],
    "front": "assets/rail/the-black-peak-lapel-front.webp",
    "back": "assets/rail/the-black-peak-lapel-back.webp",
    "side": "assets/rail/the-black-peak-lapel-side.webp",
    "color": "#1e1e1e",
    "w": 587,
    "h": 1000
  },
  {
    "id": "the-grey-check",
    "name": "The Grey Check",
    "price": 460,
    "cat": "Single-breasted · Subtle check",
    "sizes": [
      "36R",
      "38R",
      "40R",
      "42R",
      "44R",
      "46R"
    ],
    "front": "assets/rail/the-grey-check-front.webp",
    "back": "assets/rail/the-grey-check-back.webp",
    "side": "assets/rail/the-grey-check-side.webp",
    "color": "#5e5e60",
    "w": 567,
    "h": 1000
  },
  {
    "id": "the-forest-double-breasted",
    "name": "The Forest Double-Breasted",
    "price": 690,
    "cat": "Double-breasted · Peak lapel",
    "sizes": [
      "36R",
      "38R",
      "40R",
      "42R",
      "44R",
      "46R"
    ],
    "front": "assets/rail/the-forest-double-breasted-front.webp",
    "back": "assets/rail/the-forest-double-breasted-back.webp",
    "side": "assets/rail/the-forest-double-breasted-side.webp",
    "color": "#1a2b1e",
    "w": 516,
    "h": 1000
  },
  {
    "id": "the-burgundy-two-button",
    "name": "The Burgundy Two-Button",
    "price": 560,
    "cat": "Single-breasted · Notch lapel",
    "sizes": [
      "36R",
      "38R",
      "40R",
      "42R",
      "44R",
      "46R"
    ],
    "front": "assets/rail/the-burgundy-two-button-front.webp",
    "back": "assets/rail/the-burgundy-two-button-back.webp",
    "side": "assets/rail/the-burgundy-two-button-side.webp",
    "color": "#43161f",
    "w": 552,
    "h": 1000
  }
];

// What the shopper fills, and what one product is called in the page copy.
// container.kind: 'tote' | 'basket' | 'cart' | 'box'   (drawn in css/style.css)
export const CONFIG = { container: { kind: "tote", word: "bag" }, itemWord: "suit" };

// Where orders ship from, and where the demo can deliver to.
export const ORIGIN = { city: 'Accra', country: 'Ghana', code: 'ACC', lon: -0.17, lat: 5.6 };
export const CITIES = [
  { city: 'London', country: 'United Kingdom', code: 'LHR', lon: -0.45, lat: 51.47 },
  { city: 'New York', country: 'United States', code: 'JFK', lon: -73.78, lat: 40.64 },
  { city: 'Toronto', country: 'Canada', code: 'YYZ', lon: -79.6, lat: 43.68 },
  { city: 'Houston', country: 'United States', code: 'IAH', lon: -95.34, lat: 29.98 },
  { city: 'Los Angeles', country: 'United States', code: 'LAX', lon: -118.4, lat: 33.94 },
  { city: 'Paris', country: 'France', code: 'CDG', lon: 2.55, lat: 49.0 },
  { city: 'Amsterdam', country: 'Netherlands', code: 'AMS', lon: 4.76, lat: 52.31 },
  { city: 'Berlin', country: 'Germany', code: 'BER', lon: 13.5, lat: 52.36 },
  { city: 'Lagos', country: 'Nigeria', code: 'LOS', lon: 3.32, lat: 6.58 },
  { city: 'Nairobi', country: 'Kenya', code: 'NBO', lon: 36.93, lat: -1.32 },
  { city: 'Johannesburg', country: 'South Africa', code: 'JNB', lon: 28.24, lat: -26.13 },
  { city: 'Dubai', country: 'UAE', code: 'DXB', lon: 55.36, lat: 25.25 },
  { city: 'Tokyo', country: 'Japan', code: 'HND', lon: 139.78, lat: 35.55 },
  { city: 'Sydney', country: 'Australia', code: 'SYD', lon: 151.18, lat: -33.94 }
];
export const km = (a, b) => { const R = 6371, r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r, h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
