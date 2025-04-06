<template>
  <div class="detection-features">
    <div class="section-header">
      <h2>智能检测功能</h2>
      <p>多模态新闻真实性智能检测系统</p>
    </div>
    
    <div class="features-grid">
      <div v-for="feature in features" 
           :key="feature.title" 
           class="feature-item"
           @click="handleFeatureClick(feature.type)">
        <div class="feature-icon">
          <el-icon><component :is="feature.icon" /></el-icon>
        </div>
        <div class="feature-content">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
          <ul class="feature-list">
            <li v-for="(item, index) in feature.details" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Document, PictureFilled, VideoCamera, Connection } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    icon: 'Document',
    title: '文本检测',
    type: 'text',
    description: '采用先进的自然语言处理技术，全方位分析新闻文本',
    details: [
      '基于BERT的语义分析',
      '文本情感倾向识别',
      '关键信息提取与验证',
      '多源信息交叉对比'
    ]
  },
  {
    icon: 'PictureFilled',
    title: '图像检测',
    type: 'image',
    description: '运用计算机视觉技术，精确识别图像真实性',
    details: [
      '图像篡改痕迹检测',
      'AI生成图像识别',
      '元数据完整性验证',
      '图像源追溯分析'
    ]
  },
  {
    icon: 'VideoCamera',
    title: '视频检测',
    type: 'video',
    description: '深度学习驱动的视频真实性分析系统',
    details: [
      'Deepfake视频识别',
      '音视频同步性分析',
      '视频剪辑痕迹检测',
      '多帧一致性验证'
    ]
  },
  {
    icon: 'Connection',
    title: '多模态融合',
    type: 'multimodal',
    description: '整合多维度信息，提供全面的真实性评估',
    details: [
      '跨模态信息验证',
      '多源数据关联分析',
      '综合可信度评分',
      '实时预警机制'
    ]
  }
]

const handleFeatureClick = (type: string) => {
  router.push({
    name: 'verify',
    query: { type }
  })
}
</script>

<style scoped>
.detection-features {
  padding: 60px 0;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.05), rgba(103, 194, 58, 0.05));
  border-radius: 16px;
  margin: 40px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 600;
  color: var(--el-color-primary);
  margin-bottom: 16px;
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.section-header p {
  font-size: 16px;
  color: var(--el-text-color-secondary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 0 40px;
}

.feature-item {
  background: white;
  border-radius: 12px;
  padding: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
  cursor: pointer;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--el-color-primary-light-8), var(--el-color-primary-light-9));
}

.feature-icon .el-icon {
  font-size: 30px;
  color: var(--el-color-primary);
}

.feature-content h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
}

.feature-content p {
  color: var(--el-text-color-secondary);
  margin-bottom: 16px;
  line-height: 1.6;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 8px 0;
  padding-left: 24px;
  position: relative;
  color: var(--el-text-color-regular);
  transition: all 0.3s ease;
}

.feature-list li:hover {
  color: var(--el-color-primary);
  transform: translateX(5px);
}

.feature-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--el-color-primary);
  transition: all 0.3s ease;
}

.feature-list li:hover::before {
  transform: translateY(-50%) scale(1.5);
  box-shadow: 0 0 10px var(--el-color-primary);
}

@media (max-width: 768px) {
  .detection-features {
    padding: 40px 20px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }

  .section-header h2 {
    font-size: 28px;
  }
}
</style> 