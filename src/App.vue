<template>
  <div id="app">
    <div class="main-box">
        <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Wysokość pełnego okna przeglądarki */
  background-color: orange; /* Tło strony */
  margin: 0;
}

.main-box {
  width: 75vw; /* 75% szerokości okna przeglądarki */
  height: 75vh; /* 75% wysokości okna przeglądarki */
  background-color: #ffffff; /* Tło prostokąta */
  border-radius: 20px; /* Zaokrąglone rogi */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Cień dla elegancji */
  padding: 20px; /* Odstęp wewnętrzny */
  position: relative; /* Aby `sticky` działało w obrębie */
}

nav {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  position: sticky; /* Pasek nawigacyjny "przyklejony" */
  top: 0; /* Umiejscowienie na górze kontenera */
  background-color: #ffffff; /* Tło dla nawigacji */
  z-index: 10; /* Ustawienie nad innymi elementami */
  padding: 10px 0; /* Dodatkowy odstęp wewnętrzny */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Cień dla lepszej widoczności */
  border-bottom: 1px solid #e0e0e0; /* Dolna linia dla separacji */
  border-radius: 20px 20px 0 0; /* Zaokrąglenie górnych rogów */
}

nav a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  font-size: 1.1em;
}

nav a:hover {
  text-decoration: underline;
  color: #0056b3;
}

.content {
  height: calc(100% - 60px); /* Ustaw wysokość, aby zajęła resztę przestrzeni */
  overflow-y: auto; /* Pozwól na przewijanie w pionie */
  padding: 10px; /* Dodaj odstęp od krawędzi */
}

</style>
