window.App = (() => {
  const renderStaticPage = () => {
    const about = document.getElementById("about-page");
    if (about) {
      about.innerHTML = `
 <section class="container-page py-10 md:py-16">
 <div class="grid lg:grid-cols-2 gap-8 items-center">
 <div><p class="badge-pill mb-4"><i class="fa-solid fa-store"></i> Tentang Renov Coffee</p><h1 class="section-title text-4xl md:text-6xl text-slate-900 ">Coffee shop modern untuk pengalaman belanja cepat.</h1><p class="mt-5 text-slate-600 leading-8">Renov Coffee adalah toko online yang menjual coffee, non coffee, dan food. Seluruh transaksi, wishlist, login, checkout, pembayaran, dan riwayat pesanan dapat dilakukan dalam website ini.</p><div class="mt-8 grid sm:grid-cols-3 gap-4"><div class="soft-card rounded-3xl p-5"><strong class="text-3xl">30+</strong><p class="text-sm text-slate-500">Produk</p></div><div class="soft-card rounded-3xl p-5"><strong class="text-3xl">24/7</strong><p class="text-sm text-slate-500">Simulasi</p></div><div class="soft-card rounded-3xl p-5"><strong class="text-3xl">100%</strong><p class="text-sm text-slate-500">Frontend</p></div></div></div>
 <img src="assets/images/banners/tentang.png" alt="Interior coffee shop" class="rounded-[2.5rem] h-[520px] w-full object-cover shadow-2xl">
 </div>
 </section>`;
    }
    const contact = document.getElementById("contact-page");
    if (contact) {
      contact.innerHTML = `
 <section class="container-page py-10 md:py-16">
 <div class="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
 <form class="soft-card rounded-[2rem] p-6 md:p-8" onsubmit="event.preventDefault(); Toast.success('Pesan berhasil dikirim secara dummy')">
 <p class="badge-pill mb-4"><i class="fa-solid fa-envelope"></i> Kontak</p><h1 class="section-title text-4xl md:text-5xl text-slate-900 ">Hubungi Kami</h1><div class="mt-8 grid sm:grid-cols-2 gap-4"><div><label class="font-bold text-sm">Nama</label><input class="input-field mt-2" required></div><div><label class="font-bold text-sm">Email</label><input type="email" class="input-field mt-2" required></div><div class="sm:col-span-2"><label class="font-bold text-sm">Subjek</label><input class="input-field mt-2" required></div><div class="sm:col-span-2"><label class="font-bold text-sm">Pesan</label><textarea class="input-field mt-2 min-h-36" required></textarea></div></div><button class="btn-primary mt-6">Kirim Pesan</button>
 </form>
 <aside class="space-y-4"><div class="soft-card rounded-3xl p-5"><i class="fa-solid fa-phone text-2xl text-orange-600"></i><h2 class="font-display font-extrabold text-xl mt-3">Telepon</h2><p class="text-slate-500 mt-1">${APP_CONFIG.supportPhone}</p></div><div class="soft-card rounded-3xl p-5"><i class="fa-brands fa-whatsapp text-2xl text-emerald-500"></i><h2 class="font-display font-extrabold text-xl mt-3">WhatsApp</h2><p class="text-slate-500 mt-1">+62 812-3456-7890</p></div><div class="soft-card rounded-3xl p-5 h-64 flex items-center justify-center"><i class="fa-solid fa-map-location-dot mr-2"></i> Maps Dummy</div></aside>
 </div>
 </section>`;
    }
  };

  const route = () => {
    const page = document.body.dataset.page;
    const routes = {
      home: Products.renderHome,
      products: Products.renderProductsPage,
      detail: ProductDetail.render,
      cart: Cart.renderPage,
      checkout: Checkout.render,
      payment: Payment.render,
      "order-success": Orders.renderSuccess,
      tracking: () => location.replace("orders.html"),
      wishlist: Wishlist.renderPage,
      login: Auth.renderLogin,
      register: Auth.renderRegister,
      profile: Profile.render,
      orders: Orders.render,
    };
    if (routes[page]) routes[page]();
    renderStaticPage();
    Utils.lazyImages();
    Utils.animateOnScroll();
    Slider.init();
  };

  const init = () => {
    Storage.init();
    UI.init();
    Auth.protect();
    route();
  };

  document.addEventListener("DOMContentLoaded", init);
  return { init, route };
})();
