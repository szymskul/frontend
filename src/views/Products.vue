<template>
  <nav class="nav">
    <a href="/home">Home</a>
    <a href="/products">Products</a>
    <a href="/orders">Orders</a>
  </nav>
    <div class="filters mb-3">
      <input 
        type="text" 
        v-model="filterText" 
        placeholder="Search by name" 
        class="form-control mb-2"
      />
      <select v-model="filterCategory" class="form-select">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>
    <div class="container">
    <table class="table table-striped table-hover">
      <tbody>
        <tr v-for="(product, index) in products" :key="product.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>${{ product.unit_price }}</td>
          <td>{{ product.unit_weight }}</td>
          <td>
            <button class="btn btn-primary" @click="addToCart(product)">
              Buy
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
    <div class="shopping-cart" @click="toggleCart">
      🛒
    </div>
    <div v-if="cartVisible" class="cart-details">
      <ul>
        <li v-for="(item, index) in cart" :key="index">
  {{ item.name }} - ${{ item.unit_price ? item.unit_price.toFixed(2) : '0.00' }}
</li>

        <li v-if="cart.length === 0" class="empty">Your cart is empty</li>
      </ul>
      <button class="btn btn-success mt-2" @click="placeOrder()">Order</button>
    </div>
</template> 

<script>
import { productService } from '../store/api';

export default {
  name: 'ProductsShop',
  data() {
    return {
      products: [], // Lista produktów
      categories: ['Fruits', 'Dairy', 'Grains', 'Snacks', 'Beverages'], // Kategorie produktów
      cart: [], // Produkty w koszyku
      cartVisible: false, // Widoczność koszyka
      filterText: '', // Filtr tekstowy
      filterCategory: '', // Wybrana kategoria
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => {
        const matchesName =
          this.filterText === '' ||
          product.name.toLowerCase().includes(this.filterText.toLowerCase());
        const matchesCategory =
          this.filterCategory === '' ||
          product.category === this.filterCategory;
        return matchesName && matchesCategory;
      });
    },
  },
  methods: {
    addToCart(product) {
  const existingProduct = this.cart.find(item => item.name === product.name);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    this.cart.push({
      ...product,
      quantity: 1,
      unit_price: parseFloat(product.unit_price) || 0, // Konwersja na liczbę
    });
    }
    },

    toggleCart() {
      this.cartVisible = !this.cartVisible;
    },
    placeOrder() {
    console.log('placeOrderFun'); // Debugging
  localStorage.setItem('cart', JSON.stringify(this.cart)); // Zapis koszyka do localStorage
  this.$router.push('/cart');
},
  },
  async created() {
    try {
      // Pobranie danych produktów z backendu
      this.products = await productService.getAllProducts();
      console.log('Products loaded:', this.products); // Debugowanie
    } catch (error) {
      console.error('Failed to load products:', error.message);
      alert('Unable to load products. Please try again later.');
    }
  },

};
</script>

<style scoped>

.container {
  height: 100%; /* Pełna wysokość kontenera */
  max-height: 470px; /* Ograniczenie maksymalnej wysokości */
  overflow-y: auto; /* Dodanie przewijania */
  padding: 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

/* Filtry */
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.filters input,
.filters select {
  max-width: 200px;
}

/* Koszyk */
.shopping-cart {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: #28a745;
  color: white;
  font-size: 24px;
  text-align: center;
  line-height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
}

.shopping-cart:hover {
  transform: scale(1.1);
}

.cart-details {
  max-height: 300px;
  overflow-y: auto;
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 300px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.table {
  max-width: 100%;
  margin-top: 10px;
}
</style>
