// Simple cart management using localStorage
(function() {
  const STORAGE_KEY = 'acreidson_cart_v1';

  function read() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"items":[]}'); } catch { return { items: [] }; }
  }
  function write(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateCartCount();
  }
  function computeTotal(items) {
    return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  }

  function add(item) {
    const state = read();
    const existing = state.items.find(i => i.id === item.id);
    if (existing) existing.quantity += 1; else state.items.push({ ...item, quantity: 1 });
    write(state);
  }
  function updateQuantity(id, qty) {
    const state = read();
    const item = state.items.find(i => i.id === id);
    if (!item) return;
    item.quantity = Math.max(0, qty);
    state.items = state.items.filter(i => i.quantity > 0);
    write(state);
  }
  function removeItem(id) {
    const state = read();
    state.items = state.items.filter(i => i.id !== id);
    write(state);
  }
  function clear() {
    write({ items: [] });
  }
  function getState() {
    const s = read();
    return { items: s.items, total: computeTotal(s.items) };
  }
  function updateCartCount() {
    const el = document.getElementById('cart-count');
    if (!el) return;
    const count = read().items.reduce((sum, it) => sum + it.quantity, 0);
    if (count > 0) {
      el.textContent = String(count);
      el.classList.remove('hidden');
      el.classList.add('flex');
    } else {
      el.textContent = '';
      el.classList.add('hidden');
    }
  }

  window.Cart = { add, updateQuantity, removeItem, clear, getState, updateCartCount };
  document.addEventListener('DOMContentLoaded', updateCartCount);
})(); 