<template>
  <div class="detection-page" v-motion-fade>
    <div class="background-decoration">
      <div class="gradient-circle circle-1"></div>
      <div class="gradient-circle circle-2"></div>
      <div class="grid-pattern"></div>
    </div>
    
    <div class="page-header" v-motion-slide-top>
      <h2>智能检测</h2>
      <p>基于深度学习的多模态新闻真实性智能检测系统</p>
    </div>

    <div class="process-section" v-motion-slide-visible>
      <div class="section-title">
        <h3>AI 检测流程</h3>
        <p>多维度数据分析与深度学习模型结合，实现高精度检测</p>
      </div>
      <div class="process-steps">
        <div class="step-connector"></div>
        <div v-for="(step, index) in processSteps" 
             :key="index" 
             class="step"
             v-motion-slide-visible
             :custom-delay="index * 100">
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-icon">
            <el-icon><component :is="step.icon" /></el-icon>
          </div>
          <div class="step-content">
            <h4>{{ step.title }}</h4>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="visualization-2d-section">
      <div class="chart-container" v-motion-slide-visible>
        <div class="chart-header">
          <h4>检测流程分析</h4>
          <el-tooltip content="展示数据处理流程和各阶段处理量">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
        <div ref="flowChartRef" class="flow-chart"></div>
      </div>
      <div class="chart-container" v-motion-slide-visible>
        <div class="chart-header">
          <h4>检测效果统计</h4>
          <el-tooltip content="不同类型内容的检测准确率统计">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
        <div ref="statsChartRef" class="stats-chart"></div>
      </div>
    </div>

    <div class="detection-types">
      <div class="section-title" v-motion-slide-visible>
        <h3>检测类型</h3>
        <p>支持多种类型的新闻内容检测分析</p>
      </div>
      <el-row :gutter="30">
        <el-col :span="8" v-for="(item, index) in detectionTypes" :key="item.type">
          <div class="detection-card" 
               v-motion-slide-visible
               :custom-delay="index * 100"
               @mouseenter="handleCardHover(index)"
               @mouseleave="handleCardLeave(index)">
            <div class="card-icon">
              <el-icon><component :is="item.icon" /></el-icon>
            </div>
            <div class="card-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <div class="card-features">
                <div v-for="(feature, index) in item.features" 
                     :key="index" 
                     class="feature-item">
                  <el-icon><Check /></el-icon>
                  <span>{{ feature }}</span>
                </div>
              </div>
              <el-button type="primary" class="start-btn">
                开始检测
                <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Document, Picture, VideoCamera, Connection, Loading, DataAnalysis, Check, QuestionFilled } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
import { useMotion } from '@vueuse/motion'

const router = useRouter()

const detectionTypes = [
  {
    type: 'text',
    title: '文本检测',
    icon: 'Document',
    description: '使用先进的NLP技术分析新闻文本真实性',
    features: [
      'BERT语义分析',
      '情感倾向识别',
      '事实一致性检查',
      '多源信息对比'
    ]
  },
  {
    type: 'image',
    title: '图像检测',
    icon: 'Picture',
    description: '运用计算机视觉技术识别图像真伪',
    features: [
      '篡改痕迹检测',
      'AI生成识别',
      '元数据分析',
      '图像溯源'
    ]
  },
  {
    type: 'video',
    title: '视频检测',
    icon: 'VideoCamera',
    description: '深度学习驱动的视频真实性分析',
    features: [
      'Deepfake识别',
      '音视频同步检测',
      '剪辑痕迹分析',
      '多帧一致性'
    ]
  }
]

const handleDetectionClick = (type: string) => {
  router.push({
    name: 'verify',
    query: { type }
  })
}

const flowChartRef = ref<HTMLElement | null>(null)
const statsChartRef = ref<HTMLElement | null>(null)
let flowChart: echarts.ECharts | null = null
let statsChart: echarts.ECharts | null = null

