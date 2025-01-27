<template>
    <div>
      <nav class="nav">
      <a href="/home">Home</a>
      <a href="/products">Products</a>
      <a href="/orders">Orders</a>
    </nav>
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Approval Date</th>
            <th>Status ID</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>User ID</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.approvalDate }}</td>
            <td>{{ order.orderStatusId }}</td>
            <td>{{ order.userName }}</td>
            <td>{{ order.email }}</td>
            <td>{{ order.phoneNumber }}</td>
            <td>{{ order.userId }}</td>
            <td>
              <ul>
                <li v-for="item in order.items" :key="item.productId">
                  Product ID: {{ item.productId }}, Quantity: {{ item.quantity }}
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: "OrdersShop",
    props: {
      orders: {
        type: Array,
        required: true
      }
    }
  };
  </script>
  
  <style>
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
