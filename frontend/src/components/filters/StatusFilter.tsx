interface StatusFilterProps {
  options: string[];
  value: string;
  onChange: (status: string) => void;
}

export function StatusFilter({ options, value, onChange }: StatusFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-bg-tertiary border border-border-subtle rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
    >
      <option value="">Todos</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
