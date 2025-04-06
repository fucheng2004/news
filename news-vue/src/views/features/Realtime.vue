<template>
  <div class="realtime-page">
    <!-- 添加背景动画 -->
    <div class="background-decoration">
      <div class="gradient-circle circle-1"></div>
      <div class="gradient-circle circle-2"></div>
      <div class="grid-pattern"></div>
    </div>

    <div class="page-header">
      <h2>实时监测</h2>
      <p>24小时不间断监控新闻动态，实时预警</p>
    </div>

    <!-- 添加实时统计卡片 -->
    <div class="stats-overview">
      <div v-for="(stat, index) in overviewStats" 
           :key="stat.label"
           class="stat-card"
           v-motion-slide-visible
           :custom-delay="index * 100">
        <div class="stat-icon">
          <el-icon><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
        <div class="stat-trend" :class="stat.trend">
          {{ stat.trendValue }}
        </div>
      </div>
    </div>

    <div class="monitor-grid">
      <!-- 实时监控面板 -->
      <div class="monitor-panel" v-motion-slide-visible>
        <div class="panel-header">
          <h3>实时监控</h3>
          <div class="status-badge">
            <span class="dot"></span>
            运行中
          </div>
        </div>
        <div class="monitor-chart" ref="monitorChartRef"></div>
        <div class="monitor-stats">
          <div class="stat-item">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">今日检测总量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.warning }}</div>
            <div class="stat-label">预警信息</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.processing }}</div>
            <div class="stat-label">处理中</div>
          </div>
        </div>
      </div>

      <!-- 预警列表 -->
      <div class="warning-list" v-motion-slide-visible>
        <div class="list-header">
          <h3>预警信息</h3>
          <el-tag type="danger" size="small">{{ warnings.length }}</el-tag>
        </div>
        <div class="list-content">
          <div v-for="warning in warnings" 
               :key="warning.id"
               class="warning-item"
               :class="warning.level">
            <div class="warning-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="warning-content">
              <div class="warning-title">{{ warning.title }}</div>
              <div class="warning-info">
                <span>{{ warning.time }}</span>
                <span>{{ warning.source }}</span>
              </div>
            </div>
            <div class="warning-actions">
              <el-button type="primary" link>处理</el-button>
              <el-button type="info" link>忽略</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时数据流 -->
    <div class="data-stream" v-motion-slide-visible>
      <div class="stream-header">
        <h3>数据流</h3>
        <div class="stream-controls">
          <el-switch v-model="streamEnabled" />
          <span>{{ streamEnabled ? '已开启' : '已暂停' }}</span>
        </div>
      </div>
      <div class="stream-content" ref="streamChartRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Warning } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const monitorChartRef = ref<HTMLElement | null>(null)
const streamChartRef = ref<HTMLElement | null>(null)
let monitorChart: echarts.ECharts | null = null
let streamChart: echarts.ECharts | null = null

// 模拟数据
const stats = ref({
  total: '12,592',
  warning: '23',
  processing: '156'
})

const warnings = ref([
  {
    id: 1,
    level: 'high',
    title: '发现疑似虚假新闻传播',
    time: '2分钟前',
    source: '社交媒体'
  },
  {
    id: 2,
    level: 'medium',
    title: '检测到异常传播模式',
    time: '5分钟前',
    source: '新闻网站'
  },
  {
    id: 3,
    level: 'low',
    title: '信息一致性验证失败',
    time: '12分钟前',
    source: '自媒体'
  }
])

const streamEnabled = ref(true)

// 初始化监控���表
const initMonitorChart = () => {
  if (!monitorChartRef.value) return
  
  monitorChart = echarts.init(monitorChartRef.value)
  const option = {
    grid: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 40,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#409EFF',
          type: 'dashed'
        }
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#909399',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#EBEEF5',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#909399',
        fontSize: 12
      }
    },
    series: [{
      type: 'line',
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#409EFF' },
          { offset: 1, color: '#36CFC9' }
        ])
      },
      itemStyle: {
        color: '#409EFF',
        borderWidth: 2,
        borderColor: '#fff'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64,158,255,0.2)' },
          { offset: 1, color: 'rgba(64,158,255,0.05)' }
        ])
      }
    }]
  }
  
  monitorChart.setOption(option)
}

