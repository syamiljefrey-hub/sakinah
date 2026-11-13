const KAABA = [21.4225, 39.8262], R = Math.PI / 180;
export function qibla(lat, lng) {
  const dl = (KAABA[1] - lng) * R, p1 = lat * R, p2 = KAABA[0] * R;
  const y = Math.sin(dl) * Math.cos(p2), x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return (Math.atan2(y, x) / R + 360) % 360;
}
export function distKm(lat, lng) {
  const dp = (KAABA[0] - lat) * R, dl = (KAABA[1] - lng) * R;
  const a = Math.sin(dp / 2) ** 2 + Math.cos(lat * R) * Math.cos(KAABA[0] * R) * Math.sin(dl / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
export const dir8 = (d) => ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(d / 45) % 8];

const NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
export function nextOf(t, tz) {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).formatToParts(new Date());
  const g = (k) => +p.find((x) => x.type === k).value;
  const now = (g("hour") % 24) * 3600 + g("minute") * 60 + g("second");
  const secs = NAMES.map((k) => { const [h, m] = t[k].split(":"); return h * 3600 + m * 60; });
  let i = secs.findIndex((x) => x > now), diff;
  if (i < 0) { i = 0; diff = secs[0] + 86400 - now; } else diff = secs[i] - now;
  const z = (n) => String(n).padStart(2, "0");
  return { name: NAMES[i], time: t[NAMES[i]], clock: `${z((diff / 3600) | 0)}:${z(((diff % 3600) / 60) | 0)}:${z(diff % 60)}` };
}
