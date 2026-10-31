import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('dist');
const origin = 'https://kuhakstudio.github.io';
const pages = [
  ['index.html', '/'],
  ['shakchunnir-badhon/index.html', '/shakchunnir-badhon/'],
  ['shakchunnir-badhon/privacy.html', '/shakchunnir-badhon/privacy.html'],
  ['404.html', '/404.html'],
];
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const localExists = async url => {
  const parsed = new URL(url, origin);
  assert.equal(parsed.origin, origin, `Unexpected host: ${url}`);
  const file = path.join(output, parsed.pathname, parsed.pathname.endsWith('/') ? 'index.html' : '');
  await access(file);
  return file;
};
const titleSet = new Set();
const descriptionSet = new Set();
for (const [file, pathname] of pages) {
  const html = await readFile(path.join(output, file), 'utf8');
  const titles = [...html.matchAll(/<title>([\s\S]*?)<\/title>/g)];
  assert.equal(titles.length, 1, `${file}: one document title`);
  assert(!titleSet.has(titles[0][1]), `${file}: duplicate title`);titleSet.add(titles[0][1]);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${file}: one main heading`);
  const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map(m => attrs(m[0]));
  const meta = name => metas.find(m => m.name === name || m.property === name)?.content;
  assert.equal(metas.filter(m => m.name === 'description').length, 1);
  const description = meta('description');assert(description?.length >= 50 && description.length <= 200);
  assert(!descriptionSet.has(description));descriptionSet.add(description);
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(m => attrs(m[0]));
  assert.equal(links.filter(l => l.rel === 'canonical').length, 1);
  assert.equal(links.find(l => l.rel === 'canonical').href, origin + pathname);
  for (const key of ['og:title','og:description','og:image','og:image:alt','og:image:type','og:site_name','twitter:title','twitter:description','twitter:image','twitter:image:alt']) assert(meta(key), `${file}: missing ${key}`);
  assert.equal(meta('og:url'), origin + pathname);
  assert.equal(meta('og:image'), meta('twitter:image'));
  assert.equal(meta('og:image:width'), '1200');assert.equal(meta('og:image:height'), '630');
  assert.equal(meta('og:image:type'), 'image/jpeg');assert.equal(meta('twitter:card'), 'summary_large_image');
  await localExists(meta('og:image'));
  assert.equal(meta('og:title'), meta('twitter:title'));assert.equal(meta('og:description'), description);
  assert.equal(meta('viewport'), 'width=device-width, initial-scale=1');
  assert.equal(links.find(l => l.rel === 'apple-touch-icon')?.sizes, '180x180');
  for (const link of links.filter(l => ['icon','apple-touch-icon','manifest'].includes(l.rel))) await localExists(link.href);
  if (file === '404.html') {
    assert(meta('robots').includes('noindex'));
    assert(!html.includes('application/ld+json'));
  } else {
    assert(!meta('robots').includes('noindex'));
    const structured = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert(structured, `${file}: structured data`);
    const data = JSON.parse(structured[1]);assert.equal(data['@context'], 'https://schema.org');
    assert(data['@graph'].some(item => item['@type'] === 'Organization'));
    assert(data['@graph'].some(item => item['@type'] === 'WebPage' && item.url === origin + pathname));
    if (file === 'shakchunnir-badhon/index.html') {
      const game = data['@graph'].find(item => item['@type'] === 'VideoGame');assert(game && game.operatingSystem === 'Android');
      assert(!game.aggregateRating && !game.offers && !game.datePublished, 'Do not invent ratings, availability, or launch dates');
    }
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    const image = attrs(match[0]);assert('alt' in image, `${file}: missing image alt`);
    assert(Number(image.width)>0 && Number(image.height)>0, `${file}: missing intrinsic image dimensions: ${image.src}`);
    if (image.loading === 'lazy') assert(image.fetchpriority !== 'high');
  }
  for (const match of html.matchAll(/<a\b[^>]*>/g)) {
    const link = attrs(match[0]);
    if(link.target === '_blank') assert(link.rel?.includes('noopener'), `${file}: external link rel`);
  }
  console.log(`SEO audit passed: ${pathname}`);
}
const sitemap = await readFile(path.join(output, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.deepEqual(locations.sort(), pages.filter(([p])=>p!=='404.html').map(([,p])=>origin+p).sort());
const robots = await readFile(path.join(output, 'robots.txt'), 'utf8');assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`));assert(robots.includes('Allow: /'));
const manifest = JSON.parse(await readFile(path.join(output, 'site.webmanifest'), 'utf8'));
for(const icon of manifest.icons){const file=await localExists(icon.src);const data=await readFile(file);const size=Number(icon.sizes.split('x')[0]);assert.equal(data.readUInt32BE(16),size);assert.equal(data.readUInt32BE(20),size);}
console.log('Sitemap, robots, social previews, structured data, icons and image metadata verified.');
