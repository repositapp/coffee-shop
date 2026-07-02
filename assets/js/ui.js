window.UI = (() => {
  const navItems = [
    ["index.html", "Home"],
    ["products.html?category=coffee", "Coffee"],
    ["products.html?category=non-coffee", "Non Coffee"],
    ["products.html?category=food", "Food"],
    ["products.html?flash=true", "Promo"],
    ["about.html", "Tentang"],
    ["contact.html", "Kontak"],
  ];

  const countCart = () =>
    Storage.getCart().reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    );
  const countWishlist = () => Storage.getWishlist().length;

  const categoryLabel = (category) =>
    ({ coffee: "Coffee", "non-coffee": "Non Coffee", food: "Food" })[
      category
    ] || "";

  const activeMenuLabel = () => {
    const current = location.pathname.split("/").pop() || "index.html";
    const params = new URLSearchParams(location.search);

    if (current === "index.html") return "Home";
    if (current === "about.html") return "Tentang";
    if (current === "contact.html") return "Kontak";
    if (current === "promo.html") return "Promo";
    if (current === "products.html" || current === "shop.html") {
      if (params.get("flash") === "true") return "Promo";
      return categoryLabel(params.get("category"));
    }
    if (current === "product-detail.html" || current === "product.html") {
      const id = params.get("id") || params.get("slug");
      const product = STORE_DATA.products.find(
        (item) => item.id === id || item.slug === id,
      );
      return categoryLabel(product?.category);
    }
    return "";
  };

  const navLink = ([href, label], mobile = false) => {
    const active = activeMenuLabel() === label;
    const mobileClass = active
      ? "bg-orange-50 text-orange-700"
      : "text-coffee-800 hover:bg-orange-50 hover:text-orange-700";
    return `<a href="${href}" class="${mobile ? `px-4 py-3 rounded-2xl font-bold transition ${mobileClass}` : `nav-link ${active ? "active" : ""}`}">${label}</a>`;
  };

  const bindNavbarScroll = () => {
    const header = document.querySelector(".site-navbar");
    if (!header) return;
    const update = () =>
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
  };

  const renderNavbar = () => {
    const root = document.getElementById("app-navbar");
    if (!root) return;
    const user = Storage.currentUser();
    root.innerHTML = `
      <header class="site-navbar fixed top-0 inset-x-0 z-[90] border-b border-[#E7D9C8]/80 bg-[#F8F5F2]/92 backdrop-blur-xl transition-all duration-300">
        <a href="#main-content" class="skip-link">Lewati ke konten</a>
        <nav class="container-page min-h-[76px] py-3 flex items-center justify-between gap-4" aria-label="Navigasi utama">
          <a href="index.html" class="flex items-center gap-3 shrink-0" aria-label="Coffee Shop Store Home">
            <span class="w-11 h-11 rounded-2xl bg-gradient-to-br from-coffee-700 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-900/20"><i class="fa-solid fa-mug-hot"></i></span>
            <span class="font-display font-extrabold text-lg tracking-tight text-[#3B281D] leading-tight">Rimba<span class="text-orange-600">Coffee</span></span>
          </a>
          <div class="hidden lg:flex items-center gap-7">
            ${navItems.map((item) => navLink(item)).join("")}
          </div>
          <div class="hidden md:flex items-center flex-1 max-w-sm relative">
            <button onclick="Search.open()" class="w-full text-left rounded-full border border-[#E6D7C9] bg-white/70 px-4 py-2.5 text-sm text-[#7B543C] hover:border-orange-300 hover:bg-white transition"><i class="fa-solid fa-magnifying-glass mr-2"></i> Cari menu favorit...</button>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="Search.open()" class="md:hidden w-10 h-10 rounded-full bg-white/80 text-coffee-700 border border-[#E6D7C9]" aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
            <a href="wishlist.html" class="relative w-10 h-10 rounded-full bg-white/80 text-coffee-700 border border-[#E6D7C9] flex items-center justify-center" aria-label="Wishlist"><i class="fa-regular fa-heart"></i><span data-wishlist-count class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">0</span></a>
            <a href="cart.html" class="relative w-10 h-10 rounded-full bg-coffee-700 text-white flex items-center justify-center shadow-lg shadow-coffee-700/20" aria-label="Keranjang"><i class="fa-solid fa-bag-shopping"></i><span data-cart-count class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">0</span></a>
            <a href="${user ? "profile.html" : "login.html"}" class="hidden sm:flex w-10 h-10 rounded-full bg-white/80 text-coffee-700 border border-[#E6D7C9] items-center justify-center" aria-label="Profil"><i class="fa-regular fa-user"></i></a>
            <button id="mobile-menu-btn" class="lg:hidden w-10 h-10 rounded-full bg-white/80 text-coffee-700 border border-[#E6D7C9]" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
          </div>
        </nav>
        <div id="mobile-menu" class="hidden lg:hidden border-t border-[#E7D9C8] bg-[#F8F5F2]/98 backdrop-blur-xl">
          <div class="container-page py-4 grid gap-2">
            ${navItems.map((item) => navLink(item, true)).join("")}
            <a href="${user ? "profile.html" : "login.html"}" class="px-4 py-3 rounded-2xl bg-orange-50 font-bold text-orange-700">${user ? "Profil Saya" : "Login"}</a>
          </div>
        </div>
      </header>`;
    document
      .getElementById("mobile-menu-btn")
      ?.addEventListener("click", () =>
        document.getElementById("mobile-menu")?.classList.toggle("hidden"),
      );
    bindNavbarScroll();
    updateBadges();
  };

  const renderFooter = () => {
    const root = document.getElementById("app-footer");
    if (!root) return;
    root.innerHTML = `
      <footer class="mt-16 bg-[#F1E7DC] text-[#4E3727] relative overflow-hidden border-t border-[#E3D0BF]">
        <div class="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_20%_20%,#FCD9A8,transparent_25%),radial-gradient(circle_at_80%_0%,#D8C2B1,transparent_30%)]"></div>
        <div class="container-page relative py-12 md:py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-3 text-[#3B281D]"><span class="w-11 h-11 rounded-2xl bg-gradient-to-br from-coffee-700 to-orange-600 text-white flex items-center justify-center"><i class="fa-solid fa-mug-hot"></i></span><strong class="font-display text-xl">RimbaCoffee</strong></div>
            <p class="mt-4 text-sm leading-7 text-[#7B543C]">Toko online coffee, non coffee, dan food pilihan dengan pengalaman belanja cepat dan elegan.</p>
            <div class="mt-5 flex gap-3"><a class="w-10 h-10 rounded-full bg-white/70 text-coffee-700 flex items-center justify-center hover:bg-orange-600 hover:text-white transition" href="#"><i class="fa-brands fa-instagram"></i></a><a class="w-10 h-10 rounded-full bg-white/70 text-coffee-700 flex items-center justify-center hover:bg-orange-600 hover:text-white transition" href="#"><i class="fa-brands fa-tiktok"></i></a><a class="w-10 h-10 rounded-full bg-white/70 text-coffee-700 flex items-center justify-center hover:bg-orange-600 hover:text-white transition" href="#"><i class="fa-brands fa-x-twitter"></i></a></div>
          </div>
          <div><h3 class="font-display font-extrabold text-[#3B281D] mb-4">Jam Operasional</h3><ul class="space-y-3 text-sm text-[#6F4E37]"><li>Senin - Jumat: 08.00 - 22.00</li><li>Sabtu - Minggu: 09.00 - 23.00</li><li>Pickup Order: 08.30 - 21.30</li></ul></div>
          <div><h3 class="font-display font-extrabold text-[#3B281D] mb-4">Bantuan</h3><ul class="space-y-3 text-sm text-[#6F4E37]"><li><a href="about.html" class="hover:text-orange-600">Tentang Kami</a></li><li><a href="contact.html" class="hover:text-orange-600">Kontak</a></li><li><a href="#" class="hover:text-orange-600">FAQ</a></li><li><a href="#" class="hover:text-orange-600">Privacy Policy</a></li><li><a href="#" class="hover:text-orange-600">Terms</a></li></ul></div>
          <div><h3 class="font-display font-extrabold text-[#3B281D] mb-4">Newsletter</h3><p class="text-sm text-[#7B543C] mb-4">Dapatkan info promo dan menu baru.</p><div class="flex gap-2"><input class="w-full rounded-full bg-white/80 border border-[#E3D0BF] px-4 py-3 outline-none" placeholder="Email kamu"><button onclick="Toast.success('Newsletter berhasil disimpan')" class="rounded-full bg-orange-600 px-4 font-bold text-white">Kirim</button></div><div class="mt-4 overflow-hidden rounded-3xl border border-[#E3D0BF] shadow-sm h-30">
   <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d786.0798195315384!2d122.61665667656635!3d-5.470839441350459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2da477003542bebf%3A0x62c50bb10190b311!2sRimba%20Coffee!5e1!3m2!1sid!2sid!4v1783018495017!5m2!1sid!2sid" width="100%" height="100%" style="border:0;" loading="lazy" allowfullscreen="" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div></div>
        </div>
        <div class="relative border-t border-[#E3D0BF] py-5 text-center text-sm text-[#7B543C]">© 2026 RimbaCoffee. All rights reserved.</div>
      </footer>`;
  };

  const renderFloating = () => {
    const root =
      document.getElementById("floating-root") || document.createElement("div");
    root.id = "floating-root";
    root.innerHTML = `
      <div class="fixed right-4 bottom-4 z-40 flex flex-col gap-3">
        <a href="cart.html" class="relative w-12 h-12 rounded-full bg-coffee-700 text-white shadow-xl flex items-center justify-center" aria-label="Floating cart"><i class="fa-solid fa-cart-shopping"></i><span data-cart-count class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">0</span></a>
        <a href="https://wa.me/${APP_CONFIG.whatsappNumber}" class="w-12 h-12 rounded-full bg-emerald-500 text-white shadow-xl flex items-center justify-center" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
        <a href="tel:${APP_CONFIG.supportPhone}" class="w-12 h-12 rounded-full bg-blue-500 text-white shadow-xl flex items-center justify-center" aria-label="Call"><i class="fa-solid fa-phone"></i></a>
        <button onclick="Toast.info('Halo, ada yang bisa kami bantu?')" class="w-12 h-12 rounded-full bg-coffee-700 text-white shadow-xl flex items-center justify-center" aria-label="Chat"><i class="fa-solid fa-comments"></i></button>
        <button id="back-to-top" class="hidden w-12 h-12 rounded-full bg-white text-coffee-800 border border-[#E6D7C9] shadow-xl items-center justify-center" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></button>
      </div>`;
    document.body.appendChild(root);
    const back = document.getElementById("back-to-top");
    window.addEventListener(
      "scroll",
      () => back?.classList.toggle("hidden", window.scrollY < 600),
      { passive: true },
    );
    back?.addEventListener("click", () =>
      scrollTo({ top: 0, behavior: "smooth" }),
    );
    updateBadges();
  };

  const updateBadges = () => {
    document
      .querySelectorAll("[data-cart-count]")
      .forEach((el) => (el.textContent = countCart()));
    document
      .querySelectorAll("[data-wishlist-count]")
      .forEach((el) => (el.textContent = countWishlist()));
  };

  const skeletonCards = (count = 8) =>
    Array.from(
      { length: count },
      () =>
        `<div class="rounded-3xl overflow-hidden soft-card p-4"><div class="skeleton h-48 rounded-2xl"></div><div class="skeleton h-4 rounded mt-4 w-2/3"></div><div class="skeleton h-4 rounded mt-3 w-1/2"></div><div class="skeleton h-10 rounded-full mt-5"></div></div>`,
    ).join("");

  const init = () => {
    renderNavbar();
    renderFooter();
    renderFloating();
    updateBadges();
    window.addEventListener("store:changed", updateBadges);
  };

  return {
    init,
    renderNavbar,
    renderFooter,
    renderFloating,
    updateBadges,
    skeletonCards,
  };
})();
