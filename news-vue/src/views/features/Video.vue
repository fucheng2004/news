<template>
  <div class="video-page">
    <div class="background-decoration">
      <div class="gradient-circle circle-1"></div>
      <div class="gradient-circle circle-2"></div>
      <div class="grid-pattern"></div>
    </div>

    <div class="page-header">
      <h2>视频检测</h2>
      <p>深度学习驱动的视频真实性分析系统</p>
    </div>

    <div class="analysis-grid">
      <!-- 视频分析面板 -->
      <div class="analysis-panel" v-motion-slide-visible>
        <div class="panel-header">
          <h3>视频分析</h3>
          <div class="analysis-status">
            <el-tag type="success" effect="dark">AI 分析中</el-tag>
          </div>
        </div>
        <div class="video-preview">
          <div class="preview-window">
            <div class="scan-line"></div>
            <div class="detection-boxes">
              <div v-for="box in detectionBoxes" 
                   :key="box.id"
                   class="detection-box"
                   :style="box.style">
                <div class="box-label">{{ box.label }}</div>
              </div>
            </div>
          </div>
          <div class="preview-controls">
            <div class="time-line">
              <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="control-buttons">
              <el-button-group>
                <el-button :icon="VideoPlay" @click="togglePlay"></el-button>
                <el-button :icon="VideoPause"></el-button>
                <el-button :icon="RefreshRight"></el-button>
              </el-button-group>
              <span class="time-display">00:{{ String(currentTime).padStart(2, '0') }}/02:30</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 检测结果 -->
      <div class="results-panel" v-motion-slide-visible>
        <div class="panel-header">
          <h3>检测结果</h3>
          <el-progress 
            type="circle" 
            :percentage="analysisProgress"
            :stroke-width="8"
            :width="36"
            status="success">
          </el-progress>
        </div>
        <div class="results-content">
          <div class="result-metrics">
            <div v-for="metric in metrics" 
                 :key="metric.label" 
                 class="metric-card">
              <div class="metric-value">{{ metric.value }}</div>
              <div class="metric-label">{{ metric.label }}</div>
              <el-progress 
                :percentage="metric.percentage" 
                :color="metric.color"
                :show-text="false">
              </el-progress>
            </div>
          </div>
          <div ref="chartRef" class="analysis-chart"></div>
        </div>
      </div>
    </div>

    <!-- 检测特征 -->
    <div class="features-grid">
      <div v-for="feature in features" 
           :key="feature.title"
           class="feature-card"
           v-motion-slide-visible>
        <div class="feature-icon">
          <el-icon><component :is="feature.icon" /></el-icon>
        </div>
        <div class="feature-content">
          <h4>{{ feature.title }}</h4>
          <p>{{ feature.description }}</p>
          <div class="feature-score">
            <div class="score-label">可信度</div>
            <el-progress 
              :percentage="feature.score" 
              :color="feature.color"
              :format="(val) => val + '%'">
            </el-progress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { VideoPlay, VideoPause, RefreshRight } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 模拟检测框数据
const detectionBoxes = ref([
  { id: 1, label: 'Face', style: { top: '20%', left: '30%', width: '20%', height: '25%' } },
  { id: 2, label: 'Object', style: { top: '50%', left: '40%', width: '15%', height: '20%' } }
])

// 模拟进度
const progress = ref(45)
const currentTime = ref(15)
const analysisProgress = ref(85)

// 模拟指标数据
const metrics = ref([
  { label: '真实度', value: '95.8%', percentage: 95.8, color: '#67C23A' },
  { label: '同步性', value: '92.3%', percentage: 92.3, color: '#409EFF' },
  { label: '完整性', value: '88.7%', percentage: 88.7, color: '#E6A23C' }
])

// 检测特征
const features = [
  {
    icon: 'VideoCamera',
    title: 'Deepfake检测',
    description: '基于深度学习的人脸篡改识别',
    score: 98,
    color: '#67C23A'
  },
  {
    icon: 'Timer',
    title: '音视频同步',
    description: '音频与视频的时序一致性分析',
    score: 92,
    color: '#409EFF'
  },
  {
    icon: 'Film',
    title: '剪辑分析',
    description: '视频剪辑和编辑痕迹检测',
    score: 85,
    color: '#E6A23C'
  }
]

// 图表相关
const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: 10,
      right: 10,
      bottom: 20,
      left: 30,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['0s', '30s', '60s', '90s', '120s', '150s'],
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      max: 100,
      splitLine: {
        lineStyle: { type: 'dashed' }
      }
    },
    series: [{
      type: 'line',
      data: [95, 93, 97, 94, 96, 95],
      smooth: true,
      lineStyle: {
        width: 3,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#409EFF' },
          { offset: 1, color: '#36CFC9' }
        ])
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64,158,255,0.2)' },
          { offset: 1, color: 'rgba(64,158,255,0.05)' }
        ])
      }
    }]
  }
  
  chart.setOption(option)
}

// 播放控制
const togglePlay = () => {
  // 实现播放/暂停逻辑
}

// 生命周期钩子
onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  chart?.dispose()
})
</script>

<style scoped>
/* 基础样式 */
.video-page {
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面标题 */
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

/* 分析网格 */
.analysis-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 24px;
  margin-bottom: 40px;
}

/* 视频预览 */
.video-preview {
  margin-top: 20px;
}

.preview-window {
  position: relative;
  width: 100%;
  height: 400px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #409EFF, transparent);
  animation: scan 2s linear infinite;
}

.detection-box {
  position: absolute;
  border: 2px solid #409EFF;
  border-radius: 4px;
  animation: pulse 2s infinite;
}

.box-label {
  position: absolute;
  top: -20px;
  left: 0;
  background: #409EFF;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

/* 控制栏 */
.preview-controls {
  margin-top: 16px;
}

.time-line {
  height: 4px;
  background: #E4E7ED;
  border-radius: 2px;
  margin-bottom: 12px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #409EFF, #36CFC9);
  transition: width 0.3s linear;
}

.control-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-display {
  font-family: monospace;
  color: #606266;
}

/* 结果面板 */
.results-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.result-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  text-align: center;
  padding: 16px;
  background: #F5F7FA;
  border-radius: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
}

.analysis-chart {
  height: 200px;
}

/* 特征网格 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 20px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature-icon {
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

.feature-icon .el-icon {
  font-size: 24px;
  color: #409EFF;
}

.feature-content {
  flex: 1;
}

.feature-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.feature-content p {
  color: #909399;
  margin-bottom: 16px;
  line-height: 1.6;
}

.feature-score {
  background: #F5F7FA;
  padding: 12px;
  border-radius: 8px;
}

.score-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

/* 动画 */
@keyframes scan {
  from { transform: translateY(0); }
  to { transform: translateY(400px); }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(64, 158, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(64, 158, 255, 0); }
}

/* 响应式 */
@media (max-width: 768px) {
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-window {
    height: 300px;
  }
  
  .result-metrics {
    grid-template-columns: 1fr;
  }
}
</style> 