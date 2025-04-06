<template>
  <div class="data-platform">
    <div class="page-header">
      <h1>数读平台</h1>
      <p class="subtitle">新闻数据分析与可视化</p>
    </div>

    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon><DataLine /></el-icon>
              <span>今日检测量</span>
            </div>
          </template>
          <div class="stat-value">
            <span class="number">2,384</span>
            <span class="trend up">
              <el-icon><ArrowUp /></el-icon>12.5%
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon><Warning /></el-icon>
              <span>谣言识别率</span>
            </div>
          </template>
          <div class="stat-value">
            <span class="number">95.8%</span>
            <span class="trend up">
              <el-icon><ArrowUp /></el-icon>2.3%
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon><Timer /></el-icon>
              <span>平均响应时间</span>
            </div>
          </template>
          <div class="stat-value">
            <span class="number">1.2s</span>
            <span class="trend down">
              <el-icon><ArrowDown /></el-icon>0.3s
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <el-icon><User /></el-icon>
              <span>活跃用户数</span>
            </div>
          </template>
          <div class="stat-value">
            <span class="number">12,856</span>
            <span class="trend up">
              <el-icon><ArrowUp /></el-icon>8.7%
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-section">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>新闻检测趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里可以集成 ECharts 等图表库 -->
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>谣言类型分布</span>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里可以放饼图 -->
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  DataLine, 
  Warning, 
  Timer, 
  User, 
  ArrowUp, 
  ArrowDown 
} from '@element-plus/icons-vue'

const timeRange = ref('week')
</script>

<style scoped>
.data-platform {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  color: var(--el-text-color-primary);
  margin: 0;
}

.subtitle {
  color: var(--el-text-color-secondary);
  margin-top: 8px;
}

.stat-cards {
  margin-bottom: 24px;
}

.stat-card {
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-primary);
}

.card-header .el-icon {
  font-size: 18px;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.stat-value .number {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.trend.up {
  color: #52c41a;
}

.trend.down {
  color: #f5222d;
}

.charts-section .chart-card {
  margin-bottom: 24px;
}

.chart-container {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-lighter);
  border-radius: 4px;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .page-header h1 {
    color: var(--el-text-color-primary);
  }

  .chart-container {
    background: var(--el-fill-color-dark);
  }
}
</style> 