const processSteps = [
  {
    icon: 'Loading',
    title: '数据输入',
    description: '支持多种格式的新闻内容输入'
  },
  {
    icon: 'DataAnalysis',
    title: '特征提取',
    description: '深度学习模型提取关键特征'
  },
  {
    icon: 'Check',
    title: '真实性评估',
    description: '综合多维度数据给出评估结果'
  }
]

const handleResize = () => {
  flowChart?.resize()
  statsChart?.resize()
}

const initFlowChart = () => {
  if (!flowChartRef.value) return
  
  flowChart = echarts.init(flowChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        emphasis: {
          focus: 'adjacency'
        },
        data: [
          { name: '输入数据' },
          { name: '预处理' },
          { name: '特征提取' },
          { name: '模型分析' },
          { name: '结果输出' },
          { name: '真实' },
          { name: '可疑' },
          { name: '虚假' }
        ],
        links: [
          { source: '输入数据', target: '预处理', value: 100 },
          { source: '预处理', target: '特征提取', value: 95 },
          { source: '特征提取', target: '模型分析', value: 90 },
          { source: '模型分析', target: '结果输出', value: 85 },
          { source: '结果输出', target: '真实', value: 50 },
          { source: '结果输出', target: '可疑', value: 20 },
          { source: '结果输出', target: '虚假', value: 15 }
        ],
        lineStyle: {
          color: 'gradient',
          curveness: 0.5
        }
      }
    ]
  }
  
  flowChart.setOption(option)
}

const initStatsChart = () => {
  if (!statsChartRef.value) return
  
  statsChart = echarts.init(statsChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['文本', '图像', '视频', '多模态'],
      axisLabel: {
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '准确率 (%)'
    },
    series: [
      {
        name: '检测准确率',
        type: 'bar',
        data: [95, 92, 88, 96],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        }
      }
    ]
  }
  
  statsChart.setOption(option)
}

onMounted(() => {
  initFlowChart()
  initStatsChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  flowChart?.dispose()
  statsChart?.dispose()
  window.removeEventListener('resize', handleResize)
})

const activeCard = ref(-1)

const handleCardHover = (index: number) => {
  activeCard.value = index
}

const handleCardLeave = (index: number) => {
  activeCard.value = -1
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.detection-page {
  position: relative;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  background: transparent;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow: hidden;
}

.background-decoration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
  background: var(--el-bg-color);
}

.gradient-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.08;
}

.circle-1 {
  top: -10%;
  left: -10%;
  width: 50%;
  height: 50%;
  background: linear-gradient(45deg, 
    var(--el-color-primary-light-5), 
    var(--el-color-success-light-5)
  );
  animation: float 20s infinite alternate;
}

.circle-2 {
  bottom: -20%;
  right: -10%;
  width: 60%;
  height: 60%;
  background: linear-gradient(225deg, 
    var(--el-color-primary-light-3), 
    var(--el-color-success-light-3)
  );
  animation: float 25s infinite alternate-reverse;
}

.grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(var(--el-border-color-lighter) 1px, transparent 1px),
    linear-gradient(90deg, var(--el-border-color-lighter) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.5;
  mask-image: radial-gradient(circle at 50% 50%, black, transparent 80%);
}

@keyframes float {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20px, 20px);
  }
  100% {
    transform: translate(20px, -20px);
  }
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
  padding: 40px;
  background: var(--el-bg-color-overlay);
  backdrop-filter: blur(20px);
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
}

