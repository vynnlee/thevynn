import { writeFileSync } from "fs";

const generateSitemap = async () => {
  const staticPages = ["/", "/lab", "/library"];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map(
        page => `
    <url>
      <loc>https://mywebsite.com${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>`,
      )
      .join("")}
  </urlset>`;

  writeFileSync("public/sitemap.xml", sitemap);
};

generateSitemap();
