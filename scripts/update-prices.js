/**
 * Script de mise à jour manuelle des prix
 *
 * Usage : node scripts/update-prices.js
 *
 * Ce script ouvre chaque fiche produit Amazon et te guide pour
 * mettre à jour le prix manuellement dans products.json.
 *
 * Pour une mise à jour automatique, il faudrait l'API
 * Amazon Product Advertising API (disponible après 3 ventes
 * affiliées qualifiées).
 */

const products = require("../data/products.json")

console.log("\n📦  EuroPrix — Vérification des prix\n")
console.log("Ouvre chaque lien ci-dessous dans ton navigateur,")
console.log("note le prix actuel, puis mets à jour data/products.json\n")
console.log("─".repeat(70))

products.forEach((p) => {
  console.log(`\n▶  ${p.name}`)
  Object.entries(p.prices).forEach(([country, offer]) => {
    // Build a clean Amazon URL (without affiliate tag for price checking)
    const asin = offer.affiliate_url.match(/\/dp\/([A-Z0-9]{10})/)?.[1] ?? "?"
    const domain = { FR: "amazon.fr", DE: "amazon.de", ES: "amazon.es" }[country]
    const cleanUrl = `https://www.${domain}/dp/${asin}`
    console.log(`   ${country}  ${offer.price.toFixed(2)} € → ${cleanUrl}`)
  })
})

console.log("\n─".repeat(70))
console.log("\nAprès mise à jour, relance le serveur de développement.")
console.log("N'oublie pas de mettre à jour le champ updated_at avec la date du jour.\n")
