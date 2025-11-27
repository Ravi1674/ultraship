import React from "react";

export default function EmployeeModal({ emp, onClose }) {
  if (!emp) return null;
  return (
    <div className="modal" onClick={onClose}>
      <div
        className="modal-inner"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 900 }}
      >
        <div className="toolbar" style={{ alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0 }}>{emp.name}</h2>
            <div className="small" style={{ marginTop: 6 }}>
              {emp.id}
            </div>
          </div>
          <div>
            <button
              onClick={onClose}
              style={{
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                padding: "10px 14px",
                borderRadius: 10,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(37,99,235,0.16)",
              }}
            >
              Back to list
            </button>
          </div>
        </div>

        <div className="details" style={{ marginTop: 12 }}>
          <div style={{ padding: 12, borderRadius: 10, background: "#fafafa" }}>
            <div className="small">Age</div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>{emp.age}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 10, background: "#fafafa" }}>
            <div className="small">Class</div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>{emp.class}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 10, background: "#fafafa" }}>
            <div className="small">Subjects</div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>
              {(emp.subjects || []).join(", ")}
            </div>
          </div>
          <div style={{ padding: 12, borderRadius: 10, background: "#fafafa" }}>
            <div className="small">Attendance</div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>
              {emp.attendance}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
