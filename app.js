// Global app behaviors for static site
(function() {
  function formatBRL(value) {
    return `R$ ${Number(value).toFixed(2)}`;
  }

  function setupWhatsApp() {
    const phoneNumber = '5511953148003';
    const message = 'Olá! Gostaria de saber mais sobre os jogos disponíveis na Acreidson.';
    const btn = document.getElementById('whatsapp-btn');
    if (btn) btn.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  }

  function setupSearchRedirect() {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    if (!form || !input) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const q = (input.value || '').trim();
      if (q) window.location.href = `./jogos.html?search=${encodeURIComponent(q)}`;
    });
  }

  // HOME
  function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;
    grid.innerHTML = '';
    GameData.featuredGames.forEach(function(game) {
      const card = document.createElement('a');
      card.href = `./jogo.html?id=${game.id}`;
      card.className = 'group';
      card.innerHTML = `
        <div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 border border-gray-700 hover:border-purple-500/50">
          <div class="relative overflow-hidden">
            <img src="${game.image}" alt="${game.title}" class="w-full h-48 object-cover" />
            ${game.discount ? `<div class='absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold'>-${game.discount}%</div>` : ''}
          </div>
          <div class="p-4 space-y-3">
            <div>
              <h3 class="text-white font-semibold text-lg line-clamp-1">${game.title}</h3>
              <p class="text-gray-400 text-sm">${game.genre}</p>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                ${game.originalPrice ? `<span class='text-gray-400 text-sm line-through'>${formatBRL(game.originalPrice)}</span>` : ''}
                <span class="text-white font-bold text-lg">${formatBRL(game.price)}</span>
              </div>
              <button data-id="${game.id}" class="add-btn bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm">Adicionar</button>
            </div>
          </div>
        </div>`;
      grid.appendChild(card);
    });

    grid.addEventListener('click', function(e) {
      const target = e.target;
      if (target && target.classList.contains('add-btn')) {
        e.preventDefault();
        const id = Number(target.getAttribute('data-id'));
        const game = GameData.getById(id);
        if (game) Cart.add(game);
      }
    });
  }

  // GAMES LISTING
  function renderGamesPage() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;

    const params = new URLSearchParams(window.location.search);
    const search = (params.get('search') || '').toLowerCase();

    const genreSelect = document.getElementById('filter-genre');
    const platformSelect = document.getElementById('filter-platform');
    const priceSelect = document.getElementById('filter-price');
    const sortSelect = document.getElementById('sort-by');
    const countEl = document.getElementById('games-count');

    // Setup unique filter options
    const genres = Array.from(new Set(GameData.allGames.map(g => g.genre)));
    genres.forEach(g => { const o = document.createElement('option'); o.value = g; o.textContent = g; genreSelect.appendChild(o); });
    const platforms = Array.from(new Set(GameData.allGames.flatMap(g => g.platform)));
    platforms.forEach(p => { const o = document.createElement('option'); o.value = p; o.textContent = p; platformSelect.appendChild(o); });

    function applyFilters() {
      let list = GameData.allGames.slice();
      if (search) list = list.filter(g => g.title.toLowerCase().includes(search) || (g.genre||'').toLowerCase().includes(search));
      if (genreSelect.value) list = list.filter(g => g.genre === genreSelect.value);
      if (platformSelect.value) list = list.filter(g => g.platform.includes(platformSelect.value));
      if (priceSelect.value) {
        const parts = priceSelect.value.split('-').map(Number);
        list = list.filter(g => g.price >= parts[0] && g.price <= parts[1]);
      }
      switch (sortSelect.value) {
        case 'price-low': list.sort((a,b)=>a.price-b.price); break;
        case 'price-high': list.sort((a,b)=>b.price-a.price); break;
        case 'rating': list.sort((a,b)=>b.rating-a.rating); break;
        case 'name': list.sort((a,b)=>a.title.localeCompare(b.title)); break;
        default: break;
      }
      grid.innerHTML = '';
      if (countEl) countEl.textContent = `${list.length} jogos encontrados`;
      if (!list.length) {
        grid.innerHTML = `<div class='text-center py-16 w-full col-span-full'><div class='text-6xl mb-4'>🎮</div><h3 class='text-xl font-semibold text-white mb-2'>Nenhum jogo encontrado</h3><p class='text-gray-400 mb-6'>Tente ajustar os filtros ou fazer uma nova busca</p></div>`;
        return;
      }
      list.forEach(function(game) {
        const card = document.createElement('div');
        card.innerHTML = `
          <a href="./jogo.html?id=${game.id}" class="group block">
            <div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 border border-gray-700 hover:border-purple-500/50">
              <div class="relative overflow-hidden">
                <img src="${game.image}" alt="${game.title}" class="w-full h-48 object-cover" />
                ${game.discount ? `<div class='absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold'>-${game.discount}%</div>` : ''}
              </div>
              <div class="p-4 space-y-3">
                <div>
                  <h3 class="text-white font-semibold text-lg line-clamp-1">${game.title}</h3>
                  <p class="text-gray-400 text-sm">${game.genre}</p>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    ${game.originalPrice ? `<span class='text-gray-400 text-sm line-through'>${formatBRL(game.originalPrice)}</span>` : ''}
                    <span class="text-white font-bold text-lg">${formatBRL(game.price)}</span>
                  </div>
                  <button data-id="${game.id}" class="add-btn bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm">Adicionar</button>
                </div>
              </div>
            </div>
          </a>`;
        grid.appendChild(card);
      });
    }

    genreSelect.addEventListener('change', applyFilters);
    platformSelect.addEventListener('change', applyFilters);
    priceSelect.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);

    grid.addEventListener('click', function(e) {
      const target = e.target;
      if (target && target.classList.contains('add-btn')) {
        e.preventDefault();
        const id = Number(target.getAttribute('data-id'));
        const game = GameData.getById(id);
        if (game) Cart.add(game);
      }
    });

    applyFilters();
  }

  // GAME DETAIL
  function renderDetailPage() {
    const container = document.getElementById('game-detail');
    if (!container) return;
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id') || '0');
    const game = GameData.getById(id) || GameData.allGames[0];

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="space-y-4">
          <div class="relative overflow-hidden rounded-xl">
            <img src="${game.image}" alt="${game.title}" class="w-full h-96 object-cover" />
            ${game.discount ? `<div class='absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg font-bold'>-${game.discount}%</div>` : ''}
          </div>
        </div>
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${game.title}</h1>
            <p class="text-gray-400 text-lg">${game.genre}</p>
          </div>
          <div class="flex items-center space-x-4">
            ${game.originalPrice ? `<span class='text-gray-400 text-xl line-through'>${formatBRL(game.originalPrice)}</span>` : ''}
            <span class="text-white font-bold text-3xl">${formatBRL(game.price)}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-gray-400">Disponível para:</span>
            ${game.platform.map(p=>`<span class='bg-gray-800 px-3 py-1 rounded-lg text-sm text-gray-300'>${p}</span>`).join('')}
          </div>
          <div class="flex flex-col sm:flex-row gap-4">
            <button id="add-to-cart" class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg">Adicionar ao Carrinho</button>
            <a href="./jogos.html" class="p-4 rounded-xl border-2 border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-500 text-center">Voltar</a>
          </div>
          <div class="bg-gray-800 rounded-xl p-6">
            <h2 class="text-2xl font-bold text-white mb-4">Sobre o Jogo</h2>
            <p class="text-gray-300 leading-relaxed text-lg">Jogo incrível com mundo aberto e história envolvente.</p>
          </div>
        </div>
      </div>`;

    const addBtn = document.getElementById('add-to-cart');
    if (addBtn) addBtn.addEventListener('click', function() { Cart.add(game); });
  }

  // CART PAGE
  function renderCartPage() {
    const list = document.getElementById('cart-list');
    const summaryTotal = document.getElementById('summary-total');
    const subtotalLine = document.getElementById('summary-subtotal');
    const checkout = document.getElementById('checkout-btn');
    const clearBtn = document.getElementById('clear-cart-btn');
    if (!list || !summaryTotal || !subtotalLine || !checkout || !clearBtn) return;

    function build() {
      const state = Cart.getState();
      list.innerHTML = '';
      if (state.items.length === 0) {
        list.innerHTML = `<div class='text-center py-16'><div class='text-8xl mb-6'>🛒</div><h1 class='text-3xl font-bold text-white mb-4'>Seu carrinho está vazio</h1><a href='./jogos.html' class='inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold'>Explorar Jogos</a></div>`;
      } else {
        state.items.forEach(function(item) {
          const row = document.createElement('div');
          row.className = 'bg-gray-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center sm:space-x-6 space-y-4 sm:space-y-0';
          row.innerHTML = `
            <div class='w-full sm:w-32 h-48 sm:h-20 rounded-lg overflow-hidden flex-shrink-0'>
              <img src='${item.image}' alt='${item.title}' class='w-full h-full object-cover' />
            </div>
            <div class='flex-1 min-w-0'>
              <h3 class='text-white font-semibold text-lg mb-1 truncate'>${item.title}</h3>
              <div class='flex flex-wrap items-center gap-2 mb-2'>${item.platform.map(p=>`<span class='bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs'>${p}</span>`).join('')}</div>
              <div class='text-purple-400 font-bold text-lg'>${formatBRL(item.price)}</div>
            </div>
            <div class='flex items-center space-x-3'>
              <button class='qty-dec p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white' data-id='${item.id}'>-</button>
              <span class='text-white font-medium w-8 text-center'>${item.quantity}</span>
              <button class='qty-inc p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white' data-id='${item.id}'>+</button>
            </div>
            <button class='remove p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10' data-id='${item.id}'>🗑️</button>`;
          list.appendChild(row);
        });
      }
      subtotalLine.textContent = formatBRL(state.total);
      summaryTotal.textContent = formatBRL(state.total);
    }

    list.addEventListener('click', function(e) {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const id = Number(t.getAttribute('data-id'));
      if (t.classList.contains('qty-dec')) { Cart.updateQuantity(id, Cart.getState().items.find(i=>i.id===id).quantity - 1); build(); }
      if (t.classList.contains('qty-inc')) { Cart.updateQuantity(id, Cart.getState().items.find(i=>i.id===id).quantity + 1); build(); }
      if (t.classList.contains('remove')) { Cart.removeItem(id); build(); }
    });

    clearBtn.addEventListener('click', function() { Cart.clear(); build(); });

    checkout.addEventListener('click', function() {
      const state = Cart.getState();
      if (state.items.length === 0) return;
      let message = '🎮 *PEDIDO ACREIDSON* 🎮\n\n';
      message += '📋 *Itens do pedido:*\n';
      state.items.forEach(function(item, index) {
        message += `${index + 1}. ${item.title}\n`;
        message += `   💰 ${formatBRL(item.price)}`;
        if (item.quantity > 1) message += ` x${item.quantity} = ${formatBRL(item.price * item.quantity)}`;
        message += `\n   🎯 Plataforma: ${item.platform.join(', ')}\n\n`;
      });
      message += `💵 *TOTAL: ${formatBRL(state.total)}*\n\n`;
      message += '✅ Gostaria de finalizar esta compra!';
      const whatsappNumber = '5511953148003';
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, '_blank');
      setTimeout(function(){ Cart.clear(); build(); }, 2000);
    });

    build();
  }

  document.addEventListener('DOMContentLoaded', function() {
    setupWhatsApp();
    setupSearchRedirect();
    Cart.updateCartCount();
    renderFeatured();
    renderGamesPage();
    renderDetailPage();
    renderCartPage();
  });
})(); 