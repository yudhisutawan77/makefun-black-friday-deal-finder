// filterDeals and sortDeals: the search, filter and sort behind the board.
// Every control on the page runs through these two functions, so a filter
// that shows here is a filter that really runs.

import { discountPercent, dollarsSaved } from './data.js';

export const SORTS = {
  discount: 'Biggest discount',
  savings: 'Most dollars saved',
  priceLow: 'Price: low to high',
  priceHigh: 'Price: high to low',
  verdict: 'Best verdict first',
};

const VERDICT_RANK = { 'NEW LOW': 0, STRONG: 1, ROUTINE: 2, INFLATED: 3 };

export function emptyFilters() {
  return { query: '', category: 'All', store: 'All', minDiscount: 0, verdict: 'All', sort: 'verdict' };
}

// A deal passes when every active filter agrees with it: the search text
// matches its title, store or category; the category, store and verdict
// pickers match; and its discount reaches the minimum.
export function filterDeals(all, filters) {
  const q = filters.query.trim().toLowerCase();
  return all.filter((deal) => {
    if (q !== '') {
      const haystack = `${deal.title} ${deal.store} ${deal.category}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.category !== 'All' && deal.category !== filters.category) return false;
    if (filters.store !== 'All' && deal.store !== filters.store) return false;
    if (filters.verdict !== 'All' && deal.verdict !== filters.verdict) return false;
    if (discountPercent(deal) < filters.minDiscount) return false;
    return true;
  });
}

// Sorts a copy, never the input: biggest discount, most dollars saved,
// price low to high or high to low, or best verdict first (new lows, then
// strong prices, then routine, then inflated; ties break by discount).
export function sortDeals(shown, sort) {
  const copy = [...shown];
  switch (sort) {
    case 'savings':
      return copy.sort((a, b) => dollarsSaved(b) - dollarsSaved(a) || discountPercent(b) - discountPercent(a));
    case 'priceLow':
      return copy.sort((a, b) => a.price - b.price || discountPercent(b) - discountPercent(a));
    case 'priceHigh':
      return copy.sort((a, b) => b.price - a.price || discountPercent(b) - discountPercent(a));
    case 'verdict':
      return copy.sort(
        (a, b) => VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] || discountPercent(b) - discountPercent(a),
      );
    case 'discount':
    default:
      return copy.sort((a, b) => discountPercent(b) - discountPercent(a) || dollarsSaved(b) - dollarsSaved(a));
  }
}
