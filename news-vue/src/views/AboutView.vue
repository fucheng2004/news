<template>
  <div class="about">
    <div class="background-animation">
      <div v-for="i in 5" :key="i" class="floating-circle"></div>
      <div class="grid-background"></div>
      <div class="glow-effects">
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>
        <div class="glow glow-3"></div>
      </div>
      <div class="color-waves"></div>
      <div class="gradient-mesh"></div>
    </div>

    <div class="title-section">
      <div class="section-container">
        <div class="mega-title">
          <div class="title-glow"></div>
          <h1 class="title-text">
            <span class="word">
              <span class="letter" style="--delay: 0s">关</span>
              <span class="letter" style="--delay: 0.1s">于</span>
              <span class="letter" style="--delay: 0.2s">我</span>
              <span class="letter" style="--delay: 0.3s">们</span>
            </span>
          </h1>
          <div class="title-underline"></div>
        </div>
      </div>
    </div>

    <div class="section-container">
      <div class="hero-section">
        <div class="mission-statement">
          <div class="mission-icon">
            <el-icon><Aim /></el-icon>
          </div>
          <p class="rainbow-text">致力于打造最专业的新闻真实性检测平台</p>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="section-container">
        <el-row class="content-section" :gutter="40">
          <el-col :span="24" :lg="12" v-motion-slide-left>
            <el-card class="vision-card glass-effect feature-card">
              <template #header>
                <div class="card-header fancy-header">
                  <el-icon><View /></el-icon>
                  <span>我们的愿景</span>
                  <div class="header-line"></div>
                </div>
              </template>
              <div class="vision-content">
                <div class="vision-intro">
                  <div class="intro-icon">
                    <el-icon><Sunrise /></el-icon>
                  </div>
                  <p class="intro-text gradient-text">在信息爆炸的时代，我们希望：</p>
                </div>
                <ul class="vision-list">
                  <li v-for="(vision, index) in visions" 
                      :key="index"
                      v-motion-slide-visible
                      :delay="index * 100"
                      class="vision-item"
                  >
                    <div class="vision-icon-wrapper" :style="{ '--index': index }">
                      <el-icon><component :is="visionIcons[index]" /></el-icon>
                      <div class="icon-ring"></div>
                    </div>
                    <div class="vision-content">
                      <h4 class="vision-title">{{ visionTitles[index] }}</h4>
                      <p class="vision-desc">{{ vision }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>

          <el-col :span="24" :lg="12" v-motion-slide-right>
            <el-card class="tech-card glass-effect feature-card">
              <template #header>
                <div class="card-header fancy-header">
                  <el-icon><Monitor /></el-icon>
                  <span>技术优势</span>
                  <div class="header-line"></div>
                </div>
              </template>
              <div class="tech-intro">
                <div class="tech-intro-icon">
                  <el-icon><Connection /></el-icon>
                </div>
                <p class="tech-intro-text">
                  采用前沿技术，打造智能化新闻检测平台
                </p>
              </div>
              <div class="tech-grid">
                <div v-for="(tech, index) in technologies" 
                     :key="tech.name"
                     class="tech-item tech-card-modern"
                     v-motion-slide-visible
                     :delay="index * 150"
                >
                  <div class="tech-content">
                    <div class="tech-icon-wrapper">
                      <el-icon>
                        <component :is="tech.icon" />
                      </el-icon>
                      <div class="tech-icon-bg"></div>
                    </div>
                    <h3 class="tech-title gradient-text">{{ tech.name }}</h3>
                    <p class="tech-description">{{ tech.description }}</p>
                    <div class="tech-features">
                      <span v-for="(feature, idx) in tech.features" 
                            :key="idx" 
                            class="tech-feature"
                      >
                        {{ feature }}
                      </span>
                    </div>
                    <div class="tech-progress">
                      <div class="progress-bar" :style="{ width: tech.progress + '%' }"></div>
                      <span class="progress-text">{{ tech.progress }}% 完成度</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <div class="section-divider"></div>
        <el-row class="team-section" v-motion-fade>
          <el-col :span="24">
            <div class="team-header">
              <div class="team-title-container">
                <div class="title-glow-effect"></div>
                <h2 class="team-title">
                  <span class="title-part">核心</span>
                  <span class="title-divider">
                    <span class="divider-dot"></span>
                  </span>
                  <span class="title-part">团队</span>
                </h2>
                <div class="title-underline">
                  <div class="underline-progress"></div>
                </div>
              </div>
              <p class="team-slogan">
                <span class="slogan-text">汇聚顶尖人才</span>
                <span class="slogan-divider">·</span>
                <span class="slogan-text">共同推动技术创新</span>
              </p>
            </div>
            <div class="team-grid three-column">
              <el-card v-for="member in teamMembers" 
                      :key="member.name"
                      class="member-card glass-effect hover-float"
                      v-motion-slide-visible
              >
                <div class="member-background"></div>
                <div class="member-avatar">
                  <el-avatar 
                    :size="80" 
                    :src="member.avatar" 
                    class="glow-avatar"
                  >
                    {{ member.name.charAt(0) }}
                  </el-avatar>
                </div>
                <h3>{{ member.name }}</h3>
                <p class="member-title">{{ member.title }}</p>
                <p class="member-description">{{ member.description }}</p>
                <div class="member-expertise">
                  <div class="expertise-item" 
                       v-for="(exp, idx) in member.expertise" 
                       :key="idx"
                  >
                    <div class="expertise-label">{{ exp.name }}</div>
                    <div class="expertise-bar">
                      <div class="expertise-progress" :style="{ width: exp.level + '%' }"></div>
                    </div>
                  </div>
                </div>
                <div class="member-skills">
                  <el-tag 
                    v-for="skill in member.skills" 
                    :key="skill"
                    size="small"
                    effect="light"
                    class="skill-tag"
                  >
                    {{ skill }}
                  </el-tag>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>

        <div class="section-divider"></div>
        <el-row class="contact-section" v-motion-slide-up>
          <el-col :span="24">
            <el-card class="contact-card glass-effect">
              <template #header>
                <div class="card-header">
                  <el-icon><Message /></el-icon>
                  <span>联系我们</span>
                </div>
              </template>
              <div class="contact-content">
                <div class="contact-grid">
                  <div class="contact-item">
                    <el-icon><Location /></el-icon>
                    <div class="contact-info">
                      <h4>地址</h4>
                      <p>*******</p>
                    </div>
                  </div>
                  <div class="contact-item">
                    <el-icon><Phone /></el-icon>
                    <div class="contact-info">
                      <h4>电话</h4>
                      <p>*******</p>
                    </div>
                  </div>
                  <div class="contact-item">
                    <el-icon><Message /></el-icon>
                    <div class="contact-info">
                      <h4>邮箱</h4>
                      <p>*******</p>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {
  Aim,
  View,
  Check,
  Monitor,
  Message,
  Location,
  Phone,
  DataLine,
  Connection,
  Share,
  Cpu,
  Sunrise,
  DataAnalysis,
  TrendCharts
} from '@element-plus/icons-vue'

const visionIcons = [Aim, Connection, DataAnalysis, TrendCharts]
const visionTitles = [
  '准确可靠',
  '快速识别',
  '推动发展',
  '真实可信'
]

const visions = [
  '为用户提供准确、可靠的新闻真实性检测服务',
  '帮助用户快速识别虚假信息和不实新闻',
  '推动新闻媒体行业的健康发展',
  '构建更加真、可信的信息环境'
]

const technologies = [
  {
    name: '深度学习',
    icon: Cpu,
    description: '采用最新的深度学习算法，实现高精度的文本分析和图像识别',
    features: ['神经网络', 'AI模型', '机器学习'],
    progress: 95
  },
  {
    name: '多模态分析',
    icon: DataLine,
    description: '支持文本、图片、视频等多种形式的内容分析',
    features: ['文本分析', '图像识别', '视频处理'],
    progress: 85
  },
  {
    name: '实时检测',
    icon: Connection,
    description: '毫秒级响应，快速完成新闻真实性评估',
    features: ['高性能', '低延迟', '实时反馈'],
    progress: 90
  },
  {
    name: '知识图谱',
    icon: Share,
    description: '构建海量新闻知识库，提供准确的事实核查',
    features: ['数据挖掘', '关系分析', '智能推理'],
    progress: 80
  }
]

const teamMembers = [
  {
    name: '张三',
    title: '首席技术官',
    description: '人工智能专家，拥有多年深度学习经验',
    avatar: '',
    skills: ['深度学习', 'NLP', '计算机视觉'],
    expertise: [
      { name: '算法研发', level: 95 },
      { name: '架构设计', level: 90 },
      { name: '团队管理', level: 85 }
    ]
  },
  {
    name: '李四',
    title: '算法工程师',
    description: '自然语言处理领域专家，负责核心算法开发',
    avatar: '',
    skills: ['机器学习', '文本分析', '数据挖掘'],
    expertise: [
      { name: '算法研发', level: 90 },
      { name: '数据分析', level: 85 },
      { name: '算法优化', level: 80 }
    ]
  },
  {
    name: '王五',
    title: '产品经理',
    description: '资深产品专家，专注用户体验设计',
    avatar: '',
    skills: ['产品设计', 'UI/UX', '项目管理'],
    expertise: [
      { name: '产品设计', level: 90 },
      { name: '用户体验', level: 85 },
      { name: '项目管理', level: 80 }
    ]
  }
]

const contactForm = reactive({
  name: '',
  contact: '',
  message: ''
})
</script>

<style scoped>
.about {
  padding: 0;
  max-width: 100%;
  margin: 0;
  overflow-x: hidden;
}

.about-header {
  text-align: center;
  margin-bottom: 60px;
}

.about-header h1 {
  font-size: 3rem;
  color: var(--el-color-primary);
  margin-bottom: 20px;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--el-text-color-secondary);
}

