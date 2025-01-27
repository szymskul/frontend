<template>
    <div class="admin-products">
        <nav class="nav">
        <a href="/adminhome">AdminHome</a>
        <a href="/adminproduct">AdminProducts</a>
        <a href="/adminorder">AdminOrders</a>
        <a href="/admininit">AdminInit</a>
      </nav>
      <div class="container mt-4">
        <h1>Manage Products</h1>
  
        <table class="table table-striped mt-3">
          <thead class="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Weight</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="product.id">
              <td>{{ index + 1 }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.description }}</td>
              <td>${{ product.unit_price }}</td>
              <td>{{ product.unit_weight }}</td>
              <td>{{ product.category }}</td>
              <td>
                <button class="btn btn-primary btn-sm" @click="editProduct(product)">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
  
        <div v-if="selectedProduct" class="mt-5">
          <h2>Edit Product</h2>
          <form @submit.prevent="updateProduct">
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input
                type="text"
                id="name"
                v-model="selectedProduct.name"
                class="form-control"
                required
              />
            </div>
  
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea
                id="description"
                v-model="selectedProduct.description"
                class="form-control"
                required
              ></textarea>
              <button
                type="button"
                class="btn btn-secondary mt-2"
                @click="optimizeDescription"
              >
                Optimize Description
              </button>
            </div>
  
            <div class="mb-3">
              <label for="price" class="form-label">Price</label>
              <input
                type="number"
                id="price"
                v-model.number="selectedProduct.unit_price"
                class="form-control"
                min="0.01"
                step="0.01"
                required
              />
            </div>
  
            <div class="mb-3">
              <label for="weight" class="form-label">Weight</label>
              <input
                type="number"
                id="weight"
                v-model.number="selectedProduct.unit_weight"
                class="form-control"
                min="0.01"
                step="0.01"
                required
              />
            </div>
  
            <div class="mb-3">
              <label for="category" class="form-label">Category</label>
              <select v-model="selectedProduct.categoryId" id="category" class="form-select" required>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
  
            <button type="submit" class="btn btn-success">Save Changes</button>
          </form>
  
          <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
          </div>
          <div v-if="message" class="alert mt-3" :class="message.type === 'success' ? 'alert-success' : 'alert-danger'">
            {{ message.text }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { productService } from '../store/api';

export default {
  name: 'AdminProducts',
  data() {
    return {
      products: [],
      categories: [],
      selectedProduct: null,
      message: null,
      errorMessage: null,
    };
  },
  methods: {
    async loadProducts() {
      try {
        const products = await productService.getAllProducts();
        const categories = await productService.getAllCategories();

        // Mapowanie kategorii do produktów
        this.products = products.map(product => {
          const category = categories.find(cat => cat.id === product.category_id);
          return {
            ...product,
            category: category ? category.name : 'Unknown',
          };
        });

        this.categories = categories;
      } catch (error) {
        console.error('Error loading products or categories:', error.message);
        this.message = { type: 'alert-danger', text: 'Failed to load products or categories.' };
      }
    },
    editProduct(product) {
      this.selectedProduct = { ...product };
    },
    async updateProduct() {
      try {
        this.errorMessage = null;

        await productService.updateProductById(this.selectedProduct.id, {
          name: this.selectedProduct.name,
          description: this.selectedProduct.description,
          unit_price: this.selectedProduct.unit_price,
          unit_weight: this.selectedProduct.unit_weight,
          categoryId: this.selectedProduct.categoryId,
        });

        this.message = { type: 'success', text: 'Product updated successfully!' };
        await this.loadProducts();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          this.errorMessage = error.response.data.error;
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
        console.error('Error updating product:', error.message);
      }
    },
    async optimizeDescription() {
      try {
        const optimizedDescription = await productService.getSeoDescription(this.selectedProduct.id);
        this.selectedProduct.description = optimizedDescription;
        this.message = { type: 'success', text: 'Description optimized successfully!' };
      } catch (error) {
        console.error('Error optimizing description:', error.message);
        this.message = { type: 'alert-danger', text: 'Failed to optimize description.' };
      }
    },
  },
  async created() {
    await this.loadProducts();
  },
};

  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    height: 500px;
    margin: auto;
    overflow-y: auto; /* Dodanie przewijania w pionie */
    padding-right: 10px; 
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
  