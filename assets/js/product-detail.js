window.ProductDetail = (() => {
 let selectedImage = 0;

 const optionButtons = (name, values, selected = '') => values.map((value, index) => `
 <label class="cursor-pointer">
 <input type="radio" name="${name}" value="${value}" class="peer sr-only" ${selected === value || (!selected && index === 0) ? 'checked' : ''}>
 <span class="inline-flex px-4 py-2 rounded-full border border-slate-200 peer-checked:bg-coffee-700 peer-checked:text-white peer-checked:border-coffee-700 font-bold text-sm transition">${value}</span>
 </label>`).join('');

 const readOptions = product => {
 const form = document.getElementById('product-options-form');
 return {
 size: form?.querySelector('input[name="size"]:checked')?.value || product.sizes?.[0],
 topping: form?.querySelector('input[name="topping"]:checked')?.value || '',
 sugar: form?.querySelector('input[name="sugar"]:checked')?.value || '',
 ice: form?.querySelector('input[name="ice"]:checked')?.value || '',
 note: document.getElementById('order-note')?.value || ''
 };
 };

 const render = () => {
 const root = document.getElementById('product-detail-page');
 if (!root) return;
 const id = Utils.getParam('id') || Utils.getParam('slug');
 const product = Products.getById(id) || STORE_DATA.products[0];
 const productReviews = STORE_DATA.reviews.filter(review => review.productId === product.id || review.productId === 'co-001');
 root.innerHTML = `
 <section class="container-page py-8 md:py-12 mobile-safe-bottom">
 <div class="grid lg:grid-cols-2 gap-8 items-start">
 <div class="lg:sticky lg:top-24">
 <div class="soft-card rounded-[2rem] p-3">
 <div class="relative overflow-hidden rounded-[1.5rem] bg-slate-100 ">
 <img id="main-product-image" src="${product.images[0]}" alt="${product.name}" class="w-full h-[420px] md:h-[560px] object-cover cursor-zoom-in" onclick="ProductDetail.zoom('${product.images[0]}', '${product.name}')">
 <span class="absolute top-4 left-4 badge-pill">${product.badge}</span>
 </div>
 </div>
 <div class="mt-4 grid grid-cols-3 gap-3">${product.images.map((img, index) => `<button onclick="ProductDetail.changeImage('${img}', ${index})" class="rounded-2xl overflow-hidden border-2 ${index === 0 ? 'border-orange-500' : 'border-transparent'}" data-thumb="${index}"><img src="${img}" alt="${product.name} ${index + 1}" class="h-28 w-full object-cover"></button>`).join('')}</div>
 </div>
 <div>
 <div class="flex items-start justify-between gap-4">
 <div><p class="badge-pill mb-3">${product.categoryName}</p><h1 class="section-title text-3xl md:text-5xl text-slate-900 ">${product.name}</h1><div class="mt-3 flex items-center gap-2 text-sm">${Utils.stars(product.rating)}<strong>${product.rating}</strong><span class="text-slate-400">${product.reviews} review</span><span class="text-slate-400">• ${product.sold} terjual</span></div></div>
 <button data-wishlist="${product.id}" onclick="Wishlist.toggle('${product.id}')" class="w-12 h-12 rounded-full bg-slate-100 ${Wishlist.has(product.id) ? 'text-red-500 bg-red-50' : 'text-slate-600 '}"><i class="fa-${Wishlist.has(product.id) ? 'solid' : 'regular'} fa-heart"></i></button>
 </div>
 <div class="mt-5 flex items-end gap-3">${Products.priceBlock(product)}${product.discount ? `<span class="badge-pill bg-red-500 text-white">Hemat ${product.discount}%</span>` : ''}</div>
 <p class="mt-6 text-slate-600 leading-8">${product.description}</p>
 <form id="product-options-form" class="mt-8 space-y-6">
 <div><h2 class="font-display font-extrabold text-lg mb-3">Pilihan Ukuran</h2><div class="flex flex-wrap gap-2">${optionButtons('size', product.sizes)}</div></div>
 <div><h2 class="font-display font-extrabold text-lg mb-3">Pilihan Topping</h2><div class="flex flex-wrap gap-2">${optionButtons('topping', product.toppings)}</div></div>
 ${product.sugarLevels.length ? `<div><h2 class="font-display font-extrabold text-lg mb-3">Pilihan Gula</h2><div class="flex flex-wrap gap-2">${optionButtons('sugar', product.sugarLevels, '50%')}</div></div>` : ''}
 ${product.iceLevels.length ? `<div><h2 class="font-display font-extrabold text-lg mb-3">Pilihan Es</h2><div class="flex flex-wrap gap-2">${optionButtons('ice', product.iceLevels, 'Normal Ice')}</div></div>` : ''}
 </form>
 <div class="mt-6"><label class="font-display font-extrabold text-lg">Catatan Pesanan</label><textarea id="order-note" class="input-field mt-3 min-h-28" placeholder="Contoh: less sweet, tanpa whipped cream"></textarea></div>
 <div class="mt-6 flex items-center gap-3"><span class="font-bold">Quantity</span><div class="inline-flex items-center rounded-full border border-slate-200 p-1"><button onclick="ProductDetail.qty(-1)" class="w-10 h-10 rounded-full hover:bg-slate-100 " type="button">−</button><input id="detail-qty" value="1" class="w-14 bg-transparent text-center font-extrabold outline-none"><button onclick="ProductDetail.qty(1)" class="w-10 h-10 rounded-full hover:bg-slate-100 " type="button">+</button></div></div>
 <div class="mt-8 grid sm:grid-cols-2 gap-3 mobile-sticky-cta"><button onclick="ProductDetail.add('${product.id}')" class="btn-primary"><i class="fa-solid fa-cart-plus"></i> Tambah ke Keranjang</button><button onclick="Wishlist.toggle('${product.id}')" class="btn-secondary"><i class="fa-regular fa-heart"></i> Wishlist</button></div>
 <div class="mt-8 grid md:grid-cols-2 gap-4">
 <div class="soft-card rounded-3xl p-5"><h2 class="font-display font-extrabold text-xl mb-3">Komposisi</h2><ul class="space-y-2 text-sm text-slate-600 ">${product.composition.map(item => `<li><i class="fa-solid fa-check text-emerald-500 mr-2"></i>${item}</li>`).join('')}</ul></div>
 <div class="soft-card rounded-3xl p-5"><h2 class="font-display font-extrabold text-xl mb-3">Informasi Nutrisi</h2><div class="grid grid-cols-2 gap-3 text-sm">${Object.entries(product.nutrition).map(([k,v]) => `<div class="rounded-2xl bg-slate-50 p-3"><p class="text-slate-500 capitalize">${k}</p><strong>${v}${k === 'calories' ? ' kcal' : ' g'}</strong></div>`).join('')}</div></div>
 </div>
 </div>
 </div>
 <div class="mt-12 soft-card rounded-[2rem] p-6 md:p-8"><h2 class="section-title text-2xl md:text-3xl mb-6">Review Produk</h2><div class="grid md:grid-cols-3 gap-5">${productReviews.map(review => `<article class="rounded-3xl bg-slate-50 p-5"><div class="flex items-center gap-3"><img src="${review.avatar}" alt="${review.name}" class="w-12 h-12 rounded-full object-cover"><div><h3 class="font-bold">${review.name}</h3><p class="text-xs text-slate-500">${review.date}</p></div></div><div class="mt-3 text-xs">${Utils.stars(review.rating)}</div><p class="text-sm text-slate-500 mt-3 leading-6">${review.comment}</p></article>`).join('')}</div></div>
 <div class="mt-12"><div class="flex items-end justify-between mb-6"><div><p class="badge-pill mb-3">Produk Serupa</p><h2 class="section-title text-2xl md:text-3xl text-slate-900 ">Rekomendasi Lain</h2></div></div><div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">${Products.related(product).map(item => Products.card(item)).join('')}</div></div>
 </section>`;
 };

 const changeImage = (src, index) => {
 selectedImage = index;
 const main = document.getElementById('main-product-image');
 if (main) main.src = src;
 document.querySelectorAll('[data-thumb]').forEach(btn => btn.classList.toggle('border-orange-500', Number(btn.dataset.thumb) === selectedImage));
 };

 const zoom = (src, name) => Modal.open({ title: name, size: 'max-w-5xl', content: `<img src="${src}" alt="${name}" class="w-full max-h-[78vh] object-contain rounded-3xl bg-slate-100 ">` });

 const qty = step => {
 const input = document.getElementById('detail-qty');
 input.value = Math.max(1, Number(input.value || 1) + step);
 };

 const add = id => {
 const product = Products.getById(id);
 const quantity = Math.max(1, Number(document.getElementById('detail-qty')?.value || 1));
 Cart.add(id, quantity, readOptions(product));
 };

 return { render, changeImage, zoom, qty, add };
})();
