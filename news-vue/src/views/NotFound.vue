<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="router.push('/')">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--el-bg-color);
}

.content {
  padding: 40px;
}

h1 {
  font-size: 120px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

p {
  font-size: 24px;
  color: var(--el-text-color-secondary);
  margin: 20px 0 40px;
}

.el-button {
  padding: 12px 24px;
  font-size: 16px;
}
</style> 