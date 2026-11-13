export const ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
const FALLBACK = { Fajr: "05:52", Sunrise: "07:02", Dhuhr: "13:15", Asr: "16:30", Maghrib: "19:20", Isha: "20:32" };
const dmy = (o) => { const d = new Date(Date.now() + o * 864e5); return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`; };

// Prayer times: Aladhan API. Falls back to sample data when offline.
export async function loadTimings(s, off = 0) {
  const q = `method=${s.method}&school=${s.school}`;
  const url = s.address
    ? `https://api.aladhan.com/v1/timingsByAddress/${dmy(off)}?address=${encodeURIComponent(s.address)}&${q}`
    : `https://api.aladhan.com/v1/timings/${dmy(off)}?latitude=${s.lat}&longitude=${s.lng}&${q}`;
  try {
    const j = await (await fetch(url)).json();
    const t = {};
    ORDER.forEach((k) => (t[k] = j.data.timings[k].slice(0, 5)));
    return { t, tz: j.data.meta.timezone, lat: j.data.meta.latitude, lng: j.data.meta.longitude, live: true };
  } catch {
    return { t: FALLBACK, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, lat: s.lat, lng: s.lng, live: false };
  }
}

// Quran: Al-Quran Cloud API
const Q = "https://api.alquran.cloud/v1";
export const getSurahs = () => fetch(`${Q}/surah`).then((r) => r.json()).then((j) => j.data);
export const getSurah = (n, reciter) =>
  fetch(`${Q}/surah/${n}/editions/quran-uthmani,en.asad,en.transliteration,${reciter}`).then((r) => r.json()).then((j) => j.data);
export const getVerse = (ref) =>
  fetch(`${Q}/ayah/${ref}/editions/quran-uthmani,en.asad`).then((r) => r.json()).then((j) => j.data);
