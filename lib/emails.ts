import { Resend } from "resend"
import { htmlEscape, isHttpsUrl } from "@/lib/security"

const FROM = "CompareUro <alertes@compareuro.com>"
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://compareuro.com"

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

function fmt(n: number) {
  return n.toFixed(2).replace(".", ",") + " €"
}

// Shared header HTML
const emailHeader = `
  <tr>
    <td style="background:#0a0f1e;padding:28px 40px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:10px;vertical-align:middle;">
                  <svg width="22" height="22" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 46 46 Q 28 25 17 17" stroke="white" stroke-width="7" fill="none" stroke-linecap="round"/>
                    <polygon points="0,0 10,4 10,-4" fill="white" transform="translate(17 17) rotate(-135)"/>
                    <path d="M 54 46 Q 72 25 83 17" stroke="white" stroke-width="7" fill="none" stroke-linecap="round"/>
                    <polygon points="0,0 10,4 10,-4" fill="white" transform="translate(83 17) rotate(-45)"/>
                    <path d="M 54 54 Q 72 75 83 83" stroke="white" stroke-width="7" fill="none" stroke-linecap="round"/>
                    <polygon points="0,0 10,4 10,-4" fill="white" transform="translate(83 83) rotate(45)"/>
                    <path d="M 46 54 Q 28 75 17 83" stroke="white" stroke-width="7" fill="none" stroke-linecap="round"/>
                    <polygon points="0,0 10,4 10,-4" fill="white" transform="translate(17 83) rotate(135)"/>
                  </svg>
                </td>
                <td style="vertical-align:middle;">
                  <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:17px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">CompareUro</span>
                </td>
              </tr>
            </table>
          </td>
          <td align="right" style="vertical-align:middle;">
            <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:rgba(245,245,247,0.45);letter-spacing:0.06em;text-transform:uppercase;">FR &middot; DE &middot; ES</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`

const emailFooter = (unsubUrl: string) => `
  <tr>
    <td style="padding:32px 40px;border-top:1px solid #e2e8f0;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:#94a3b8;line-height:1.7;">
            <strong style="color:#64748b;">CompareUro</strong> &mdash; Comparateur Amazon France, Allemagne, Espagne.<br/>
            <a href="${htmlEscape(unsubUrl)}" style="color:#94a3b8;text-decoration:underline;">G&eacute;rer mes pr&eacute;f&eacute;rences</a>
            &nbsp;&middot;&nbsp;
            <a href="${htmlEscape(SITE)}/mentions-legales" style="color:#94a3b8;text-decoration:underline;">Mentions l&eacute;gales</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`

