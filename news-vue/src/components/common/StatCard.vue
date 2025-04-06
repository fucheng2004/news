<template>
  <div class="stat-item">
    <div class="stat-value">
      <span class="number">{{ value }}</span>
      <span v-if="unit" class="unit">{{ unit }}</span>
    </div>
    <div class="stat-label">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: string | number
  unit?: string
  label: string
}>()
</script>

<style scoped>
.stat-item {
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  background: var(--el-color-primary-light-9);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 8px;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.stat-value .number {
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-success) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-value .unit {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  -webkit-text-fill-color: var(--el-text-color-secondary);
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

@media (max-width: 768px) {
  .stat-value {
    font-size: 24px;
  }
  
  .stat-value .unit {
    font-size: 14px;
  }
}
</style> 