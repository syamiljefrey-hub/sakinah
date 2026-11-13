"use client";
import { useEffect, useState } from "react";
import { usePrayer, useTick } from "../lib/hooks";
import { nextOf } from "../lib/geo";
import { getVerse } from "../lib/api";
import Star from "./Star";

const REFS = ["2:255", "94:5", "13:28", "65:3", "39:53", "3:139", "20:114"];
const FALLBACK_VERSE = { ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", en: "In the name of God, the Most Gracious, the Most Merciful.", ref: "1:1" };

export default function Home({ s, go, last, tasbih, setTasbih }) {
  useTick();
  const d = usePrayer(s, 0);
  const [v, setV] = useState(FALLBACK_VERSE);
  const [msg, setMsg] = useState("");
  const day = Math.floor(Date.now() / 864e5);
  useEffect(() => {
    const ref = REFS[day % REFS.length];
    getVerse(ref).then((r) => setV({ ar: r[0].text, en: r[1].text, ref })).catch(() => {});
  }, []);

  const nx = d ? nextOf(d.t, d.tz) : null;
  const hijri = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
  const greg = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const city = s.address || (d ? d.tz.split("/").pop().replace("_", " ") : "...");

  const share = async () => {
    const text = `${v.en} (Quran ${v.ref})`;
    try { if (navigator.share) await navigator.share({ text }); else { await navigator.clipboard.writeText(text); setMsg("Copied"); setTimeout(() => setMsg(""), 1500); } } catch {}
  };

  return (
    <div className="page">
      <header className="head">
        <div><div className="hijri">{hijri}</div><div className="sub">{greg}</div></div>
        <div className="chip">{city}</div>
      </header>

      <section className="hero">
        <Star size={190} />
        <div className="sub">Next prayer</div>
        <h2>{nx ? nx.name : "..."} <span>{nx ? nx.time : ""}</span></h2>
        <div className="count">{nx ? nx.clock : "--:--:--"}</div>
        {d && !d.live && <div className="sub">Offline: showing sample times</div>}
      </section>

      <div className="row">
        <button className="card" onClick={() => go("quran", last?.n || 1)}>
          <div className="sub">Continue reading</div>
          <b>{last ? last.name : "Al-Fatihah"}</b>
          <div className="sub">Ayah {last ? last.ayah : 1}</div>
        </button>
        <div className="card">
          <div className="sub">Tasbih</div>
          <button className="tap" onClick={() => setTasbih(tasbih + 1)} aria-label="Add one">{tasbih}</button>
          <button className="link" onClick={() => setTasbih(0)}>Reset</button>
        </div>
      </div>

      <section className="card verse">
        <div className="sub">Verse of the day · {v.ref}</div>
        <p className="arabic" dir="rtl">{v.ar}</p>
        <p>{v.en}</p>
        <button className="btn" onClick={share}>{msg || "Share"}</button>
      </section>
    </div>
  );
}
