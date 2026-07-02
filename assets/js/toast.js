window.Toast = (() => {
 const icons = {
 success: 'fa-circle-check text-emerald-500',
 error: 'fa-circle-xmark text-red-500',
 warning: 'fa-triangle-exclamation text-amber-500',
 info: 'fa-circle-info text-blue-500'
 };

 const ensure = () => {
 let box = document.getElementById('toast-root');
 if (!box) {
 box = document.createElement('div');
 box.id = 'toast-root';
 box.className = 'fixed top-4 right-4 z-[120] space-y-3 w-[calc(100%-2rem)] max-w-sm pointer-events-none';
 document.body.appendChild(box);
 }
 return box;
 };

 const show = (message, type = 'info', duration = 2800) => {
 const root = ensure();
 const el = document.createElement('div');
 el.className = 'toast-item pointer-events-auto glass-card rounded-2xl px-4 py-3 flex items-start gap-3 text-sm font-semibold text-slate-800 ';
 el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info} text-lg mt-0.5"></i><div class="flex-1">${Utils.escapeHTML(message)}</div><button class="text-slate-400 hover:text-slate-700 " aria-label="Tutup toast"><i class="fa-solid fa-xmark"></i></button>`;
 root.appendChild(el);
 el.querySelector('button').addEventListener('click', () => el.remove());
 setTimeout(() => {
 el.style.opacity = '0';
 el.style.transform = 'translateY(-8px)';
 setTimeout(() => el.remove(), 180);
 }, duration);
 };

 return {
 show,
 success: message => show(message, 'success'),
 error: message => show(message, 'error'),
 warning: message => show(message, 'warning'),
 info: message => show(message, 'info')
 };
})();