.mission-section, .vision-section {
  padding: 30px;
  height: 100%;
  background: var(--el-bg-color-page);
  border-radius: 8px;
}

.about h2 {
  font-size: 2rem;
  color: var(--el-text-color-primary);
  margin-bottom: 20px;
}

.tech-section {
  margin: 60px 0;
  text-align: center;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 30px;
  padding: 20px;
}

.tech-item {
  padding: 30px;
  background: var(--el-bg-color);
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.tech-item:hover {
  transform: translateY(-5px);
}

.tech-icon {
  font-size: 40px;
  color: var(--el-color-primary);
  margin-bottom: 20px;
}

.team-section {
  margin: 60px 0;
  text-align: center;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 60px;
}

.team-member {
  padding: 30px;
  background: var(--el-bg-color);
  border-radius: 8px;
}

.member-title {
  color: var(--el-color-primary);
  margin: 10px 0;
}

.member-description {
  color: var(--el-text-color-secondary);
}

.contact-section {
  text-align: center;
  margin: 40px 0 80px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--el-text-color-regular);
}

@media (max-width: 768px) {
  .about-header h1 {
    font-size: 2.5rem;
  }
  
  .mission-section, .vision-section {
    margin-bottom: 20px;
  }
  
  .tech-grid, .team-grid {
    grid-template-columns: 1fr;
  }
}

