import { getCollection } from 'astro:content';

export async function GET(context: { site?: URL }) {
  const site = (context.site?.toString() || 'https://example.sk').replace(/\/$/, '');
  const towns = await getCollection('towns');
  const now = new Date();
  const blogPosts = await getCollection('blog');
  const publishedBlogPosts = blogPosts.filter(
    (p) => p.data.draft !== true && p.data.pubDate <= now,
  );
  const routes = [
    '/', '/dane', '/financne-poradenstvo', '/hypoteky', '/poistenie', '/cennik', '/o-mne', '/kontakt', '/kariera',
    '/blog',
    ...towns.map((t) => `/${t.slug}`),
    ...publishedBlogPosts.map((p) => `/blog/${p.slug}`),
  ];
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    routes.map((r) => `  <url><loc>${site}${r}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
