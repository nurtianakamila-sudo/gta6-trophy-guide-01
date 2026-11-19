# Leonida Trophy Guide

The best offline guide and tracker for all 55 GTA VI trophies on PlayStation 5 — built for make.fun's “Build the best GTA 6 trophy guide” bounty ($250 in USDC).

[![make.fun](https://img.shields.io/badge/make.fun-bounty-ff5da2)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Referral](https://img.shields.io/badge/referral-09jncemn-39d5e8)](https://make.fun/r/09jncemn)

## What it is

A static web app (desktop browser, network off) that covers every trophy with its official name, description and grade, a guide in our own words that cites its sources, and a tracker that saves progress in the browser.

- **All 55 trophies** — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 of them hidden on PlayStation until earned.
- **Guides with sources** — each trophy's guide names the guide it draws on (PowerPyx, KeenGamer, OutputLag, GTA Zone, EGamers). Five trophies whose exact trigger is not yet confirmed at launch say so honestly instead of guessing.
- **Tracker** — checklist saved in localStorage, export to JSON, import back, reset. Progress bar and per-grade counts in the header.
- **Filters** — text search, grade, kind (story / missable / collectibles / activities / online — the online filter correctly shows “no online trophies”), earned / remaining.
- **Spoiler setting** — hides the names and descriptions of story trophies until they are earned.
- **Roadmap to the Platinum** — 7 steps plus the full 100% completion checklist behind A Long Road.
- **Missable flag** — Positive Mental Attitude only: 18 meditation spots in 10 locations, and the Chapter 1 balcony meditation disappears after the chapter. No mission replay, so the guide warns you before you leave Chapter 1.
- **Look** — original dark “Vice City nights” styling (indigo, pink, cyan). No Rockstar logo, artwork or game screenshots anywhere, and no web fonts.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Or open `app/index.html` from any static server with `app/` at its root. It works with the network off — every file it loads lives under `app/`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) validates the gate caps, copies `app/` and `screenshots/` to the output directory, and writes `dossier.json` with the vendored `buildDossier` from `vendor/makefun-frontend.ts`.

## Screenshots

Four real renders of the app in headless Chrome, taken with `../shoot.mjs`:

1. `1-checklist` — the checklist with progress, filters and grades.
2. `2-guide` — the missable trophy's guide open beside the list.
3. `3-roadmap` — the roadmap to the Platinum.
4. `4-spoiler` — spoiler mode on, one story trophy earned and revealed.

## License

MIT — see [LICENSE](LICENSE).
