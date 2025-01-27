<template>
    <div>
      <nav class="nav">
        <a href="/adminhome">AdminHome</a>
        <a href="/adminproduct">AdminProducts</a>
        <a href="/adminorder">AdminOrders</a>
        <a href="/admininit">AdminInit</a>
      </nav>
      <div class="content">
        <h1>Welcome to the Admin Home Page!</h1>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminHomeView',
  };
  </script>
  
  <style scoped>
  
  .content {
    margin-top: 20px;
  }
  </style>
  