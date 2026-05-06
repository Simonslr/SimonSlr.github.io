const codes: Record<string, string> = { FR: "fr", DE: "de", ES: "es" }

export default function Flag({ country, size = 20 }: { country: string; size?: number }) {
  const code = codes[country] ?? country.toLowerCase()
  const h = Math.round(size * 0.75)
  return (
    <img
      src={`https://flagcdn.com/${size}x${h}/${code}.png`}
      srcSet={`https://flagcdn.com/${size * 2}x${h * 2}/${code}.png 2x`}
      width={size}
      height={h}
      alt={country}
      className="rounded-sm object-cover flex-shrink-0"
      style={{ display: "inline-block" }}
    />
  )
}
