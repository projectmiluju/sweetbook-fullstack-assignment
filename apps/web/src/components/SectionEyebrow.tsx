interface SectionEyebrowProps {
  children: React.ReactNode;
}

export function SectionEyebrow({ children }: SectionEyebrowProps) {
  return (
    <p className="text-xs font-semibold tracking-[0.25em] text-[color:var(--accent)] uppercase">
      {children}
    </p>
  );
}
