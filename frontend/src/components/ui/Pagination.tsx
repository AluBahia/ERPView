interface PaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between py-3">
      <div className="text-sm text-text-muted">
        {totalItems > 0 ? `Mostrando ${start}-${end} de ${totalItems}` : 'Nenhum resultado'}
      </div>
      <div className="flex items-center gap-3">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-bg-tertiary border border-border-subtle rounded-lg px-2 py-1 text-sm text-text-primary focus:outline-none"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 rounded-lg border border-border-subtle text-sm text-text-secondary hover:bg-bg-tertiary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-sm text-text-muted px-2">
            {page} / {totalPages || 1}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 rounded-lg border border-border-subtle text-sm text-text-secondary hover:bg-bg-tertiary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
