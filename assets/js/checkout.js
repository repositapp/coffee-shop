window.Checkout = (() => {
 const render = () => {
 const root = document.getElementById('checkout-page');
 if (!root) return;
 const items = Cart.detailed();
 if (!items.length) {
 root.innerHTML = `<section class="container-page py-16"><div class="soft-card rounded-[2rem] p-8 text-center"><h1 class="font-display text-3xl font-extrabold">Keranjang kosong</h1><a href="products.html" class="btn-primary mt-6">Belanja Dulu</a></div></section>`;
 return;
 }
 const user = Storage.currentUser() || {};
 const selectedShipping = Storage.get('selectedShipping', STORE_DATA.shipping[0]);
 Storage.set('selectedShipping', selectedShipping);
 root.innerHTML = `
 <section class="container-page py-8 md:py-12 mobile-safe-bottom">
 <div class="mb-8"><p class="badge-pill mb-3"><i class="fa-solid fa-location-dot"></i> Checkout</p><h1 class="section-title text-3xl md:text-5xl text-slate-900 ">Informasi Pengiriman</h1></div>
 <div class="grid lg:grid-cols-[1fr_380px] gap-6">
 <form id="checkout-form" class="space-y-5">
 <div class="soft-card rounded-3xl p-5"><h2 class="font-display font-extrabold text-xl mb-4">Informasi Pembeli</h2><div class="grid sm:grid-cols-2 gap-4">
 <div><label class="font-bold text-sm">Nama</label><input id="buyer-name" class="input-field mt-2" value="${user.name || ''}" required></div>
 <div><label class="font-bold text-sm">Nomor HP</label><input id="buyer-phone" class="input-field mt-2" value="${user.phone || ''}" required></div>
 <div class="sm:col-span-2"><label class="font-bold text-sm">Email</label><input id="buyer-email" type="email" class="input-field mt-2" value="${user.email || ''}" required></div>
 </div></div>
 <div class="soft-card rounded-3xl p-5"><h2 class="font-display font-extrabold text-xl mb-4">Alamat Pengiriman</h2><div class="grid sm:grid-cols-2 gap-4">
 <div class="sm:col-span-2"><label class="font-bold text-sm">Alamat</label><textarea id="buyer-address" class="input-field mt-2 min-h-24" required>${user.address || ''}</textarea></div>
 ${['Provinsi','Kabupaten','Kecamatan','Kelurahan','Kode Pos'].map((label, idx) => `<div class="${idx === 4 ? 'sm:col-span-2' : ''}"><label class="font-bold text-sm">${label}</label><input id="addr-${Utils.slugify(label)}" class="input-field mt-2" required></div>`).join('')}
 <div class="sm:col-span-2"><label class="font-bold text-sm">Catatan Pengiriman</label><textarea id="delivery-note" class="input-field mt-2 min-h-24">${Storage.get('cartNote', '') || ''}</textarea></div>
 </div></div>
 <div class="soft-card rounded-3xl p-5"><h2 class="font-display font-extrabold text-xl mb-4">Pilihan Pengiriman</h2><div class="grid md:grid-cols-3 gap-3">${STORE_DATA.shipping.map(method => `<label class="cursor-pointer"><input type="radio" name="shipping" value="${method.id}" class="peer sr-only" ${method.id === selectedShipping.id ? 'checked' : ''} onchange="Checkout.selectShipping('${method.id}')"><span class="block h-full rounded-3xl border border-slate-200 p-4 peer-checked:border-orange-500 peer-checked:bg-orange-50 "><strong>${method.name}</strong><p class="text-sm text-slate-500 mt-1">${method.description}</p><p class="font-extrabold mt-3">${Utils.money(method.price)}</p></span></label>`).join('')}</div></div>
 </form>
 <aside class="checkout-sticky space-y-4">${Cart.summaryHTML(true)}<button onclick="Checkout.save()" class="btn-primary w-full mobile-sticky-cta"><i class="fa-solid fa-wallet"></i> Pilih Pembayaran</button></aside>
 </div>
 </section>`;
 };

 const selectShipping = id => {
 const method = STORE_DATA.shipping.find(item => item.id === id) || STORE_DATA.shipping[0];
 Storage.set('selectedShipping', method);
 render();
 };

 const save = () => {
 const required = ['buyer-name','buyer-phone','buyer-email','buyer-address','addr-provinsi','addr-kabupaten','addr-kecamatan','addr-kelurahan','addr-kode-pos'];
 const missing = required.find(id => !document.getElementById(id)?.value.trim());
 if (missing) return Toast.warning('Lengkapi seluruh data checkout');
 const checkout = {
 buyer: {
 name: document.getElementById('buyer-name').value.trim(),
 phone: document.getElementById('buyer-phone').value.trim(),
 email: document.getElementById('buyer-email').value.trim()
 },
 address: {
 detail: document.getElementById('buyer-address').value.trim(),
 province: document.getElementById('addr-provinsi').value.trim(),
 city: document.getElementById('addr-kabupaten').value.trim(),
 district: document.getElementById('addr-kecamatan').value.trim(),
 village: document.getElementById('addr-kelurahan').value.trim(),
 postalCode: document.getElementById('addr-kode-pos').value.trim(),
 note: document.getElementById('delivery-note').value.trim()
 },
 shipping: Storage.get('selectedShipping', STORE_DATA.shipping[0]),
 totals: Cart.totals()
 };
 Storage.set('checkout', checkout);
 Toast.success('Data checkout disimpan');
 setTimeout(() => location.href = 'payment.html', 450);
 };

 return { render, selectShipping, save };
})();
