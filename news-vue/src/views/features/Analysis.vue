<template>
  <div class="analysis-page" v-motion-fade>
    <div class="background-decoration">
      <div class="gradient-circle circle-1"></div>
      <div class="gradient-circle circle-2"></div>
      <div class="grid-pattern"></div>
      <div class="floating-particles">
        <div v-for="n in 10" :key="n" class="particle"></div>
      </div>
    </div>

    <div class="page-header" v-motion-slide-top>
      <h2>多维分析</h2>
      <p class="typing">{{ currentText }}</p>
    </div>

    <div class="analysis-grid">
      <div v-for="(module, index) in analysisModules" 
           :key="module.title"
           class="analysis-card"
           v-motion-slide-visible
           :custom-delay="index * 100"
           @mouseenter="handleCardEnter($event, index)"
           @mouseleave="handleCardLeave($event, index)">
        <div class="card-header">
          <div class="header-icon">
            <el-icon><component :is="module.icon" /></el-icon>
          </div>
          <h3>{{ module.title }}</h3>
        </div>
        <p class="card-desc">{{ module.description }}</p>
        <div class="analysis-chart" :ref="el => chartRefs[index] = el"></div>
        <div class="card-metrics">
          <div v-for="metric in module.metrics" 
               :key="metric.label" 
               class="metric-item">
            <span class="metric-value">{{ metric.value }}</span>
            <span class="metric-label">{{ metric.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="analysis-features" v-motion-slide-visible>
      <h3>核心特性</h3>
      <div class="features-grid">
        <div v-for="feature in features" 
             :key="feature.title" 
             class="feature-card">
          <div class="feature-icon">
            <el-icon><component :is="feature.icon" /></el-icon>
          </div>
          <div class="feature-content">
            <h4>{{ feature.title }}</h4>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { DataLine, Connection, TrendCharts, Histogram, Share, Monitor } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useMotion } from '@vueuse/motion'

const chartRefs = ref<(HTMLElement | null)[]>([])
const charts = ref<(echarts.ECharts | null)[]>([])

const chartTheme = {
  color: [
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: '#409EFF' },
      { offset: 1, color: '#36CFC9' }
    ])
  ],
  grid: {
    containLabel: true,
    left: '3%',
    right: '4%',
    bottom: '3%'
  },
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#E4E7ED',
    textStyle: { color: '#606266' },
    padding: [8, 12],
    extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);'
  }
}

const analysisModules = [
  {
    title: '情感分析',
    icon: 'DataLine',
    description: '深度分析新闻文本的情感倾向和语义特征',
    metrics: [
      { label: '情感准确率', value: '95.8%', trend: '+2.3%', status: 'up' },
      { label: '处理速度', value: '0.2s', trend: '-0.1s', status: 'down' }
    ],
    chartOption: {
      ...chartTheme,
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['积极', '中性', '消极'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#909399',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        show: false,
        splitLine: { show: false }
      },
      series: [{
        type: 'bar',
        data: [60, 30, 10],
        barWidth: '40%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#409EFF' },
            { offset: 1, color: '#36CFC9' }
          ])
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.1)'
          }
        }
      }]
    }
  },
  {
    title: '传播分析',
    icon: 'Connection',
    description: '追踪新闻传播路径和影响范围',
    metrics: [
      { label: '传播深度', value: '5层' },
      { label: '覆盖范围', value: '10w+' }
    ],
    chartOption: {
      tooltip: { trigger: 'item' },
      series: [{
        type: 'graph',
        layout: 'force',
        symbolSize: 20,
        roam: true,
        label: { show: false },
        data: [
          { name: '源头', value: 20, symbolSize: 40 },
          { name: 'A', value: 15 },
          { name: 'B', value: 15 },
          { name: 'C', value: 10 }
        ],
        links: [
          { source: '源头', target: 'A' },
          { source: '源头', target: 'B' },
          { source: 'A', target: 'C' }
        ],
        lineStyle: {
          color: '#188df0',
          width: 2
        }
      }]
    }
  },
  {
    title: '趋势预测',
    icon: 'TrendCharts',
    description: '预测新闻热度走势和发展趋势',
    metrics: [
      { label: '预测准确率', value: '92.3%' },
      { label: '预测周期', value: '7天' }
    ],
    chartOption: {
      tooltip: { trigger: 'axis' },
      grid: { top: 10, right: 10, bottom: 20, left: 30 },
      xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      yAxis: { type: 'value', show: false },
      series: [{
        type: 'line',
        smooth: true,
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        lineStyle: {
          width: 3,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#83bff6' },
            { offset: 1, color: '#188df0' }
          ])
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(131,191,246,0.3)' },
            { offset: 1, color: 'rgba(131,191,246,0.1)' }
          ])
        }
      }]
    }
  }
]

