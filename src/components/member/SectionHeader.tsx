interface SectionHeaderProps {
  badge: string;
  title: string;
  description: string;
  selected: string;
}

export function SectionHeader({ badge, title, description, selected }: SectionHeaderProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-sm font-medium text-[var(--color-primary)]">{badge}</div>
      <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)]">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
      <div className="mt-3 inline-flex rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-3 py-1.5 text-sm text-[var(--color-primary)]">
        현재 메뉴: {selected}
      </div>
    </div>
  );
}
