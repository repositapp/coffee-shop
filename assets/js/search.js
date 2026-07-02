window.Search = (() => {
 const searchProducts = query => {
 const q = String(query || '').toLowerCase().trim();
 if (!q) return STORE_DATA.products;
 return STORE_DATA.products.filter(product => [product.name, product.categoryName, product.description, ...(product.tags || [])].join(' ').toLowerCase().includes(q));
 };

 const autocomplete = (input, target) => {
 if (!input || !target) return;
 const render = Utils.debounce(() => {
 const q = input.value.trim();
 if (!q) return target.classList.add('hidden');
 const results = searchProducts(q).slice(0, 6);
 target.innerHTML = results.length ? results.map(product => `
 <a href="product-detail.html?id=${product.id}" class="flex items-center gap-3 p-3 hover:bg-orange-50 rounded-2xl">
 <img src="${product.images[0]}" alt="${product.name}" class="w-12 h-12 rounded-xl object-cover">
 <div class="min-w-0"><p class="font-bold truncate">${product.name}</p><p class="text-xs text-slate-500">${Utils.money(product.price)}</p></div>
 </a>`).join('') : '<div class="p-4 text-sm text-slate-500">Produk tidak ditemukan.</div>';
 target.classList.remove('hidden');
 }, 180);
 input.addEventListener('input', render);
 };

 const open = () => {
 Modal.open({
 title: 'Cari Produk',
 size: 'max-w-xl',
 content: `
 <div class="relative">
 <input id="global-search-modal-input" class="input-field pr-12" placeholder="Cari coffee, non coffee, food..." autofocus>
 <i class="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
 </div>
 <div id="global-search-modal-results" class="mt-4 space-y-2"></div>`
 });
 setTimeout(() => {
 const input = document.getElementById('global-search-modal-input');
 const result = document.getElementById('global-search-modal-results');
 input?.focus();
 input?.addEventListener('input', Utils.debounce(() => {
 const results = searchProducts(input.value).slice(0, 8);
 result.innerHTML = input.value.trim() ? results.map(product => `
 <a href="product-detail.html?id=${product.id}" class="soft-card rounded-2xl p-3 flex items-center gap-3 hover:scale-[1.01] transition">
 <img src="${product.images[0]}" alt="${product.name}" class="w-14 h-14 rounded-xl object-cover">
 <div class="flex-1"><p class="font-extrabold text-slate-900 ">${product.name}</p><p class="text-sm text-slate-500">${product.categoryName} • ${Utils.money(product.price)}</p></div>
 <i class="fa-solid fa-chevron-right text-slate-300"></i>
 </a>`).join('') : '<p class="text-sm text-slate-500">Ketik nama produk untuk mulai mencari.</p>';
 }, 150));
 }, 20);
 };

 return { searchProducts, autocomplete, open };
})();
