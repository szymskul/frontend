<template>
    <div class="container mt-4">
      <h1 class="text-primary">Your Cart</h1>
  
      <table class="table table-striped mt-3" v-if="cart.length > 0">
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in cart" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>${{ item.price.toFixed(2) }}</td>
            <td>
              <button @click="updateQuantity(index, -1)" :disabled="item.quantity <= 1" class="btn btn-outline-secondary btn-sm">-</button>
              {{ item.quantity }}
              <button @click="updateQuantity(index, 1)" class="btn btn-outline-secondary btn-sm">+</button>
            </td>
            <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
            <td>
              <button class="btn btn-danger btn-sm" @click="removeFromCart(index)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div v-if="cart.length > 0" class="mt-4">
        <h3>Total: ${{ totalPrice.toFixed(2) }}</h3>
        <form @submit.prevent="submitOrder" class="mt-3">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" id="name" v-model="orderDetails.name" required class="form-control" />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" v-model="orderDetails.email" required class="form-control" />
          </div>
          <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <textarea id="address" v-model="orderDetails.address" required class="form-control"></textarea>
          </div>
          <button type="submit" class="btn btn-success">Place Order</button>
        </form>
      </div>
  
      <div v-else>
        <p>Your cart is empty.</p>
        <router-link to="/products" class="btn btn-primary mt-3">Go to Products</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CartShop',
    data() {
      return {
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        orderDetails: {
          name: '',
          email: '',
          address: ''
        }
      };
    },
    computed: {
      totalPrice() {
        return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      }
    },
    methods: {
      updateQuantity(index, amount) {
        this.cart[index].quantity += amount;
        this.saveCart();
      },
      removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveCart();
      },
      saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
      },
      submitOrder() {
        alert(`Order placed successfully for ${this.orderDetails.name}!`);
        this.cart = [];
        this.orderDetails = { name: '', email: '', address: '' };
        this.saveCart();
        this.$router.push('/products');
      }
    }
  };
  </script>
  
  <style scoped>
  .table {
    margin-top: 20px;
  }
  
  button {
    margin: 0 5px;
  }
  </style>
  