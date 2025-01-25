<template>
    <div class="container mt-4">
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
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Price</th>
            <th scope="col">Weight</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in filteredProducts" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>${{ product.price }}</td>
            <td>{{ product.weight }}</td>
            <td><button class="btn btn-primary" @click="addToCart(product)">Buy</button></td>
          </tr>
        </tbody>
      </table>
      <div class="shopping-cart" @click="placeOrder">
        🛒
      </div>

      <div v-if="cartVisible" class="cart-details">
        <ul>
          <li v-for="(item, index) in cart" :key="index">
            {{ item.name }} - ${{ item.price.toFixed(2) }}
          </li>
          <li v-if="cart.length === 0" class="empty">Your cart is empty</li>
        </ul>
        <button class="btn btn-success mt-2" @click="placeOrder">Order</button>
      </div>
    </div>
</template>

<script>
export default {
  name: 'ProductsShop',
  data() {
    return {
      products: [
        { name: 'Apple', description: 'Fresh red apple from organic farms.', price: 1.50, weight: '200g', category: 'Fruits' },
        { name: 'Milk', description: '1 liter of whole milk from local dairies.', price: 1.20, weight: '1L', category: 'Dairy' },
        { name: 'Rice', description: 'Basmati rice, perfect for every meal.', price: 2.00, weight: '500g', category: 'Grains' },
        { name: 'Chocolate', description: 'Dark chocolate with 70% cocoa content.', price: 2.50, weight: '100g', category: 'Snacks' },
        { name: 'Orange Juice', description: 'Freshly squeezed orange juice, no added sugar.', price: 3.00, weight: '1L', category: 'Beverages' },
        { name: 'Apple', description: 'Fresh red apple from organic farms.', price: 1.50, weight: '200g', category: 'Fruits' },
        { name: 'Milk', description: '1 liter of whole milk from local dairies.', price: 1.20, weight: '1L', category: 'Dairy' },
        { name: 'Rice', description: 'Basmati rice, perfect for every meal.', price: 2.00, weight: '500g', category: 'Grains' },
        { name: 'Chocolate', description: 'Dark chocolate with 70% cocoa content.', price: 2.50, weight: '100g', category: 'Snacks' },
        { name: 'Orange Juice', description: 'Freshly squeezed orange juice, no added sugar.', price: 3.00, weight: '1L', category: 'Beverages' }
      ],
      categories: ['Fruits', 'Dairy', 'Grains', 'Snacks', 'Beverages'],
      cart: [],
      cartVisible: false,
      filterText: '', // Dodane do inicjalizacji
      filterCategory: '' // Dodane do inicjalizacji
    };
  },
  computed: {
    filteredProducts() {
      // Dodano sprawdzenie poprawności wartości filtra
      return this.products.filter(product => {
        const matchesName = this.filterText === '' || product.name.toLowerCase().includes(this.filterText.toLowerCase());
        const matchesCategory = this.filterCategory === '' || product.category === this.filterCategory;
        return matchesName && matchesCategory;
      });
    }
  },
  methods: {
    addToCart(product) {
      const existingProduct = this.cart.find(item => item.name === product.name);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
    },
    placeOrder() {
      localStorage.setItem('cart', JSON.stringify(this.cart)); // Zapis koszyka do localStorage
      this.$router.push({ name: 'cart' }); // Przejście do widoku koszyka
    },
    toggleCart() {
      this.cartVisible = !this.cartVisible;
    }
  },
  created() {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
      this.cart = savedCart;
    }
  }
};
</script>


<style scoped>
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.shopping-cart:hover {
  transform: scale(1.1);
}

.cart-details {
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

.cart-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-details li {
  padding: 5px 0;
  border-bottom: 1px solid #ccc;
}

.cart-details li:last-child {
  border-bottom: none;
}

.cart-details .empty {
  text-align: center;
  color: #888;
}

.filters {
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.filters input,
.filters select {
  max-width: 300px;
}
</style>
