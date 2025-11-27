// App.jsx
import React, { useEffect, useRef, useState } from "react";
import { request, gql } from "graphql-request";
import Header from "./components/Header";
import EmployeeTile from "./components/EmployeeTile";
import EmployeeModal from "./components/EmployeeModal";
import Pagination from "./components/Pagination";
import ConfirmModal from "./components/ConfirmModal";
import EmployeeTableView from "./components/EmployeeTableView";
import {
  fetchEmployeesFromBackend,
  fetchEmployeesFromRandomUser,
} from "./lib/api";

const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4000/graphql";

const LIST_QUERY = gql`
  query List($page: Int, $pageSize: Int, $filter: EmployeeFilter) {
    listEmployees(page: $page, pageSize: $pageSize, filter: $filter) {
      total
      page
      pageSize
      items {
        id
        name
        age
        class
        subjects
        attendance
        flagged
      }
    }
  }
`;

export default function App() {
  const [view, setView] = useState("grid"); // "grid" = table, "tile" = cards
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [usingPublic, setUsingPublic] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // keep *all* public employees here; search + paging will be local
  const [allPublic, setAllPublic] = useState([]);

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const confirmRef = useRef({});

  // -----------------------------
  // DATA LOADING
  // -----------------------------

  useEffect(() => {
    if (usingPublic) {
      loadPublicData();
    } else {
      loadBackendData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usingPublic, page, pageSize, search]);

  async function loadPublicData() {
    setErrorMsg("");

    try {
      // 1) If we don't have public data yet, fetch it once
      if (allPublic.length === 0) {
        setLoading(true);
        const resp = await fetchEmployeesFromRandomUser({
          page: 1,
          pageSize: 200, // get a decent set once
        });
        if (!resp.ok) throw new Error(resp.error || "Unknown public API error");
        const all = resp.items || [];
        setAllPublic(all);
        applyPublicFilters(all);
      } else {
        // 2) We already have all public data – just filter + paginate locally
        applyPublicFilters(allPublic);
      }
    } catch (e) {
      console.error(e);
      setData([]);
      setTotal(0);
      setErrorMsg(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  function applyPublicFilters(source) {
    let items = source || [];

    // search by name (case-insensitive)
    if (search) {
      const term = search.toLowerCase();
      items = items.filter((it) =>
        String(it.name || "")
          .toLowerCase()
          .includes(term)
      );
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = items.slice(start, end);

    setData(pageItems);
    setTotal(items.length); // proper total for Pagination
  }

  async function loadBackendData() {
    setLoading(true);
    setErrorMsg("");

    try {
      const variables = {
        page,
        pageSize,
        filter: search ? { nameContains: search } : undefined,
      };

      const resp = await fetchEmployeesFromBackend({
        endpoint: GRAPHQL_URL,
        query: LIST_QUERY,
        variables,
      });

      if (!resp.ok) throw new Error(resp.error || "Unknown backend error");

      // assuming your helper already unwraps data.listEmployees
      const items = resp.items || [];
      const newTotal =
        resp.total != null && !Number.isNaN(resp.total)
          ? resp.total
          : items.length;

      setData(items);
      setTotal(newTotal);
    } catch (e) {
      console.error(e);
      setData([]);
      setTotal(0);
      setErrorMsg(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // MODALS + ACTIONS
  // -----------------------------

  function open(emp) {
    setSelected(emp);
  }
  function close() {
    setSelected(null);
  }

  function askConfirm(action, emp) {
    confirmRef.current = { action, emp };
    setConfirmOpen(true);
  }

  async function onConfirm() {
    const { action, emp } = confirmRef.current;
    setConfirmOpen(false);
    if (action === "flag") {
      await doToggleFlag(emp);
    } else if (action === "del") {
      doDelete(emp);
    } else if (action === "edit") {
      alert(`Edit: ${emp.name} (demo)`);
    }
  }
  function onCancel() {
    setConfirmOpen(false);
  }

  async function doToggleFlag(emp) {
    if (usingPublic) {
      // local only
      setData((prev) =>
        prev.map((p) => (p.id === emp.id ? { ...p, flagged: !p.flagged } : p))
      );
      setAllPublic((prev) =>
        prev.map((p) => (p.id === emp.id ? { ...p, flagged: !p.flagged } : p))
      );
      return;
    }

    try {
      const updated = { ...emp, flagged: !emp.flagged };
      setData((prev) => prev.map((p) => (p.id === emp.id ? updated : p)));

      const mutation = `mutation Update($id:ID!,$input:EmployeeInput!){
        updateEmployee(id:$id,input:$input){ id flagged }
      }`;

      await request(GRAPHQL_URL, mutation, {
        id: emp.id,
        input: { flagged: updated.flagged },
      });
    } catch (e) {
      console.error(e);
      // reload from backend on error
      loadBackendData();
    }
  }

  function doDelete(emp) {
    if (usingPublic) {
      setData((prev) => prev.filter((p) => p.id !== emp.id));
      setAllPublic((prev) => prev.filter((p) => p.id !== emp.id));
      return;
    }

    setData((prev) => prev.filter((p) => p.id !== emp.id));
    const mutation = `mutation Delete($id:ID!){ deleteEmployee(id:$id) }`;
    fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: mutation, variables: { id: emp.id } }),
    });
  }

  // -----------------------------
  // PAGINATION HANDLERS
  // -----------------------------

  function handlePrev() {
    setPage((p) => Math.max(1, p - 1));
  }
  function handleNext() {
    const pages = Math.max(1, Math.ceil(total / pageSize));
    setPage((p) => Math.min(pages, p + 1));
  }
  function handlePageSize(size) {
    setPageSize(size);
    setPage(1);
  }

  // -----------------------------
  // RENDER
  // -----------------------------

  return (
    <div className="app">
      <Header
        view={view}
        setView={setView}
        search={search}
        setSearch={setSearch}
        usingPublic={usingPublic}
        setUsingPublic={(val) => {
          setUsingPublic(val);
          setPage(1); // reset page when switching source
        }}
      />

      {errorMsg && (
        <div
          style={{
            padding: 12,
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: 8,
            marginTop: 12,
          }}
        >
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      {loading && (
        <div style={{ padding: 12, color: "var(--muted)" }}>Loading...</div>
      )}

      {view === "tile" && (
        <EmployeeTableView
          data={data}
          loading={loading}
          onRowClick={open}
          onFlag={(emp) => askConfirm("flag", emp)}
        />
      )}

      {view === "grid" && (
        <div className="grid">
          {data.map((emp) => (
            <EmployeeTile
              key={emp.id}
              emp={emp}
              onClick={open}
              onEdit={(emp) => askConfirm("edit", emp)}
              onFlag={(emp) => askConfirm("flag", emp)}
              onDelete={(emp) => askConfirm("del", emp)}
            />
          ))}
          {data.length === 0 && !loading && (
            <div style={{ padding: 20, color: "var(--muted)" }}>
              No records.
            </div>
          )}
        </div>
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPrev={handlePrev}
        onNext={handleNext}
        onPageSize={handlePageSize}
      />

      <EmployeeModal emp={selected} onClose={close} />

      <ConfirmModal
        open={confirmOpen}
        title={
          confirmRef.current.action === "flag"
            ? `${
                confirmRef.current.emp?.flagged ? "Unflag" : "Flag"
              } confirmation`
            : confirmRef.current.action === "del"
            ? "Delete confirmation"
            : "Edit"
        }
        body={
          confirmRef.current.action === "flag"
            ? `Are you sure you want to ${
                confirmRef.current.emp?.flagged ? "remove flag from" : "flag"
              } "${confirmRef.current.emp?.name}"?`
            : confirmRef.current.action === "del"
            ? `Permanently delete "${confirmRef.current.emp?.name}"?`
            : `Edit "${confirmRef.current.emp?.name}" (demo). Proceed?`
        }
        confirmText={confirmRef.current.action === "del" ? "Delete" : "Yes"}
        cancelText="Cancel"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </div>
  );
}
