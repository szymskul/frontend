<template>
  <div>
    <nav class="nav">
        <a href="/adminhome">AdminHome</a>
        <a href="/adminproduct">AdminProducts</a>
        <a href="/adminorder">AdminOrders</a>
        <a href="/admininit">AdminInit</a>
      </nav>

    <div class="container mt-4">
      <h1>{{ showUnrealizedOrders ? 'Unrealized Orders' : 'Realized or Cancelled Orders' }}</h1>

      <button class="btn btn-secondary mb-3" @click="toggleOrderView">
        {{ showUnrealizedOrders ? 'Show Realized/Cancelled Orders' : 'Show Unrealized Orders' }}
      </button>

      <table class="orders-table">
        <thead>
          <tr>
            <th>Approval Date</th>
            <th>Total Value</th>
            <th>Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>{{ order.approvalDate || 'Pending Approval' }}</td>
            <td>${{ order.total_value ? order.total_value.toFixed(2) : '0.00' }}</td>
            <td>
              <ul>
                <li v-for="item in order.orderItems" :key="item.productId">
                  Product ID: {{ item.productId }}, Quantity: {{ item.quantity }}
                </li>
              </ul>
            </td>
            <td>
              <div v-if="showUnrealizedOrders">
                <button class="btn btn-success btn-sm" @click="changeOrderStatus(order.id, 2)">Mark as Realized</button>
                <button class="btn btn-danger btn-sm" @click="changeOrderStatus(order.id, 3)">Cancel</button>
              </div>
              <div v-else>
                <button class="btn btn-primary btn-sm" @click="loadOpinions(order.id)">View Opinions</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="opinions && opinions.length" class="mt-4">
        <h2>Opinions</h2>
        <ul>
          <li v-for="(opinion, index) in opinions" :key="index">
            <strong>Rating:</strong> {{ opinion.rating }} <br />
            <strong>Content:</strong> {{ opinion.content }}
          </li>
        </ul>
      </div>

      <div v-if="message" class="alert mt-3" :class="message.type">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { orderService } from '../store/api';
import { productService } from '../store/api';

export default {
  name: "AdminOrders",
  data() {
    return {
      orders: [],
      opinions: [],
      message: null,
      showUnrealizedOrders: true, // True = Unrealized, False = Realized/Cancelled
    };
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(order => {
        return this.showUnrealizedOrders
          ? order.orderStatusId === 1 // Unrealized
          : order.orderStatusId === 2 || order.orderStatusId === 3; // Realized or Cancelled
      });
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

        // Fetch orders and products
        const ordersResponse = await orderService.getAllOrders(token);
        const products = await productService.getAllProducts();

        // Process orders to calculate total_value
        this.orders = ordersResponse.map(order => {
          const totalValue = Array.isArray(order.orderItems)
            ? order.orderItems.reduce((sum, item) => {
                const product = products.find(prod => prod.id === item.productId);
                const productPrice = product ? parseFloat(product.unit_price) || 0 : 0;
                return sum + productPrice * item.quantity;
              }, 0)
            : 0;

          return {
            ...order,
            total_value: totalValue, // Add calculated value to the order
          };
        });

        console.log("Processed orders with total values:", this.orders);
      } catch (error) {
        console.error("Error loading orders:", error.message);
        this.message = { type: "alert-danger", text: "Failed to load orders." };
      }
    },
    async changeOrderStatus(orderId, statusId) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        await orderService.updateOrderStatus(orderId, statusId, token);
        this.message = { type: "alert-success", text: "Order status updated successfully!" };

        // Reload orders after update
        await this.loadOrders();
      } catch (error) {
        console.error("Error updating order status:", error.message);
        this.message = { type: "alert-danger", text: "Failed to update order status." };
      }
    },
    async loadOpinions(orderId) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        const response = await orderService.getOpinions(orderId, token);
        this.opinions = response;
      } catch (error) {
        console.error("Error loading opinions:", error.message);
        this.message = { type: "alert-danger", text: "Failed to load opinions." };
      }
    },
    toggleOrderView() {
      this.showUnrealizedOrders = !this.showUnrealizedOrders;
      this.opinions = []; // Clear opinions when switching views
    },
  },
  async created() {
    await this.loadOrders();
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: auto;
  height: 500px;
  overflow-y: auto; /* Dodanie przewijania w pionie */
  padding-right: 10px; 
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.orders-table th,
.orders-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.orders-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.orders-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.orders-table tr:hover {
  background-color: #ddd;
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
</style>
