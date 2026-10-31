import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) => {
  const paths = ['/', '/shakchunnir-badhon/', '/shakchunnir-badhon/privacy.html'];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${new URL(path, site)}</loc></url>`).join('')}</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
