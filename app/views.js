// dealDetail and compareTable: the single-deal page. It shows the full
// price picture, the verdict with its evidence, the source the price was
// read in, and the same product's price at every other store on the board.

import { CHECKED_LABEL, bestPriceFor, discountPercent, dollarsSaved } from './data.js';
import { escapeHtml, money, verdictBadge } from './render.js';

// A cross-store table: one row per store that lists this product, with the
// cheapest row marked. Rows come from the deal's own compare list plus the
// deal itself, sorted cheapest first.
export function compareTable(deal) {
  const rows = [{ store: deal.store, price: deal.price, note: 'This listing' }, ...deal.compare];
  const cheapest = bestPriceFor(deal);
  const sorted = [...rows].sort((a, b) => a.price - b.price);
  return `<table class="compare">
  <thead><tr><th>Store</th><th>Price</th><th>Note</th></tr></thead>
  <tbody>${sorted
    .map(
      (row) =>
        `<tr${row.price === cheapest.price && row.store === cheapest.store ? ' class="cheapest"' : ''}><td>${escapeHtml(row.store)}${row.price === cheapest.price && row.store === cheapest.store ? ' ★ cheapest' : ''}</td><td>${money(row.price)}</td><td>${escapeHtml(row.note)}</td></tr>`,
    )
    .join('')}</tbody>
</table>`;
}

export function dealDetail(deal) {
  const pct = discountPercent(deal);
  const compare = deal.compare.length > 0 ? `<h2>Same product, other stores</h2>${compareTable(deal)}` : '';
  const note = deal.note !== '' ? `<p class="note"><strong>Note:</strong> ${escapeHtml(deal.note)}</p>` : '';
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <div class="card-top"><span class="store">${escapeHtml(deal.store)}</span><span class="category">${escapeHtml(deal.category)}</span></div>
  <h1>${escapeHtml(deal.title)}</h1>
  <p class="prices big"><span class="sale">${money(deal.price)}</span> <s>${money(deal.was)}</s> <span class="off">${pct}% off</span></p>
  <p class="save">Save ${money(dollarsSaved(deal))} off the usual ${money(deal.was)} price.</p>
  <p class="verdict-row">${verdictBadge(deal.verdict)} <span class="evidence">${escapeHtml(deal.evidence)}</span></p>
  ${note}
  <dl class="facts">
    <dt>Store</dt><dd>${escapeHtml(deal.store)}</dd>
    <dt>Category</dt><dd>${escapeHtml(deal.category)}</dd>
    <dt>Price checked</dt><dd>${escapeHtml(CHECKED_LABEL)}</dd>
    <dt>Price read in</dt><dd>${escapeHtml(deal.source)}</dd>
  </dl>
  ${compare}
  <p><a class="button big" href="${escapeHtml(deal.url)}" rel="noopener" target="_blank">View at ${escapeHtml(deal.store)} ↗</a></p>
  <p class="fineprint">Prices change fast during Black Friday week — confirm the price at checkout before you buy.</p>
</article>`;
}

export function notFound() {
  return `<h1>Deal not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
