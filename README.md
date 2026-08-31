# Animasync

An Infinity ® cartoon listening theater: four 1980s animated series paired with full 1990s alternative albums. No uploads, clip cutting, account setup, or AI subscription is required to use this curated edition.

## Program

| Cartoon | Album |
|---|---|
| He-Man and the Masters of the Universe (1983) | Soundgarden — Superunknown (1994) |
| The Transformers (1984) | The Smashing Pumpkins — Siamese Dream (1993) |
| The Real Ghostbusters (1986) | Alice in Chains — Dirt (1992) |
| Teenage Mutant Ninja Turtles (1987) | Green Day — Dookie (1994) |

## Playback

Choose a pairing and press **Start both**. Cartoon audio starts muted; album audio is enabled. The album playlist repeats in sequence. Cartoon playlists continue in their source order; the TMNT source is a first-season marathon that repeats. Switching pairings destroys the previous two players.

Both YouTube players remain visible with their native controls. Shared pause, restart, next-song, and reload controls are provided. The first three cartoons also have an opening-episode fallback. Restart returns to the first episode and first track; it is not a frame-accurate synchronization system.

On phones, YouTube may require tapping play inside each player. Device policies may prevent simultaneous playback. Ads and buffering are controlled by YouTube and may disrupt alignment; native controls let the viewer adjust either stream. The site does not remove ads, bypass embedding restrictions, download media, or promise gapless playback.

Some albums contain explicit lyrics. This is a nostalgia/music experience, not a children's programming service.

## Sources and verification

All playlist and video IDs are centralized in `lib/program.ts`.

Opening video metadata was checked through YouTube oEmbed:
- He-Man: QX7nrhZdlc4 — Mini Moments.
- Transformers: Y1ujpoDlgRU — Hasbro Pulse.
- The Real Ghostbusters: TDIO1nVgdt8 — Throwback Toons.
- TMNT: cA5yaZ4f8jI — Teenage Mutant Ninja Turtles.

Album and cartoon playlists were found through web search. Program tests validate URL construction, decades, uniqueness, muted cartoon defaults, and repeat settings. Playlist pages returned HTTP 200 but did not expose track data to the source-check script; complete album track order, all episodes, regional availability, and simultaneous device playback have NOT been verified. A successful build is not a full viewing test.

Upstream content belongs to its respective owners. Embedding availability is not a grant to redistribute content or monetize a synchronized derivative. No licensing arrangement, advertising revenue, or coin payout is implemented.

## GitHub Pages edition

This repository contains the portable GitHub Pages edition. It includes ready-built `index.html`, `app.js`, and `styles.css`, plus readable source.

In GitHub repository Settings → Pages, select **Deploy from a branch**, **main**, **/(root)**. No GitHub Actions workflow, secrets, or API keys are needed.

To rebuild the portable edition with Node installed:
```sh
npm install
npm run build
npm test
```

## Sites edition

The root application uses the provided Vinext starter. `app/page.tsx` implements the theater; `app/animasync.css` defines its responsive design. The static export uses the same page, catalog, and stylesheet.

Verification:
```sh
node scripts/test-program.mjs
```

This first edition has no wallet, identity ledger, tracking, automatic curation service, or payout claims.

## Playback repair — pairings 2 and 3

Transformers now queues the three full More Than Meets the Eye episodes directly from Hasbro Pulse. Ghostbusters queues Ghosts R Us and Mr. Sandman, Dream Me a Dream from Throwback Toons. These explicit video queues replace the two previous cartoon playlist dependencies. The same albums remain, with replacement primary playlists and an alternate album-source button. The repair adds separate Start cartoon and Start music controls, and permits Start both when either player is ready. Pairings 1 and 4 retain their media sources.

All five cartoon video titles and publishers were checked through oEmbed. Regression tests and the portable build pass. This does not establish the exact cause of the reported device failures or verify complete album/embedded playback; a viewing check is still needed. No clips are downloaded or cut.


## Sharing and unified wallet
A shared wallet bar offers native sharing, copy-link fallback, and an X post composer. Confirmed sharing earns 0.1 StarCoin once per site per wallet. Opening a composer or copying a link alone earns nothing; manual confirmation is self-reported. Credits use the same browser-local wallet as StarQuest’s unified-wallet integration, not its separate cloud ledger. Pending claims retry on return. Social preview metadata is in index.html and the card is assets/share-preview-v1.png.
