window.Payment = (() => {
  let selected = null;

  const bankAccounts = {
    bca: '8800 0101 2026', mandiri: '1380 0026 2026', bni: '0099 2026 8800', bri: '0026 8800 2026',
    'cimb-niaga': '8000 2026 1177', permata: '8877 2026 0101', btn: '9922 2026 7700', bsi: '7110 2026 8800',
    'bank-mega': '4260 2026 8800', danamon: '6600 2026 1188', panin: '7711 2026 9900', ocbc: '9026 8800 1200', maybank: '7712 2026 5500'
  };

  const walletNumbers = {
    gopay: '0812 3456 7890', ovo: '0813 2222 2026', dana: '0815 8888 2026', shopeepay: '0817 2026 8800',
    linkaja: '0818 6600 2026', astrapay: '0819 1010 2026', isaku: '0821 2026 7700', sakuku: '0822 8800 2026'
  };

  const retailCodes = {
    indomaret: 'IDM-2026-COFFEE',
    alfamart: 'ALFA-2026-COFFEE'
  };

  const methodGroup = id => STORE_DATA.payment.find(group => group.methods.some(method => method.id === id))?.group || '';

  const infoRow = (label, value, copyable = false) => `
    <div class="rounded-2xl bg-orange-50/60 border border-orange-100 p-4">
      <p class="text-xs font-bold uppercase tracking-wide text-orange-700">${label}</p>
      <div class="mt-1 flex items-center justify-between gap-3">
        <strong class="text-coffee-800 break-all">${value}</strong>
        ${copyable ? `<button onclick="Utils.copy('${String(value).replace(/'/g, "\\'")}')" class="text-xs font-extrabold text-orange-700 hover:text-coffee-700">Copy</button>` : ''}
      </div>
    </div>`;

  const qrBox = label => `
    <div class="mt-4 rounded-3xl bg-white p-6 text-slate-900 text-center border border-slate-100">
      <i class="fa-solid fa-qrcode text-8xl text-coffee-700"></i>
      <p class="font-bold mt-3">${label}</p>
    </div>`;

  const instructionHTML = (method, checkout) => {
    const group = methodGroup(method.id);
    const total = Utils.money(checkout.totals.total);
    if (group === 'Transfer Bank') {
      const account = bankAccounts[method.id] || '8800 2026 0101';
      return `
        <div class="mt-5 grid gap-3">
          ${infoRow('Bank', method.name)}
          ${infoRow('Nomor Rekening', account, true)}
          ${infoRow('Nama Penerima', 'PT CoffeeStore Indonesia', true)}
          ${infoRow('Cabang', 'Jakarta Coffee House')}
          ${infoRow('Nominal Transfer', total, true)}
          <p class="text-sm text-slate-500 leading-6">Transfer sesuai nominal. Konfirmasi berjalan otomatis pada simulasi frontend setelah tombol bayar ditekan.</p>
        </div>`;
    }
    if (group === 'E-Wallet') {
      const number = walletNumbers[method.id] || '0812 3456 7890';
      const showQr = ['gopay', 'shopeepay', 'linkaja'].includes(method.id);
      return `
        <div class="mt-5 grid gap-3">
          ${infoRow('E-Wallet', method.name)}
          ${infoRow('Nomor Tujuan', number, true)}
          ${infoRow('Nama Penerima', 'CoffeeStore', true)}
          ${infoRow('Nominal', total, true)}
          ${showQr ? qrBox(`${method.name} Dummy QR`) : ''}
        </div>`;
    }
    if (method.id === 'qris') {
      return `
        <div class="mt-5 grid gap-3">
          ${qrBox('QRIS Dummy')}
          ${infoRow('Nominal', total, true)}
          ${infoRow('Status', 'Menunggu Pembayaran')}
        </div>`;
    }
    if (method.id === 'cod') {
      return `
        <div class="mt-5 grid gap-3">
          ${infoRow('Metode', 'Bayar kepada kurir')}
          ${infoRow('Nominal', total)}
          <p class="text-sm text-slate-500 leading-6">Pembayaran dilakukan kepada kurir ketika pesanan diterima pelanggan.</p>
        </div>`;
    }
    if (group === 'Retail') {
      const code = retailCodes[method.id] || 'RTL-2026-COFFEE';
      return `
        <div class="mt-5 grid gap-3">
          ${infoRow('Retail', method.name)}
          ${infoRow('Kode Pembayaran', code, true)}
          ${infoRow('Nominal', total, true)}
          <p class="text-sm text-slate-500 leading-6">Tunjukkan kode pembayaran kepada kasir ${method.name}. Data ini hanya simulasi frontend.</p>
        </div>`;
    }
    return '<p class="mt-4 text-sm text-slate-500">Instruksi pembayaran simulasi tersedia setelah metode dipilih.</p>';
  };

  const render = () => {
    const root = document.getElementById('payment-page');
    if (!root) return;
    const checkout = Storage.get('checkout', null);
    if (!checkout) {
      root.innerHTML = `<section class="container-page py-16"><div class="soft-card rounded-[2rem] p-8 text-center"><h1 class="font-display text-3xl font-extrabold">Data checkout belum tersedia</h1><a href="checkout.html" class="btn-primary mt-6">Kembali Checkout</a></div></section>`;
      return;
    }
    root.innerHTML = `
      <section class="container-page py-8 md:py-12 mobile-safe-bottom">
        <div class="mb-8"><p class="badge-pill mb-3"><i class="fa-solid fa-credit-card"></i> Payment</p><h1 class="section-title text-3xl md:text-5xl text-slate-900">Metode Pembayaran</h1><p class="text-slate-500 mt-3">Semua metode pembayaran hanya simulasi frontend.</p></div>
        <div class="grid lg:grid-cols-[1fr_380px] gap-6">
          <div class="space-y-6">
            ${STORE_DATA.payment.map(group => `<div class="soft-card rounded-3xl p-5"><h2 class="font-display font-extrabold text-xl mb-4">${group.group}</h2><div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">${group.methods.map(method => `<button onclick="Payment.select('${method.id}', '${method.name}')" data-payment="${method.id}" class="payment-option rounded-3xl border border-slate-200 p-4 flex items-center gap-3 text-left hover:border-orange-400 transition"><span class="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl"><i class="fa-solid ${method.logo}"></i></span><span><strong class="block">${method.name}</strong><small class="text-slate-500">${group.group}</small></span></button>`).join('')}</div></div>`).join('')}
          </div>
          <aside class="checkout-sticky space-y-4">
            <div class="soft-card rounded-3xl p-5"><h2 class="font-display font-extrabold text-xl mb-4">Ringkasan Pembayaran</h2><div class="space-y-3 text-sm"><div class="flex justify-between"><span>Total</span><strong>${Utils.money(checkout.totals.total)}</strong></div><div class="flex justify-between"><span>Pengiriman</span><strong>${checkout.shipping.name}</strong></div><div class="flex justify-between"><span>Pembeli</span><strong>${checkout.buyer.name}</strong></div></div></div>
            <div id="selected-payment-box" class="soft-card rounded-3xl p-5 hidden"></div>
            <button onclick="Payment.pay()" class="btn-primary w-full mobile-sticky-cta"><i class="fa-solid fa-lock"></i> Bayar Sekarang</button>
          </aside>
        </div>
      </section>`;
  };

  const select = (id, name) => {
    const method = STORE_DATA.payment.flatMap(group => group.methods).find(item => item.id === id) || { id, name };
    selected = method;
    document.querySelectorAll('.payment-option').forEach(btn => btn.classList.remove('border-orange-500', 'bg-orange-50'));
    document.querySelector(`[data-payment="${id}"]`)?.classList.add('border-orange-500', 'bg-orange-50');
    const checkout = Storage.get('checkout', null);
    const box = document.getElementById('selected-payment-box');
    if (box && checkout) {
      box.classList.remove('hidden');
      box.innerHTML = `<p class="text-sm text-slate-500">Metode dipilih</p><h3 class="font-display text-2xl font-extrabold mt-1">${name}</h3>${instructionHTML(method, checkout)}`;
    }
  };

  const pay = () => {
    if (!selected) return Toast.warning('Pilih metode pembayaran terlebih dahulu');
    const checkout = Storage.get('checkout', null);
    if (!checkout) return Toast.error('Data checkout tidak ditemukan');
    const order = {
      id: Utils.generateId('INV'),
      date: Utils.today(),
      status: 'Selesai',
      total: checkout.totals.total,
      items: Cart.detailed().map(item => ({ productId: item.productId, name: item.product.name, qty: item.quantity, options: item.options })),
      payment: selected.name,
      shipping: checkout.shipping.name,
      buyer: checkout.buyer,
      address: checkout.address,
      estimatedDone: checkout.shipping.eta || '30-60 menit'
    };
    Storage.setOrders([order, ...Storage.getOrders()]);
    Storage.set('lastOrderId', order.id);
    Cart.clear();
    Storage.remove('checkout');
    Toast.success('Pembayaran simulasi berhasil');
    setTimeout(() => location.href = `order-success.html?order=${order.id}`, 600);
  };

  return { render, select, pay };
})();
