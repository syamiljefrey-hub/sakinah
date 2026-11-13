"use client";
import { useEffect, useState } from "react";
import { LINKS } from "./links";

const CITIES = {
  kl: { off: 8, qibla: 292, en: "Kuala Lumpur", ar: "كوالالمبور", t: ["05:52", "13:15", "16:30", "19:20", "20:32"] },
  dxb: { off: 4, qibla: 256, en: "Dubai", ar: "دبي", t: ["05:12", "11:50", "15:00", "17:20", "18:40"] },
  sana: { off: 3, qibla: 327, en: "Sana'a", ar: "صنعاء", t: ["04:55", "11:42", "14:55", "17:25", "18:40"] },
};
const PRAYERS = { en: ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"], ar: ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"] };
const TABS = ["azan", "quran", "qibla"];

const T = {
  en: {
    nav: ["Preview", "Why Sakina", "Download"],
    h1: "Prayer times that stay out of your way.",
    sub: "Sakina tells you when the next prayer is, plays the azan, and points to the Qibla. No ads, no clutter.",
    cta: "Download for Windows", cta2: "Try the preview",
    tabs: { azan: "Smart Azan", quran: "Quran", qibla: "Qibla" },
    next: "Next prayer", in: "in", sample: "Sample times for each city",
    previewH: "Pick a city. See how it feels.",
    previewP: "Everything in the phone works. Change the city, switch tabs, mark a surah as read.",
    read: "Read", bearing: "Qibla bearing",
    whyH: "Built to be quiet.",
    why: [
      ["Zero Ads", "Nothing interrupts a prayer. There are no banners, pop-ups or trackers."],
      ["Offline Audio", "Download an azan once and it plays anywhere, even with no signal."],
      ["Bilingual UI", "English and Arabic, with full right-to-left layout. Switch at any time."],
    ],
    dlH: "Get Sakina on your device.", dlP: "Pick your device. Install it, open it, and you are in the app.",
    win: "Windows (.exe)", and: "Android (.apk)", web: "Open in your browser", note: "On Android, allow installs from this source when asked.",
  },
  ar: {
    nav: ["المعاينة", "لماذا سكينة", "التحميل"],
    h1: "مواقيت الصلاة دون ضجيج.",
    sub: "سكينة يخبرك بموعد الصلاة القادمة، ويرفع الأذان، ويشير إلى القبلة. بلا إعلانات وبلا تشويش.",
    cta: "حمّل لنظام ويندوز", cta2: "جرّب المعاينة",
    tabs: { azan: "الأذان الذكي", quran: "القرآن", qibla: "القبلة" },
    next: "الصلاة القادمة", in: "بعد", sample: "أوقات تجريبية لكل مدينة",
    previewH: "اختر مدينة وجرّب بنفسك.",
    previewP: "كل ما في الهاتف يعمل. بدّل المدينة، وانتقل بين التبويبات، وعلّم سورة كمقروءة.",
    read: "مقروءة", bearing: "اتجاه القبلة",
    whyH: "صُمّم ليكون هادئًا.",
    why: [
      ["بلا إعلانات", "لا شيء يقاطع صلاتك. لا لافتات ولا نوافذ منبثقة ولا تتبّع."],
      ["صوت دون إنترنت", "حمّل الأذان مرة واحدة ويعمل في أي مكان، حتى بلا إشارة."],
      ["واجهة بلغتين", "العربية والإنجليزية مع تخطيط كامل من اليمين إلى اليسار."],
    ],
    dlH: "احصل على سكينة على جهازك.", dlP: "اختر جهازك، ثبّت التطبيق وافتحه لتبدأ.",
    win: "ويندوز (.exe)", and: "أندرويد (.apk)", web: "افتح في المتصفح", note: "على أندرويد، اسمح بالتثبيت من هذا المصدر عند الطلب.",
  },
};
const SURAHS = [["Al-Fatihah", "الفاتحة", 7], ["Al-Ikhlas", "الإخلاص", 4], ["Al-Falaq", "الفلق", 5], ["An-Nas", "الناس", 6]];

function nextPrayer(city) {
  const local = new Date(Date.now() + city.off * 3600000);
  const now = local.getUTCHours() * 3600 + local.getUTCMinutes() * 60 + local.getUTCSeconds();
  const secs = city.t.map((s) => { const [h, m] = s.split(":"); return h * 3600 + m * 60; });
  let i = secs.findIndex((s) => s > now), diff;
  if (i === -1) { i = 0; diff = secs[0] + 86400 - now; } else diff = secs[i] - now;
  const p = (n) => String(n).padStart(2, "0");
  return { i, clock: `${p(Math.floor(diff / 3600))}:${p(Math.floor((diff % 3600) / 60))}:${p(diff % 60)}` };
}

