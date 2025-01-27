<template>
  <div>
    <nav class="nav">
      <a href="/home">Home</a>
      <a href="/products">Products</a>
      <a href="/orders">Orders</a>
    </nav>
    <div class="content">
      <h1>Welcome to the Home Page!</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
};
</script>

<style scoped>

.content {
  margin-top: 20px;
}
</style>
