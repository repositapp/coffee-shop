window.Orders = (() => {
  const findOrder = id => Storage.getOrders().find(order => order.id === id) || Storage.getOrders()[0];

  const addressText = order => {
    const address = order?.address || {};
    return [address.detail, address.village, address.district, address.city, address.province, address.postalCode].filter(Boolean).join(', ') || 'Alamat tidak tersedia';
  };

  const render = () => {
    const root = document.getElementById('orders-page');
    if (!root) return;
    const orders = Storage.getOrders();
    root.innerHTML = `
      <section class="container-page py-8 md:py-12">
        <div class="mb-8"><p class="badge-pill mb-3"><i class="fa-solid fa-receipt"></i> Orders</p><h1 class="section-title text-3xl md:text-5xl text-slate-900">Riwayat Pesanan</h1></div>
        <div class="space-y-4">${orders.map(order => `<article class="soft-card rounded-3xl p-5"><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><h2 class="font-display text-xl font-extrabold">${order.id}</h2><p class="text-sm text-slate-500 mt-1">${order.date} • ${order.payment} • ${order.shipping}</p><p class="text-sm text-slate-500 mt-2">${(order.items || []).map(item => `${item.name} x${item.qty}`).join(', ')}</p></div><div class="flex flex-col sm:flex-row sm:items-center gap-3"><span class="badge-pill">Selesai</span><strong class="text-lg text-coffee-700">${Utils.money(order.total)}</strong><a href="order-success.html?order=${order.id}" class="btn-secondary py-2">Detail</a></div></div></article>`).join('') || `<div class="soft-card rounded-[2rem] p-8 text-center"><h2 class="font-display text-3xl font-extrabold">Belum ada pesanan</h2><a href="products.html" class="btn-primary mt-6">Belanja Sekarang</a></div>`}</div>
      </section>`;
  };

  const renderSuccess = () => {
    const root = document.getElementById('order-success-page');
    if (!root) return;
    const id = Utils.getParam('order') || Storage.get('lastOrderId', '');
    const order = findOrder(id);
    if (!order) {
      root.innerHTML = `<section class="container-page py-16"><div class="soft-card rounded-[2rem] p-8 text-center"><h1 class="font-display text-3xl font-extrabold">Pesanan tidak ditemukan</h1><a href="orders.html" class="btn-primary mt-6">Lihat Riwayat Pesanan</a></div></section>`;
      return;
    }
    const totalItems = (order.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0);
    root.innerHTML = `
      <section class="container-page py-8 md:py-12">
        <div class="max-w-5xl mx-auto">
          <div class="soft-card rounded-[2.5rem] p-6 md:p-10 text-center overflow-hidden relative">
            <div class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-orange-100/80 to-transparent"></div>
            <div class="relative mx-auto w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-5xl animate-fade-up shadow-xl shadow-emerald-100"><i class="fa-solid fa-check"></i></div>
            <p class="badge-pill mt-6 mb-4"><i class="fa-solid fa-circle-check"></i> Pembayaran Berhasil</p>
            <h1 class="section-title text-3xl md:text-5xl text-slate-900">Pesanan Selesai Dibuat</h1>
            <p class="text-slate-500 mt-3">Invoice ${order.id} berhasil disimpan ke riwayat pesanan.</p>
          </div>

          <div class="mt-6 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
            <div class="space-y-6">
              <div class="soft-card rounded-3xl p-5 md:p-6">
                <h2 class="font-display font-extrabold text-2xl mb-4">Detail Transaksi</h2>
                <div class="grid sm:grid-cols-2 gap-4 text-sm">
                  <div class="rounded-2xl bg-orange-50/60 p-4"><p class="text-slate-500">Nomor Invoice</p><strong class="text-coffee-800">${order.id}</strong></div>
                  <div class="rounded-2xl bg-orange-50/60 p-4"><p class="text-slate-500">Tanggal Transaksi</p><strong>${order.date}</strong></div>
                  <div class="rounded-2xl bg-orange-50/60 p-4"><p class="text-slate-500">Metode Pembayaran</p><strong>${order.payment}</strong></div>
                  <div class="rounded-2xl bg-orange-50/60 p-4"><p class="text-slate-500">Total Pembayaran</p><strong class="text-coffee-700">${Utils.money(order.total)}</strong></div>
                  <div class="rounded-2xl bg-orange-50/60 p-4"><p class="text-slate-500">Status Pesanan</p><strong class="text-emerald-600">Selesai</strong></div>
                  <div class="rounded-2xl bg-orange-50/60 p-4"><p class="text-slate-500">Estimasi Pesanan Selesai</p><strong>${order.estimatedDone || '30-60 menit'}</strong></div>
                </div>
              </div>

              <div class="soft-card rounded-3xl p-5 md:p-6">
                <h2 class="font-display font-extrabold text-2xl mb-4">Alamat Pengiriman</h2>
                <p class="text-slate-600 leading-7">${addressText(order)}</p>
              </div>

              <div class="soft-card rounded-3xl p-5 md:p-6">
                <h2 class="font-display font-extrabold text-2xl mb-4">Ringkasan Pesanan</h2>
                <div class="space-y-3">${(order.items || []).map(item => `<div class="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4"><div><strong>${item.name}</strong><p class="text-sm text-slate-500">Jumlah ${item.qty}</p></div><span class="badge-pill">x${item.qty}</span></div>`).join('')}</div>
              </div>
            </div>

            <aside class="checkout-sticky space-y-4">
              <div class="soft-card rounded-3xl p-5">
                <h2 class="font-display font-extrabold text-xl">Ringkasan</h2>
                <div class="mt-4 space-y-3 text-sm">
                  <div class="flex justify-between"><span>Total Item</span><strong>${totalItems}</strong></div>
                  <div class="flex justify-between"><span>Total Bayar</span><strong>${Utils.money(order.total)}</strong></div>
                  <div class="flex justify-between"><span>Status</span><strong class="text-emerald-600">Selesai</strong></div>
                </div>
              </div>
              <button onclick="Orders.downloadInvoice('${order.id}')" class="btn-primary w-full"><i class="fa-solid fa-download"></i> Download Invoice</button>
              <a href="products.html" class="btn-secondary w-full"><i class="fa-solid fa-mug-hot"></i> Belanja Lagi</a>
              <a href="orders.html" class="btn-secondary w-full"><i class="fa-solid fa-receipt"></i> Lihat Riwayat Pesanan</a>
            </aside>
          </div>
        </div>
      </section>`;
  };

  const downloadInvoice = id => {
    const order = findOrder(id);
    if (!order) return Toast.error('Invoice tidak ditemukan');
    const lines = [
      'COFFEESTORE INVOICE',
      `Invoice: ${order.id}`,
      `Tanggal: ${order.date}`,
      `Pembayaran: ${order.payment}`,
      `Total: ${Utils.money(order.total)}`,
      `Status: Selesai`,
      `Alamat: ${addressText(order)}`,
      '',
      'Ringkasan Pesanan:',
      ...(order.items || []).map(item => `- ${item.name} x${item.qty}`)
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    Toast.success('Invoice berhasil dibuat');
  };

  return { render, renderSuccess, downloadInvoice };
})();
