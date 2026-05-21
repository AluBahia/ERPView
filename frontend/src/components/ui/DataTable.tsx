import { useState, type ReactNode } from "react";

interface Column<T> {
  key: keyof T & string;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

const PAGE_SIZE = 20;

export function DataTable<T>({
  columns,
  data,
  onRowClick,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const currentPage = safePage;

  const start = currentPage * PAGE_SIZE;
  const pageData = data.slice(start, start + PAGE_SIZE);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="sticky top-0 z-10">
            <tr className="bg-bg-secondary border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 font-medium text-text-muted whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, idx) => (
              <tr
                key={idx}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-border/50 transition-colors ${
                  onRowClick
                    ? "cursor-pointer hover:bg-bg-tertiary"
                    : "hover:bg-bg-tertiary"
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-text-primary whitespace-nowrap"
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : (row[col.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}

            {pageData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-text-muted"
                >
                  Nenhum dado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 text-sm text-text-muted">
          <span>
            {start + 1}&ndash;{Math.min(start + PAGE_SIZE, data.length)} de{" "}
            {data.length}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-2 py-1 rounded hover:bg-bg-tertiary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>

            <span className="px-2">
              {currentPage + 1} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="px-2 py-1 rounded hover:bg-bg-tertiary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Pr&oacute;ximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
