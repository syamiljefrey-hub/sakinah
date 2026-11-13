"use client";
import { useEffect, useRef, useState } from "react";
import { usePrayer } from "../lib/hooks";
import { qibla, distKm, dir8 } from "../lib/geo";

export default function Qibla({ s }) {
  const d = usePrayer(s, 0);
  const lat = d ? d.lat : s.lat, lng = d ? d.lng : s.lng;
  const q = qibla(lat, lng);
  const [head, setHead] = useState(0), [live, setLive] = useState(false), [help, setHelp] = useState(false);
  const hr = useRef(null);

  const start = async () => {
    try {
      if (window.DeviceOrientationEvent?.requestPermission && (await DeviceOrientationEvent.requestPermission()) !== "granted") return;
      hr.current = (e) => {
        const v = e.webkitCompassHeading ?? (e.alpha == null ? null : 360 - e.alpha);
        if (v != null) { setLive(true); setHead(v); }
      };
      window.addEventListener("deviceorientationabsolute", hr.current, true);
      window.addEventListener("deviceorientation", hr.current, true);
    } catch {}
  };
  useEffect(() => {
    if (!window.DeviceOrientationEvent?.requestPermission) start();
    return () => {
      window.removeEventListener("deviceorientationabsolute", hr.current, true);
      window.removeEventListener("deviceorientation", hr.current, true);
    };
  }, []);

  const diff = ((q - head + 540) % 360) - 180;
  const aligned = Math.abs(diff) < 3;
  useEffect(() => { if (aligned && live) navigator.vibrate?.(40); }, [aligned]);

  return (
    <div className="page qibla">
      <header className="head"><h1>Qibla</h1><button className="chip" onClick={() => setHelp(!help)}>Calibrate</button></header>
      {help && <div className="tip">Move your phone in a figure-8 pattern and keep it away from metal and magnets.</div>}

      <div className={`dialwrap ${aligned ? "ok" : ""}`}>
        <div className="needle" />
        <div className="dial" style={{ transform: `rotate(${-head}deg)` }}>
          <span className="n">N</span>
          <div className="kaaba" style={{ transform: `rotate(${q}deg) translateY(-128px)` }}>
            <svg viewBox="0 0 24 24" width="30" height="30"><rect x="3" y="3" width="18" height="18" rx="2" fill="#1E293B" /><rect x="3" y="8" width="18" height="3" fill="#D4AF37" /></svg>
          </div>
        </div>
      </div>

      <div className="deg">{Math.round(q)}° {dir8(q)}</div>
      <div className="sub">{Math.round(distKm(lat, lng)).toLocaleString()} km to Makkah</div>
      {aligned && <div className="okmsg">You are facing the Qibla</div>}

      {!live && (
        <div className="sim">
          <button className="btn" onClick={start}>Enable compass</button>
          <label>No sensor found. Simulate heading: {Math.round(head)}°
            <input type="range" min="0" max="359" value={head} onChange={(e) => setHead(+e.target.value)} />
          </label>
        </div>
      )}
    </div>
  );
}
