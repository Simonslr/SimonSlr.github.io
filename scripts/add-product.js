#!/usr/bin/env node
/**
 * EuroPrix — Ajout automatique d'un produit
 *
 * Donne un ASIN → le script visite Amazon FR/DE/ES, récupère
 * nom, description, image, prix et construit l'entrée products.json.
 *
 * Usage :
 *   node scripts/add-product.js B0DGHY5KG8
 *   node scripts/add-product.js B0DGHY5KG8 --category Smartphones
 *   node scripts/add-product.js B0DGHY5KG8 --dry-run   ← affiche sans sauvegarder
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const DOMAINS = {
  FR: { base: "https://www.amazon.fr", lang: "fr-FR" },
  DE: { base: "https://www.amazon.de", lang: "de-DE" },
  ES: { base: "https://www.amazon.es", lang: "es-ES" },
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

function today() {
  return new Date().toISOString().split("T")[0];
}

// ── Scrape une page Amazon complète ──────────────────────────────────────────
async function scrapeProduct(browser, domainInfo, asin) {
  const url = `${domainInfo.base}/dp/${asin}`;
  const context = await browser.newContext({
    userAgent: UA,
    locale: domainInfo.lang,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });

    const title = await page.title();
    if (title.toLowerCase().includes("robot") || title.toLowerCase().includes("captcha")) {
      await context.close();
      return { error: "CAPTCHA" };
    }

    // ── Nom du produit ────────────────────────────────────────────────────────
    const name = await page.evaluate(() => {
      const el = document.querySelector("#productTitle, h1.a-size-large");
      return el ? el.textContent.trim().replace(/\s+/g, " ") : null;
    });

    // ── Prix ──────────────────────────────────────────────────────────────────
    const price = await page.evaluate(() => {
      const whole = document.querySelector(".a-price-whole");
      const frac = document.querySelector(".a-price-fraction");
      if (whole) {
        const w = whole.textContent.replace(/[^0-9]/g, "");
        const f = frac
          ? frac.textContent.replace(/[^0-9]/g, "").substring(0, 2).padEnd(2, "0")
          : "00";
        const val = parseFloat(`${w}.${f}`);
        if (!isNaN(val) && val > 0) return val;
      }
      return null;
    });

    // ── Disponibilité ─────────────────────────────────────────────────────────
    const inStock = await page.evaluate(() => {
      const avail = document.querySelector("#availability span");
      if (!avail) return true;
      const t = avail.textContent.toLowerCase();
      return !["indisponible", "nicht verfügbar", "no disponible", "unavailable"].some((w) =>
        t.includes(w)
      );
    });

    // ── Image haute résolution ────────────────────────────────────────────────
    const image = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[type="text/javascript"]');
      for (const s of scripts) {
        const m = s.textContent.match(
          /"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/[^"]+)"/
        );
        if (m) return m[1];
      }
      const img = document.querySelector("#landingImage");
      return img?.dataset?.oldHires || img?.src || null;
    });

    // ── Description ───────────────────────────────────────────────────────────
    const description = await page.evaluate(() => {
      const bullets = document.querySelectorAll("#feature-bullets ul li span:not(.a-list-item)");
      if (bullets.length > 0) {
        return [...bullets]
          .map((b) => b.textContent.trim())
          .filter(Boolean)
          .slice(0, 4)
          .join(". ")
          .substring(0, 250);
      }
      const p = document.querySelector("#productDescription p");
      return p ? p.textContent.trim().substring(0, 250) : null;
    });

    // ── Catégorie suggérée ────────────────────────────────────────────────────
    const breadcrumb = await page.evaluate(() => {
      const crumbs = document.querySelectorAll("#wayfinding-breadcrumbs_feature_div li span a");
      return crumbs.length > 0 ? crumbs[crumbs.length - 1].textContent.trim() : null;
    });

    await context.close();
    return {
      name,
      price: inStock && price ? price : null,
      in_stock: inStock && price !== null,
      image,
      description,
      breadcrumb,
    };
  } catch (err) {
    await context.close();
    return { error: err.message.split("\n")[0] };
  }
}

// ── Téléchargement de l'image ─────────────────────────────────────────────────
async function downloadImage(url, id) {
  const https = require("https");
  const destDir = path.join(__dirname, "../public/products");
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const dest = path.join(destDir, `${id}.jpg`);

  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, { headers: { Referer: "https://www.amazon.fr/", "User-Agent": UA } }, (res) => {
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          const size = fs.statSync(dest).size;
          resolve(size > 5000 ? `/products/${id}.jpg` : null);
        });
      })
      .on("error", () => resolve(null));
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const asin = args.find((a) => /^[A-Z0-9]{10}$/.test(a));

  if (!asin) {
    console.error("❌  Usage : node scripts/add-product.js ASIN [--category Catégorie] [--dry-run]");
    process.exit(1);
  }

  const getArg = (flag) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : null;
  };
  const categoryOverride = getArg("--category");
  const dryRun = args.includes("--dry-run");

  console.log(`\n🔍 EuroPrix — Ajout produit ASIN: ${asin}`);

  const browser = await chromium.launch({ headless: true });
  const results = {};

  // Scrape les 3 pays
  for (const [country, domain] of Object.entries(DOMAINS)) {
    process.stdout.write(`  ${country}: scraping… `);
    const data = await scrapeProduct(browser, domain, asin);
    if (data.error) {
      console.log(`❌ ${data.error}`);
    } else {
      console.log(
        `✓ ${data.in_stock ? data.price + "€" : "indisponible"} — ${data.name?.substring(0, 50) || "?"}`
      );
      results[country] = data;
    }
    await sleep(2500 + Math.random() * 1000);
  }

  await browser.close();

  // Choisir le meilleur nom (FR en priorité)
  const bestData = results.FR || results.DE || results.ES;
  if (!bestData) {
    console.error("\n❌ Impossible de récupérer les données pour cet ASIN.");
    process.exit(1);
  }

  // Construire l'ID / slug
  const rawName = bestData.name || `Produit ${asin}`;
  const id = slugify(rawName.split(" ").slice(0, 5).join("-")) || asin.toLowerCase();
  const slug = id;

  // Catégorie
  const category = categoryOverride || bestData.breadcrumb || "Divers";

  // Téléchargement de l'image
  let imagePath = null;
  const imageUrl = bestData.image;
  if (imageUrl) {
    process.stdout.write(`\n  📸 Téléchargement de l'image… `);
    imagePath = await downloadImage(imageUrl, id);
    console.log(imagePath ? `✓ /products/${id}.jpg` : "❌ échec");
  }

  // Construction de l'entrée
  const entry = {
    id,
    slug,
    name: rawName.substring(0, 120),
    category,
    image: imagePath || imageUrl || "",
    description: (bestData.description || "").substring(0, 250),
    prices: {},
  };

  for (const [country, data] of Object.entries(results)) {
    const domain = DOMAINS[country].base;
    entry.prices[country] = {
      price: data.price || 0,
      shipping: 0,
      seller: `Amazon.${country.toLowerCase()}`,
      in_stock: data.in_stock,
      affiliate_url: `${domain}/dp/${asin}?linkCode=ll2&tag=${
        country === "FR" ? "priceeu-21" : "VOTRE-TAG-" + country
      }`,
      updated_at: today(),
    };
  }

  // Remplir les pays manquants
  for (const country of ["FR", "DE", "ES"]) {
    if (!entry.prices[country]) {
      entry.prices[country] = {
        price: 0,
        shipping: 0,
        seller: `Amazon.${country.toLowerCase()}`,
        in_stock: false,
        affiliate_url: `${DOMAINS[country].base}/dp/${asin}?tag=VOTRE-TAG-${country}`,
        updated_at: today(),
      };
    }
  }

  console.log("\n" + "─".repeat(50));
  console.log("📦 Produit construit :");
  console.log(`   Nom       : ${entry.name}`);
  console.log(`   ID/Slug   : ${entry.id}`);
  console.log(`   Catégorie : ${entry.category}`);
  console.log(`   Image     : ${entry.image}`);
  for (const [c, o] of Object.entries(entry.prices)) {
    console.log(`   ${c}        : ${o.in_stock ? o.price + "€" : "indisponible"}`);
  }

  if (dryRun) {
    console.log("\n[dry-run] Pas de sauvegarde.\n");
    console.log(JSON.stringify(entry, null, 2));
    return;
  }

  // Ajout au fichier
  const productsPath = path.join(__dirname, "../data/products.json");
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

  const existing = products.findIndex((p) => p.id === id);
  if (existing !== -1) {
    console.log(`\n⚠  Produit "${id}" déjà existant — mise à jour.`);
    products[existing] = entry;
  } else {
    products.push(entry);
    console.log(`\n✅ Produit ajouté (${products.length} produits au total).`);
  }

  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), "utf-8");
  console.log("📝 data/products.json sauvegardé.\n");
}

main().catch((err) => {
  console.error("Erreur fatale :", err.message);
  process.exit(1);
});
