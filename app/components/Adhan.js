"use client";
import { useState } from "react";
import { usePrayer, usePersist, useTick } from "../lib/hooks";
import { nextOf } from "../lib/geo";
import { ORDER } from "../lib/api";

const METHODS = { MWL: 3, ISNA: 2, "Umm al-Qura": 4, JAKIM: 17 };
const SCHOOLS = { "Shafi'i": 0, Hanafi: 1 };
const MODES = ["Adhan", "Vibrate", "Mute"];

export default function Adhan({ s, setS }) {
  useTick();
  const [off, setOff] = useState(0);
  const [modal, setModal] = useState(false);
  const [q, setQ] = useState("");
  const [modes, setModes] = usePersist("modes", {});
  const [done, setDone] = usePersist("done", {});
  const d = usePrayer(s, off);
  const key = new Date(Date.now() + off * 864e5).toDateString();
  const nx = d && off === 0 ? nextOf(d.t, d.tz) : null;
  const ticked = done[key] || [];

  const cycle = (p) => setModes({ ...modes, [p]: MODES[(MODES.indexOf(modes[p] || "Adhan") + 1) % 3] });
  const check = (p) => setDone({ ...done, [key]: ticked.includes(p) ? ticked.filter((x) => x !== p) : [...ticked, p] });
  const gps = () => navigator.geolocation?.getCurrentPosition((p) => setS({ ...s, lat: p.coords.latitude, lng: p.coords.longitude, address: "" }));
  const search = (e) => { e.preventDefault(); if (q.trim()) setS({ ...s, address: q.trim() }); };

  return (
    <div className="page">
      <header className="head"><h1>Prayer times</h1><button className="chip" onClick={() => setModal(true)}>Settings</button></header>

      <form className="search" onSubmit={search}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search city, e.g. Kuala Lumpur" aria-label="Search city" />
        <button className="btn" type="button" onClick={gps}>Use GPS</button>
      </form>

      <div className="seg">
        {["Today", "Tomorrow"].map((l, i) => (<button key={l} className={off === i ? "on" : ""} onClick={() => setOff(i)}>{l}</button>))}
      </div>

      <ul className="plist">
        {ORDER.map((p) => (
          <li key={p} className={nx && nx.name === p ? "now" : ""}>
            {p !== "Sunrise" ? (
              <input type="checkbox" checked={ticked.includes(p)} onChange={() => check(p)} aria-label={`${p} prayed`} />
            ) : <span className="ph" />}
            <span className="pn">{p}</span>
            <span className="pt">{d ? d.t[p] : "--:--"}</span>
            {p !== "Sunrise" && <button className="chip" onClick={() => cycle(p)}>{modes[p] || "Adhan"}</button>}
          </li>
        ))}
      </ul>
      <p className="sub">{ticked.length} of 5 prayers completed. Monthly calendar view is not included yet.</p>

      {modal && (
        <div className="modal" onClick={() => setModal(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <h2>Settings</h2>
            <label>Calculation method
              <select value={s.method} onChange={(e) => setS({ ...s, method: +e.target.value })}>
                {Object.entries(METHODS).map(([k, v]) => <option key={k} value={v}>{k}</option>)}
              </select>
            </label>
            <label>Juristic method
              <select value={s.school} onChange={(e) => setS({ ...s, school: +e.target.value })}>
                {Object.entries(SCHOOLS).map(([k, v]) => <option key={k} value={v}>{k}</option>)}
              </select>
            </label>
            <button className="btn" onClick={() => setModal(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
