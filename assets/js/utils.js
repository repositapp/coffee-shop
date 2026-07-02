window.Utils = (() => {
 const currency = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

 const qs = (selector, scope = document) => scope.querySelector(selector);
 const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
 const money = value => currency.format(Number(value || 0));
 const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
 const debounce = (fn, wait = 250) => {
 let timeout;
 return (...args) => {
 clearTimeout(timeout);
 timeout = setTimeout(() => fn(...args), wait);
 };
 };
 const slugify = value => String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
 const params = () => new URLSearchParams(window.location.search);
 const getParam = key => params().get(key);
 const setParam = (key, value) => {
 const url = new URL(window.location.href);
 if (value === null || value === undefined || value === '') url.searchParams.delete(key);
 else url.searchParams.set(key, value);
 history.replaceState({}, '', url);
 };
 const generateId = (prefix = 'ID') => `${prefix}-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
 const today = () => new Date().toISOString().slice(0, 10);
 const stars = rating => {
 const full = Math.round(Number(rating || 0));
 return Array.from({ length: 5 }, (_, i) => `<i class="fa-solid fa-star ${i < full ? 'text-amber-400' : 'text-slate-300 '}"></i>`).join('');
 };
 const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
 const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
 const unique = list => [...new Set(list)];
 const readJSON = async (url, fallback = null) => {
 try {
 const res = await fetch(url);
 if (!res.ok) throw new Error('JSON fetch failed');
 return await res.json();
 } catch (error) {
 return fallback;
 }
 };
 const lazyImages = () => {
 const images = qsa('img[data-src]');
 if (!('IntersectionObserver' in window)) {
 images.forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
 return;
 }
 const observer = new IntersectionObserver(entries => {
 entries.forEach(entry => {
 if (!entry.isIntersecting) return;
 const img = entry.target;
 img.src = img.dataset.src;
 img.removeAttribute('data-src');
 observer.unobserve(img);
 });
 }, { rootMargin: '120px' });
 images.forEach(img => observer.observe(img));
 };
 const animateOnScroll = () => {
 const items = qsa('[data-animate]');
 if (!('IntersectionObserver' in window)) {
 items.forEach(el => el.classList.add('is-visible'));
 return;
 }
 const observer = new IntersectionObserver(entries => {
 entries.forEach(entry => {
 if (entry.isIntersecting) {
 entry.target.classList.add('is-visible');
 observer.unobserve(entry.target);
 }
 });
 }, { threshold: .12 });
 items.forEach(el => observer.observe(el));
 };
 const copy = async text => {
 try {
 await navigator.clipboard.writeText(text);
 Toast.success('Berhasil disalin');
 } catch (error) {
 Toast.error('Gagal menyalin teks');
 }
 };

 return { qs, qsa, money, clamp, debounce, slugify, params, getParam, setParam, generateId, today, stars, escapeHTML, sleep, unique, readJSON, lazyImages, animateOnScroll, copy };
})();
