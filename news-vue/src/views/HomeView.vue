<template>
  <div class="home-page">
    <div class="side-nav">
      <div class="nav-header">
        <el-icon><Monitor /></el-icon>
        <span class="nav-title">功能导航</span>
      </div>
      <div class="nav-items">
        <template v-for="item in navItems" :key="item.name">
          <div v-if="!item.children" 
               class="nav-item"
               @click="handleNavClick(item.route)"
               :class="{ active: currentRoute === item.route }"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span class="nav-text">{{ item.name }}</span>
            <div class="hover-effect"></div>
          </div>
          <div v-else class="nav-group">
            <div class="nav-group-title">
              <el-icon><component :is="item.icon" /></el-icon>
              <span class="nav-text">{{ item.name }}</span>
            </div>
            <div class="nav-group-items">
              <div v-for="child in item.children"
                   :key="child.name"
                   class="nav-item sub-item"
                   @click="handleNavClick(child.route)"
                   :class="{ active: currentRoute === child.route }"
              >
                <el-icon><component :is="child.icon" /></el-icon>
                <span class="nav-text">{{ child.name }}</span>
                <div class="hover-effect"></div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="main-content">
      <div class="background-animation">
        <div class="gradient-circle circle-1"></div>
        <div class="gradient-circle circle-2"></div>
        <div class="gradient-circle circle-3"></div>
        <div class="floating-shapes">
          <div v-for="i in 8" :key="i" 
            :class="['floating-shape', `shape-${i % 4 + 1}`]"
            :style="getRandomStyle(i)"
          ></div>
        </div>
        <div class="grid-overlay"></div>
      </div>

      <div class="hero-section">
        <div class="hero-content">
          <div class="hero-badge">
            <el-icon><Monitor /></el-icon>
            <span>AI 驱动</span>
            <div class="badge-pulse"></div>
          </div>
          <h1 class="hero-title">{{ title }}</h1>
          <p class="hero-subtitle">智能、快速、准确的新闻真实性检测平台</p>
          <div class="typing-text">
            <span>支持</span>
            <span class="typed-words">{{ currentTypedWord }}</span>
            <span>检测分析</span>
          </div>
          <div class="hero-features">
            <div class="feature-tag">
              <el-icon><DataLine /></el-icon>
              <span class="tag-text">多维度分析</span>
              <div class="tag-glow"></div>
            </div>
            <div class="feature-tag">
              <el-icon><Timer /></el-icon>
              <span class="tag-text">实时检测</span>
              <div class="tag-glow"></div>
            </div>
            <div class="feature-tag">
              <el-icon><TrendCharts /></el-icon>
              <span class="tag-text">可视化报告</span>
              <div class="tag-glow"></div>
            </div>
            <div class="feature-tag">
              <el-icon><VideoPlay /></el-icon>
              <span class="tag-text">视频检测</span>
              <div class="tag-glow"></div>
            </div>
          </div>
          <div class="hero-actions">
            <el-button 
              type="primary" 
              size="large" 
              class="start-btn neo-btn"
              @click="handleStartVerify"
            >
              <el-icon><Search /></el-icon>
              开始检测
              <div class="btn-glow"></div>
            </el-button>
            <el-button 
              size="large" 
              class="learn-btn"
              @click="handleLearnMore"
            >
              <el-icon><InfoFilled /></el-icon>
              了解更多
            </el-button>
          </div>
        </div>
        <div class="hero-image">
          <div class="hero-image-content">
            <svg class="ai-detection-icon" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#409EFF"/>
                  <stop offset="100%" style="stop-color:#67C23A"/>
                </linearGradient>
              </defs>
              <g fill="url(#iconGradient)">
                <path d="M100 20c-44.183 0-80 35.817-80 80s35.817 80 80 80 80-35.817 80-80-35.817-80-80-80zm0 140c-33.137 0-60-26.863-60-60s26.863-60 60-60 60 26.863 60 60-26.863 60-60 60z"/>
                <circle cx="100" cy="100" r="40"/>
                <path d="M150 70l-60 60M70 70l60 60" stroke="white" stroke-width="10"/>
              </g>
            </svg>
            <div class="ai-text">AI News Detection</div>
          </div>
          <div class="image-decoration">
            <div class="deco-circle"></div>
            <div class="deco-line"></div>
            <div class="floating-elements">
              <div v-for="n in 3" :key="n" class="float-element"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="cta-section">
        <div class="cta-content">
          <h2>开始使用</h2>
          <p>立即体验智能新闻检测服务</p>
          <el-button 
            type="primary" 
            size="large" 
            @click="handleStartVerify"
            class="start-btn neo-btn"
          >
            <el-icon><Search /></el-icon>
            免费开始使用
            <div class="btn-glow"></div>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, InfoFilled, Monitor, DataLine, Timer, VideoPlay, TrendCharts, HomeFilled, Document, Setting } from '@element-plus/icons-vue'
