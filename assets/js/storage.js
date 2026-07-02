window.Storage = (() => {
 const prefix = window.APP_CONFIG?.storagePrefix || 'coffee_shop_store_';
 const key = name => `${prefix}${name}`;

 const get = (name, fallback = null) => {
 try {
 const item = localStorage.getItem(key(name));
 return item ? JSON.parse(item) : fallback;
 } catch (error) {
 return fallback;
 }
 };

 const set = (name, value) => {
 localStorage.setItem(key(name), JSON.stringify(value));
 window.dispatchEvent(new CustomEvent('store:changed', { detail: { name, value } }));
 return value;
 };

 const remove = name => localStorage.removeItem(key(name));

 const init = () => {
 if (!get('cart')) set('cart', window.STORE_DATA?.cart || []);
 if (!get('wishlist')) set('wishlist', window.STORE_DATA?.wishlist || []);
 if (!get('users')) set('users', window.STORE_DATA?.users || []);
 if (!get('orders')) set('orders', window.STORE_DATA?.orders || []);
 if (!get('addresses')) set('addresses', []);
 remove('theme');
 };

 const getCart = () => get('cart', []);
 const setCart = cart => set('cart', cart);
 const getWishlist = () => get('wishlist', []);
 const setWishlist = list => set('wishlist', list);
 const getUsers = () => get('users', []);
 const setUsers = users => set('users', users);
 const getOrders = () => get('orders', []);
 const setOrders = orders => set('orders', orders);
 const currentUser = () => get('currentUser', null);
 const setCurrentUser = user => set('currentUser', user);
 const logout = () => remove('currentUser');

 return { key, get, set, remove, init, getCart, setCart, getWishlist, setWishlist, getUsers, setUsers, getOrders, setOrders, currentUser, setCurrentUser, logout };
})();
