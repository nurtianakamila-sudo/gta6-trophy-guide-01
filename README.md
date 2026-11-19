# Leonida Trophy Guide

An offline guide and tracker for all 55 GTA VI trophies on PlayStation 5, built for the make.fun "Build the best GTA 6 trophy guide" bounty ($250 in USDC).

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/nurtianakamila-sudo/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/nurtianakamila-sudo/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

## What it is

- **Every trophy, in one place.** All 55 PlayStation 5 trophies — 1 Platinum, 2 Gold, 6 Silver and 46 Bronze, 28 of them hidden — each with its official name, description, grade and a guide written for this project.
- **Guides you can trust.** Each trophy's guide names its sources (PowerPyx, KeenGamer, OutputLag, GTA Zone and EGamers). Five trophies whose exact trigger is not yet confirmed at launch say so plainly instead of guessing.
- **A tracker that remembers.** Tick trophies off as you earn them; progress lives in localStorage. Export your checklist to a JSON file, import it back later, or reset and start over. A progress bar and per-grade counts sit in the header.
- **Filters that cut the list down.** Search by text, filter by grade, by kind (story, missable, collectibles, activities, online), and by earned or remaining. The online filter tells you the truth: there are no online trophies.
- **A spoiler setting.** Turn it on and the names and descriptions of story trophies stay hidden until you have earned them.
- **A 7-step roadmap to the Platinum**, plus the full 100% completion checklist behind it.
- **One missable trophy, clearly flagged.** Only Positive Mental Attitude can be missed: 18 meditation spots across 10 locations, and the Chapter 1 balcony meditation is gone once the chapter ends — there is no mission replay.
- **A dark "Vice City nights" look** in indigo, pink and cyan. No Rockstar logo, no artwork, no game screenshots and no web fonts anywhere.

## Run it

```sh
node serve.ts
```

That serves `app/` at http://localhost:8080. Or drop `app/` at the root of any static server and open `app/index.html`. Everything runs with the network off.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` is Node 22, standard library only. It validates the gate caps, copies `app/` and `screenshots/` into the output directory, and writes `dossier.json`.

## Screenshots

Four real renders of the app in headless Chrome, taken with `../shoot.mjs`:

- `1-checklist` — the trophy checklist with progress
- `2-guide` — a trophy guide open beside the list
- `3-roadmap` — the 7-step roadmap to the Platinum
- `4-spoiler` — spoiler mode hiding unearned story trophies

## License

MIT — see LICENSE.

<sub>Entered on [make.fun](https://make.fun/?ref=09jncemn&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
