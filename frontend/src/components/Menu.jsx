import React from "react";

export default function Menu({ vertical = false, onSelect }) {
  const items = [
    { key: "home", label: "Home" },
    { key: "employees", label: "Employees" },
    { key: "teams", label: "Teams" },
    { key: "settings", label: "Settings" },
  ];

  if (vertical) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it) => (
          <button
            key={it.key}
            className="menu-item"
            onClick={() => onSelect && onSelect(it.key)}
            style={{ textAlign: "left", width: "100%" }}
          >
            {it.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="horizontal-menu" role="navigation">
      {items.map((it) => (
        <div key={it.key} className="menu-item">
          {it.label}
        </div>
      ))}
    </div>
  );
}