export default function Page() {
  const [lang, setLang] = useState("en");
  const [cityKey, setCityKey] = useState("kl");
  const [tab, setTab] = useState("azan");
  const [read, setRead] = useState([0]);
  const [, tick] = useState(0);
  useEffect(() => { const id = setInterval(() => tick((n) => n + 1), 1000); return () => clearInterval(id); }, []);

  const t = T[lang], city = CITIES[cityKey], np = nextPrayer(city);
  const L = (o) => o[lang];
  const toggleRead = (i) => setRead((r) => (r.includes(i) ? r.filter((x) => x !== i) : [...r, i]));

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} className={lang === "ar" ? "ar" : ""}>
      <header className="bar">
        <a href="#top" className="logo">Sakina</a>
        <nav>
          <a href="#preview">{t.nav[0]}</a><a href="#why">{t.nav[1]}</a><a href="#download">{t.nav[2]}</a>
          <button className="lang" onClick={() => setLang(lang === "en" ? "ar" : "en")} aria-label="Switch language">
            {lang === "en" ? "العربية" : "English"}
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="copy">
            <h1>{t.h1}</h1>
            <p>{t.sub}</p>
            <div className="actions">
              <a className="btn gold" href="#download">{t.cta}</a>
              <a className="btn ghost" href="#preview">{t.cta2}</a>
            </div>
          </div>
          <Phone {...{ t, lang, city, cityKey, np, tab, setTab, read, toggleRead, L }} />
        </section>

        <section id="preview" className="preview">
          <h2>{t.previewH}</h2>
          <p>{t.previewP}</p>
          <div className="cities" role="tablist">
            {Object.entries(CITIES).map(([k, c]) => (
              <button key={k} role="tab" aria-selected={k === cityKey} className={k === cityKey ? "on" : ""} onClick={() => setCityKey(k)}>{L(c)}</button>
            ))}
          </div>
          <small>{t.sample}</small>
        </section>

        <section id="why" className="why">
          <h2>{t.whyH}</h2>
          <ul>{t.why.map(([h, p]) => (<li key={h}><h3>{h}</h3><p>{p}</p></li>))}</ul>
        </section>

        <section id="download" className="download">
          <h2>{t.dlH}</h2>
          <p>{t.dlP}</p>
          <div className="signup">
            <a className="btn gold" href={LINKS.windows} download>{t.win}</a>
            <a className="btn gold" href={LINKS.android} download>{t.and}</a>
            <a className="btn light" href={LINKS.web} target="_blank" rel="noreferrer">{t.web}</a>
          </div>
          <small>{t.note}</small>
        </section>
      </main>
      <footer>© 2026 Sakina</footer>
    </div>
  );
}

function Phone({ t, lang, city, np, tab, setTab, read, toggleRead, L }) {
  return (
    <div className="phone" aria-label="Sakina app preview">
      <div className="screen">
        <div className="city">{L(city)}</div>
        {tab === "azan" && (
          <div>
            <div className="lbl">{t.next}: {PRAYERS[lang][np.i]}</div>
            <div className="count">{np.clock}</div>
            <ol className="times">
              {city.t.map((time, i) => (
                <li key={i} className={i === np.i ? "now" : ""}><span>{PRAYERS[lang][i]}</span><span>{time}</span></li>
              ))}
            </ol>
          </div>
        )}
        {tab === "quran" && (
          <ul className="surahs">
            {SURAHS.map((s, i) => (
              <li key={s[0]}>
                <span>{L({ en: s[0], ar: s[1] })}<em>{s[2]}</em></span>
                <button className={read.includes(i) ? "chk on" : "chk"} onClick={() => toggleRead(i)} aria-pressed={read.includes(i)}>{t.read}</button>
              </li>
            ))}
          </ul>
        )}
        {tab === "qibla" && (
          <div className="qibla">
            <div className="dial"><i style={{ transform: `rotate(${city.qibla}deg)` }} /></div>
            <div className="deg">{t.bearing}: {city.qibla}°</div>
          </div>
        )}
      </div>
      <div className="tabs">
        {TABS.map((k) => (<button key={k} className={k === tab ? "on" : ""} onClick={() => setTab(k)}>{t.tabs[k]}</button>))}
      </div>
    </div>
  );
}