// 初始化数据流图表
const initStreamChart = () => {
  if (!streamChartRef.value) return
  
  streamChart = echarts.init(streamChartRef.value)
  const option = {
    grid: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
    xAxis: {
      show: false,
      type: 'value'
    },
    yAxis: {
      show: false,
      type: 'value'
    },
    series: [{
      type: 'scatter',
      data: Array.from({ length: 50 }, () => [
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 50
      ]),
      symbolSize: function (data: number[]) {
        return data[2]
      },
      itemStyle: {
        color: function (params: any) {
          return new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
            {
              offset: 0,
              color: 'rgba(64,158,255,0.5)'
            },
            {
              offset: 1,
              color: 'rgba(64,158,255,0.1)'
            }
          ])
        }
      },
      emphasis: {
        focus: 'self'
      },
      blur: {
        itemStyle: {
          opacity: 0.3
        }
      }
    }]
  }
  
  streamChart.setOption(option)
}

// 更新数据流
const updateStream = () => {
  if (!streamEnabled.value || !streamChart) return
  
  const newData = Array.from({ length: 50 }, () => [
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 50
  ])
  
  streamChart.setOption({
    series: [{
      data: newData
    }]
  })
}

// 生命周期钩子
let streamTimer: number
onMounted(() => {
  initMonitorChart()
  initStreamChart()
  streamTimer = window.setInterval(updateStream, 2000)
})

onBeforeUnmount(() => {
  monitorChart?.dispose()
  streamChart?.dispose()
  clearInterval(streamTimer)
})

// 添加新的统计数据
const overviewStats = [
  {
    icon: 'DataLine',
    label: '检测总量',
    value: '1,294,86',
    trend: 'up',
    trendValue: '+12.5%'
  },
  {
    icon: 'Warning',
    label: '异常预警',
    value: '89',
    trend: 'down',
    trendValue: '-5.2%'
  },
  {
    icon: 'Timer',
    label: '平均响应',
    value: '0.5s',
    trend: 'up',
    trendValue: '+8.3%'
  },
  {
    icon: 'Check',
    label: '准确率',
    value: '99.8%',
    trend: 'stable',
    trendValue: '0.0%'
  }
]
</script>

<style scoped>
.realtime-page {
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h2 {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #409EFF, #36CFC9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 16px;
}

.page-header p {
  color: #909399;
  font-size: 16px;
}

.monitor-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.monitor-panel,
.warning-list,
.data-stream {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.panel-header,
.list-header,
.stream-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h3,
.list-header h3,
.stream-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #67C23A;
  font-size: 14px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #67C23A;
  animation: pulse 2s infinite;
}

.monitor-chart {
  height: 300px;
  margin: 20px 0;
}

.monitor-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #F5F7FA;
  border-radius: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.warning-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  background: rgba(245, 247, 250, 0.8);
  transition: all 0.3s ease;
}

.warning-item:hover {
  transform: translateX(5px);
}

.warning-item.high .warning-icon {
  color: #F56C6C;
}

.warning-item.medium .warning-icon {
  color: #E6A23C;
}

.warning-item.low .warning-icon {
  color: #909399;
}

.warning-icon {
  font-size: 24px;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.warning-info {
  font-size: 12px;
  color: #909399;
  display: flex;
  gap: 12px;
}

.stream-content {
  height: 200px;
}

.stream-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #909399;
  font-size: 14px;
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

@media (max-width: 768px) {
  .monitor-grid {
    grid-template-columns: 1fr;
  }
  
  .monitor-chart {
    height: 200px;
  }
  
  .monitor-stats {
    grid-template-columns: 1fr;
  }
}

/* 添加新样式 */
.background-decoration {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
}

.gradient-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.1;
}

.circle-1 {
  top: -10%;
  left: -10%;
  width: 50%;
  height: 50%;
  background: linear-gradient(45deg, #409EFF, #36CFC9);
  animation: float 20s infinite alternate;
}

.circle-2 {
  bottom: -20%;
  right: -10%;
  width: 60%;
  height: 60%;
  background: linear-gradient(225deg, #67C23A, #409EFF);
  animation: float 25s infinite alternate-reverse;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  mask-image: radial-gradient(circle at 50% 50%, black, transparent 80%);
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,
    rgba(64, 158, 255, 0.1),
    rgba(54, 207, 201, 0.1)
  );
}

.stat-icon .el-icon {
  font-size: 24px;
  background: linear-gradient(45deg, #409EFF, #36CFC9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.stat-trend {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.stat-trend.up {
  color: #67C23A;
  background: rgba(103, 194, 58, 0.1);
}

.stat-trend.down {
  color: #F56C6C;
  background: rgba(245, 108, 108, 0.1);
}

.stat-trend.stable {
  color: #909399;
  background: rgba(144, 147, 153, 0.1);
}

/* 添加动画 */
@keyframes float {
  0% { transform: translate(0, 0); }
  50% { transform: translate(-20px, 20px); }
  100% { transform: translate(20px, -20px); }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
  }
  
  .stat-value {
    font-size: 20px;
  }
}
</style> 