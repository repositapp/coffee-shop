window.Wishlist = (() => {
 const has = productId => Storage.getWishlist().includes(productId);

 const toggle = productId => {
 const list = Storage.getWishlist();
 const product = STORE_DATA.products.find(item => item.id === productId);
 const next = list.includes(productId) ? list.filter(id => id !== productId) : [...list, productId];
 Storage.setWishlist(next);
 UI.updateBadges();
 document.querySelectorAll(`[data-wishlist="${productId}"]`).forEach(btn => {
 btn.classList.toggle('text-red-500', next.includes(productId));
 btn.classList.toggle('bg-red-50', next.includes(productId));
 btn.innerHTML = `<i class="fa-${next.includes(productId) ? 'solid' : 'regular'} fa-heart"></i>`;
 });
 if (document.getElementById('wishlist-page')) renderPage();
 Toast.success(next.includes(productId) ? `${product?.name || 'Produk'} ditambahkan ke wishlist` : `${product?.name || 'Produk'} dihapus dari wishlist`);
 };

 const moveToCart = productId => {
 Cart.add(productId, 1, { size: 'Regular' });
 toggle(productId);
 };

 const renderPage = () => {
 const root = document.getElementById('wishlist-page');
 if (!root) return;
 const items = Storage.getWishlist().map(id => STORE_DATA.products.find(p => p.id === id)).filter(Boolean);
 root.innerHTML = `
 <section class="container-page py-8 md:py-12">
 <div class="mb-8">
 <p class="badge-pill mb-3"><i class="fa-solid fa-heart"></i> Wishlist</p>
 <h1 class="section-title text-3xl md:text-5xl text-slate-900 ">Produk Favorit</h1>
 </div>
 ${items.length ? `<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 tv-grid gap-5">${items.map(product => Products.card(product)).join('')}</div>` : `
 <div class="soft-card rounded-[2rem] p-8 text-center max-w-2xl mx-auto">
 <div class="w-20 h-20 rounded-full bg-red-50 mx-auto flex items-center justify-center text-3xl text-red-500 mb-5"><i class="fa-regular fa-heart"></i></div>
 <h2 class="font-display text-3xl font-extrabold text-slate-900 ">Wishlist Masih Kosong</h2>
 <p class="text-slate-500 mt-2">Simpan produk favorit agar mudah ditemukan kembali.</p>
 <a href="products.html" class="btn-primary mt-6">Cari Produk</a>
 </div>`}
 </section>`;
 };

 return { has, toggle, moveToCart, renderPage };
})();
