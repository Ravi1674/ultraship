import React, { useState, useEffect, useRef } from "react";
import Menu from "./Menu";

export default function Hamburger() {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [open]);

  // Keep the actual hamburger button visible only in mobile via CSS rules.
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        aria-label="Open menu"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "var(--card)",
          border: "1px solid rgba(15,23,36,0.04)",
          cursor: "pointer",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="5" width="18" height="2" rx="1" fill="#0f1724"></rect>
          <rect x="3" y="11" width="14" height="2" rx="1" fill="#0f1724"></rect>
          <rect x="3" y="17" width="10" height="2" rx="1" fill="#0f1724"></rect>
        </svg>
      </button>

      {open && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,23,36,0.25)",
              zIndex: 50,
            }}
            onClick={() => setOpen(false)}
          />
          <aside
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              width: 300,
              padding: 16,
              background: "var(--card)",
              boxShadow: "0 12px 40px rgba(15,23,36,0.12)",
              zIndex: 60,
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div style={{ fontWeight: 800 }}>Menu</div>
              <button className="btn" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <Menu vertical onSelect={() => setOpen(false)} />
          </aside>
        </>
      )}
    </div>
  );
}
