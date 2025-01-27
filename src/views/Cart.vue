<template>
  <nav class="nav">
    <a href="/home">Home</a>
    <a href="/products">Products</a>
    <a href="/orders">Orders</a>
    <a href="/orderreviews">ReviewOrders</a>
  </nav>
  <div class="cart-container mt-4">
  <h1 class="text-primary">Your Cart</h1>

  <div class="cart-scroll">
    <table class="table table-striped mt-3" v-if="cart.length > 0">
      <thead class="table-dark">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Unit Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cart" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>${{ typeof item.unit_price === 'number' ? item.unit_price.toFixed(2) : '0.00' }}</td>
          <td>
            <button
              @click="updateQuantity(index, -1)"
              :disabled="item.quantity <= 1"
              class="btn btn-outline-secondary btn-sm"
            >
              -
            </button>
            {{ item.quantity }}
            <button
              @click="updateQuantity(index, 1)"
              class="btn btn-outline-secondary btn-sm"
            >
              +
            </button>
          </td>
          <td>${{ (item.unit_price * item.quantity).toFixed(2) }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="removeFromCart(index)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="cart.length > 0" class="mt-4">
    <h3>Total: ${{ totalPrice.toFixed(2) }}</h3>
    <form @submit.prevent="submitOrder" class="mt-3">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          type="text"
          id="name"
          v-model="orderDetails.name"
          required
          class="form-control"
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          id="email"
          v-model="orderDetails.email"
          required
          class="form-control"
        />
      </div>
      <div class="mb-3">
        <label for="address" class="form-label">Address</label>
        <textarea
          id="address"
          v-model="orderDetails.address"
          required
          class="form-control"
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="name" class="form-label">phoneNumber</label>
        <input
          type="tel"
          id="phoneNumber"
          v-model="orderDetails.phoneNumber"
          required
          class="form-control"
        />
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
import { orderService } from "../store/api";

export default {
  name: "CartShop",
  data() {
    return {
      cart: JSON.parse(localStorage.getItem("cart"))?.map((item) => ({
        ...item,
        unit_price: parseFloat(item.unit_price) || 0, // Konwersja ceny na liczbę
        quantity: item.quantity || 1, // Domyślna ilość, jeśli brak danych
      })) || [],
      orderDetails: {
        name: "",
        email: "",
        address: "",
        phoneNumber: "",
      },
      userId: null, // Przechowywanie userId
      message: null, // Informacje o statusie zamówienia
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
      );
    },
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
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    
    async submitOrder() {
      // Dekodowanie tokena, aby pobrać userId
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;
      const today = new Date();
      // Przygotowanie danych zamówienia
      const orderData = {
        approvalDate: today.toISOString().split("T")[0], // Aktualna data
        orderStatusId: 1, // Status zamówienia (np. "nowe")
        userName: this.orderDetails.name,
        email: this.orderDetails.email,
        phoneNumber: this.orderDetails.phoneNumber,
        userId: userId, // Pobranie userId z tokena
        items: this.cart.map((item) => ({
          productId: item.id, // Zakładam, że `id` to ID produktu
          quantity: item.quantity,
        })),
      };

      try {
        console.log("Order data:", orderData);
        // Wysyłanie zamówienia do serwera
        await orderService.createOrder(orderData);

        // Jeśli zamówienie zostało wysłane poprawnie
        this.message = { type: "success", text: "Order placed successfully!" };

        // Czyszczenie koszyka
        this.cart = [];
        this.orderDetails = { name: "", email: "", address: "", phoneNumber: "" };
        this.saveCart();

        // Przekierowanie użytkownika na stronę produktów
        this.$router.push("/products");
      } catch (error) {
        console.error("Error placing order:", error.message);
        this.message = {
          type: "danger",
          text: "Failed to place order. Please try again.",
        };
      }
    },
  },
};

</script>

<style scoped>
.cart-container {
  max-width: 800px; /* Maksymalna szerokość koszyka */
  margin: auto; /* Wyśrodkowanie koszyka */
  padding: 10px;
  background: #fff;
  height: 100%; /* Ustawienie pełnej wysokości */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 480px; /* Maksymalna wysokość przewijania */
  overflow-y: auto; /* Dodanie przewijania w pionie */
  padding-right: 10px; /* Dodanie odstępu dla paska przewijania */
}

.table {
  margin-top: 20px;
  width: 100%; /* Szerokość tabeli */
}

button {
  margin: 0 5px;
}

</style>