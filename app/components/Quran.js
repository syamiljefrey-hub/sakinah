"use client";
import { useEffect, useRef, useState } from "react";
import { getSurahs, getSurah } from "../lib/api";
import { usePersist } from "../lib/hooks";
import Star from "./Star";

const JUZ = [1, 2, 2, 3, 4, 4, 5, 6, 7, 8, 9, 11, 12, 15, 17, 18, 21, 23, 25, 27, 29, 33, 36, 39, 41, 46, 51, 58, 67, 78];
const RECITERS = [["ar.alafasy", "Mishary Alafasy"], ["ar.husary", "Mahmoud Al-Husary"]];
const MOCK = [[1, "الفاتحة", "Al-Fatihah", "The Opening", 7], [112, "الإخلاص", "Al-Ikhlas", "Sincerity", 4], [113, "الفلق", "Al-Falaq", "The Daybreak", 5], [114, "الناس", "An-Nas", "Mankind", 6]]
  .map(([number, name, englishName, englishNameTranslation, numberOfAyahs]) => ({ number, name, englishName, englishNameTranslation, numberOfAyahs }));

export default function Quran({ open, setOpen, setLast }) {
  const [list, setList] = useState(MOCK), [q, setQ] = useState(""), [mode, setMode] = useState("Surah");
  useEffect(() => { getSurahs().then(setList).catch(() => {}); }, []);
  if (open) return <Reader n={open} onBack={() => setOpen(null)} setLast={setLast} />;

  const f = list.filter((x) => (x.englishName + x.englishNameTranslation).toLowerCase().includes(q.toLowerCase()) || String(x.number) === q.trim());
  return (
    <div className="page">
      <header className="head"><h1>Quran</h1></header>
      <input className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search surah name or number" aria-label="Search surah" />
      <div className="seg">{["Surah", "Juz"].map((m) => <button key={m} className={mode === m ? "on" : ""} onClick={() => setMode(m)}>{m}</button>)}</div>
      <ul className="slist">
        {mode === "Surah" ? f.map((x) => (
          <li key={x.number}><button onClick={() => setOpen(x.number)}>
            <Star n={x.number} />
            <span className="mid"><b>{x.englishName}</b><small>{x.englishNameTranslation} · {x.numberOfAyahs} verses</small></span>
            <span className="arabic">{x.name}</span>
          </button></li>
        )) : JUZ.map((sn, i) => (
          <li key={i}><button onClick={() => setOpen(sn)}>
            <Star n={i + 1} /><span className="mid"><b>Juz {i + 1}</b><small>Starts in surah {sn}</small></span>
          </button></li>
        ))}
      </ul>
    </div>
  );
}

function Reader({ n, onBack, setLast }) {
  const [d, setD] = useState(null), [err, setErr] = useState(false);
  const [size, setSize] = usePersist("size", 28), [tr, setTr] = usePersist("tr", true);
  const [rec, setRec] = usePersist("rec", "ar.alafasy"), [bm, setBm] = usePersist("bm", []);
  const [cur, setCur] = useState(-1), [playing, setPlaying] = useState(false);
  const au = useRef(null);

  useEffect(() => { au.current = new Audio(); return () => au.current.pause(); }, []);
  useEffect(() => {
    au.current?.pause(); setPlaying(false); setCur(-1); setD(null); setErr(false);
    getSurah(n, rec).then(setD).catch(() => setErr(true));
  }, [n, rec]);
  useEffect(() => { document.getElementById("ay-" + cur)?.scrollIntoView({ behavior: "smooth", block: "center" }); }, [cur]);

  const play = (i) => {
    const x = d[3].ayahs[i], a = au.current;
    if (!x) { setPlaying(false); setCur(-1); return; }
    a.src = x.audio; a.onended = () => play(i + 1); a.play();
    setCur(i); setPlaying(true); setLast({ n, name: d[0].englishName, ayah: i + 1 });
  };
  const toggle = () => (playing ? (au.current.pause(), setPlaying(false)) : cur >= 0 ? (au.current.play(), setPlaying(true)) : play(0));
  const mark = (id) => setBm(bm.includes(id) ? bm.filter((x) => x !== id) : [...bm, id]);

  return (
    <div className="page reader">
      <header className="head"><button className="chip" onClick={onBack}>Back</button><h1>{d ? d[0].englishName : "..."}</h1></header>
      <div className="tools">
        <label>Size <input type="range" min="20" max="44" value={size} onChange={(e) => setSize(+e.target.value)} /></label>
        <label><input type="checkbox" checked={tr} onChange={(e) => setTr(e.target.checked)} /> Transliteration</label>
      </div>
      {err && <p className="sub">Could not load this surah. Check your connection and try again.</p>}
      {!d && !err && <p className="sub">Loading...</p>}
      {d && d[0].ayahs.map((a, i) => (
        <article key={i} id={"ay-" + i} className={`ayah ${cur === i ? "cur" : ""}`}>
          <button className={`bm ${bm.includes(n + ":" + (i + 1)) ? "on" : ""}`} onClick={() => mark(n + ":" + (i + 1))} aria-label="Bookmark ayah">{bm.includes(n + ":" + (i + 1)) ? "★" : "☆"}</button>
          <p className="arabic" dir="rtl" style={{ fontSize: size }}>{a.text}</p>
          {tr && <p className="tl">{d[2].ayahs[i].text}</p>}
          <p>{d[1].ayahs[i].text}</p>
        </article>
      ))}
      <div className="player">
        <button className="btn" onClick={toggle} disabled={!d}>{playing ? "Pause" : "Play"}</button>
        <select value={rec} onChange={(e) => setRec(e.target.value)} aria-label="Reciter">
          {RECITERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
    </div>
  );
}
