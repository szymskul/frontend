<template>
  <button @click="handleClick">{{ label }}</button>
</template>

<script>
export default {
  name: 'ButtonNew',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleClick() {
      console.log('Kliknięto przycisk!');
    },
  },
};
</script>

<style scoped>
/* Stylowanie przycisku */
button {
  padding: 10px 20px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
