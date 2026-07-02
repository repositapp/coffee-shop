window.Filter = (() => {
 const apply = (products, state = {}) => {
 let result = [...products];
 if (state.category && state.category !== 'all') result = result.filter(product => product.category === state.category);
 if (state.query) result = Search.searchProducts(state.query).filter(product => result.some(item => item.id === product.id));
 if (state.minPrice) result = result.filter(product => product.price >= Number(state.minPrice));
 if (state.maxPrice) result = result.filter(product => product.price <= Number(state.maxPrice));
 if (state.flash) result = result.filter(product => product.isFlashSale);
 if (state.sort === 'price-low') result.sort((a, b) => a.price - b.price);
 if (state.sort === 'price-high') result.sort((a, b) => b.price - a.price);
 if (state.sort === 'rating') result.sort((a, b) => b.rating - a.rating);
 if (state.sort === 'newest') result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
 if (state.sort === 'popular') result.sort((a, b) => b.sold - a.sold);
 return result;
 };
 return { apply };
})();
