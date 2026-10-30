# kuhakstudio.github.io

The Kuhak Studio website: the studio homepage, each game's privacy policy, and
`app-ads.txt` for AdMob. Plain HTML + one CSS file, no build step, no outside requests.

## Before publishing
1. Replace `CONTACT_EMAIL` everywhere (index.html, shakchunnir-badhon/privacy.html) with the
   contact email that is also given in Play Console.
2. After the AdMob account exists, add `app-ads.txt` at the root with the line AdMob shows
   (format: `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`).

## Publishing (free, GitHub Pages)
1. On GitHub create an organization `kuhakstudio` (free plan).
2. In it create a **public** repository named exactly `kuhakstudio.github.io`.
3. Push this folder to it (branch `main`); Settings > Pages > deploy from branch `main`, root.
4. The site is then at https://kuhakstudio.github.io/ and the policy at
   https://kuhakstudio.github.io/shakchunnir-badhon/privacy.html (the URL the game opens:
   `PRIVACY_URL` in bhoot-runner/ui/run_hud.gd). Put the same URL in Play Console.
5. Later a custom domain (kuhakstudio.com) can point here: Settings > Pages > Custom domain.
   Then update the game's PRIVACY_URL, the Play listing website, and keep app-ads.txt at the new root.