.mission-statement {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
}

.mission-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

.vision-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.vision-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  padding: 12px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.vision-list li:hover {
  transform: translateX(10px);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.tech-item {
  text-align: center;
  padding: 20px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tech-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.tech-item .el-icon {
  font-size: 32px;
  color: var(--el-color-primary);
  margin-bottom: 12px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin: 40px 0;
}

.member-card {
  text-align: center;
  padding: 30px;
}

.member-avatar {
  margin-bottom: 20px;
}

.member-title {
  color: var(--el-color-primary);
  margin: 8px 0;
}

.member-description {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.contact-content {
  padding: 20px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
}

.info-item .el-icon {
  color: var(--el-color-primary);
}

@media (max-width: 768px) {
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .team-grid {
    grid-template-columns: 1fr;
  }
}

.color-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(64, 158, 255, 0.1),
    rgba(103, 194, 58, 0.1),
    rgba(230, 162, 60, 0.1)
  );
  z-index: -1;
}

.gradient-mesh {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: -1;
}

.animated-text .text-wrapper {
  position: relative;
  display: inline-block;
  padding-bottom: 0.1em;
  padding-top: 0.2em;
  overflow: hidden;
}

.animated-text .line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--el-color-primary), transparent);
  animation: line-animation 2s infinite;
}

@keyframes line-animation {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

.rainbow-text {
  background: linear-gradient(
    90deg,
    #ff0000,
    #ff7f00,
    #ffff00,
    #00ff00,
    #0000ff,
    #4b0082,
    #8f00ff
  );
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: rainbow 4s linear infinite;
}

@keyframes rainbow {
  to { background-position: 200% center; }
}

.hover-glow {
  transition: all 0.3s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.4);
  transform: translateY(-5px);
}

