import React from "react";
import Hamburger from "./Hamburger";
import Menu from "./Menu";

export default function Header({
  view,
  setView,
  search,
  setSearch,
  usingPublic,
  setUsingPublic,
}) {
  return (
    <header className="header">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="hamburger" aria-hidden>
          {" "}
          {/* visible only on mobile due to CSS */}
          <Hamburger />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="logo">EP</div>
          <div>
            <div className="brand-title">Employee POC</div>
            <div className="brand-sub">GraphQL demo</div>
          </div>
        </div>
      </div>

      <nav>
        <Menu />
      </nav>

      <div className="controls-wrap">
        <input
          className="search"
          placeholder="Search name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 13, color: "var(--muted)" }}>
            Use public API
          </label>
          <input
            type="checkbox"
            checked={usingPublic}
            onChange={(e) => setUsingPublic(e.target.checked)}
          />
        </div>

        <div className="toggle-group">
          <button
            className={`btn ${view === "grid" ? "active" : ""}`}
            onClick={() => setView("grid")}
          >
            Grid
          </button>
          <button
            className={`btn ${view === "tile" ? "active" : ""}`}
            onClick={() => setView("tile")}
          >
            Tile
          </button>
        </div>
      </div>
    </header>
  );
}