function buildEmail(body: string, footerUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>CompareUro</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background:#f1f5f9;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06),0 8px 24px rgba(0,0,0,0.04);">
          ${emailHeader}
          ${body}
          ${emailFooter(footerUrl)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendWelcomeEmail(email: string) {
  const resend = getResend()
  if (!resend) return

  const body = `
    <tr>
      <td style="padding:48px 40px 40px;">
        <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#2563eb;margin:0 0 16px;">
          Bienvenue
        </p>
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:400;font-style:italic;color:#0f172a;margin:0 0 20px;line-height:1.15;letter-spacing:-0.01em;">
          Le m&ecirc;me produit,<br/>moins cher en Europe.
        </h1>
        <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:16px;color:#475569;line-height:1.7;margin:0 0 32px;">
          Votre compte est actif. CompareUro compare Amazon France, Allemagne et Espagne &mdash;
          livraison incluse &mdash; pour vous indiquer o&ugrave; acheter au meilleur prix.
        </p>

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
          <tr>
            <td width="4" style="background:#2563eb;border-radius:4px;">&nbsp;</td>
            <td style="padding:0 0 0 20px;">
              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:600;color:#0f172a;margin:0 0 6px;">Favoris</p>
              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#64748b;margin:0;line-height:1.6;">
                Sauvegardez les produits qui vous int&eacute;ressent depuis chaque fiche produit.
              </p>
            </td>
          </tr>
          <tr><td colspan="2" style="padding:12px 0;">&nbsp;</td></tr>
          <tr>
            <td width="4" style="background:#059669;border-radius:4px;">&nbsp;</td>
            <td style="padding:0 0 0 20px;">
              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:600;color:#0f172a;margin:0 0 6px;">Alertes prix</p>
              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#64748b;margin:0;line-height:1.6;">
                D&eacute;finissez un seuil de prix. Nous vous notifions d&egrave;s qu&rsquo;il est atteint.
              </p>
            </td>
          </tr>
        </table>

        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-radius:10px;background:#2563eb;">
              <a href="${htmlEscape(SITE)}/#catalogue" style="display:inline-block;padding:14px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.01em;">
                Voir les &eacute;conomies du jour &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `

  await resend.emails.send({
    from:    FROM,
    to:      email,
    subject: "Bienvenue sur CompareUro",
    html:    buildEmail(body, `${SITE}/compte`),
  })
}

export async function sendAlertEmail(opts: {
  email:        string
  productName:  string
  productSlug:  string
  currentPrice: number
  targetPrice:  number
  country:      string
  affiliateUrl: string
}) {
  const resend = getResend()
  if (!resend) return

  const marketplace: Record<string, string> = {
    FR: "Amazon.fr",
    DE: "Amazon.de",
    ES: "Amazon.es",
  }

  // Validate affiliate URL before embedding in email link
  const safeAffiliateUrl = isHttpsUrl(opts.affiliateUrl) ? opts.affiliateUrl : `${SITE}/produit/${opts.productSlug}`
  const safeProductUrl   = `${SITE}/produit/${opts.productSlug}`

  // Escape all user-controlled strings before interpolating into HTML
  const safeProductName = htmlEscape(opts.productName)
  const safeMarketplace = htmlEscape(marketplace[opts.country] ?? opts.country)
  const saving          = opts.targetPrice - opts.currentPrice

  const body = `
    <tr>
      <td style="padding:48px 40px 0;">
        <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#059669;margin:0 0 14px;">
          Alerte prix d&eacute;clench&eacute;e
        </p>
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;font-style:italic;color:#0f172a;margin:0 0 32px;line-height:1.2;letter-spacing:-0.01em;">
          ${safeProductName}
        </h1>
      </td>
    </tr>

    <tr>
      <td style="padding:0 40px 32px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px;">
              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#059669;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;margin:0 0 10px;">
                Meilleur prix actuel
              </p>
              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:48px;font-weight:700;color:#059669;letter-spacing:-0.04em;margin:0 0 8px;line-height:1;">
                ${fmt(opts.currentPrice)}
              </p>
              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#475569;margin:0;">
                Sur <strong>${safeMarketplace}</strong> &middot; livraison incluse &middot; vendeur officiel
              </p>
              ${saving > 0 ? `
              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#64748b;margin:10px 0 0;">
                Votre seuil &eacute;tait : ${fmt(opts.targetPrice)} &mdash; vous &eacute;conomisez <strong style="color:#059669;">${fmt(saving)}</strong> de plus
              </p>` : `
              <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#64748b;margin:10px 0 0;">
                Votre seuil : ${fmt(opts.targetPrice)}
              </p>`}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:0 40px 48px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-radius:10px;background:#2563eb;">
              <a href="${htmlEscape(safeAffiliateUrl)}" style="display:inline-block;padding:14px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.01em;">
                Acheter sur ${safeMarketplace} &rarr;
              </a>
            </td>
            <td style="padding-left:12px;">
              <a href="${htmlEscape(safeProductUrl)}" style="display:inline-block;padding:14px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#475569;text-decoration:none;border:1px solid #e2e8f0;border-radius:10px;">
                Voir la comparaison
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `

  await resend.emails.send({
    from:    FROM,
    to:      opts.email,
    subject: `${opts.productName} — ${fmt(opts.currentPrice)} sur ${marketplace[opts.country] ?? opts.country}`,
    html:    buildEmail(body, `${SITE}/compte`),
  })
}
