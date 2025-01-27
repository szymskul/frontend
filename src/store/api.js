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
};

export const authService = {
    signUp: async (username, password) => {
        console.log('Sign-up request:', { username, password }); // Debugging
        try {
            console.log('Sign-up responsea'); // Debugging
          const response = await axiosInstance.post('/login', { username, password });
          console.log('Sign-up response:', response.data); // Debugging
          return response.data;
        } catch (error) {
          console.error('Error during sign-up:', error.response?.data || error.message);
          throw error.response?.data || new Error('Sign-up failed!');
        }
      },
};
