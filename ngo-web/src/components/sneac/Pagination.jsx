import React from 'react';

// Reusable pagination bar used across all SNEAC admin panels.
const Pagination = ({ page, pageSize, total, onPage, onPageSize, pageSizeOptions = [10, 25, 50] }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build a compact page number list: always show first, last, current ±1, with ellipsis gaps
  const pages = [];
  const add = (n) => !pages.includes(n) && pages.push(n);

  add(1);
  if (page > 3) pages.push('...');
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) add(i);
  if (page < totalPages - 2) pages.push('...');
  if (totalPages > 1) add(totalPages);

  if (totalPages <= 1 && total <= pageSizeOptions[0]) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100 text-sm">
      {/* Info */}
      <span className="text-gray-500 text-xs">
        {total === 0 ? 'No results' : `Showing ${from}–${to} of ${total}`}
      </span>

      {/* Pages */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition"
        >
          ‹ Prev
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400 select-none">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold border transition ${
                p === page
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'border-gray-200 hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition"
        >
          Next ›
        </button>
      </div>

      {/* Page-size picker */}
      <select
        value={pageSize}
        onChange={(e) => { onPageSize(Number(e.target.value)); onPage(1); }}
        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {pageSizeOptions.map((s) => (
          <option key={s} value={s}>{s} per page</option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;
