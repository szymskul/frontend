import axios from 'axios';

const API_URL = 'http://localhost:8081'; // Możesz też wykorzystać zmienną środowiskową

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Pobiera token z localStorage
    },
});

export const productService = {
    getAllProducts: async () => {
        try {
            const response = await axiosInstance.get('/products');
            return response.data; // Axios trzyma dane w polu `data`
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },
    getAllCategories: async () => {
        try {
          const response = await axiosInstance.get('/categories');
          return response.data;
        } catch (error) {
          console.error('Error fetching categories:', error.response?.data || error.message);
          throw error;
        }
      },
      getProductById: async (id) => {
        try {
          const response = await axiosInstance.get(`/products/${id}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching product by ID:', error);
          throw error;
        }
      },
    
      // Zaktualizuj produkt po ID
      updateProductById: async (id, productData) => {
        try {
          const response = await axiosInstance.put(`/products/${id}`, productData);
          return response.data;
        } catch (error) {
          console.error('Error updating product:', error);
          throw error;
        }
      },
    
      addProduct: async (product) => {
        try {
          const token = localStorage.getItem("token");
          const response = await axiosInstance.post("/products", product, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          return response.data;
        } catch (error) {
          console.error("Error adding product:", error.response?.data || error);
          throw error.response?.data || error;
        }
      },
      getSeoDescription: async (productId) => {
        try {
          const response = await axiosInstance.get(`/products/${productId}/seo-description`);
          return response.data.description; // Zakładam, że endpoint zwraca { description: "..." }
        } catch (error) {
          console.error('Error fetching SEO description:', error.message);
          throw error;
        }
      },
};

export const authService = {
    // Rejestracja użytkownika
    signUp: async (username, password) => {
      try {
        const response = await axios.post(`${API_URL}/register`, { 
          username, 
          password, 
          role: "KLIENT" // Stała rola dla rejestracji
        });
        return response.data;
      } catch (error) {
        console.error("Error during sign-up:", error.response?.data || error.message);
        throw error.response?.data || new Error("Sign-up failed!");
      }
    },
  
    logIn: async (username, password) => {
        try {
          const response = await axios.post(`${API_URL}/login`, { username, password });
          localStorage.setItem("token", response.token);
          return response.data;
        } catch (error) {
          console.error("Error during log-in:", error.response?.data || error.message);
          throw error.response?.data || new Error("Log-in failed!");
        }
      },
  };

  

export const orderService = {

    getAllOrders: async (token) => {
      try {
        const response = await axiosInstance.get(`/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching orders:', error.message);
        throw error;
      }
    },
  
    updateOrder: async (orderId, updatedOrder) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/orders/${orderId}`, updatedOrder, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error updating order:', error.message);
        throw error;
      }
    },

    updateOrderStatus: async (orderId, status) => {
        try {
          const token = localStorage.getItem("token");
          const response = await axiosInstance.patch(
            `/orders/${orderId}`, 
            { orderStatusId: status }, 
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          return response.data;
        } catch (error) {
          console.error("Error updating order status:", error.message);
          throw error;
        }
      },
    createOrder: async (orderData) => {
        try {
          const token = localStorage.getItem("token"); // Pobierz token z localStorage
          const response = await axios.post(`${API_URL}/orders`, orderData, {
            headers: {
              Authorization: `Bearer ${token}`, // Nagłówek uwierzytelnienia
              "Content-Type": "application/json", // Nagłówek JSON
            },
          });
          return response.data;
        } catch (error) {
          console.error("Error creating order:", error.message);
          throw error;
        }
      },
      addOpinion: async (orderId, opinionData) => {
        try {
          const token = localStorage.getItem('token');
          console.log('Token:', token);
          console.log('Order ID:', orderId);
          console.log('Opinion data:', opinionData);
      
          const response = await axios.post(
            `http://localhost:8081/orders/${orderId}/opinions`,
            opinionData,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Dodaj token autoryzacyjny
                'Content-Type': 'application/json',
              },
            }
          );
      
          console.log('Response:', response.data);
          return response.data;
        } catch (error) {
          console.error('Error adding opinion:', error.response?.data || error.message);
          throw error;
        }
      },
      
      getOpinions: async (orderId) => {
        try {
          const token = localStorage.getItem('token'); // Pobierz token z localStorage
          const response = await axiosInstance.get(`/orders/${orderId}/opinions`, {
            headers: {
              Authorization: `Bearer ${token}`, // Dodaj token do nagłówka
            },
          });
          return response.data;
        } catch (error) {
          console.error(`Error fetching opinions for order ${orderId}:`, error.message);
          throw error;
        }
      },
  };
  

  export const statusService = {
    getAllOrderStatuses: async () => {
      try {
        const token = localStorage.getItem('token'); // Pobierz token z localStorage
        const response = await axios.get(`${API_URL}/order-statuses`, {
          headers: {
            Authorization: `Bearer ${token}`, // Dodaj token do nagłówka
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching order statuses:', error.message);
        throw error;
      }
    },
  };
  
