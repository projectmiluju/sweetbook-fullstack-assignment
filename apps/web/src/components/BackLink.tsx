import Link from "next/link";

interface BackLinkProps {
  href: string;
  children: React.ReactNode;
}

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-sm font-medium text-[color:var(--text-muted)] hover:text-[color:var(--accent)] hover:scale-[1.02]"
    >
      <span
        aria-hidden="true"
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--border-mid)] text-xs transition-all group-hover:border-[color:var(--accent)] group-hover:bg-[color:var(--accent)] group-hover:text-white"
      >
        &larr;
      </span>
      {children}
    </Link>
  );
}
