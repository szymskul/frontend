<template>
    <div>
      <h1>Sign Up</h1>
      <form @submit.prevent="handleSignUp">
        <!-- Form inputs -->
        <div>
          <label for="username">username:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  </template>
  
  <script>
  import { authService } from "../store/api";
  
  export default {
    name: "SignUp",
    data() {
      return {
        username: "", // pole login
        password: "", // pole hasło
      };
    },
    methods: {
  async handleSignUp() {
    console.log('Sign-up form submitted!'); // Debugging
    try {
      const response = await authService.signUp(this.username, this.password);
      console.log('Response from API:', response); // Debugging
      localStorage.setItem("token", response.token);
      localStorage.setItem("refreshToken", response.refreshToken);
      this.$router.push("/home");
    } catch (error) {
      console.error('Sign-up error:', error.message);
      alert("Sign-up failed. Please try again.");
    }
},

    },
  };
  </script>
  