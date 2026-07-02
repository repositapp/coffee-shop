window.Slider = (() => {
 const init = () => {
 document.querySelectorAll('[data-slider]').forEach(slider => {
 const track = slider.querySelector('[data-slider-track]');
 slider.querySelector('[data-slider-next]')?.addEventListener('click', () => track.scrollBy({ left: 340, behavior: 'smooth' }));
 slider.querySelector('[data-slider-prev]')?.addEventListener('click', () => track.scrollBy({ left: -340, behavior: 'smooth' }));
 });
 };
 return { init };
})();
