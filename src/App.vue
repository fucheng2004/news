<template>
  <div id="app">
    <Navigation />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'

export default {
  name: 'App',
  components: {
    Navigation
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f5f5f5;
}

#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main-content {
  margin-top: 70px;
  padding: 20px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
</style> 