window.Profile = (() => {
 const render = () => {
 const root = document.getElementById('profile-page');
 if (!root) return;
 const user = Storage.currentUser();
 if (!user) return;
 const orders = Storage.getOrders();
 root.innerHTML = `
 <section class="container-page py-8 md:py-12">
 <div class="grid lg:grid-cols-[320px_1fr] gap-6">
 <aside class="soft-card rounded-[2rem] p-6 h-fit lg:sticky lg:top-24"><img src="${APP_CONFIG.defaultAvatar}" alt="Avatar" class="w-24 h-24 rounded-full object-cover mx-auto"><h1 class="font-display text-2xl font-extrabold text-center mt-4">${user.name}</h1><p class="text-center text-slate-500 text-sm mt-1">${user.email}</p><div class="mt-6 grid gap-2"><a href="orders.html" class="btn-secondary">Pesanan</a><a href="wishlist.html" class="btn-secondary">Wishlist</a><button onclick="Auth.logout()" class="btn-primary bg-red-600"><i class="fa-solid fa-right-from-bracket"></i> Logout</button></div></aside>
 <div class="space-y-6">
 <div class="soft-card rounded-[2rem] p-6"><p class="badge-pill mb-3"><i class="fa-solid fa-user"></i> Profil Pengguna</p><h2 class="section-title text-3xl text-slate-900 ">Data Diri</h2><div class="mt-6 grid sm:grid-cols-2 gap-4"><div><label class="font-bold text-sm">Nama</label><input id="profile-name" class="input-field mt-2" value="${user.name || ''}"></div><div><label class="font-bold text-sm">Nomor HP</label><input id="profile-phone" class="input-field mt-2" value="${user.phone || ''}"></div><div class="sm:col-span-2"><label class="font-bold text-sm">Email</label><input id="profile-email" class="input-field mt-2" value="${user.email || ''}"></div><div class="sm:col-span-2"><label class="font-bold text-sm">Alamat</label><textarea id="profile-address" class="input-field mt-2 min-h-24">${user.address || ''}</textarea></div></div><button onclick="Profile.save()" class="btn-primary mt-5">Simpan Profil</button></div>
 <div class="grid md:grid-cols-3 gap-4"><div class="soft-card rounded-3xl p-5"><p class="text-sm text-slate-500">Total Pesanan</p><strong class="text-3xl">${orders.length}</strong></div><div class="soft-card rounded-3xl p-5"><p class="text-sm text-slate-500">Wishlist</p><strong class="text-3xl">${Storage.getWishlist().length}</strong></div><div class="soft-card rounded-3xl p-5"><p class="text-sm text-slate-500">Riwayat Pembayaran</p><strong class="text-3xl">${orders.length}</strong></div></div>
 <div class="soft-card rounded-[2rem] p-6"><h2 class="font-display font-extrabold text-2xl mb-4">Pesanan Terbaru</h2><div class="space-y-3">${orders.slice(0, 3).map(order => `<a href="order-success.html?order=${order.id}" class="block rounded-3xl bg-slate-50 p-4"><div class="flex justify-between gap-3"><strong>${order.id}</strong><span class="text-orange-600 font-bold">Selesai</span></div><p class="text-sm text-slate-500 mt-1">${order.date} • ${Utils.money(order.total)}</p></a>`).join('') || '<p class="text-slate-500">Belum ada pesanan.</p>'}</div></div>
 </div>
 </div>
 </section>`;
 };

 const save = () => {
 const user = Storage.currentUser();
 const updated = { ...user, name: document.getElementById('profile-name').value.trim(), phone: document.getElementById('profile-phone').value.trim(), email: document.getElementById('profile-email').value.trim(), address: document.getElementById('profile-address').value.trim() };
 Storage.setCurrentUser(updated);
 const users = Storage.getUsers().map(item => item.id === updated.id ? { ...item, ...updated } : item);
 Storage.setUsers(users);
 Toast.success('Profil berhasil diperbarui');
 render();
 };

 return { render, save };
})();