const features = [
  {
    icon: 'Histogram',
    title: '多维度分析',
    description: '从情感、传播、影响力等多个维度进行深度分析'
  },
  {
    icon: 'Share',
    title: '关联分析',
    description: '构建新闻事件关联网络，挖掘潜在关系'
  },
  {
    icon: 'Monitor',
    title: '实时监控',
    description: '24小时实时监控新闻动态，及时预警'
  }
]

const chartsLoading = ref(true)

const initCharts = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    analysisModules.forEach((module, index) => {
      if (chartRefs.value[index]) {
        const chart = echarts.init(chartRefs.value[index] as HTMLElement)
        chart.setOption({
          ...module.chartOption,
          animation: true,
          animationDuration: 1000,
          animationEasing: 'cubicOut'
        })
        charts.value[index] = chart
      }
    })
  } finally {
    chartsLoading.value = false
  }
}

const handleResize = () => {
  charts.value.forEach(chart => chart?.resize())
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  charts.value.forEach(chart => chart?.dispose())
  window.removeEventListener('resize', handleResize)
})

const texts = [
  '基于深度学习的新闻内容多维度分析系统',
  '实时监控新闻传播趋势和影响力',
  '智能识别新闻情感倾向和关联关系'
]
const currentText = ref(texts[0])
let currentIndex = 0

const typeNextText = () => {
  currentIndex = (currentIndex + 1) % texts.length
  currentText.value = texts[currentIndex]
}

onMounted(() => {
  setInterval(typeNextText, 3000)
})

const handleCardEnter = (event: MouseEvent, index: number) => {
  const card = event.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  card.style.setProperty('--mouse-x', `${x}px`)
  card.style.setProperty('--mouse-y', `${y}px`)
}

const handleCardLeave = (event: MouseEvent, index: number) => {
  const card = event.currentTarget as HTMLElement
  card.style.setProperty('--mouse-x', '50%')
  card.style.setProperty('--mouse-y', '50%')
}
</script>

<style scoped>
/* 导入字体 */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

