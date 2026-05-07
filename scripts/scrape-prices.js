#!/usr/bin/env node
/**
 * EuroPrix — Playwright price scraper
 *
 * Visite les pages Amazon avec un vrai navigateur (JavaScript rendu),
 * extrait les prix et met à jour data/products.json.
 *
 * Usage :
 *   node scripts/scrape-prices.js                      ← tous les produits, tous les pays
 *   node scripts/scrape-prices.js --country FR          ← France uniquement
 *   node scripts/scrape-prices.js --id iphone-16        ← un seul produit
 *   node scripts/scrape-prices.js --id iphone-16 --country DE
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

// ── Config ────────────────────────────────────────────────────────────────────
const DOMAINS = {
  FR: { base: "https://www.amazon.fr", lang: "fr-FR,fr;q=0.9" },
  DE: { base: "https://www.amazon.de", lang: "de-DE,de;q=0.9" },
  ES: { base: "https://www.amazon.es", lang: "es-ES,es;q=0.9" },
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const DELAY_MS = 2000; // délai poli entre requêtes

// ── Helpers ───────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function extractAsin(url) {
  const m = url.match(/\/dp\/([A-Z0-9]{10})/);
  return m ? m[1] : null;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

// ── Scrape une page produit Amazon ────────────────────────────────────────────
async function scrapePage(browser, domainInfo, asin) {
  const url = `${domainInfo.base}/dp/${asin}`;
  const context = await browser.newContext({
    userAgent: UA,
    locale: domainInfo.lang.split(",")[0].replace(";q=0.9", ""),
    extraHTTPHeaders: { "Accept-Language": domainInfo.lang },
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });

    // Détection CAPTCHA / robot
    const title = await page.title();
    if (
      title.toLowerCase().includes("robot") ||
      title.toLowerCase().includes("captcha") ||
      title.toLowerCase().includes("sorry")
    ) {
      await context.close();
      return { error: "CAPTCHA" };
    }

    // ── Prix ─────────────────────────────────────────────────────────────────
    const price = await page.evaluate(() => {
      // Méthode 1 : sélecteurs CSS standard
      const whole = document.querySelector(
        ".a-price-whole, #priceblock_ourprice, #priceblock_dealprice"
      );
      const frac = document.querySelector(".a-price-fraction");
      if (whole) {
        const w = whole.textContent.replace(/[^0-9]/g, "");
        const f = frac
          ? frac.textContent.replace(/[^0-9]/g, "").substring(0, 2).padEnd(2, "0")
          : "00";
        const val = parseFloat(`${w}.${f}`);
        if (!isNaN(val) && val > 0) return val;
      }

      // Méthode 2 : chercher dans les scripts JSON (corePriceDisplay)
      const scripts = document.querySelectorAll('script[type="text/javascript"]');
      for (const s of scripts) {
        const m = s.textContent.match(/"displayAmount"\s*:\s*"([0-9\s]+[,\.][0-9]+)\s*€"/);
        if (m) {
          const raw = m[1].replace(/\s/g, "").replace(",", ".");
          const val = parseFloat(raw);
          if (!isNaN(val) && val > 0) return val;
        }
      }
      return null;
    });

    // ── Disponibilité ─────────────────────────────────────────────────────────
    const inStock = await page.evaluate(() => {
      const avail = document.querySelector("#availability span");
      if (!avail) return true; // pas de bloc = généralement dispo
      const t = avail.textContent.toLowerCase();
      const unavailable = [
        "actuellement indisponible",
        "derzeit nicht verfügbar",
        "no disponible",
        "currently unavailable",
        "introuvable",
      ];
      return !unavailable.some((w) => t.includes(w));
    });

    // ── Image ─────────────────────────────────────────────────────────────────
    const image = await page.evaluate(() => {
      // Chercher hiRes dans les scripts
      const scripts = document.querySelectorAll('script[type="text/javascript"]');
      for (const s of scripts) {
        const m = s.textContent.match(
          /"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/[^"]+)"/
        );
        if (m) return m[1];
      }
      // Fallback : balise img principale
      const img = document.querySelector("#landingImage");
      return img?.dataset?.oldHires || img?.src || null;
    });

    // ── Description ───────────────────────────────────────────────────────────
    const description = await page.evaluate(() => {
      const bullets = document.querySelector("#feature-bullets ul");
      if (bullets) {
        const items = [...bullets.querySelectorAll("li span:not(.a-list-item)")];
        if (items.length > 0)
          return items
            .map((i) => i.textContent.trim())
            .filter(Boolean)
            .slice(0, 3)
            .join(". ")
            .substring(0, 200);
      }
      const desc = document.querySelector("#productDescription p");
      return desc ? desc.textContent.trim().substring(0, 200) : null;
    });

    await context.close();
    return {
      price: inStock && price ? price : null,
      in_stock: inStock && price !== null,
      image,
      description,
    };
  } catch (err) {
    await context.close();
    return { error: err.message.split("\n")[0] };
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : null;
  };

  const countryFilter = getArg("--country");
  const idFilter = getArg("--id");

  const productsPath = path.join(__dirname, "../data/products.json");
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

  console.log("🚀 EuroPrix — Scraper de prix Amazon");
  console.log(`   Produits : ${idFilter || "tous"}`);
  console.log(`   Pays     : ${countryFilter || "FR + DE + ES"}\n`);

  const browser = await chromium.launch({ headless: true });
  let updated = 0, failed = 0, skipped = 0;

  for (const product of products) {
    if (idFilter && product.id !== idFilter) continue;

    console.log(`\n📦 ${product.name}`);

    const entries = Object.entries(product.prices);
    for (const [country, offer] of entries) {
      if (countryFilter && country !== countryFilter) continue;

      const asin = extractAsin(offer.affiliate_url);
      if (!asin) {
        console.log(`  ${country}: ⚠  ASIN introuvable dans l'URL`);
        skipped++;
        continue;
      }

      process.stdout.write(`  ${country}: scraping ${asin}… `);
      const result = await scrapePage(browser, DOMAINS[country], asin);

      if (result.error) {
        console.log(`❌ ${result.error}`);
        failed++;
      } else {
        const oldPrice = offer.price;
        const newPrice = result.price;
        const wasStock = offer.in_stock;

        offer.price = newPrice || 0;
        offer.in_stock = result.in_stock;
        offer.updated_at = today();

        // Mise à jour image si on en a trouvé une meilleure (URL Amazon directe)
        if (
          result.image &&
          result.image.includes("m.media-amazon.com") &&
          !product.image.startsWith("/products/")
        ) {
          product.image = result.image;
        }

        // Mise à jour description si on en a une
        if (result.description && (!product.description || product.description.length < 50)) {
          product.description = result.description;
        }

        // Affichage du résultat
        const stockIcon = result.in_stock ? "✓" : "✗";
        const priceStr = newPrice ? `${newPrice.toFixed(2)} €` : "indisponible";
        let change = "";
        if (newPrice && oldPrice && oldPrice > 0 && Math.abs(newPrice - oldPrice) > 0.01) {
          const diff = newPrice - oldPrice;
          change = diff > 0 ? ` (↑ +${diff.toFixed(2)}€)` : ` (↓ ${diff.toFixed(2)}€)`;
        }

        console.log(`${stockIcon} ${priceStr}${change}`);
        updated++;
      }

      await sleep(DELAY_MS + Math.random() * 1000);
    }
  }

  await browser.close();

  // Sauvegarde
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), "utf-8");

  console.log(`\n${"─".repeat(50)}`);
  console.log(`✅ Terminé`);
  console.log(`   ✓ Mis à jour : ${updated}`);
  console.log(`   ✗ Échecs     : ${failed}`);
  console.log(`   ⚠  Ignorés   : ${skipped}`);
  console.log(`   📝 data/products.json sauvegardé`);
}

main().catch((err) => {
  console.error("Erreur fatale :", err.message);
  process.exit(1);
});
