import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Homeview.vue';
import ProductsView from '../views/Products.vue';
import OrdersView from '../views/Orders.vue';
import CartView from '../views/Cart.vue';
import SignUp from '../views/SignUp.vue';
import AdminProduct from '../views/AdminProduct.vue';
import AdminOrder from '@/views/AdminOrder.vue';
import AdminInit from '@/views/AdminInit.vue';
import OrderReviews from '@/views/OrderReviews.vue';
import AdminHomeView from '@/views/AdminHomeView.vue';

const routes = [
  { path: '/', name: 'signup', component: SignUp },
  { path: '/products', name: 'products', component: ProductsView},
  { path: '/orders', name: 'orders', component: OrdersView},
  { path: '/cart', name: 'cart', component: CartView},
  { path: '/home', name: 'homeview', component: HomeView},
  { path: '/adminhome', name: 'Adminhomeview', component: AdminHomeView, meta: { role: "PRACOWNIK" }},
  { path: '/adminproduct', name: 'adminProduct', component: AdminProduct, meta: { role: "PRACOWNIK" }},
  { path: '/adminorder', name: 'adminOrder', component: AdminOrder, meta: { role: "PRACOWNIK" }},
  { path: '/admininit', name: 'adminInit', component: AdminInit, meta: { role: "PRACOWNIK" }},
  { path: '/orderreviews', name: 'orderReviews', component: OrderReviews},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userRole = payload.role;

    if (to.meta.role && to.meta.role !== userRole) {
      alert("You are not authorized to access this page.");
      return next("/");
    }
  } else if (to.meta.role) {

    alert("You must log in first.");
    return next("/");
  }
  next();
});

export default router;
