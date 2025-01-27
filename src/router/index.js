import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Homeview.vue';
import ProductsView from '../views/Products.vue';
import OrdersView from '../views/Orders.vue';
import CartView from '../views/Cart.vue';
import SignUp from '../views/SignUp.vue';

const routes = [
  { path: '/', name: 'signup', component: SignUp },
  { path: '/products', name: 'products', component: ProductsView},
  { path: '/orders', name: 'orders', component: OrdersView},
  { path: '/cart', name: 'cart', component: CartView},
  { path: '/home', name: 'homeview', component: HomeView},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
