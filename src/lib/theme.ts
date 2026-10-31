// Shared Tailwind class strings for the moonlit-brand look: night black, river teal, moon
// cream, ivory, leaf ember and lamp amber; Cinzel display type and Cormorant Garamond leads.

// Colour tokens live on <html>: dark by default (always, whatever the system setting), light
// when the visitor picks it (data-theme="light", remembered in localStorage by site.js).
export const themeVars = [
  '[color-scheme:dark] data-[theme=light]:[color-scheme:light]',
  '[--night:#05090b] data-[theme=light]:[--night:#e6d8c0]',
  '[--ink:#efe8da] data-[theme=light]:[--ink:#1a1f20]',
  '[--ink-2:#bdbab0] data-[theme=light]:[--ink-2:#3b3f3d]',
  '[--ink-3:#92948b] data-[theme=light]:[--ink-3:#5a5b54]',
  '[--line:#fceed2] data-[theme=light]:[--line:#2e2418]',
  '[--glass:#04080a] data-[theme=light]:[--glass:#e9dcc5]',
  '[--panel:#0a1215] data-[theme=light]:[--panel:#eee1cb]',
  '[--card:#0a1416] data-[theme=light]:[--card:#efe2cc]',
  '[--card-2:#0d1a1d] data-[theme=light]:[--card-2:#e2d1b6]',
  '[--accent:#f59a3c] data-[theme=light]:[--accent:#a2470a]',
  '[--accent-2:#f0773a] data-[theme=light]:[--accent-2:#b0400c]',
  '[--lead:#fef3ce] data-[theme=light]:[--lead:#5e3c1a]',
  '[--hi-1:#fffaf0] data-[theme=light]:[--hi-1:#161c1e]',
  '[--hi-2:#f6e9cc] data-[theme=light]:[--hi-2:#2a3536]',
  '[--hi-3:#d8bb8f] data-[theme=light]:[--hi-3:#62401f]',
  '[--em-end:#fceed2] data-[theme=light]:[--em-end:#74300e]',
  '[--b-teal:#071419] data-[theme=light]:[--b-teal:#efe4d2]',
  '[--b-night:#030608] data-[theme=light]:[--b-night:#e0d1b9]',
  '[--b-mist:#0d1b1e] data-[theme=light]:[--b-mist:#eadcc5]',
  '[--b-dusk:#120a07] data-[theme=light]:[--b-dusk:#e9d0b2]',
  '[--b-deep:#040607] data-[theme=light]:[--b-deep:#dccab0]',
  '[--f-1:#070605] data-[theme=light]:[--f-1:#d8c6a9]',
  '[--f-2:#020303] data-[theme=light]:[--f-2:#ccb796]',
  '[--s-1:#140904] data-[theme=light]:[--s-1:#e3c49c]',
  '[--s-2:#1a0d06] data-[theme=light]:[--s-2:#e9cfab]',
  '[--s-ink:#e9d5b2] data-[theme=light]:[--s-ink:#53321a]',
  '[--t-1:#140c08] data-[theme=light]:[--t-1:#ecd9bd]',
  '[--t-2:#0a1214] data-[theme=light]:[--t-2:#efe2cc]',
  // Background gradient animation (site background): base gradient, five blob colours and the
  // mouse blob as "r,g,b", how blobs blend, and how strongly the blob layer shows.
  '[--g-start:rgb(5,9,11)] data-[theme=light]:[--g-start:rgb(239,228,210)]',
  '[--g-end:rgb(8,24,29)] data-[theme=light]:[--g-end:rgb(228,212,186)]',
  '[--g1:22,163,74] data-[theme=light]:[--g1:248,113,113]',
  '[--g2:5,150,105] data-[theme=light]:[--g2:251,146,60]',
  '[--g3:13,148,136] data-[theme=light]:[--g3:251,191,36]',
  '[--g4:8,145,178] data-[theme=light]:[--g4:250,204,21]',
  '[--g5:4,120,87] data-[theme=light]:[--g5:252,211,77]',
  '[--g-pointer:6,182,212] data-[theme=light]:[--g-pointer:249,115,22]',
  '[--g-blend:screen] data-[theme=light]:[--g-blend:multiply]',
  '[--g-alpha:.7] data-[theme=light]:[--g-alpha:.8]',
].join(' ');
export const eyebrow = "eyebrow mb-5 flex items-center gap-3 font-['Cinzel'] text-[11px] font-semibold tracking-[.24em] text-(--accent-2) uppercase before:h-px before:w-8 before:shrink-0 before:bg-linear-to-r before:from-transparent before:to-(--accent-2) [[lang=bn]_&]:font-sans [[lang=bn]_&]:tracking-normal";
export const display = "font-['Cinzel'] font-semibold tracking-[.01em] [[lang=bn]_&]:font-sans [[lang=bn]_&]:font-bold [[lang=bn]_&]:tracking-normal";
export const h2 = `${display} text-[clamp(2rem,4.4vw,4.1rem)] leading-[1.1] [[lang=bn]_&]:leading-snug`;
export const h2Small = `${display} text-3xl leading-tight md:text-5xl [[lang=bn]_&]:leading-snug`;
export const ivory = 'bg-linear-to-b from-(--hi-1) via-(--hi-2) to-(--hi-3) bg-clip-text text-transparent';
export const ember = 'bg-linear-to-r from-[#f04f06] via-(--accent) to-(--em-end) bg-clip-text text-transparent';
export const lead = "font-['Cormorant_Garamond'] font-medium italic text-(--lead) [[lang=bn]_&]:font-sans [[lang=bn]_&]:not-italic";
export const body = 'text-sm leading-7 text-(--ink-2)';
export const muted = 'text-(--ink-3)';
export const card = 'rounded-2xl border border-(--line)/10 bg-(--card)/80 shadow-[inset_0_1px_0_0_rgba(252,238,210,.07),0_24px_60px_-30px_rgba(0,0,0,.55)]';
// One hairline across the top of a section, like the rules beside "STUDIO" in the logo.
export const rule = 'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-(--line)/20 before:to-transparent';
// Each band of the page gets its own night tone (all semi-transparent over the floating lights).
export const band = {
  teal: 'bg-(--b-teal)/38',
  night: 'bg-(--b-night)/50',
  mist: 'bg-(--b-mist)/38',
  dusk: 'bg-(--b-dusk)/38',
  deep: 'bg-(--b-deep)/65',
};
export const textLink = 'inline-flex items-center gap-2 border-b border-[#f04f06]/60 py-2 text-xs font-semibold text-(--ink) transition-colors hover:border-(--accent) hover:text-(--accent)';
