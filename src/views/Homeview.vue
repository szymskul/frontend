<template>
    <div>
      <h1>Witamy w aplikacji</h1>
      <p>Jest to strona główna.</p>
      <ButtonNew label="Kliknij mnie" />
    </div>
  </template>
  
  <script>
  import ButtonNew from '../components/ButtonNew.vue'; // Importujemy komponent Button
  
  export default {
    name: 'HomeView',
    components: {
      ButtonNew, // Rejestrujemy komponent Button
    },
  };
  </script>
  
  <style scoped>
  /* Stylowanie widoku */
  h1 {
    color: blue;
  }
  </style>
  