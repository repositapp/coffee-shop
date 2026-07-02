window.Cart = (() => {
 const getProduct = id => STORE_DATA.products.find(product => product.id === id);
 const optionKey = options => btoa(unescape(encodeURIComponent(JSON.stringify(options || {}))));
 const lineKey = (productId, options = {}) => `${productId}-${optionKey(options)}`;

 const detailed = () => Storage.getCart().map(item => ({
 ...item,
 product: getProduct(item.productId)
 })).filter(item => item.product);

 const totals = (voucherCode = Storage.get('voucher', '')) => {
 const items = detailed();
 const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
 const promo = STORE_DATA.promos.find(p => p.code.toLowerCase() === String(voucherCode || '').toLowerCase());
 let discount = 0;
 if (promo && subtotal >= promo.minPurchase) {
 discount = promo.type === 'percent' ? Math.round(subtotal * promo.value / 100) : promo.type === 'fixed' ? promo.value : 0;
 }
 const tax = Math.round((subtotal - discount) * APP_CONFIG.taxRate);
 const shipping = Storage.get('selectedShipping', null);
 const shippingCost = shipping?.price || 0;
 const shippingDiscount = promo?.type === 'shipping' && subtotal >= promo.minPurchase ? Math.min(promo.value, shippingCost) : 0;
 const total = Math.max(0, subtotal - discount + tax + shippingCost - shippingDiscount);
 return { items, subtotal, discount, tax, shippingCost, shippingDiscount, total, promo };
 };

 const add = (productId, quantity = 1, options = {}) => {
 const product = getProduct(productId);
 if (!product) return Toast.error('Produk tidak ditemukan');
 const cart = Storage.getCart();
 const key = lineKey(productId, options);
 const existing = cart.find(item => item.key === key);
 if (existing) existing.quantity += Number(quantity);
 else cart.push({ key, productId, quantity: Number(quantity), options, note: options.note || '' });
 Storage.setCart(cart);
 UI.updateBadges();
 Toast.success(`${product.name} ditambahkan ke keranjang`);
 };

 const update = (key, quantity) => {
 const cart = Storage.getCart().map(item => item.key === key ? { ...item, quantity: Math.max(1, Number(quantity)) } : item);
 Storage.setCart(cart);
 UI.updateBadges();
 renderPage();
 };

 const remove = key => {
 Storage.setCart(Storage.getCart().filter(item => item.key !== key));
 UI.updateBadges();
 renderPage();
 Toast.success('Produk dihapus dari keranjang');
 };

 const clear = () => {
 Storage.setCart([]);
 UI.updateBadges();
 };

 const applyVoucher = code => {
 const promo = STORE_DATA.promos.find(p => p.code.toLowerCase() === String(code || '').toLowerCase());
 if (!promo) return Toast.error('Voucher tidak tersedia');
 Storage.set('voucher', promo.code);
 Toast.success(`Voucher ${promo.code} digunakan`);
 renderPage();
 };

 const summaryHTML = (showShipping = true) => {
 const t = totals();
 return `
 <div class="soft-card rounded-3xl p-5 space-y-4">
 <h2 class="font-display text-xl font-extrabold text-slate-900 ">Ringkasan Belanja</h2>
 <div class="space-y-3 text-sm">
 <div class="flex justify-between"><span class="text-slate-500 ">Subtotal</span><strong>${Utils.money(t.subtotal)}</strong></div>
 <div class="flex justify-between"><span class="text-slate-500 ">Diskon</span><strong class="text-emerald-600">-${Utils.money(t.discount)}</strong></div>
 <div class="flex justify-between"><span class="text-slate-500 ">Pajak 11%</span><strong>${Utils.money(t.tax)}</strong></div>
 ${showShipping ? `<div class="flex justify-between"><span class="text-slate-500 ">Ongkir</span><strong>${Utils.money(t.shippingCost)}</strong></div>` : ''}
 ${t.shippingDiscount ? `<div class="flex justify-between"><span class="text-slate-500 ">Diskon Ongkir</span><strong class="text-emerald-600">-${Utils.money(t.shippingDiscount)}</strong></div>` : ''}
 </div>
 <div class="border-t border-slate-200 pt-4 flex justify-between text-lg"><span class="font-bold">Total</span><strong class="text-coffee-700 ">${Utils.money(t.total)}</strong></div>
 </div>`;
 };

 const emptyCartHTML = () => `
 <section class="container-page py-16">
 <div class="soft-card rounded-[2rem] p-8 text-center max-w-2xl mx-auto">
 <div class="w-20 h-20 rounded-full bg-orange-50 mx-auto flex items-center justify-center text-3xl text-orange-600 mb-5"><i class="fa-solid fa-cart-shopping"></i></div>
 <h1 class="font-display text-3xl font-extrabold text-slate-900 ">Keranjang Masih Kosong</h1>
 <p class="text-slate-500 mt-2">Pilih menu favorit dan simpan pesanan sebelum checkout.</p>
 <a href="products.html" class="btn-primary mt-6">Belanja Sekarang</a>
 </div>
 </section>`;

 const renderPage = () => {
 const root = document.getElementById('cart-page');
 if (!root) return;
 const items = detailed();
 if (!items.length) {
 root.innerHTML = emptyCartHTML();
 return;
 }
 root.innerHTML = `
 <section class="container-page py-8 md:py-12 mobile-safe-bottom">
 <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
 <div>
 <p class="badge-pill mb-3"><i class="fa-solid fa-bag-shopping"></i> Keranjang</p>
 <h1 class="section-title text-3xl md:text-5xl text-slate-900 ">Keranjang Belanja</h1>
 </div>
 <a href="products.html" class="btn-secondary xs-full"><i class="fa-solid fa-plus"></i> Tambah Produk</a>
 </div>
 <div class="grid lg:grid-cols-[1fr_380px] gap-6">
 <div class="space-y-4">
 ${items.map(item => `
 <article class="soft-card rounded-3xl p-4 flex flex-col sm:flex-row gap-4" data-cart-key="${item.key}">
 <img src="${item.product.images[0]}" alt="${item.product.name}" class="w-full sm:w-28 h-36 sm:h-28 object-cover rounded-2xl">
 <div class="flex-1 min-w-0">
 <div class="flex items-start justify-between gap-3">
 <div>
 <h2 class="font-display font-extrabold text-lg text-slate-900 ">${item.product.name}</h2>
 <p class="text-sm text-slate-500 mt-1">${Object.values(item.options || {}).filter(Boolean).slice(0, 4).join(' • ') || item.product.categoryName}</p>
 </div>
 <button onclick="Cart.remove('${item.key}')" class="w-10 h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-100 " aria-label="Hapus"><i class="fa-solid fa-trash"></i></button>
 </div>
 <div class="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div class="inline-flex items-center rounded-full border border-slate-200 p-1 w-fit">
 <button onclick="Cart.update('${item.key}', ${item.quantity - 1})" class="w-9 h-9 rounded-full hover:bg-slate-100 " aria-label="Kurangi">−</button>
 <input value="${item.quantity}" onchange="Cart.update('${item.key}', this.value)" class="w-12 text-center bg-transparent font-bold outline-none" aria-label="Jumlah ${item.product.name}">
 <button onclick="Cart.update('${item.key}', ${item.quantity + 1})" class="w-9 h-9 rounded-full hover:bg-slate-100 " aria-label="Tambah">+</button>
 </div>
 <strong class="text-lg text-coffee-700 ">${Utils.money(item.product.price * item.quantity)}</strong>
 </div>
 </div>
 </article>`).join('')}
 <div class="soft-card rounded-3xl p-5">
 <label class="font-bold text-sm text-slate-700 ">Voucher</label>
 <div class="mt-2 flex gap-2">
 <input id="voucher-input" class="input-field" placeholder="Masukkan kode voucher" value="${Storage.get('voucher', '') || ''}">
 <button onclick="Cart.applyVoucher(document.getElementById('voucher-input').value)" class="btn-primary shrink-0">Pakai</button>
 </div>
 <div class="mt-3 flex flex-wrap gap-2 text-xs font-bold">
 ${STORE_DATA.promos.map(p => `<button onclick="Cart.applyVoucher('${p.code}')" class="px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 ">${p.code}</button>`).join('')}
 </div>
 <label class="block mt-5 font-bold text-sm text-slate-700 ">Catatan Pesanan</label>
 <textarea id="cart-note" class="input-field mt-2 min-h-28" placeholder="Contoh: kopi dibuat tidak terlalu panas">${Storage.get('cartNote', '') || ''}</textarea>
 </div>
 </div>
 <aside class="checkout-sticky space-y-4">
 ${summaryHTML(false)}
 <button onclick="Storage.set('cartNote', document.getElementById('cart-note')?.value || ''); location.href='checkout.html'" class="btn-primary w-full mobile-sticky-cta"><i class="fa-solid fa-credit-card"></i> Lanjut Checkout</button>
 </aside>
 </div>
 </section>`;
 };

 return { detailed, totals, add, update, remove, clear, applyVoucher, summaryHTML, renderPage };
})();
