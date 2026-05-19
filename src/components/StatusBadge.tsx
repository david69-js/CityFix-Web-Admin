interface Props {
  name: string;
  color?: string;
}

export default function StatusBadge({ name, color }: Props) {
  const bg = color || '#6B7280';
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: bg }}
    >
      {name}
    </span>
  );
}
