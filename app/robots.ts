import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/compte",
          "/connexion",
          "/inscription",
          "/api/",
          "/auth/",
        ],
      },
    ],
    sitemap: "https://eurocompare.fr/sitemap.xml",
  }
}
