interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[color:var(--border-mid)] bg-[color:var(--surface)] px-6 py-24 text-center">
      <p className="font-display text-2xl font-bold tracking-tight text-[color:var(--foreground)] [text-wrap:balance]">{title}</p>
      <p className="mt-3 max-w-sm text-sm leading-7 text-[color:var(--text-muted)]">{message}</p>
    </div>
  );
}
