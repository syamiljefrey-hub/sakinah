"use client";
import { useEffect, useState } from "react";
import { usePersist } from "../lib/hooks";
import Home from "../components/Home";
import Quran from "../components/Quran";
import Adhan from "../components/Adhan";
import Qibla from "../components/Qibla";

const TABS = ["Home", "Quran", "Adhan", "Qibla"];
const DEFAULTS = { lat: 3.139, lng: 101.687, address: "", method: 17, school: 0 };

export default function App() {
  const [tab, setTab] = useState("Home");
  const [open, setOpen] = useState(null);
  const [theme, setTheme] = usePersist("theme", "light");
  const [s, setS] = usePersist("settings", DEFAULTS);
  const [last, setLast] = usePersist("last", null);
  const [tasbih, setTasbih] = usePersist("tasbih", 0);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const go = (t, surah = null) => { setTab(t); setOpen(surah); };

  return (
    <div className="shell">
      <button className="theme" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle dark mode">
        {theme === "light" ? "Dark" : "Light"}
      </button>
      <main>
        {tab === "Home" && <Home {...{ s, go, last, tasbih, setTasbih }} />}
        {tab === "Quran" && <Quran {...{ open, setOpen, setLast }} />}
        {tab === "Adhan" && <Adhan {...{ s, setS }} />}
        {tab === "Qibla" && <Qibla {...{ s }} />}
      </main>
      <nav className="nav">
        {TABS.map((t) => (<button key={t} className={t === tab ? "on" : ""} onClick={() => go(t)}>{t}</button>))}
      </nav>
    </div>
  );
}
