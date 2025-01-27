<template>
  <div>
    <nav class="nav">
      <a href="/home">Home</a>
      <a href="/products">Products</a>
      <a href="/orders">Orders</a>
      <a href="/orderreviews">ReviewOrders</a>
    </nav>
    <div class="content-container">
      <div class="filters mb-3">
        <label for="status" class="form-label">Filter by Status:</label>
        <select v-model="filterStatus" id="status" class="form-select">
          <option value="">All</option>
          <option value="1">Pending</option>
          <option value="2">Realized</option>
          <option value="3">Cancelled</option>
        </select>
      </div>
      <table class="orders-table">
        <thead>
          <tr>
            <th>Approval Date</th>
            <th>Total Value</th>
            <th>Status</th>
            <th>Email</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>{{ order.approvalDate }}</td>
            <td>{{ order.total_value }}</td>
            <td>{{ getStatusName(order.orderStatusId) }}</td>
            <td>{{ order.email }}</td>
            <td>{{ order.phoneNumber }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { orderService } from '../store/api';
import { productService } from '../store/api';

export default {
  name: "OrdersShop",
  data() {
    return {
      orders: [],
      filterStatus: '',
      userId: null, // User ID from token
    };
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(order => {
        const matchesStatus = !this.filterStatus || order.orderStatusId === parseInt(this.filterStatus);
        const matchesUser = this.userId ? order.userId === this.userId : true;
        return matchesStatus && matchesUser;
      });
    }
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

        // Fetch orders and products
        const ordersResponse = await orderService.getAllOrders(token);
        const products = await productService.getAllProducts();

        // Process orders to calculate total_value
        this.orders = ordersResponse.map(order => {
          const totalValue = Array.isArray(order.orderItems)
            ? order.orderItems.reduce((sum, item) => {
                const product = products.find(prod => prod.id === item.productId);
                const productPrice = product ? parseFloat(product.unit_price) || 0 : 0; // Convert price from string
                return sum + productPrice * item.quantity;
              }, 0)
            : 0; // Default totalValue to 0 if no items

          return {
            ...order,
            total_value: parseFloat(totalValue.toFixed(2)), // Add calculated value to the order
          };
        });

        console.log("Processed orders with total values:", this.orders);
      } catch (error) {
        console.error("Error loading orders:", error.message);
      }
    },

    getStatusName(statusId) {
      const statuses = {
        1: 'Pending',
        2: 'Realized',
        3: 'Cancelled',
      };
      return statuses[statusId] || 'Unknown';
    }
  },
  async created() {
    await this.loadOrders();
  }
};
</script>

<style>
/* Dodanie stylów dla kontenera z przewijaniem */
.content-container {
  max-height: 500px; /* Maksymalna wysokość */
  overflow-y: auto; /* Przewijanie w pionie */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
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
</style>
