<template>
    <div>
        <nav class="nav">
        <a href="/adminhome">AdminHome</a>
        <a href="/adminproduct">AdminProducts</a>
        <a href="/adminorder">AdminOrders</a>
        <a href="/admininit">AdminInit</a>
      </nav>
      <h1>Initialize Database</h1>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
      <div v-if="loading" class="loading">Loading...</div>
  
      <form @submit.prevent="handleFileUpload">
        <div class="mb-3">
          <label for="file" class="form-label">Upload File (JSON/CSV)</label>
          <input type="file" id="file" @change="readFile" class="form-control" />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="!fileContent || loading">Initialize</button>
      </form>
    </div>
  </template>
  
  <script>
  import { productService } from "../store/api";
  
  export default {
    name: "InitializeDatabase",
    data() {
      return {
        fileContent: null, // Zawartość pliku
        error: null, // Komunikat błędu
        success: null, // Komunikat sukcesu
        loading: false, // Status ładowania
      };
    },
    methods: {
      readFile(event) {
        this.error = null;
        const file = event.target.files[0];
        if (!file) return;
  
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target.result;
            if (file.type === "application/json") {
              this.fileContent = JSON.parse(content);
            } else if (file.type === "text/csv") {
              this.fileContent = this.parseCSV(content);
            } else {
              throw new Error(
                "Unsupported file format. Please upload a JSON or CSV file."
              );
            }
          } catch (err) {
            this.error = `Error reading file: ${err.message}`;
            this.fileContent = null;
          }
        };
        reader.readAsText(file);
      },
      parseCSV(csvContent) {
        const rows = csvContent.split("\n").filter((row) => row.trim() !== "");
        const headers = rows[0].split(",");
        return rows.slice(1).map((row) => {
          const values = row.split(",");
          return headers.reduce((acc, header, index) => {
            acc[header.trim()] = values[index].trim();
            return acc;
          }, {});
        });
      },
      async handleFileUpload() {
        if (!this.fileContent || !Array.isArray(this.fileContent)) {
          this.error = "Invalid file content. Please upload a valid file.";
          return;
        }
  
        this.loading = true;
        this.error = null;
        this.success = null;
  
        try {
          for (const product of this.fileContent) {
            // Walidacja danych produktu przed wysłaniem
            if (!product.name || !product.price || !product.categoryId || !product.description || !product.weight) {
              throw new Error(
                `Invalid product data: ${JSON.stringify(product)}`
              );
            }
  
            // Wyślij produkt do serwera
            await productService.addProduct(product);
          }
          this.success = "Database initialized successfully!";
        } catch (err) {
          this.error = `Error initializing database: ${err.message}`;
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  .success {
    color: green;
  }
  .loading {
    color: blue;
  }
  </style>
  