.hover-float {
  transition: all 0.3s ease;
}

.hover-float:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.glow-avatar {
  position: relative;
}

.glow-avatar::after {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-success));
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.member-card:hover .glow-avatar::after {
  opacity: 0.5;
}

.shine-text {
  position: relative;
  color: transparent;
  background: linear-gradient(
    90deg,
    var(--el-color-primary) 0%,
    var(--el-color-success) 50%,
    var(--el-color-primary) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shine 3s linear infinite;
  text-shadow: 
    0 0 30px rgba(64, 158, 255, 0.2),
    0 0 60px rgba(64, 158, 255, 0.1);
  padding: 10px 0;
}

@keyframes shine {
  to { background-position: 200% center; }
}

.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 8px 32px rgba(31, 38, 135, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.hero-section {
  position: relative;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  margin-bottom: 40px;
}

.title-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.title-background {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(
    circle at center,
    rgba(64, 158, 255, 0.1) 0%,
    transparent 70%
  );
  animation: rotate 20s linear infinite;
  z-index: -1;
}

.title-wrapper {
  position: relative;
  z-index: 1;
}

.fancy-title {
  margin: 0;
  padding: 0;
  font-size: 4.5rem;
  font-weight: 900;
  line-height: 1.2;
  text-transform: none;
  letter-spacing: 0.1em;
}

.title-inner {
  display: inline-block;
  background: linear-gradient(
    135deg,
    var(--el-color-primary) 0%,
    #36cfc9 25%,
    var(--el-color-success) 50%,
    #36cfc9 75%,
    var(--el-color-primary) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shine 3s linear infinite;
  text-shadow: 
    0 0 30px rgba(64, 158, 255, 0.2),
    0 0 60px rgba(64, 158, 255, 0.1);
  padding: 10px 0;
}

.char {
  display: inline-block;
  animation: float-char 3s ease-in-out infinite;
  padding: 0 5px;
  font-size: 5rem;
}

.char:nth-child(1) { animation-delay: 0s; }
.char:nth-child(2) { animation-delay: 0.1s; }
.char:nth-child(3) { animation-delay: 0.2s; }
.char:nth-child(4) { animation-delay: 0.3s; }

.title-decoration {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.line-left,
.line-right {
  height: 2px;
  width: 60px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--el-color-primary),
    transparent
  );
  animation: expandLine 2s ease-in-out infinite;
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--el-color-primary);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.title-shadow {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 20px;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.1),
    transparent 70%
  );
}

@keyframes float-char {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.member-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  padding: 40px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-5px);
}

.contact-item .el-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

.contact-info h4 {
  margin: 0 0 8px;
  color: var(--el-text-color-primary);
}

.contact-info p {
  margin: 0;
  color: var(--el-text-color-regular);
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
}

.submit-btn {
  width: 100%;
  height: 40px;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .title-section {
    padding: 20px 0;
  }
  
  .fancy-title {
    font-size: 3rem;
  }
  
  .char {
    font-size: 3.5rem;
    padding: 0 3px;
  }

  .hero-section {
    min-height: 150px;
    padding: 20px 0;
  }
}

.tech-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: var(--el-color-primary-light-9);
}

.tech-icon-wrapper .el-icon {
  font-size: 28px;
  color: var(--el-color-primary);
}

.grid-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(64, 158, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(64, 158, 255, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  animation: gridMove 20s linear infinite;
}

.glow-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.2;
}

.glow-1 {
  top: 20%;
  left: 20%;
  width: 300px;
  height: 300px;
  background: var(--el-color-primary);
  animation: glowFloat 15s ease-in-out infinite;
}

.glow-2 {
  top: 60%;
  right: 20%;
  width: 400px;
  height: 400px;
  background: var(--el-color-success);
  animation: glowFloat 20s ease-in-out infinite reverse;
}

.glow-3 {
  bottom: 10%;
  left: 30%;
  width: 350px;
  height: 350px;
  background: var(--el-color-warning);
  animation: glowFloat 18s ease-in-out infinite;
}

