import React from "react";

export default function EmployeeTableView({
  data,
  loading,
  onRowClick,
  onFlag,
}) {
  return (
    <>
      <div className="table-headers">
        <div>ID</div>
        <div>Name</div>
        <div>Age</div>
        <div>Class</div>
        <div>Subjects</div>
        <div>Attendance</div>
        <div>Flag</div>
      </div>

      <div>
        {data.map((emp) => (
          <div
            key={emp.id}
            className="table-row"
            onClick={() => onRowClick(emp)}
          >
            <div>{String(emp.id).slice(0, 6)}</div>
            <div style={{ fontWeight: 600 }}>{emp.name}</div>
            <div>{emp.age}</div>
            <div>{emp.class}</div>
            <div>{(emp.subjects || []).join(", ")}</div>
            <div>{emp.attendance}%</div>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <span className={`flag-pill ${emp.flagged ? "flagged" : ""}`}>
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFlag(emp);
                  }}
                >
                  {emp.flagged ? "Unflag" : "Flag"}
                </button>
              </span>
            </div>
          </div>
        ))}

        {data.length === 0 && !loading && (
          <div style={{ padding: 20, color: "var(--muted)" }}>No records.</div>
        )}
      </div>
    </>
  );
}
