<template>
  <div class="app-container">
    <nav-header />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavHeader from '@/components/layout/NavHeader.vue'
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 60px;
  position: relative;
  z-index: 1;
}
</style> 