.page-header h2 {
  font-size: 42px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  background: linear-gradient(45deg, 
    var(--el-color-primary), 
    var(--el-color-primary-light-3)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.page-header p {
  font-size: 18px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.section-title h3 {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: 12px;
  background: linear-gradient(45deg, 
    var(--el-color-primary), 
    var(--el-color-primary-light-3)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.section-title p {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.process-steps {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  position: relative;
}

.process-steps::before {
  content: '';
  position: absolute;
  top: 40px;
  left: 60px;
  right: 60px;
  height: 2px;
  background: linear-gradient(90deg, 
    var(--el-color-primary-light-7), 
    var(--el-color-primary-light-5)
  );
  opacity: 0.3;
  z-index: 0;
}

.step {
  flex: 1;
  position: relative;
  z-index: 1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--el-color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-weight: 600;
  font-size: 16px;
}

.step-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--el-color-primary-light-8), 
    var(--el-color-primary-light-9)
  );
  box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.15);
}

.step-icon .el-icon {
  font-size: 30px;
  color: var(--el-color-primary);
}

.step-content h4 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.step-content p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.chart-header .el-icon {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  cursor: help;
}

.chart-header h4 {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--el-text-color-primary);
}

.detection-types {
  margin-top: 60px;
}

.detection-card {
  background: var(--el-bg-color);
  backdrop-filter: blur(20px);
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 30px;
  height: 100%;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detection-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 
    0 8px 24px rgba(var(--el-color-primary-rgb), 0.1),
    0 0 0 1px var(--el-border-color);
  background: var(--el-bg-color);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--el-color-primary-light-8), 
    var(--el-color-primary-light-9)
  );
  box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.15);
}

.card-icon .el-icon {
  font-size: 30px;
  color: var(--el-color-primary);
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-content h3 {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.card-content p {
  font-size: 15px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.card-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
}

.feature-item {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-regular);
}

.feature-item .el-icon {
  color: var(--el-color-success);
  font-size: 16px;
}

.start-btn {
  margin-top: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;
  height: 44px;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

@media (max-width: 768px) {
  .detection-page {
    padding: 20px;
  }

  .el-col {
    margin-bottom: 20px;
  }

  .page-header h2 {
    font-size: 32px;
  }

  .page-header p {
    font-size: 16px;
  }

  .section-title h3 {
    font-size: 28px;
  }

  .card-content h3 {
    font-size: 20px;
  }

  .gradient-circle {
    filter: blur(80px);
    opacity: 0.06;
  }
  
  .grid-pattern {
    background-size: 15px 15px;
    opacity: 0.3;
  }
}

.visualization-2d-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 40px 0;
}

.chart-container {
  background: var(--el-bg-color-overlay);
  backdrop-filter: blur(20px);
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.flow-chart,
.stats-chart {
  width: 100%;
  height: 300px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .visualization-2d-section {
    grid-template-columns: 1fr;
  }
  
  .flow-chart,
  .stats-chart {
    height: 250px;
  }
}

.step-connector {
  position: absolute;
  top: 40px;
  left: 60px;
  right: 60px;
  height: 2px;
  background: linear-gradient(90deg, 
    var(--el-color-primary-light-7), 
    var(--el-color-primary-light-5)
  );
  opacity: 0.3;
  transform: scaleX(0);
  transform-origin: left;
  animation: connector-grow 1s ease-out forwards;
}

@keyframes connector-grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.detection-card {
  position: relative;
  isolation: isolate;
}

.detection-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    var(--el-color-primary-light-5),
    var(--el-color-success-light-5)
  );
  mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.detection-card:hover::before {
  opacity: 1;
}

.card-icon,
.step-icon {
  position: relative;
  overflow: hidden;
}

.card-icon::after,
.step-icon::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.2),
    transparent 70%
  );
  transform: scale(0);
  transition: transform 0.5s ease-out;
}

.detection-card:hover .card-icon::after,
.step:hover .step-icon::after {
  transform: scale(1);
}

.start-btn {
  position: relative;
  overflow: hidden;
}

.start-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: translateX(-100%);
}

.start-btn:hover::before {
  animation: button-shine 1s ease-out;
}

@keyframes button-shine {
  to { transform: translateX(100%); }
}

.chart-container {
  position: relative;
  overflow: hidden;
}

.chart-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--x, 50%) var(--y, 50%),
    rgba(var(--el-color-primary-rgb), 0.1),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.chart-container:hover::after {
  opacity: 1;
}

@media (max-width: 768px) {
  .step-connector {
    display: none;
  }
  
  .detection-card::before {
    opacity: 0.5;
  }
}
</style> 