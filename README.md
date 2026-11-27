# FridayFinder — 40 checked Black Friday deals

[![Black Friday deal finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/yudhisutawan77/makefun-black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/yudhisutawan77/makefun-black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

**40 real Black Friday deals, all prices checked 27 Nov 2026, 15:00 WITA** — from Amazon, Walmart, Best Buy, Target and Disney. Every deal names its store, sale price, usual price, discount, the source the price was read in, and an honest verdict: NEW LOW (3), STRONG (30), ROUTINE (6) or INFLATED (1). The biggest cut is the LG 83-inch C5 OLED at $2,789.95, down from $5,399.99 — $2,610 off.

[Enter the bounty on make.fun](https://make.fun/bounty/black-friday-deal-finder-01)

## What it is

FridayFinder is a static deal finder that runs from its own files, on a desktop and on a phone, with no network requests while it runs:

- **Search + filters that work** — search by product, store or category; filter by category, store, minimum discount and verdict; sort by biggest discount, most dollars saved, price, or best verdict first.
- **Cross-store comparison** — the same product at other stores (AirPods Pro 3 at Amazon, Walmart and Target; Beats Studio Pro at three stores; MacBook Air M5 at three stores; KitchenAid bowl-lift at two; Dyson V12 at two), with the cheapest row marked on the detail page.
- **Detail page per deal** — full price picture, verdict with its evidence, the source the price was read in, and the store link.
- **Honest signals** — including one INFLATED listing (Cillso earbuds: the $159.99 "was" price does not hold up) and ROUTINE sales that are good prices, not rare ones.

## How the deals were checked

Each deal was found and checked in one session on 27 Nov 2026: the sale price and usual price were read in a deals source that names the store (SVR Deals' Walmart list verified live on product pages; iddeya.com's Best Buy/Amazon/Target/Walmart prices, confirmed by aktualita.co the same day; Tom's Guide and Cord Cutters News headphone deals; Popular Science kitchen deals; DealNews' Target sale; 9to5Toys; MacObserver; US Credit Cards 101). The site says when each price was checked and where it was read. Prices change fast during Black Friday week — confirm at checkout before you buy.

## Run it

Serve `app/` with any static server and open `index.html`. To hand it in:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored `buildDossier` from `vendor/makefun-frontend.ts`.

## Layout

- `app/index.html` — page shell
- `app/style.css` — the board's look
- `app/data.js` — the 40 checked deals, categories, stores and price helpers
- `app/filters.js` — `filterDeals` and `sortDeals`
- `app/render.js` — `dealCard` and the board shell
- `app/views.js` — the deal detail page and the cross-store `compareTable`
- `app/main.js` — hash routing and toolbar wiring
- `main.ts` — the hand-in program
- `screenshots/` — 4 renders of the site in a browser

## License

MIT — see [LICENSE](LICENSE).
