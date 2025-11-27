import { request } from "graphql-request";

const RANDOM_USER_API = "https://randomuser.me/api/";

export async function fetchEmployeesFromBackend({
  endpoint,
  query,
  variables,
}) {
  try {
    const resp = await request(endpoint, query, variables);
    return {
      ok: true,
      items: resp.listEmployees.items,
      total: resp.listEmployees.total,
    };
  } catch (err) {
    console.error("GraphQL fetch error:", err);
    return { ok: false, error: err.message || String(err) };
  }
}

export async function fetchEmployeesFromRandomUser({
  page = 1,
  pageSize = 8,
  signal,
} = {}) {
  try {
    const url = `${RANDOM_USER_API}?results=${pageSize}&page=${page}&nat=us,gb,au`;
    const resp = await fetch(url, { signal });
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(
        `RandomUser fetch failed: ${resp.status} ${resp.statusText} — ${txt}`
      );
    }
    const json = await resp.json();
    const items = (json.results || []).map((r, i) => {
      return {
        id: r.login?.uuid || `${r.email}-${i}`,
        name: `${r.name.first} ${r.name.last}`,
        age: r.dob?.age || 20 + i,
        class: `Class ${1 + (i % 5)}`,
        subjects: i % 2 === 0 ? ["Math", "Science"] : ["English", "History"],
        attendance: Math.round((60 + i * 3 + (r.dob?.age % 5)) * 100) / 100,
        flagged: i % 7 === 0,
      };
    });
    return { ok: true, items, total: json.info?.results || items.length };
  } catch (err) {
    console.error("RandomUser fetch error:", err);
    return {
      ok: false,
      error:
        err.name === "AbortError"
          ? "Request canceled"
          : err.message || String(err),
    };
  }
}
