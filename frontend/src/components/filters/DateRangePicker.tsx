interface DateRangePickerProps {
  value: { start: string; end: string };
  onChange: (range: { start: string; end: string }) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={value.start}
        onChange={(e) => onChange({ ...value, start: e.target.value })}
        className="bg-bg-tertiary border border-border-subtle rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
      />
      <span className="text-text-muted text-sm">até</span>
      <input
        type="date"
        value={value.end}
        onChange={(e) => onChange({ ...value, end: e.target.value })}
        className="bg-bg-tertiary border border-border-subtle rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
      />
    </div>
  );
}
