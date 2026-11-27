// dealCard and the board shell: the HTML for the deal list. Every value
// from the data is escaped before it reaches the page.

import { CHECKED_LABEL, discountPercent, dollarsSaved, isBestPrice } from './data.js';

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export function money(amount) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: amount % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`;
}

const VERDICT_CLASS = {
  'NEW LOW': 'verdict-newlow',
  STRONG: 'verdict-strong',
  ROUTINE: 'verdict-routine',
  INFLATED: 'verdict-inflated',
};

export function verdictBadge(verdict) {
  return `<span class="verdict ${VERDICT_CLASS[verdict]}">${escapeHtml(verdict)}</span>`;
}

// One deal card: product, store, sale and usual price, discount, verdict,
// when it was checked, and the store link. A "Best price" ribbon marks the
// cheapest listing of that product anywhere on this board.
export function dealCard(deal) {
  const pct = discountPercent(deal);
  // The ribbon only means something when the product is listed at more
  // than one store: the cheapest listing of a compared product.
  const best = deal.compare.length > 0 && isBestPrice(deal);
  const ribbon = best ? '<span class="best-price">Best price</span>' : '';
  return `<article class="card">
  <div class="card-top"><span class="store">${escapeHtml(deal.store)}</span><span class="category">${escapeHtml(deal.category)}</span>${ribbon}</div>
  <h3><a href="#/deal/${encodeURIComponent(deal.id)}">${escapeHtml(deal.title)}</a></h3>
  <p class="prices"><span class="sale">${money(deal.price)}</span> <s>${money(deal.was)}</s> <span class="off">${pct}% off</span></p>
  <p class="save">Save ${money(dollarsSaved(deal))}</p>
  <p class="verdict-row">${verdictBadge(deal.verdict)} <span class="evidence">${escapeHtml(deal.evidence)}</span></p>
  <p class="checked">Checked ${escapeHtml(CHECKED_LABEL)} · ${escapeHtml(deal.store)}</p>
  <p class="card-actions"><a class="button" href="${escapeHtml(deal.url)}" rel="noopener" target="_blank">View at ${escapeHtml(deal.store)} ↗</a> <a class="details" href="#/deal/${encodeURIComponent(deal.id)}">Details</a></p>
</article>`;
}

export function dealRows(shown) {
  if (shown.length === 0) {
    return '<li class="empty">No deal matches those filters. Try clearing the search or lowering the minimum discount.</li>';
  }
  return shown.map((deal) => `<li>${dealCard(deal)}</li>`).join('');
}

// The board shell: title, stats, the filter toolbar and the result list.
// The toolbar is re-rendered with the list so every control keeps its value.
export function boardShell(filters, categories, stores, shown, total) {
  const option = (value, current, label) =>
    `<option value="${escapeHtml(value)}"${value === current ? ' selected' : ''}>${escapeHtml(label ?? value)}</option>`;
  return `<section class="hero">
  <h1>FridayFinder</h1>
  <p class="tagline">Real Black Friday deals, checked by hand today — with the honest verdict on each one.</p>
  <p class="stats"><strong>${total} deals</strong> · <strong>${stores.length} stores</strong> · all prices checked <strong>${escapeHtml(CHECKED_LABEL)}</strong></p>
</section>
<section class="toolbar" aria-label="Search and filter deals">
  <label class="search-label">Search <input id="search" type="search" placeholder="Try “airpods”, “TV” or “Dyson”…" value="${escapeHtml(filters.query)}"></label>
  <label>Category <select id="category">${option('All', filters.category)}${categories.map((c) => option(c, filters.category)).join('')}</select></label>
  <label>Store <select id="store">${option('All', filters.store)}${stores.map((s) => option(s, filters.store)).join('')}</select></label>
  <label>Min. discount <select id="minDiscount">${[0, 20, 30, 40, 50, 60].map((n) => option(String(n), String(filters.minDiscount), n === 0 ? 'Any' : `${n}%+`)).join('')}</select></label>
  <label>Verdict <select id="verdict">${['All', 'NEW LOW', 'STRONG', 'ROUTINE', 'INFLATED'].map((v) => option(v, filters.verdict)).join('')}</select></label>
  <label>Sort by <select id="sort">${Object.entries({ discount: 'Biggest discount', savings: 'Most dollars saved', priceLow: 'Price: low to high', priceHigh: 'Price: high to low', verdict: 'Best verdict first' }).map(([v, l]) => option(v, filters.sort, l)).join('')}</select></label>
</section>
<p class="count" id="count">Showing <strong>${shown.length}</strong> of ${total} deals</p>
<ul class="grid" id="deal-grid">${dealRows(shown)}</ul>`;
}
