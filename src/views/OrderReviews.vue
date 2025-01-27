<template>
    <div>
      <nav class="nav">
        <a href="/home">Home</a>
        <a href="/products">Products</a>
        <a href="/orders">Orders</a>
        <a href="/orderreviews">ReviewOrders</a>
      </nav>
  
      <div class="main-content">
        <div class="container mt-4">
          <h1>Your Orders</h1>
          <table class="table table-striped mt-3">
            <thead class="table-dark">
              <tr>
                <th>#</th>
                <th>Approval Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(order) in filteredOrders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.approvalDate }}</td>
                <td>{{ getStatusName(order.orderStatusId) }}</td>
                <td>
                  <button
                    class="btn btn-primary btn-sm"
                    v-if="!order.opinion"
                    @click="selectOrder(order)"
                  >
                    Add Review
                  </button>
                  <span v-else class="text-success">Review Added</span>
                </td>
              </tr>
            </tbody>
          </table>
  
          <div v-if="selectedOrder" class="review-form mt-5">
            <h2>Add Review for Order #{{ selectedOrder.id }}</h2>
            <form @submit.prevent="submitOpinion">
              <div class="mb-3">
                <label for="rating" class="form-label">Rating (1-10)</label>
                <input
                  type="number"
                  id="rating"
                  v-model.number="opinion.rating"
                  class="form-control"
                  min="1"
                  max="10"
                  required
                />
              </div>
  
              <div class="mb-3">
                <label for="content" class="form-label">Content</label>
                <textarea
                  id="content"
                  v-model="opinion.content"
                  class="form-control"
                  required
                ></textarea>
              </div>
  
              <button type="submit" class="btn btn-success">Submit Review</button>
            </form>
  
            <div
              v-if="message"
              class="alert mt-3"
              :class="message.type === 'success' ? 'alert-success' : 'alert-danger'"
            >
              {{ message.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { orderService } from "../store/api";
  
  export default {
    name: "UserOrders",
    data() {
      return {
        orders: [],
        selectedOrder: null,
        opinion: {
          rating: null,
          content: "",
        },
        message: null,
        userId: null, // User ID extracted from the token
      };
    },
    computed: {
      filteredOrders() {
        return this.orders.filter(
          (order) =>
            (order.orderStatusId === 2 || order.orderStatusId === 3) && // ZREALIZOWANE lub ANULOWANE
            order.userId === this.userId && // Tylko zamówienia zalogowanego użytkownika
            !order.opinion // Ukryj zamówienia, które już mają opinię
        );
      },
    },
    methods: {
      async loadOrders() {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("No token found. Please log in.");
            return;
          }
  
          // Decode token to get userId
          const payload = JSON.parse(atob(token.split(".")[1]));
          this.userId = payload.id;
  
          // Fetch all orders
          this.orders = await orderService.getAllOrders(token);
        } catch (error) {
          console.error("Error loading orders:", error.message);
          this.message = { type: "danger", text: "Failed to load orders." };
        }
      },
      getStatusName(statusId) {
        const statuses = {
          2: "Realized",
          3: "Cancelled",
        };
        return statuses[statusId] || "Unknown";
      },
      selectOrder(order) {
        this.selectedOrder = order;
        this.opinion = { rating: null, content: "" };
      },
      async submitOpinion() {
        if (!this.opinion.rating || !this.opinion.content) {
          this.message = { type: "danger", text: "All fields are required." };
          return;
        }
  
        try {
          await orderService.addOpinion(this.selectedOrder.id, {
            rating: this.opinion.rating,
            content: this.opinion.content,
          });
  
          this.message = { type: "success", text: "Review added successfully!" };
          this.orders = this.orders.filter(
            (order) => order.id !== this.selectedOrder.id // Usuń zamówienie z listy po dodaniu opinii
          );
          this.selectedOrder = null; // Zamknij formularz
        } catch (error) {
          console.error("Error adding review:", error.message);
          this.message = { type: "danger", text: "Failed to add review." };
        }
      },
    },
    async created() {
      await this.loadOrders();
    },
  };
  </script>
  
  <style scoped>
  .nav {
    margin-bottom: 10px;
  }
  
  .main-content {
    max-height: 500px; /* Maksymalna wysokość kontenera */
    overflow-y: auto; /* Dodaj przewijanie w pionie */
    padding: 10px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .container {
    max-width: 800px;
    margin: auto;
  }
  
  .alert {
    padding: 15px;
    border-radius: 5px;
  }
  
  .alert-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .alert-danger {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  .mt-5 {
    margin-top: 5px;
    margin-bottom: 20px; /* Dodanie przerwy od dołu */
  }
  </style>
  