/* 基础字体设置 */
.analysis-page {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* 标题字体优化 */
.page-header h2 {
  font-size: 44px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin-bottom: 16px;
  background: linear-gradient(135deg, 
    var(--el-color-primary), 
    #36cfc9
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-header p {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  color: #606266;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  letter-spacing: -0.01em;
}

/* 卡片标题优化 */
.card-header h3 {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
  background: linear-gradient(45deg, 
    var(--el-color-primary), 
    var(--el-color-primary-light-3)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.3;
}

.card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: #909399;
  letter-spacing: -0.01em;
}

/* 数据指标优化 */
.metric-value {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(45deg, 
    #409EFF,
    #36cfc9
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.metric-label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #909399;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 特性标题优化 */
.analysis-features h3 {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 40px;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    #36cfc9
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.feature-content h4 {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: 8px;
  color: #303133;
  line-height: 1.4;
}

.feature-content p {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #909399;
  letter-spacing: -0.01em;
}

/* 响应式字体调整 */
@media (max-width: 768px) {
  .page-header h2 {
    font-size: 36px;
  }
  
  .page-header p {
    font-size: 16px;
  }
  
  .card-header h3 {
    font-size: 20px;
  }
  
  .metric-value {
    font-size: 24px;
  }
  
  .analysis-features h3 {
    font-size: 28px;
  }
}

/* 其他样式保持不变 */

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 40px 0;
}

.analysis-card {
  background: var(--el-bg-color-overlay);
  backdrop-filter: blur(20px);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.analysis-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.header-icon {
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

.header-icon .el-icon {
  font-size: 24px;
  background: linear-gradient(45deg, 
    var(--el-color-primary), 
    #36cfc9
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.analysis-chart {
  height: 200px;
  margin: 20px 0;
}

.card-metrics {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.metric-item {
  text-align: center;
}

.analysis-features {
  margin-top: 60px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  background: var(--el-bg-color-overlay);
  backdrop-filter: blur(20px);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  display: flex;
  gap: 16px;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,
    rgba(64, 158, 255, 0.1),
    rgba(54, 207, 201, 0.1)
  );
}

.feature-icon .el-icon {
  font-size: 20px;
  background: linear-gradient(45deg, 
    var(--el-color-primary), 
    #36cfc9
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@media (max-width: 768px) {
  .analysis-grid {
    grid-template-columns: 1fr;
  }

  .analysis-chart {
    height: 180px;
  }
}

/* 动态背景效果 */
.floating-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--el-color-primary-light-8);
  border-radius: 50%;
  animation: float-particle 20s infinite linear;
}

.particle:nth-child(even) {
  background: var(--el-color-success-light-8);
}

@keyframes float-particle {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  100% {
    transform: translate(100vw, 100vh) rotate(360deg);
    opacity: 0;
  }
}

/* 打字机效果 */
.typing {
  position: relative;
  display: inline-block;
  transition: all 0.3s ease;
}

.typing::after {
  content: '|';
  position: absolute;
  right: -8px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 卡片光效 */
.analysis-card {
  position: relative;
  overflow: hidden;
}

.analysis-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(var(--el-color-primary-rgb), 0.1),
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.analysis-card:hover::before {
  opacity: 1;
}

/* 图表动画 */
.analysis-chart {
  position: relative;
  transition: transform 0.3s ease;
}

.analysis-card:hover .analysis-chart {
  transform: scale(1.02);
}

/* 指标动画 */
.metric-value {
  position: relative;
  display: inline-block;
}

.metric-value::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg,
    var(--el-color-primary),
    var(--el-color-primary-light-3)
  );
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.analysis-card:hover .metric-value::before {
  transform: scaleX(1);
}

/* 特性卡片动画 */
.feature-card {
  position: relative;
  overflow: hidden;
}

.feature-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: translateX(-100%);
}

.feature-card:hover::after {
  animation: shine 1s ease-out;
}

@keyframes shine {
  to { transform: translateX(100%); }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .particle {
    display: none;
  }
  
  .analysis-card::before {
    display: none;
  }
}

/* 优化指标展示 */
.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: var(--el-bg-color-page);
  transition: all 0.3s ease;
}

.metric-trend {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-top: 4px;
}

.metric-trend.up {
  color: #67c23a;
  background: rgba(103, 194, 58, 0.1);
}

.metric-trend.down {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.1);
}

/* 优化图表容器 */
.analysis-chart {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.analysis-chart.is-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: var(--el-bg-color-page);
}

/* 优化卡片内容布局 */
.card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  position: relative;
  padding-bottom: 16px;
}

.card-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg,
    var(--el-border-color-light),
    transparent
  );
}

/* 响应式优化 */
@media (max-width: 768px) {
  .metric-item {
    padding: 8px;
  }
  
  .metric-trend {
    font-size: 11px;
    padding: 1px 6px;
  }
  
  .analysis-chart {
    min-height: 160px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .card-desc,
  .metric-label,
  .feature-content p {
    color: #a3a6ad;
  }

  .feature-content h4 {
    color: #e5eaf3;
  }

  .header-icon,
  .feature-icon {
    background: linear-gradient(135deg,
      rgba(64, 158, 255, 0.2),
      rgba(54, 207, 201, 0.2)
    );
  }
}
</style> 