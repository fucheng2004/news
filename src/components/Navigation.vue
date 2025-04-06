<template>
  <nav class="navbar">
    <div class="nav-links">
      <router-link to="/" class="nav-link">首页</router-link>
      <router-link to="/data-platform" class="nav-link">数读平台</router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
}

.nav-links {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover,
.router-link-active {
  color: #42b983;
  background-color: rgba(66, 185, 131, 0.1);
}
</style> 