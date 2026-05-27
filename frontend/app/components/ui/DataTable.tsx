"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";

type Column<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
};

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
}: {
  data: T[];
  columns: Column<T>[];
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const pageSize = 5;

  const filtered = useMemo(() => {
    return data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;

    return [...filtered].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      return sortOrder === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filtered, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-4">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <div className="flex gap-2">
          <button className="px-2 py-2 text-sm border rounded-lg bg-green cursor-pointer" title="Export">
            <Download size={16} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-60 px-3 py-1 border rounded-lg bg-white focus:outline-none"
        />
      </div>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm">

          <thead className="bg-slate-50 border-b">
            <tr>
              {columns.map((col) => {
                const isActive = sortKey === col.key;

                return (
                  <th
                    key={String(col.key)}
                    className={`text-left p-2 select-none ${col.sortable !== false
                      ? "cursor-pointer hover:bg-slate-100"
                      : ""
                      }`}
                    onClick={() =>
                      col.sortable !== false && handleSort(col.key)
                    }
                  >
                    <div className="flex items-center gap-1">
                      {col.label}

                      {isActive && (
                        <span className="text-xs text-slate-500">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>

            {paginated.length > 0 ? (

              paginated.map((row, i) => (

                <tr
                  key={i}
                  className="
          border-b border-[var(--border)]
          hover:bg-black/5
        "
                >

                  {columns.map((col) => (

                    <td
                      key={String(col.key)}
                      className="p-3 text-slate-700"
                    >
                      {row[col.key] as React.ReactNode}
                    </td>

                  ))}

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={columns.length}
                  className="
          p-6
          text-center
          text-slate-500
        "
                >
                  No record found
                </td>

              </tr>

            )}

          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <p>
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded-lg bg-white"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded-lg bg-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}