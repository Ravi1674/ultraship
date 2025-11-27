/**
 * employeeService
 * - Provides list/get/add/update/delete operations.
 * - Uses file-based repository for demo.
 * - Encapsulates filtering, sorting, and pagination.
 */

const repository = require("../data/repository");
const { v4: uuidv4 } = require("uuid");

/**
 * Apply filter object to data array.
 */
function applyFilter(data, filter = {}) {
  let out = data;
  if (filter.nameContains) {
    const q = filter.nameContains.toLowerCase();
    out = out.filter((e) => e.name.toLowerCase().includes(q));
  }
  if (filter.minAge !== undefined)
    out = out.filter((e) => e.age >= filter.minAge);
  if (filter.maxAge !== undefined)
    out = out.filter((e) => e.age <= filter.maxAge);
  if (filter.classEquals)
    out = out.filter((e) => e.class === filter.classEquals);
  if (typeof filter.flagged === "boolean")
    out = out.filter((e) => e.flagged === filter.flagged);
  return out;
}

/**
 * Generic sorter
 */
function applySort(data, sortBy = "name", sortDir = "asc") {
  const copy = [...data];
  copy.sort((a, b) => {
    const A = a[sortBy];
    const B = b[sortBy];
    if (A == null) return 1;
    if (B == null) return -1;
    if (typeof A === "string")
      return sortDir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
    return sortDir === "asc" ? A - B : B - A;
  });
  return copy;
}

module.exports = {
  list: async ({
    filter = {},
    page = 1,
    pageSize = 10,
    sortBy = "name",
    sortDir = "asc",
  }) => {
    const all = await repository.readAll();
    const filtered = applyFilter(all, filter);
    const sorted = applySort(filtered, sortBy, sortDir);
    const total = sorted.length;
    const start = (page - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);
    return { items, total, page, pageSize };
  },

  getById: async (id) => {
    const all = await repository.readAll();
    return all.find((e) => e.id === id) || null;
  },

  add: async (input) => {
    const all = await repository.readAll();
    const newEmp = { id: uuidv4(), ...input };
    all.push(newEmp);
    await repository.writeAll(all);
    return newEmp;
  },

  update: async (id, input) => {
    const all = await repository.readAll();
    const idx = all.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Employee not found");
    all[idx] = { ...all[idx], ...input };
    await repository.writeAll(all);
    return all[idx];
  },

  remove: async (id) => {
    const all = await repository.readAll();
    const before = all.length;
    const after = all.filter((e) => e.id !== id);
    await repository.writeAll(after);
    return after.length < before;
  },
};