import { ROUTE_NAMES, APP_NAME } from '@/config/constants'
import { useIntervalFn } from '@vueuse/core'
import * as echarts from 'echarts'
import 'echarts-gl'

const router = useRouter()
const route = useRoute()
const title = ref(APP_NAME)

const words = ['文本', '图片', '视频', '多模态']
const currentTypedWord = ref(words[0])

// 打字效果
useIntervalFn(() => {
  const currentIndex = words.indexOf(currentTypedWord.value)
  currentTypedWord.value = words[(currentIndex + 1) % words.length]
}, 2000)


// 生成随机样式
const getRandomStyle = (index: number) => {
  return {
    '--delay': `${index * 0.5}s`,
    '--duration': `${10 + index * 2}s`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`
  }
}


// 导航处理函数
const handleStartVerify = () => {
  router.push({ name: ROUTE_NAMES.VERIFY })
}

const handleLearnMore = () => {
  router.push({ 
    name: ROUTE_NAMES.ABOUT,
    replace: true
  })
}

const navItems = [
  { name: '首页', icon: HomeFilled, route: '/' },
  { name: '开始检测', icon: Search, route: '/verify' },
  { 
    name: '主要功能',
    icon: Monitor,
    children: [
      { name: '智能检测', icon: Search, route: '/features/detection' },
      { name: '多维分析', icon: DataLine, route: '/features/analysis' },
      { name: '实时检测', icon: Timer, route: '/features/realtime' },
      { name: '视频检测', icon: VideoPlay, route: '/features/video' }
    ]
  },
  { name: '检测历史', icon: Document, route: '/history' },
  { name: '关于我们', icon: InfoFilled, route: '/about' },
  { name: '系统设置', icon: Setting, route: '/settings' }
]

const currentRoute = computed(() => route.path)

const handleNavClick = (path: string) => {
  router.push(path)
}

const chartRef = ref(null)
let chart: echarts.ECharts | null = null

// 初始化图表数据
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  
  const option = {
    backgroundColor: 'transparent',
    globe: {
      baseTexture: '/earth.jpg',
      heightTexture: '/depth.jpg',
      environment: '/star.jpg',
      shading: 'realistic',
      realisticMaterial: {
        roughness: 0.2,
        metalness: 0
      },
      viewControl: {
        autoRotate: true,
        autoRotateSpeed: 10,
        distance: 150
      },
      light: {
        main: {
          intensity: 2,
          shadow: true
        },
        ambient: {
          intensity: 0.3
        }
      }
    },
    series: [{
      type: 'scatter3D',
      coordinateSystem: 'globe',
      blendMode: 'lighter',
      symbolSize: 10,
      itemStyle: {
        color: '#409EFF',
        opacity: 0.8
      },
      data: [
        { value: [116.46, 39.92, 0], name: '北京' },
        { value: [121.47, 31.23, 0], name: '上海' },
        { value: [114.07, 22.62, 0], name: '深圳' },
        // 可以添加更多数据点
      ]
    }]
  }
  
  chart.setOption(option)
}

// 处理窗口大小变化
const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.home-page {
  padding: 40px;
  max-width: 1440px;
  margin: 0 auto;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.gradient-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.circle-1 {
  top: -10%;
  left: -10%;
  width: 50%;
  height: 50%;
  background: linear-gradient(45deg, rgba(64,158,255,0.1), rgba(103,194,58,0.1));
  animation: float 20s infinite alternate;
}

.circle-2 {
  bottom: -20%;
  right: -10%;
  width: 60%;
  height: 60%;
  background: linear-gradient(45deg, rgba(230,162,60,0.1), rgba(245,108,108,0.1));
  animation: float 25s infinite alternate-reverse;
}

.hero-section {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  padding: 20px 0;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(103, 194, 58, 0.1));
  border-radius: 20px;
  margin-bottom: 24px;
  font-size: 14px;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 16px 0;
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  position: relative;
  display: inline-block;
}

.hero-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--el-color-primary), transparent);
  transform-origin: left;
  animation: lineGrow 1.5s ease-out forwards;
}

@keyframes lineGrow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.hero-subtitle {
  font-size: 22px;
  font-weight: 400;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.hero-features {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin: 20px 0;
  animation: fadeIn 1s ease-out 0.5s both;
}

.hero-actions {
  display: flex;
  gap: 20px;
  margin-top: 32px;
  animation: fadeIn 1s ease-out 1s both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.start-btn,
.learn-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 32px;
  height: 48px;
  font-size: 16px;
  border-radius: 24px;
  transition: all 0.3s ease;
}

.start-btn {
  background: linear-gradient(45deg, var(--el-color-primary), #36cfc9);
  border: none;
  position: relative;
  overflow: hidden;
}

.start-btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
  transform: scale(0);
  transition: transform 0.5s ease-out;
}

.start-btn:hover::before {
  transform: scale(1);
}

.learn-btn {
  border: 2px solid var(--el-border-color);
}

.learn-btn:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.hero-image {
  position: relative;
  flex: 1;
  width: 100%;
  max-width: 700px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.ai-detection-icon {
  width: 200px;
  height: 200px;
  animation: iconFloat 6s ease-in-out infinite, iconRotate 20s linear infinite;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
}

@keyframes iconRotate {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
}

.ai-text {
  font-size: 32px;
  font-weight: bold;
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  animation: textPulse 2s ease-in-out infinite;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 0.02em;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes textPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.image-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  width: 300px;
  height: 300px;
  border: 2px dashed var(--el-color-primary-light-5);
  border-radius: 50%;
  animation: rotate 20s linear infinite;
}

.deco-line {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid var(--el-color-primary-light-8);
  border-radius: 20px;
  animation: pulse 2s ease-in-out infinite;
}

.floating-elements .float-element {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--el-color-primary-light-3);
  border-radius: 50%;
  animation: floatElement 4s ease-in-out infinite;
}

.float-element:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
.float-element:nth-child(2) { top: 60%; right: 20%; animation-delay: 1s; }
.float-element:nth-child(3) { bottom: 20%; left: 40%; animation-delay: 2s; }

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes floatElement {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -20px); }
}

@media (max-width: 768px) {
  .home-page {
    padding: 16px;
  }

  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 20px 0;
  }

  .hero-title {
    font-size: 42px;
  }

  .hero-features {
    justify-content: center;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-image {
    height: 250px;
    margin-top: 40px;
  }
  
  .ai-detection-icon {
    width: 150px;
    height: 150px;
  }
  
  .ai-text {
    font-size: 24px;
  }
}

.cta-section {
  text-align: center;
  padding: 60px 40px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(103, 194, 58, 0.1));
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.cta-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.cta-content h2 {
  font-size: 42px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cta-content p {
  font-size: 18px;
  color: var(--el-text-color-secondary);
  margin-bottom: 32px;
}

.tech-labels {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1;
}

.tech-label {
  padding: 8px 16px;
  background: rgba(255,255,255,0.95);
  border-radius: 4px;
  font-size: 14px;
  color: var(--color);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
  transform: translateX(100%);
  animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: var(--delay);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.tech-label:hover {
  transform: translateX(-5px) !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.tech-label .el-icon {
  font-size: 18px;
}

.label-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.2),
    transparent
  );
  transform: translateX(-100%);
  animation: labelGlow 3s infinite;
}

@keyframes labelGlow {
  100% { transform: translateX(100%); }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.side-nav {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 200px;
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  z-index: 100;
  padding: 20px 0;
  transition: all 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.nav-header {
  padding: 0 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-header .el-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

.nav-title {
  font-size: 16px;
  font-weight: bold;
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  color: transparent;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.nav-item .el-icon {
  font-size: 18px;
  color: var(--el-text-color-regular);
  transition: all 0.3s ease;
}

.nav-text {
  color: var(--el-text-color-regular);
  transition: all 0.3s ease;
}

.hover-effect {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: linear-gradient(90deg, 
    var(--el-color-primary-light-8), 
    transparent
  );
  transition: all 0.3s ease;
  opacity: 0;
}

.nav-item:hover .hover-effect,
.nav-item.active .hover-effect {
  width: 100%;
  opacity: 0.2;
}

.nav-item:hover .el-icon,
.nav-item.active .el-icon {
  color: var(--el-color-primary);
}

.nav-item:hover .nav-text,
.nav-item.active .nav-text {
  color: var(--el-color-primary);
}

.main-content {
  margin-left: 200px;
  min-height: 100vh;
  position: relative;
  padding: 20px;
  background: 
    linear-gradient(135deg, rgba(64, 158, 255, 0.05), rgba(103, 194, 58, 0.05)),
    radial-gradient(circle at top right, rgba(64, 158, 255, 0.1), transparent 70%),
    radial-gradient(circle at bottom left, rgba(103, 194, 58, 0.1), transparent 70%);
}

@media (max-width: 768px) {
  .side-nav {
    width: 60px;
  }

  .nav-title,
  .nav-text {
    display: none;
  }

  .nav-item {
    padding: 12px;
    justify-content: center;
  }

  .main-content {
    margin-left: 60px;
  }
}

.nav-group {
  margin: 8px 0;
}

.nav-group-title {
  padding: 8px 20px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nav-group-items {
  margin-left: 12px;
}

.sub-item {
  padding: 8px 20px 8px 28px;
  font-size: 14px;
  position: relative;
  overflow: hidden;
}

.sub-item .el-icon {
  font-size: 16px;
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.sub-item .nav-text {
  font-weight: 500;
  letter-spacing: 0.01em;
}

.sub-item:hover .nav-text,
.sub-item.active .nav-text {
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.sub-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 28px;
  right: 20px;
  height: 1px;
  background: linear-gradient(90deg, var(--el-color-primary-light-5), transparent);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: left;
}

.sub-item:hover::after,
.sub-item.active::after {
  transform: scaleX(1);
}

.nav-group-items .hover-effect {
  background: linear-gradient(90deg, 
    var(--el-color-primary-light-9), 
    transparent
  );
}

.feature-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255,255,255,0.9);
  border-radius: 12px;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-tag::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2), 
    rgba(255, 255, 255, 0.05)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-tag:hover::before {
  opacity: 1;
}

.tag-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-color-primary);
  letter-spacing: 0.02em;
}

/* 为不同功能设置不同的主题色 */
.feature-tag:nth-child(1) {
  border-color: rgba(64, 158, 255, 0.2);
}

.feature-tag:nth-child(1) .tag-text,
.feature-tag:nth-child(1) .el-icon {
  color: var(--el-color-primary);
}

.feature-tag:nth-child(2) {
  border-color: rgba(103, 194, 58, 0.2);
}

.feature-tag:nth-child(2) .tag-text,
.feature-tag:nth-child(2) .el-icon {
  color: var(--el-color-success);
}

.feature-tag:nth-child(3) {
  border-color: rgba(230, 162, 60, 0.2);
}

.feature-tag:nth-child(3) .tag-text,
.feature-tag:nth-child(3) .el-icon {
  color: var(--el-color-warning);
}

.feature-tag:nth-child(4) {
  border-color: rgba(245, 108, 108, 0.2);
}

.feature-tag:nth-child(4) .tag-text,
.feature-tag:nth-child(4) .el-icon {
  color: var(--el-color-danger);
}

.feature-tag:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  background: rgba(255, 255, 255, 0.95);
}

.feature-tag .el-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.tag-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.3),
    transparent
  );
  transform: translateX(-100%);
  animation: tagGlow 3s infinite;
  opacity: 0.5;
}

.feature-tag:hover .tag-glow {
  opacity: 0.8;
}

.feature-tag:hover .el-icon {
  transform: scale(1.1) rotate(10deg);
}

.typing-text {
  font-size: 28px;
  font-weight: 500;
  margin: 20px 0;
  color: var(--el-text-color-regular);
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.typed-words {
  color: var(--el-color-primary);
  display: inline-block;
  min-width: 80px;
  font-weight: 600;
  font-size: 32px;
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  padding: 0 8px;
}

.typed-words::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--el-color-primary), transparent);
  transform-origin: left;
  animation: lineGrow 1.5s ease-out forwards;
}

.typing-text span:not(.typed-words) {
  font-weight: 500;
  color: var(--el-text-color-secondary);
}

@media (max-width: 768px) {
  .typing-text {
    font-size: 24px;
    padding: 12px;
  }
  
  .typed-words {
    font-size: 28px;
    min-width: 70px;
  }
}
</style> 