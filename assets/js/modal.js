window.Modal = (() => {
 const close = () => {
 const root = document.getElementById('modal-root');
 if (root) root.innerHTML = '';
 document.body.classList.remove('overflow-hidden');
 };

 const open = ({ title = '', content = '', size = 'max-w-2xl' } = {}) => {
 let root = document.getElementById('modal-root');
 if (!root) {
 root = document.createElement('div');
 root.id = 'modal-root';
 document.body.appendChild(root);
 }
 root.innerHTML = `
 <div class="modal-backdrop fixed inset-0 z-[110] bg-slate-950/55 p-4 flex items-center justify-center" role="dialog" aria-modal="true">
 <div class="modal-panel w-full ${size} max-h-[92vh] overflow-hidden rounded-[2rem] bg-white border border-white/60 shadow-2xl">
 <div class="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100 ">
 <h2 class="font-display text-lg font-extrabold text-slate-900 ">${Utils.escapeHTML(title)}</h2>
 <button data-modal-close class="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition" aria-label="Tutup modal"><i class="fa-solid fa-xmark"></i></button>
 </div>
 <div class="p-5 overflow-y-auto max-h-[calc(92vh-74px)] scrollbar-soft">${content}</div>
 </div>
 </div>`;
 document.body.classList.add('overflow-hidden');
 root.querySelector('[data-modal-close]').addEventListener('click', close);
 root.querySelector('.modal-backdrop').addEventListener('click', event => {
 if (event.target.classList.contains('modal-backdrop')) close();
 });
 };

 document.addEventListener('keydown', event => {
 if (event.key === 'Escape') close();
 });

 return { open, close };
})();
