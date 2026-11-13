"use client";
import React from "react";

export default function Adhan({ s, setS }) {
  const notificationsEnabled = s.notifications ?? true;

  const toggleNotifications = () => {
    setS((prev) => ({
      ...prev,
      notifications: !notificationsEnabled,
    }));
  };

  return (
    <div className="adhan-settings">
      <h2>Adhan Settings</h2>
      <p>Manage prayer time alerts and audio playback.</p>

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
    </div>
  );
}
