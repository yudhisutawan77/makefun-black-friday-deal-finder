// FridayFinder boot: hash routing, toolbar wiring and rendering. Routes:
//   #/            the deal board, with search and filters
//   #/deal/<id>   one deal, with its cross-store comparison
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { CHECKED_LABEL, categories, deals, stores } from './data.js';
import { emptyFilters, filterDeals, sortDeals } from './filters.js';
import { boardShell, dealRows } from './render.js';
import { dealDetail, notFound } from './views.js';

const app = document.getElementById('app');
const filters = emptyFilters();

// Deep-linkable filters: ?category=Audio&store=Amazon&minDiscount=50&
// verdict=STRONG&sort=savings&q=airpods pre-fills the toolbar, so a link
// (or a screenshot) can open the board already filtered.
function readLinkedFilters() {
  const params = new URLSearchParams(location.search);
  const text = (name) => params.get(name) ?? '';
  if (text('q') !== '') filters.query = text('q');
  if (categories.includes(text('category'))) filters.category = text('category');
  if (stores.includes(text('store'))) filters.store = text('store');
  const min = Number(text('minDiscount'));
  if ([0, 20, 30, 40, 50, 60].includes(min)) filters.minDiscount = min;
  if (['NEW LOW', 'STRONG', 'ROUTINE', 'INFLATED'].includes(text('verdict'))) filters.verdict = text('verdict');
  if (['discount', 'savings', 'priceLow', 'priceHigh', 'verdict'].includes(text('sort'))) filters.sort = text('sort');
}

readLinkedFilters();

function applyFilters() {
  return sortDeals(filterDeals(deals, filters), filters.sort);
}

function renderBoard() {
  const shown = applyFilters();
  app.innerHTML = boardShell(filters, categories, stores, shown, deals.length);
  const count = document.getElementById('count');
  const grid = document.getElementById('deal-grid');

  const refreshList = () => {
    const next = applyFilters();
    grid.innerHTML = dealRows(next);
    count.innerHTML = `Showing <strong>${next.length}</strong> of ${deals.length} deals`;
  };

  document.getElementById('search').addEventListener('input', (event) => {
    filters.query = event.target.value;
    refreshList();
  });
  document.getElementById('category').addEventListener('change', (event) => {
    filters.category = event.target.value;
    refreshList();
  });
  document.getElementById('store').addEventListener('change', (event) => {
    filters.store = event.target.value;
    refreshList();
  });
  document.getElementById('minDiscount').addEventListener('change', (event) => {
    filters.minDiscount = Number(event.target.value);
    refreshList();
  });
  document.getElementById('verdict').addEventListener('change', (event) => {
    filters.verdict = event.target.value;
    refreshList();
  });
  document.getElementById('sort').addEventListener('change', (event) => {
    filters.sort = event.target.value;
    refreshList();
  });
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : 'Not found'} | FridayFinder`;
    app.innerHTML = found ? dealDetail(found) : notFound();
  } else {
    document.title = 'FridayFinder — 40 checked Black Friday deals';
    renderBoard();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
