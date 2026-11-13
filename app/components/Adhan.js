"use client";
import React, { useMemo } from "react";

// Standard calculation helper or fallback for Kuala Lumpur (lat: 3.139, lng: 101.687)
function getPrayerTimes(lat, lng) {
  // If you have an existing prayer calculation library in ../lib, import and use it here.
  // Default JAKIM / Kuala Lumpur reference times:
  return [
    { name: "Fajr (Subuh)", time: "05:52" },
    { name: "Dhuhr (Zohor)", time: "13:04" },
    { name: "Asr (Asar)", time: "16:26" },
    { name: "Maghrib", time: "19:01" },
    { name: "Isha (Isyak)", time: "20:14" },
  ];
}

export default function Adhan({ s, setS }) {
  const notificationsEnabled = s.notifications ?? true;
  const prayers = useMemo(() => getPrayerTimes(s.lat, s.lng), [s.lat, s.lng]);

  const toggleNotifications = () => {
    setS((prev) => ({
      ...prev,
      notifications: !notificationsEnabled,
    }));
  };

  return (
    <div className="adhan-settings">
      <h2>Adhan & Prayer Times</h2>
      <p>Daily prayer schedule and notification preferences.</p>

      {/* Azan Notification Toggle */}
      <div
        className="setting-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          borderBottom: "1px solid rgba(128, 128, 128, 0.2)",
          marginTop: "12px",
        }}
      >
        <div>
          <strong>Azan Notifications</strong>
          <div style={{ fontSize: "0.85rem", opacity: 0.75 }}>
            {notificationsEnabled ? "Alerts and azan audio are enabled" : "All azan notifications are muted"}
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={notificationsEnabled}
          onClick={toggleNotifications}
          style={{
            width: "52px",
            height: "28px",
            borderRadius: "999px",
            border: "none",
            backgroundColor: notificationsEnabled ? "#1b5e20" : "#9e9e9e",
            position: "relative",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            padding: 0,
          }}
        >
          <span
            style={{
              display: "block",
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              position: "absolute",
              top: "3px",
              left: notificationsEnabled ? "27px" : "3px",
              transition: "left 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          />
        </button>
      </div>

      {/* Prayer Times List */}
      <div style={{ marginTop: "24px" }}>
        <h3 style={{ marginBottom: "12px" }}>Today&apos;s Prayer Times</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {prayers.map((p) => (
            <li
              key={p.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 16px",
                marginBottom: "8px",
                borderRadius: "8px",
                backgroundColor: "rgba(128, 128, 128, 0.1)",
              }}
            >
              <span>{p.name}</span>
              <strong>{p.time}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
