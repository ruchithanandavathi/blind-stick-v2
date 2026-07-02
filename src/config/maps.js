// ============================================================
// GOOGLE MAPS CONFIGURATION
// ============================================================
// To enable a real, live Google Map on the GPS section:
//
// 1. Get an API key from https://console.cloud.google.com/google/maps-apis
//    (enable the "Maps JavaScript API")
// 2. Paste it below
// 3. Set USE_REAL_MAPS to true
//
// Until you do this, the site shows a styled simulated map so the
// presentation still looks complete and works offline.
// ============================================================

export const GOOGLE_MAPS_API_KEY = ""; // <-- paste your key here
export const USE_REAL_MAPS = false; // <-- set to true once a key is added

export const DEFAULT_LOCATION = {
  lat: 12.9352,
  lng: 77.5345,
  label: "BMS College, Bengaluru",
};
