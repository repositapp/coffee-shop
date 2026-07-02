window.Auth = (() => {
 const login = (event = null) => {
 event?.preventDefault();
 const email = document.getElementById('login-email')?.value.trim();
 const password = document.getElementById('login-password')?.value;
 const user = Storage.getUsers().find(item => item.email === email && item.password === password);
 if (!user) return Toast.error('Email atau password tidak sesuai');
 Storage.setCurrentUser({ id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address });
 Toast.success('Login berhasil');
 setTimeout(() => location.href = 'profile.html', 450);
 };

 const register = (event = null) => {
 event?.preventDefault();
 const name = document.getElementById('register-name')?.value.trim();
 const email = document.getElementById('register-email')?.value.trim();
 const phone = document.getElementById('register-phone')?.value.trim();
 const password = document.getElementById('register-password')?.value;
 const confirm = document.getElementById('register-confirm')?.value;
 if (!name || !email || !phone || !password) return Toast.error('Lengkapi semua data pendaftaran');
 if (password.length < 6) return Toast.warning('Password minimal 6 karakter');
 if (password !== confirm) return Toast.error('Konfirmasi password tidak sesuai');
 const users = Storage.getUsers();
 if (users.some(user => user.email === email)) return Toast.error('Email sudah terdaftar');
 const user = { id: Utils.generateId('USR'), name, email, phone, password, address: '' };
 Storage.setUsers([...users, user]);
 Storage.setCurrentUser({ id: user.id, name, email, phone, address: '' });
 Toast.success('Pendaftaran berhasil');
 setTimeout(() => location.href = 'profile.html', 450);
 };

 const dummySocial = provider => {
 const user = { id: `${provider.toUpperCase()}-DUMMY`, name: `${provider} User`, email: `${provider.toLowerCase()}@dummy.test`, phone: '0800000000', address: '' };
 Storage.setCurrentUser(user);
 Toast.success(`Login ${provider} berhasil`);
 setTimeout(() => location.href = 'profile.html', 450);
 };

 const logout = () => {
 Storage.logout();
 Toast.success('Logout berhasil');
 setTimeout(() => location.href = 'login.html', 450);
 };

 const protect = () => {
 const protectedPages = ['profile', 'orders'];
 const page = document.body.dataset.page;
 if (protectedPages.includes(page) && !Storage.currentUser()) {
 Toast.warning('Silakan login terlebih dahulu');
 setTimeout(() => location.href = 'login.html', 600);
 }
 };

 const renderLogin = () => {
 const root = document.getElementById('login-page');
 if (!root) return;
 root.innerHTML = `
 <section class="container-page py-10 md:py-16">
 <div class="grid lg:grid-cols-2 gap-8 items-center">
 <div class="hidden lg:block rounded-[2.5rem] overflow-hidden relative min-h-[620px]">
 <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80" alt="Coffee shop premium" class="absolute inset-0 w-full h-full object-cover">
 <div class="absolute inset-0 bg-gradient-to-tr from-slate-950/75 to-transparent"></div>
 <div class="absolute bottom-8 left-8 right-8 text-white"><p class="badge-pill bg-white/20 text-white mb-4">Welcome Back</p><h1 class="font-display text-5xl font-extrabold leading-tight">Masuk dan lanjutkan pesanan favoritmu.</h1></div>
 </div>
 <form onsubmit="Auth.login(event)" class="soft-card rounded-[2rem] p-6 md:p-8 max-w-xl mx-auto w-full">
 <p class="badge-pill mb-4"><i class="fa-solid fa-lock"></i> Login</p>
 <h1 class="section-title text-3xl md:text-4xl text-slate-900 ">Masuk Akun</h1>
 <p class="text-slate-500 mt-2">Gunakan demo@coffeestore.test dan password demo123.</p>
 <div class="mt-8 space-y-4">
 <div><label class="font-bold text-sm">Email</label><input id="login-email" type="email" class="input-field mt-2" value="demo@coffeestore.test" required></div>
 <div><label class="font-bold text-sm">Password</label><input id="login-password" type="password" class="input-field mt-2" value="demo123" required></div>
 <div class="flex items-center justify-between gap-3 text-sm"><label class="inline-flex items-center gap-2"><input type="checkbox" class="rounded border-slate-300" checked> Remember Me</label><a href="#" class="font-bold text-orange-600">Lupa Password?</a></div>
 <button class="btn-primary w-full ripple">Login</button>
 <div class="grid sm:grid-cols-2 gap-3">
 <button type="button" onclick="Auth.dummySocial('Google')" class="btn-secondary"><i class="fa-brands fa-google"></i> Google</button>
 <button type="button" onclick="Auth.dummySocial('Facebook')" class="btn-secondary"><i class="fa-brands fa-facebook"></i> Facebook</button>
 </div>
 <p class="text-center text-sm text-slate-500 ">Belum punya akun? <a class="font-bold text-orange-600" href="register.html">Daftar</a></p>
 </div>
 </form>
 </div>
 </section>`;
 };

 const renderRegister = () => {
 const root = document.getElementById('register-page');
 if (!root) return;
 root.innerHTML = `
 <section class="container-page py-10 md:py-16">
 <form onsubmit="Auth.register(event)" class="soft-card rounded-[2rem] p-6 md:p-8 max-w-2xl mx-auto">
 <p class="badge-pill mb-4"><i class="fa-solid fa-user-plus"></i> Register</p>
 <h1 class="section-title text-3xl md:text-4xl text-slate-900 ">Buat Akun Baru</h1>
 <div class="mt-8 grid sm:grid-cols-2 gap-4">
 <div class="sm:col-span-2"><label class="font-bold text-sm">Nama</label><input id="register-name" class="input-field mt-2" required></div>
 <div><label class="font-bold text-sm">Email</label><input id="register-email" type="email" class="input-field mt-2" required></div>
 <div><label class="font-bold text-sm">Nomor HP</label><input id="register-phone" class="input-field mt-2" required></div>
 <div><label class="font-bold text-sm">Password</label><input id="register-password" type="password" class="input-field mt-2" required></div>
 <div><label class="font-bold text-sm">Konfirmasi Password</label><input id="register-confirm" type="password" class="input-field mt-2" required></div>
 </div>
 <button class="btn-primary w-full mt-6 ripple">Daftar</button>
 <p class="text-center text-sm text-slate-500 mt-5">Sudah punya akun? <a class="font-bold text-orange-600" href="login.html">Login</a></p>
 </form>
 </section>`;
 };

 return { login, register, dummySocial, logout, protect, renderLogin, renderRegister };
})();
