<template>
    <div>
      <h1 v-if="isLoginMode">Log In</h1>
      <h1 v-else>Sign Up</h1>
  
      <form @submit.prevent="isLoginMode ? handleLogIn() : handleSignUp()">
        <!-- Form inputs -->
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">{{ isLoginMode ? "Log In" : "Sign Up" }}</button>
      </form>
  
      <p>
        {{ isLoginMode ? "Don't have an account?" : "Already have an account?" }}
        <button @click="toggleMode">
          {{ isLoginMode ? "Sign Up" : "Log In" }}
        </button>
      </p>
    </div>
  </template>
  
  <script>
  import { authService } from "../store/api";
  
  export default {
    name: "AuthView",
    data() {
      return {
        username: "", // pole login
        password: "", // pole hasło
        isLoginMode: true, // tryb logowania lub rejestracji
      };
    },
    methods: {
      toggleMode() {
        this.isLoginMode = !this.isLoginMode;
      },
      async handleSignUp() {
        console.log("Sign-up form submitted!"); // Debugging
        try {
          const response = await authService.signUp(this.username, this.password);
          console.log("Response from API:", response); // Debugging
          alert("Sign-up successful! Please log in.");
          this.isLoginMode = true; // Przełączenie do trybu logowania
        } catch (error) {
          console.error("Sign-up error:", error.message);
          alert("Sign-up failed. Please try again.");
        }
      },
      async handleLogIn() {
      try {
        const response = await authService.logIn(this.username, this.password);
        const token = response.token;

        // Zapis tokena w localStorage
        localStorage.setItem("token", token);

        // Dekodowanie roli użytkownika z JWT
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload.role; // Zakładamy, że `role` znajduje się w tokenie

        // Przekierowanie na podstawie roli
        if (role === "KLIENT") {
          this.$router.push("/home");
        } else if (role === "PRACOWNIK") {
          this.$router.push("/adminhome");
        } else {
          alert("Unauthorized role. Please contact support.");
        }
      } catch (error) {
        console.error("Login failed:", error.message);
        alert("Invalid username or password. Please try again.");
      }
    },
    },
  };
  </script>
  