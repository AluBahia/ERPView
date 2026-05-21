import { useFilterStore } from '../../store/filterStore';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const DATE_RANGES = [
  'Hoje',
  'Últimos 7 dias',
  'Últimos 15 dias',
  'Últimos 30 dias',
  'Últimos 90 dias',
  'Este mês',
  'Este trimestre',
  'Este ano',
  'Personalizado',
];

const FILIAIS = ['Todas', 'Filial 01 – Matriz', 'Filial 02 – São Paulo', 'Filial 03 – Belo Horizonte'];

const VENDEDORES = ['Todos', 'Ana Costa', 'Carlos Lima', 'Marcos Oliveira', 'Patrícia Santos', 'Roberto Almeida'];

/* -------------------------------------------------------------------------- */
/*  Shared select styling                                                     */
/* -------------------------------------------------------------------------- */

const selectClasses =
  'bg-bg-tertiary border border-border-subtle rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50 cursor-pointer appearance-none pr-8 bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-[position:right_8px_center] bg-no-repeat';

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function FilterBar() {
  const { dateRange, filial, vendedor, setDateRange, setFilial, setVendedor } = useFilterStore();

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date range */}
      <div className="flex flex-col gap-0.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          Período
        </label>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className={selectClasses}
        >
          {DATE_RANGES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Filial */}
      <div className="flex flex-col gap-0.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          Filial
        </label>
        <select
          value={filial}
          onChange={(e) => setFilial(e.target.value)}
          className={selectClasses}
        >
          {FILIAIS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Vendedor */}
      <div className="flex flex-col gap-0.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          Vendedor
        </label>
        <select
          value={vendedor}
          onChange={(e) => setVendedor(e.target.value)}
          className={selectClasses}
        >
          {VENDEDORES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
