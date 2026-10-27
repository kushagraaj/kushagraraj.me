export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2
        className="border-b pb-2 font-mono text-[11px] tracking-[0.04em]"
        style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
      >
        {title}
      </h2>
      <div className="flex flex-col">{children}</div>
    </section>
  )
}
