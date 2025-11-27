import React from "react";

export default function Pagination({
  page,
  pageSize,
  total,
  onPrev,
  onNext,
  onPageSize,
}) {
  const totalPages =
    total && total > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const displayPages = `${page} / ${totalPages}`;

  return (
    <div className="pagination" style={{ alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button className="btn" onClick={onPrev} disabled={!canPrev}>
          Prev
        </button>
        <div style={{ padding: "6px 12px", color: "var(--muted)" }}>
          {displayPages}
        </div>
        <button className="btn" onClick={onNext} disabled={!canNext}>
          Next
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 13, color: "var(--muted)" }}>Rows</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(15,23,36,0.06)",
            background: "white",
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}
