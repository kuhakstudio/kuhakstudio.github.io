import assert from 'node:assert/strict';
import { readFile, access, copyFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
// Preserve the existing public .html URL while using the shared Astro layout.
await copyFile(path.join(dist, 'shakchunnir-badhon/privacy/index.html'), path.join(dist, 'shakchunnir-badhon/privacy.html'));
const policySource = await readFile(path.join(root, 'shakchunnir-badhon/privacy.html'), 'utf8');
const policyOutput = await readFile(path.join(dist, 'shakchunnir-badhon/privacy.html'), 'utf8');
const policyBody = html => html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
assert.equal(policyBody(policyOutput), policyBody(policySource), 'Privacy policy body must remain verbatim');
const protectedFiles = ['app-ads.txt'];
for (const file of protectedFiles) {
  assert.deepEqual(await readFile(path.join(dist, file)), await readFile(path.join(root, file)), `${file} must remain byte-for-byte unchanged`);
}
for (const file of ['index.html', 'shakchunnir-badhon/index.html', 'shakchunnir-badhon/privacy.html', '404.html']) {
  const html = await readFile(path.join(dist, file), 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:[a-z]+:|\/\/)/i.test(href)) continue;
    const url = new URL(href, `https://kuhakstudio.github.io/${file}`);
    let local = path.join(dist, decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) local = path.join(local, 'index.html');
    await access(local).catch(() => { throw new Error(`Broken local asset/link in ${file}: ${href}`); });
    if (href.startsWith('#')) assert(ids.has(href.slice(1)), `Missing anchor in ${file}: ${href}`);
  }
  console.log(`Verified routes and assets: ${file}`);
}
console.log('Privacy policy body preserved verbatim; app-ads.txt preserved byte-for-byte.');

// Keep the maintained design in Tailwind rather than handwritten stylesheets.
assert.equal((await readFile(path.join(root, 'src/styles/global.css'), 'utf8')).trim(), '@import "tailwindcss";');
console.log('Tailwind-only stylesheet verified.');
