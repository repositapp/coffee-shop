window.Products = (() => {
  const state = {
    category: Utils.getParam("category") || "all",
    query: Utils.getParam("q") || "",
    minPrice: "",
    maxPrice: "",
    sort: "popular",
    view: "grid",
    page: 1,
    perPage: 8,
    flash: Utils.getParam("flash") === "true",
  };

  const getAll = () => STORE_DATA.products;
  const getById = (id) =>
    STORE_DATA.products.find(
      (product) => product.id === id || product.slug === id,
    );
  const related = (product) =>
    STORE_DATA.products
      .filter(
        (item) => item.category === product.category && item.id !== product.id,
      )
      .slice(0, 4);

  const priceBlock = (product) => `
 <div class="flex items-center gap-2 flex-wrap">
 <strong class="text-lg text-coffee-700 ">${Utils.money(product.price)}</strong>
 ${product.oldPrice ? `<span class="text-xs line-through text-slate-400">${Utils.money(product.oldPrice)}</span>` : ""}
 </div>`;

  const card = (product, view = "grid") => {
    const wished = Wishlist.has(product.id);
    if (view === "list") {
      return `
 <article class="product-card soft-card rounded-3xl p-4 flex flex-col sm:flex-row gap-4" data-product-card data-category="${product.category}">
 <a href="product-detail.html?id=${product.id}" class="image-zoom block sm:w-56 h-48 sm:h-44 rounded-2xl overflow-hidden shrink-0"><img src="${product.images[0]}" alt="${product.name}" class="w-full h-full object-cover" loading="lazy"></a>
 <div class="flex-1 min-w-0 flex flex-col">
 <div class="flex items-start justify-between gap-3"><div><p class="badge-pill mb-2">${product.badge}</p><h3 class="font-display text-xl font-extrabold text-slate-900 "><a href="product-detail.html?id=${product.id}">${product.name}</a></h3><p class="text-sm text-slate-500 mt-1">${product.categoryName}</p></div><button data-wishlist="${product.id}" onclick="Wishlist.toggle('${product.id}')" class="w-11 h-11 rounded-full bg-slate-100 ${wished ? "text-red-500 bg-red-50" : "text-slate-600 "}"><i class="fa-${wished ? "solid" : "regular"} fa-heart"></i></button></div>
 <p class="text-sm text-slate-500 mt-3 line-clamp-2">${product.description}</p>
 <div class="mt-3 flex items-center gap-2 text-sm">${Utils.stars(product.rating)}<span class="font-bold text-slate-600 ">${product.rating}</span><span class="text-slate-400">(${product.reviews})</span></div>
 <div class="mt-auto pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">${priceBlock(product)}<div class="flex gap-2"><button onclick="Products.quickView('${product.id}')" class="btn-secondary px-4 py-2">Quick View</button><button onclick="Cart.add('${product.id}', 1, { size: '${product.category === "food" ? "Single" : "Regular"}' })" class="btn-primary px-4 py-2"><i class="fa-solid fa-cart-plus"></i> Keranjang</button></div></div>
 </div>
 </article>`;
    }
    return `
 <article class="product-card soft-card rounded-3xl p-3" data-product-card data-category="${product.category}">
 <div class="relative image-zoom rounded-2xl overflow-hidden h-52">
 <a href="product-detail.html?id=${product.id}"><img src="${product.images[0]}" alt="${product.name}" class="w-full h-full object-cover" loading="lazy"></a>
 <div class="absolute top-3 left-3 flex flex-col gap-2">${product.discount ? `<span class="badge-pill bg-red-500 text-white">-${product.discount}%</span>` : ""}<span class="badge-pill">${product.badge}</span></div>
 <div class="absolute top-3 right-3 flex flex-col gap-2">
 <button data-wishlist="${product.id}" onclick="Wishlist.toggle('${product.id}')" class="w-10 h-10 rounded-full glass-card ${wished ? "text-red-500 bg-red-50" : "text-slate-700 "}" aria-label="Wishlist ${product.name}"><i class="fa-${wished ? "solid" : "regular"} fa-heart"></i></button>
 <button onclick="Products.quickView('${product.id}')" class="w-10 h-10 rounded-full glass-card text-slate-700 " aria-label="Quick view ${product.name}"><i class="fa-regular fa-eye"></i></button>
 </div>
 </div>
 <div class="p-2 pt-4">
 <div class="flex items-center justify-between gap-2 text-xs font-bold text-slate-500 "><span>${product.categoryName}</span><span><i class="fa-solid fa-star text-amber-400"></i> ${product.rating}</span></div>
 <h3 class="font-display font-extrabold text-lg mt-2 text-slate-900 line-clamp-2"><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
 <p class="text-sm text-slate-500 mt-2 line-clamp-2">${product.description}</p>
 <div class="mt-4 flex items-center justify-between gap-3">${priceBlock(product)}<button onclick="Cart.add('${product.id}', 1, { size: '${product.category === "food" ? "Single" : "Regular"}' })" class="w-11 h-11 rounded-full bg-coffee-700 text-white shadow-lg shadow-coffee-700/20 hover:bg-orange-600 transition" aria-label="Tambah ${product.name}"><i class="fa-solid fa-plus"></i></button></div>
 </div>
 </article>`;
  };

  const quickView = (id) => {
    const product = getById(id);
    if (!product) return;
    Modal.open({
      title: product.name,
      size: "max-w-4xl",
      content: `
 <div class="grid md:grid-cols-2 gap-5">
 <img src="${product.images[0]}" alt="${product.name}" class="w-full h-80 object-cover rounded-3xl">
 <div>
 <p class="badge-pill mb-3">${product.categoryName}</p>
 <h2 class="font-display text-3xl font-extrabold text-slate-900 ">${product.name}</h2>
 <div class="mt-3 flex items-center gap-2 text-sm">${Utils.stars(product.rating)}<strong>${product.rating}</strong><span class="text-slate-400">${product.reviews} review</span></div>
 <p class="mt-4 text-slate-500 leading-7">${product.description}</p>
 <div class="mt-5">${priceBlock(product)}</div>
 <div class="mt-6 flex flex-col sm:flex-row gap-3"><a href="product-detail.html?id=${product.id}" class="btn-secondary">Detail Produk</a><button onclick="Cart.add('${product.id}', 1, { size: '${product.category === "food" ? "Single" : "Regular"}' }); Modal.close();" class="btn-primary"><i class="fa-solid fa-cart-plus"></i> Tambah ke Keranjang</button></div>
 </div>
 </div>`,
    });
  };

  const categoryChips = () => `
 <button data-category-filter="all" class="category-chip ${state.category === "all" ? "btn-primary" : "btn-secondary"} py-2">Semua</button>
 ${STORE_DATA.categories.map((category) => `<button data-category-filter="${category.id}" class="category-chip ${state.category === category.id ? "btn-primary" : "btn-secondary"} py-2"><i class="fa-solid ${category.icon}"></i> ${category.name}</button>`).join("")}`;

  const bindProductsPage = () => {
    document.querySelectorAll("[data-category-filter]").forEach((btn) =>
      btn.addEventListener("click", () => {
        state.category = btn.dataset.categoryFilter;
        state.page = 1;
        renderProductsPage();
      }),
    );
    document.getElementById("product-search")?.addEventListener(
      "input",
      Utils.debounce((event) => {
        state.query = event.target.value;
        state.page = 1;
        renderProductsPage(false);
      }, 180),
    );
    document.getElementById("min-price")?.addEventListener("input", (event) => {
      state.minPrice = event.target.value;
      state.page = 1;
      renderProductsPage(false);
    });
    document.getElementById("max-price")?.addEventListener("input", (event) => {
      state.maxPrice = event.target.value;
      state.page = 1;
      renderProductsPage(false);
    });
    document
      .getElementById("sort-product")
      ?.addEventListener("change", (event) => {
        state.sort = event.target.value;
        renderProductsPage(false);
      });
    document.querySelectorAll("[data-view-mode]").forEach((btn) =>
      btn.addEventListener("click", () => {
        state.view = btn.dataset.viewMode;
        renderProductsPage(false);
      }),
    );
  };

  const renderProductsOnly = () => {
    const list = Filter.apply(getAll(), state);
    const totalPages = Math.max(1, Math.ceil(list.length / state.perPage));
    state.page = Utils.clamp(state.page, 1, totalPages);
    const current = list.slice(
      (state.page - 1) * state.perPage,
      state.page * state.perPage,
    );
    const grid = document.getElementById("products-grid");
    const info = document.getElementById("products-info");
    const pagination = document.getElementById("products-pagination");
    if (!grid) return;
    grid.className =
      state.view === "grid"
        ? "grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
        : "grid gap-4";
    grid.innerHTML = current.length
      ? current.map((product) => card(product, state.view)).join("")
      : `<div class="soft-card rounded-3xl p-8 text-center col-span-full"><i class="fa-solid fa-magnifying-glass text-4xl text-slate-300 mb-4"></i><h3 class="font-display text-2xl font-extrabold">Produk tidak ditemukan</h3><p class="text-slate-500 mt-2">Ubah kata kunci atau filter produk.</p></div>`;
    if (info) info.textContent = `${list.length} produk ditemukan`;
    if (pagination)
      pagination.innerHTML = Array.from(
        { length: totalPages },
        (_, i) =>
          `<button onclick="Products.goPage(${i + 1})" class="w-10 h-10 rounded-full ${state.page === i + 1 ? "bg-coffee-700 text-white" : "bg-slate-100 "} font-bold">${i + 1}</button>`,
      ).join("");
  };

  const goPage = (page) => {
    state.page = page;
    renderProductsOnly();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderProductsPage = (full = true) => {
    const root = document.getElementById("products-page");
    if (!root) return;
    if (full) {
      root.innerHTML = `
 <section class="container-page py-8 md:py-12">
 <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
 <div><p class="badge-pill mb-3"><i class="fa-solid fa-store"></i> Menu Store</p><h1 class="section-title text-3xl md:text-5xl text-slate-900 ">Daftar Produk</h1><p class="text-slate-500 mt-3 max-w-2xl">Cari menu coffee, non coffee, dan food favorit dengan filter cepat.</p></div>
 <div class="flex gap-2"><button data-view-mode="grid" class="btn-secondary py-2"><i class="fa-solid fa-grip"></i></button><button data-view-mode="list" class="btn-secondary py-2"><i class="fa-solid fa-list"></i></button></div>
 </div>
 <div class="grid lg:grid-cols-[300px_1fr] gap-6">
 <aside class="soft-card rounded-3xl p-5 h-fit lg:sticky lg:top-24">
 <h2 class="font-display font-extrabold text-xl mb-4 text-slate-900 ">Filter</h2>
 <div class="space-y-5">
 <div><label class="font-bold text-sm">Search</label><input id="product-search" class="input-field mt-2" placeholder="Cari produk" value="${Utils.escapeHTML(state.query)}"></div>
 <div><label class="font-bold text-sm">Kategori</label><div class="mt-3 flex flex-wrap gap-2">${categoryChips()}</div></div>
 <div class="grid grid-cols-2 gap-3"><div><label class="font-bold text-sm">Harga Min</label><input id="min-price" type="number" class="input-field mt-2" placeholder="0"></div><div><label class="font-bold text-sm">Harga Max</label><input id="max-price" type="number" class="input-field mt-2" placeholder="100000"></div></div>
 <div><label class="font-bold text-sm">Sorting</label><select id="sort-product" class="input-field mt-2"><option value="popular">Terpopuler</option><option value="newest">Terbaru</option><option value="rating">Rating</option><option value="price-low">Harga Terendah</option><option value="price-high">Harga Tertinggi</option></select></div>
 </div>
 </aside>
 <div><div class="flex items-center justify-between mb-4"><p id="products-info" class="text-sm font-bold text-slate-500"></p><p class="text-sm text-slate-400">Grid/List View</p></div><div id="products-grid"></div><div id="products-pagination" class="mt-8 flex justify-center gap-2 flex-wrap"></div></div>
 </div>
 </section>`;
      bindProductsPage();
    }
    renderProductsOnly();
  };

  const productRail = (title, subtitle, items, id = "") => `
 <section class="container-page py-8 md:py-12" data-animate>
 <div class="flex items-end justify-between gap-4 mb-6"><div><p class="badge-pill mb-3">${subtitle}</p><h2 class="section-title text-2xl md:text-4xl text-slate-900 ">${title}</h2></div><a href="products.html${id ? "?category=" + id : ""}" class="hidden sm:inline-flex btn-secondary py-2">Lihat Semua</a></div>
 <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">${items.map((product) => card(product)).join("")}</div>
 </section>`;

  const renderHome = () => {
    const root = document.getElementById("home-page");
    if (!root) return;
    const banner = STORE_DATA.banners[0];
    const best = getAll()
      .filter((p) => p.isBestSeller)
      .slice(0, 4);
    const latest = getAll()
      .filter((p) => p.isNew)
      .slice(0, 4);
    const flash = getAll()
      .filter((p) => p.isFlashSale)
      .slice(0, 4);
    root.innerHTML = `
 <section class="hero-gradient overflow-hidden">
 <div class="container-page py-10 md:py-16 grid lg:grid-cols-2 gap-10 items-center min-h-[calc(100vh-82px)]">
 <div class="animate-fade-up"><p class="badge-pill mb-5"><i class="fa-solid fa-bolt"></i> Renov Coffee Store</p><h1 class="font-display text-4xl md:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.02] text-slate-950 ">${banner.title}</h1><p class="mt-5 text-lg text-slate-600 leading-8 max-w-xl">${banner.subtitle}</p><div class="mt-8 flex flex-col sm:flex-row gap-3"><a href="products.html" class="btn-primary xs-full">Belanja Sekarang <i class="fa-solid fa-arrow-right"></i></a><a href="products.html?flash=true" class="btn-secondary xs-full">Lihat Flash Sale</a></div><div class="mt-8 grid grid-cols-3 gap-3 max-w-lg"><div class="glass-card rounded-3xl p-4"><strong class="text-2xl text-slate-900 ">30+</strong><p class="text-xs text-slate-500">Menu</p></div><div class="glass-card rounded-3xl p-4"><strong class="text-2xl text-slate-900 ">4.8</strong><p class="text-xs text-slate-500">Rating</p></div><div class="glass-card rounded-3xl p-4"><strong class="text-2xl text-slate-900 ">60m</strong><p class="text-xs text-slate-500">Delivery</p></div></div></div>
 <div class="relative animate-float-soft"><div class="absolute -inset-6 bg-orange-500/10 blur-3xl rounded-full"></div><img src="${banner.image}" alt="${banner.title}" class="relative rounded-[2.5rem] w-full h-[440px] md:h-[620px] object-cover shadow-2xl"><div class="absolute bottom-5 left-5 right-5 glass-card rounded-3xl p-4 flex items-center justify-between"><div><p class="text-xs font-bold text-slate-500">Flash Sale Ends</p><strong id="flash-countdown" class="text-xl text-slate-900 ">00:00:00</strong></div><a href="products.html?flash=true" class="btn-primary py-2 px-4">Claim</a></div></div>
 </div>
 </section>
 <section class="container-page py-8 md:py-12" data-animate><div class="grid md:grid-cols-3 gap-5">${STORE_DATA.promos.map((p) => `<div class="soft-card rounded-3xl p-5"><p class="badge-pill mb-3">${p.code}</p><h2 class="font-display text-xl font-extrabold text-slate-900 ">${p.title}</h2><p class="text-sm text-slate-500 mt-2 leading-6">${p.description}</p><button onclick="Storage.set('voucher', '${p.code}'); Toast.success('Voucher ${p.code} disimpan')" class="btn-secondary py-2 mt-4">Simpan Voucher</button></div>`).join("")}</div></section>
 <section class="container-page py-8 md:py-12" data-animate><div class="flex items-end justify-between mb-6"><div><p class="badge-pill mb-3">Kategori</p><h2 class="section-title text-2xl md:text-4xl text-slate-900 ">Pilih Kategori</h2></div></div><div class="grid md:grid-cols-3 gap-5">${STORE_DATA.categories.map((category) => `<a href="products.html?category=${category.id}" class="group relative overflow-hidden rounded-[2rem] min-h-72 soft-card"><img src="${category.image}" alt="${category.name}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500"><div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent"></div><div class="absolute bottom-5 left-5 right-5 text-white"><span class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4"><i class="fa-solid ${category.icon}"></i></span><h3 class="font-display text-2xl font-extrabold">${category.name}</h3><p class="text-sm text-slate-200 mt-2">${category.description}</p></div></a>`).join("")}</div></section>
 ${productRail("Best Seller", "Favorit Pelanggan", best)}
 ${productRail("Produk Terbaru", "Fresh Menu", latest)}
 ${productRail("Diskon Hari Ini", "Flash Sale", flash)}
 ${productRail(
   "Menu Coffee",
   "Coffee",
   getAll()
     .filter((p) => p.category === "coffee")
     .slice(0, 4),
   "coffee",
 )}
 ${productRail(
   "Menu Non Coffee",
   "Non Coffee",
   getAll()
     .filter((p) => p.category === "non-coffee")
     .slice(0, 4),
   "non-coffee",
 )}
 ${productRail(
   "Menu Food",
   "Food",
   getAll()
     .filter((p) => p.category === "food")
     .slice(0, 4),
   "food",
 )}
 <section class="container-page py-8 md:py-12" data-animate><div class="grid md:grid-cols-4 gap-5">${[
   ["fa-truck-fast", "Cepat", "Delivery 30-60 menit"],
   ["fa-shield-heart", "Aman", "Pembayaran simulasi aman"],
   ["fa-leaf", "Fresh", "Bahan dipilih harian"],
   ["fa-headset", "Support", "Layanan pelanggan responsif"],
 ]
   .map(
     (i) =>
       `<div class="soft-card rounded-3xl p-6"><i class="fa-solid ${i[0]} text-3xl text-orange-600"></i><h3 class="font-display text-xl font-extrabold mt-4">${i[1]}</h3><p class="text-sm text-slate-500 mt-2">${i[2]}</p></div>`,
   )
   .join("")}</div></section>
 <section class="container-page py-8 md:py-12" data-animate><div class="soft-card rounded-[2rem] p-6 md:p-10"><div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"><div><p class="badge-pill mb-3">Testimoni</p><h2 class="section-title text-2xl md:text-4xl text-slate-900 ">Kata Pelanggan</h2></div></div><div class="grid md:grid-cols-4 gap-5">${STORE_DATA.reviews.map((r) => `<article class="rounded-3xl bg-slate-50 p-5"><div class="flex items-center gap-3"><img src="${r.avatar}" alt="${r.name}" class="w-12 h-12 rounded-full object-cover"><div><h3 class="font-bold">${r.name}</h3><div class="text-xs">${Utils.stars(r.rating)}</div></div></div><p class="text-sm text-slate-500 mt-4 leading-6">“${r.comment}”</p></article>`).join("")}</div></div></section>
 <section class="container-page py-8 md:py-12" data-animate><div class="rounded-[2rem] bg-gradient-to-br from-coffee-700 to-orange-600 p-6 md:p-10 text-white overflow-hidden relative"><div class="max-w-2xl relative"><p class="badge-pill bg-white/20 text-white mb-4">Newsletter</p><h2 class="font-display text-3xl md:text-5xl font-extrabold">Dapatkan update promo terbaik.</h2><div class="mt-6 flex flex-col sm:flex-row gap-3"><input class="rounded-full px-5 py-4 text-slate-900 outline-none w-full" placeholder="Email kamu"><button onclick="Toast.success('Berhasil berlangganan newsletter')" class="rounded-full bg-slate-950 px-6 py-4 font-bold">Subscribe</button></div></div></div></section>`;
    Countdown.init();
  };

  return {
    getAll,
    getById,
    related,
    card,
    quickView,
    renderProductsPage,
    renderHome,
    goPage,
    priceBlock,
  };
})();

window.Countdown = (() => {
  const init = () => {
    const el = document.getElementById("flash-countdown");
    if (!el) return;
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const tick = () => {
      const diff = Math.max(0, end - new Date());
      const h = String(Math.floor(diff / 36e5)).padStart(2, "0");
      const m = String(Math.floor((diff % 36e5) / 6e4)).padStart(2, "0");
      const s = String(Math.floor((diff % 6e4) / 1000)).padStart(2, "0");
      el.textContent = `${h}:${m}:${s}`;
    };
    tick();
    setInterval(tick, 1000);
  };
  return { init };
})();
