import React from "react";

/* Icons (inline to avoid deps) */
const IconPencil = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
      fill="#0f1724"
      opacity="0.9"
    />
    <path
      d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      fill="#0f1724"
      opacity="0.6"
    />
  </svg>
);
const IconFlag = ({ filled = false }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M6 3v18"
      stroke={filled ? "#c92a2a" : "#94a3b8"}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M8 6c2-1 4 0 6 0s4-1 6 0v9c-2-1-4 0-6 0s-4-1-6 0V6z"
      fill={filled ? "#fff5f5" : "none"}
      stroke={filled ? "#c92a2a" : "#94a3b8"}
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M3 6h18"
      stroke="#0f1724"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"
      stroke="#0f1724"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11v6M14 11v6"
      stroke="#0f1724"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export default function EmployeeTile({
  emp = {},
  onClick = () => {},
  onEdit = () => {},
  onFlag = () => {},
  onDelete = () => {},
}) {
  const initials = (emp.name || "??")
    .split(" ")
    .map((s) => s[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn(emp);
  };

  return (
    <article
      className="tile tile-modern"
      role="button"
      tabIndex={0}
      onClick={() => onClick(emp)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick(emp);
      }}
      aria-label={`Open ${emp.name || "record"}`}
    >
      <div className="tile-top">
        <div className="avatar">{initials}</div>
        <div className="title">
          <div className="tile-title">{emp.name || "—"}</div>
          <div className="tile-sub">
            {emp.class || "—"} · {emp.age ?? "—"} yrs
          </div>
          <div className="tile-id">
            ID: {String(emp.id || "").slice(0, 12) || "—"}
          </div>
        </div>
      </div>

      <div className="tile-mid">
        <div className="subjects-col">
          <div className="kicker">Subjects:</div>
          <div className="subject-list">
            {(emp.subjects || []).join(", ") || "—"}
          </div>
        </div>

        <div className="att-col">
          <div className="att-num">{emp.attendance ?? "—"}%</div>
          <div className={`att-flag ${emp.flagged ? "flagged" : ""}`}>
            {emp.flagged ? (
              <span className="flagged-indicator">
                <IconFlag filled />
                Flagged
              </span>
            ) : (
              <span className="no-flag">No Flag</span>
            )}
          </div>
        </div>
      </div>

      <div className="tile-actions" onClick={(e) => e.stopPropagation()}>
        <div className="action-group">
          <button
            className="btn-ghost"
            onClick={stop(onEdit)}
            aria-label="Edit"
          >
            <span className="btn-icon">
              <IconPencil />
            </span>
            <span className="btn-text">Edit</span>
          </button>

          <button
            className={`btn-ghost ${emp.flagged ? "btn-flagged" : ""}`}
            onClick={stop(onFlag)}
            aria-pressed={!!emp.flagged}
          >
            <span className="btn-icon">
              <IconFlag filled={!!emp.flagged} />
            </span>
            <span className="btn-text">{emp.flagged ? "Unflag" : "Flag"}</span>
          </button>
        </div>

        <div className="action-group action-right">
          <button
            className="btn-ghost btn-delete"
            onClick={stop(onDelete)}
            aria-label="Delete"
          >
            <span className="btn-icon">
              <IconTrash />
            </span>
            <span className="btn-text">Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}
