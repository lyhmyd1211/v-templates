<template>
  <div id="app">
    <v-container>
      <img alt="Vue logo" src="./assets/logo.png" />
    </v-container>
  </div>
</template>

<script>
import vContainer from './components/v-ad-container'
export default {
  name: 'App',
  components: {
    vContainer
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