.floating-circle {
  position: absolute;
  background: linear-gradient(45deg, 
    rgba(64, 158, 255, 0.2), 
    rgba(103, 194, 58, 0.2)
  );
  border-radius: 50%;
  opacity: 0.15;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: float 15s infinite linear;
}

.color-waves {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 60% 30%, 
      rgba(64, 158, 255, 0.08) 0%, 
      transparent 50%
    ),
    radial-gradient(circle at 20% 70%, 
      rgba(103, 194, 58, 0.08) 0%, 
      transparent 50%
    ),
    radial-gradient(circle at 80% 60%, 
      rgba(230, 162, 60, 0.08) 0%, 
      transparent 50%
    );
  mix-blend-mode: overlay;
  animation: wave 15s infinite alternate;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(30px, 30px); }
}

@keyframes glowFloat {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-20px, 20px); }
}

@keyframes wave {
  to { background-position: 200% center; }
}

.mega-title {
  position: relative;
  text-align: center;
  padding: 40px 0;
  margin-bottom: 30px;
}

.title-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(
    circle at center,
    rgba(64, 158, 255, 0.15) 0%,
    transparent 70%
  );
  filter: blur(20px);
  animation: pulse-glow 3s ease-in-out infinite;
}

.title-text {
  position: relative;
  font-size: 6rem;
  font-weight: 900;
  margin: 0;
  padding: 0;
  color: transparent;
  display: inline-block;
}

.word {
  display: inline-block;
  position: relative;
}

.letter {
  display: inline-block;
  background: linear-gradient(
    135deg,
    var(--el-color-primary) 0%,
    #36cfc9 50%,
    var(--el-color-success) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 6rem;
  padding: 0 0.1em;
  animation: float-letter 3s ease-in-out infinite;
  animation-delay: var(--delay);
  text-shadow: 
    0 0 20px rgba(64, 158, 255, 0.3),
    0 0 40px rgba(64, 158, 255, 0.2),
    0 0 60px rgba(64, 158, 255, 0.1);
}

.title-underline {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--el-color-primary),
    transparent
  );
  animation: expand-line 1.5s ease-out forwards;
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes float-letter {
  0%, 100% {
    transform: translateY(0) scale(1);
    filter: brightness(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
    filter: brightness(1.2);
  }
}

@keyframes expand-line {
  0% {
    width: 0;
    opacity: 0;
  }
  100% {
    width: 60%;
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .title-text, .letter {
    font-size: 3.5rem;
  }
  
  .mega-title {
    padding: 20px 0;
  }
  
  .title-underline {
    bottom: 15px;
  }
}

.feature-card {
  position: relative;
  overflow: hidden;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 8px 32px rgba(31, 38, 135, 0.15),
    0 2px 8px rgba(31, 38, 135, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 12px 48px rgba(31, 38, 135, 0.2),
    0 4px 12px rgba(31, 38, 135, 0.15);
}

.fancy-header {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: linear-gradient(
    135deg,
    rgba(64, 158, 255, 0.1),
    rgba(103, 194, 58, 0.1)
  );
}

.fancy-header .el-icon {
  font-size: 24px;
  color: var(--el-color-primary);
  background: rgba(64, 158, 255, 0.1);
  padding: 8px;
  border-radius: 8px;
}

.fancy-header span {
  font-size: 1.2rem;
  font-weight: 600;
  background: linear-gradient(120deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  color: transparent;
}

.header-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--el-color-primary), transparent);
}

.vision-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  margin-bottom: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.vision-item:hover {
  transform: translateX(10px);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(64, 158, 255, 0.1);
}

.vision-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(
    135deg,
    var(--el-color-primary),
    var(--el-color-success)
  );
  border-radius: 12px;
  color: white;
  position: relative;
  transition: all 0.3s ease;
  animation: pulse 2s infinite ease-in-out;
  animation-delay: calc(var(--index) * 0.2s);
}

.icon-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 14px;
  border: 2px solid var(--el-color-primary);
  opacity: 0.2;
  animation: ring-pulse 2s infinite ease-in-out;
  animation-delay: calc(var(--index) * 0.2s);
}

.vision-content {
  flex: 1;
}

.vision-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px;
  background: linear-gradient(120deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  color: transparent;
}

.vision-desc {
  margin: 0;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes ring-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.4;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.section-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-divider {
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(64, 158, 255, 0.2),
    transparent
  );
  margin: 80px 0;
}

