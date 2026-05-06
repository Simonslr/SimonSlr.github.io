const config: Record<string, { label: string; bg: string; text: string }> = {
  FR: { label: "France", bg: "bg-blue-50", text: "text-blue-700" },
  DE: { label: "Allemagne", bg: "bg-slate-100", text: "text-slate-700" },
  ES: { label: "Espagne", bg: "bg-red-50", text: "text-red-700" },
}

export default function CountryBadge({ code }: { code: string }) {
  const c = config[code] ?? { label: code, bg: "bg-slate-100", text: "text-slate-600" }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className="font-mono tracking-wide">{code}</span>
      <span className="font-normal text-opacity-80">{c.label}</span>
    </span>
  )
}
