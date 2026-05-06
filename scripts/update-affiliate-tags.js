/**
 * Script de mise à jour des tags d'affiliation Amazon
 *
 * Usage :
 *   node scripts/update-affiliate-tags.js --fr TON-TAG-FR --de TON-TAG-DE --es TON-TAG-ES
 *
 * Exemple :
 *   node scripts/update-affiliate-tags.js --fr europrix-21 --de europrix-22 --es europrix-23
 */

const fs = require("fs")
const path = require("path")

const args = process.argv.slice(2)
const get = (flag) => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : null
}

const tagFR = get("--fr")
const tagDE = get("--de")
const tagES = get("--es")

if (!tagFR || !tagDE || !tagES) {
  console.error("❌  Usage : node scripts/update-affiliate-tags.js --fr TAG_FR --de TAG_DE --es TAG_ES")
  process.exit(1)
}

const filePath = path.join(__dirname, "../data/products.json")
let raw = fs.readFileSync(filePath, "utf-8")

const before = raw

raw = raw.replace(/VOTRE-TAG-FR/g, tagFR)
raw = raw.replace(/VOTRE-TAG-DE/g, tagDE)
raw = raw.replace(/VOTRE-TAG-ES/g, tagES)

// Also handle any existing tags (for re-runs)
const products = JSON.parse(raw)
const updated = products.map((p) => ({
  ...p,
  prices: Object.fromEntries(
    Object.entries(p.prices).map(([country, offer]) => {
      const tag = country === "FR" ? tagFR : country === "DE" ? tagDE : tagES
      const url = new URL(offer.affiliate_url)
      url.searchParams.set("tag", tag)
      return [country, { ...offer, affiliate_url: url.toString() }]
    })
  ),
}))

fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8")

const count = products.length * 3
console.log(`✅  ${count} liens affiliés mis à jour dans products.json`)
console.log(`   FR → ${tagFR}`)
console.log(`   DE → ${tagDE}`)
console.log(`   ES → ${tagES}`)