.content-section {
  margin: 60px 0;
  display: flex;
  align-items: stretch;
}

.team-grid.three-column {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 60px;
}

.feature-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.vision-content,
.tech-content {
  flex: 1;
  padding: 30px;
}

.contact-section {
  margin: 40px 0 80px;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  padding: 40px;
}

@media (max-width: 1200px) {
  .section-container {
    padding: 0 20px;
  }

  .team-grid.three-column {
    grid-template-columns: repeat(2, 1fr);
  }

  .contact-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .team-grid.three-column,
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }

  .section-divider {
    margin: 40px 0;
  }

  .content-section {
    margin: 30px 0;
  }
}

.tech-intro {
  padding: 20px;
  margin-bottom: 30px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(103, 194, 58, 0.1));
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.tech-intro-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-success));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.tech-progress {
  margin-top: 16px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 10px;
  height: 6px;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-success));
  border-radius: 10px;
  transition: width 1s ease-in-out;
}

.progress-text {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.team-intro {
  text-align: center;
  color: var(--el-text-color-secondary);
  margin: 20px 0 40px;
  font-size: 1.1rem;
}

.member-expertise {
  margin: 20px 0;
}

.expertise-item {
  margin-bottom: 12px;
}

.expertise-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 4px;
}

.expertise-bar {
  height: 4px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.expertise-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-success));
  border-radius: 2px;
  transition: width 1s ease-in-out;
}

.skill-tag {
  transition: all 0.3s ease;
}

.skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.member-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top right, 
    rgba(64, 158, 255, 0.1),
    transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.member-card:hover .member-background {
  opacity: 1;
}

.team-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
}

.team-title-container {
  position: relative;
  display: inline-block;
  padding: 20px 40px;
}

.team-title {
  font-size: 4rem;
  font-weight: 900;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: linear-gradient(120deg, 
    var(--el-text-color-primary) 0%,
    var(--el-text-color-primary) 50%,
    var(--el-text-color-primary) 100%
  );
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 4px;
  animation: shine 3s linear infinite;
  text-shadow: 
    0 0 30px rgba(64, 158, 255, 0.2),
    0 0 60px rgba(64, 158, 255, 0.1);
}

.title-part {
  position: relative;
  display: inline-block;
}

.title-divider {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider-dot {
  width: 8px;
  height: 8px;
  background: var(--el-color-primary);
  border-radius: 50%;
  position: relative;
}

.divider-dot::before,
.divider-dot::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background: linear-gradient(90deg,
    var(--el-color-primary),
    var(--el-color-success)
  );
}

.divider-dot::before {
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.divider-dot::after {
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.title-underline {
  position: relative;
  height: 3px;
  margin-top: 20px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.underline-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    var(--el-color-primary),
    var(--el-color-success)
  );
  animation: progress 2s ease-out forwards;
  transform-origin: left;
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes progress {
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}

@keyframes shine {
  0% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
  100% { filter: brightness(1); }
}

@media (max-width: 768px) {
  .team-title {
    font-size: 2.5rem;
    gap: 10px;
  }
  
  .title-divider {
    width: 20px;
    height: 20px;
  }
  
  .divider-dot::before,
  .divider-dot::after {
    width: 10px;
  }
}

.team-slogan {
  margin: 20px 0 0;
  font-size: 1.2rem;
  color: var(--el-text-color-regular);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.slogan-text {
  position: relative;
  padding: 0 10px;
  transition: all 0.3s ease;
}

.slogan-text:hover {
  color: var(--el-color-primary);
  transform: translateY(-2px);
}

.slogan-divider {
  color: var(--el-color-primary);
  opacity: 0.6;
  animation: fade-pulse 2s ease-in-out infinite;
}

@keyframes line-pulse {
  0%, 100% { transform: scaleX(1); opacity: 0.6; }
  50% { transform: scaleX(1.2); opacity: 1; }
}

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.5); opacity: 1; }
}

@keyframes fade-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@media (max-width: 768px) {
  .team-title {
    font-size: 2.5rem;
  }
  
  .team-slogan {
    font-size: 1rem;
    flex-direction: column;
    gap: 8px;
  }
  
  .slogan-divider {
    display: none;
  }
}
</style> 