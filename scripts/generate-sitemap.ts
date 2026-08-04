// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs"
import { resolve } from "path"

const BASE_URL = "https://ville-connectee.lovable.app"

interface SitemapEntry {
  path: string
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: string
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/actualites", changefreq: "daily", priority: "0.9" },
  { path: "/evenements", changefreq: "daily", priority: "0.9" },
  { path: "/immobilier", changefreq: "daily", priority: "0.8" },
  { path: "/marche", changefreq: "daily", priority: "0.8" },
  { path: "/services", changefreq: "weekly", priority: "0.8" },
  { path: "/appels-rapides", changefreq: "monthly", priority: "0.6" },
  { path: "/annuaire", changefreq: "weekly", priority: "0.7" },
  { path: "/sante-proximite", changefreq: "weekly", priority: "0.7" },
  { path: "/carburant-gaz", changefreq: "weekly", priority: "0.6" },
  { path: "/maquis-resto", changefreq: "weekly", priority: "0.6" },
  { path: "/hotelerie", changefreq: "weekly", priority: "0.6" },
  { path: "/taxi", changefreq: "weekly", priority: "0.6" },
  { path: "/taxi-communal", changefreq: "weekly", priority: "0.6" },
  { path: "/emplois", changefreq: "daily", priority: "0.8" },
  { path: "/main-doeuvre", changefreq: "weekly", priority: "0.7" },
  { path: "/associations", changefreq: "weekly", priority: "0.6" },
  { path: "/villages", changefreq: "monthly", priority: "0.6" },
  { path: "/annonces", changefreq: "daily", priority: "0.7" },
  { path: "/necrologie", changefreq: "daily", priority: "0.6" },
  { path: "/souvenirs", changefreq: "weekly", priority: "0.5" },
  { path: "/tribune", changefreq: "weekly", priority: "0.6" },
  { path: "/suggestions", changefreq: "weekly", priority: "0.5" },
  { path: "/alertes", changefreq: "daily", priority: "0.7" },
  { path: "/materiels-gratuits", changefreq: "weekly", priority: "0.6" },
  { path: "/radio", changefreq: "weekly", priority: "0.6" },
  { path: "/jukebox", changefreq: "weekly", priority: "0.5" },
  { path: "/catalogue", changefreq: "weekly", priority: "0.6" },
  { path: "/steve-yobouet", changefreq: "monthly", priority: "0.5" },
]

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  )

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n")
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries))
console.log(`sitemap.xml written (${entries.length} entries)`)
