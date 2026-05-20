// Cinematic marquee divider — typographic rhythm between sections.

interface Props {
  speed?:   number
  reverse?: boolean
  dark?:    boolean
}

const TOKENS = [
  { text: "Amazon.fr",             size: "md", flag: "fr" },
  { text: "·",                     size: "sep" },
  { text: "Amazon.de",             size: "md", flag: "de" },
  { text: "·",                     size: "sep" },
  { text: "Amazon.es",             size: "md", flag: "es" },
  { text: "◆",                     size: "sep" },
  { text: "Économisez jusqu'à 30%", size: "sm" },
  { text: "◆",                     size: "sep" },
  { text: "Livraison",             size: "lg", italic: true },
  { text: "incluse",               size: "lg" },
  { text: "◆",                     size: "sep" },
  { text: "Vendeurs officiels",    size: "sm" },
  { text: "◆",                     size: "sep" },
  { text: "Sans inscription",      size: "sm" },
  { text: "×",                     size: "sep" },
]

export default function Marquee({ speed = 60, reverse = false, dark = false }: Props) {
  // Three copies for seamless loop
  const copies = [TOKENS, TOKENS, TOKENS]

  return (
    <div
      className={`mq2${dark ? " mq2--dark" : ""}`}
      data-marquee
      aria-hidden="true"
    >
      <div
        className="mq2__track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {copies.map((copy, ci) => (
          <span key={ci} className="mq2__copy">
            {copy.map((token, ti) => (
              token.size === "sep"
                ? <span key={ti} className="mq2__sep">{token.text}</span>
                : (
                  <span
                    key={ti}
                    className={[
                      "mq2__token",
                      `mq2__token--${token.size}`,
                      token.italic ? "mq2__token--italic" : "",
                      token.flag   ? `mq2__token--${token.flag}` : "",
                    ].filter(Boolean).join(" ")}
                  >
                    {token.text}
                  </span>
                )
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
