<template>
  <div class="news-list" ref="newsListRef">
    <div 
      class="read-progress-bar" 
      :style="{ width: `${readProgress}%` }"
    ></div>


    <div 
      v-for="(item, index) in newsList" 
      :key="item.id"
      class="news-item tech-enhanced"
      :class="{ 'is-expanded': expandedId === item.id }"
      :style="{ '--delay': `${index * 0.05}s` }"
      :data-id="item.id"
    >
      <div class="tech-border"></div>
      <div class="tech-glow"></div>
      <div class="content-wrapper">
        <div class="news-cover" v-if="item.cover">
          <el-image 
            :src="item.cover" 
            fit="cover"
            loading="lazy"
            @click="handleNewsClick(item)"
          >
            <template #placeholder>
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>

        <div class="news-content">
          <div class="news-header">
            <h3 class="news-title" @click="handleNewsClick(item)">
              {{ item.title }}
              <span 
                v-if="item.verified" 
                class="verified-badge"
                :class="item.verifiedType || ''"
                :title="getVerifiedText(item.verifiedType || '')"
              >
                <el-icon><Check /></el-icon>
              </span>
            </h3>
        <div class="news-meta">
              <span class="news-time">
                <el-icon><Timer /></el-icon>
                {{ formatTime(item.publishTime) }}
          </span>
              <span class="news-source" v-if="item.source">
                <el-icon><Link /></el-icon>
                {{ item.source }}
                <span 
                  v-if="item.sourceVerified" 
                  class="source-badge"
                  :class="item.sourceType"
                >
                  {{ getSourceBadgeText(item.sourceType) }}
                </span>
          </span>
        </div>
        </div>

          <p class="news-summary">{{ item.summary }}</p>
          
          <div class="news-footer">
            <div class="news-tags">
              <el-tag 
                v-for="tag in item.tags" 
                :key="tag"
                size="small"
                :type="getTagType(tag) as 'success' | 'warning' | 'info' | 'primary' | 'danger'"
                effect="light"
              >{{ tag }}</el-tag>
          </div>
          </div>
        </div>
      </div>

      <div class="news-actions-wrapper">
        <div class="news-actions">
          <el-button 
            class="action-btn like-btn"
            :class="{ 'is-active': item.isLiked }"
            @click="handleLike(item)"
            type="primary" 
            text
          >
            <el-icon><Star /></el-icon>
            <span>{{ formatNumber(item.likes) }}</span>
          </el-button>
          <el-button 
            class="action-btn comment-btn"
            @click="handleComment(item)"
            type="info"
            text
          >
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ formatNumber(item.comments) }}</span>
          </el-button>
          <el-button 
            class="action-btn share-btn"
            @click="handleShare(item)"
            type="info"
            text
          >
            <el-icon><Share /></el-icon>
            <span>分享</span>
          </el-button>
        </div>
      </div>

      <div 
        class="expand-trigger"
        @click="toggleExpand(item.id)"
      ></div>
    </div>

    <div class="load-more">
      <el-button 
        type="primary" 
        @click="loadMoreNews"
        v-loading="isLoading"
      >
        加载更多
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Picture, Timer, Link, Star, ChatDotRound, Share, Check, Document, Refresh } from '@element-plus/icons-vue'

// 模拟数据
const newsList = ref([
  {
    id: 1,
    title: '重要突破：AI在医疗诊断领域取得新进展',
    summary: '最新研究显示，人工智能在医疗诊断方面的准确率已超过90%，这一突破将为医疗行业带来革命性变化。专家表示，AI辅助诊断系统将大大提高医疗效率和准确性。',
    cover: 'https://picsum.photos/800/600?random=1',
    publishTime: new Date(2024, 0, 15),
    source: '科技日报',
    tags: ['AI', '医疗', '科技创新'],
    likes: 1234,
    comments: 89,
    isLiked: false,
    verified: true,
    verifiedType: 'official',
    sourceVerified: true,
    sourceType: 'government'
  },
  {
    id: 2,
    title: '全球首个量子计算机网络成功搭建',
    summary: '科学家们成功构建了首个跨洲际量子计算机网络，这一突破性进展将为未来量子互联网奠定基础。该网络已实现稳定的量子信息传输。',
    cover: 'https://picsum.photos/800/600?random=2',
    publishTime: new Date(2024, 0, 14, 15, 30),
    source: '量子科技周刊',
    tags: ['量子计算', '网络技术', '前沿科技'],
    likes: 856,
    comments: 142,
    isLiked: false,
    verified: true,
    verifiedType: 'expert',
    sourceVerified: true,
    sourceType: 'research'
  },
  {
    id: 3,
    title: '新研究：AI模型在法律文件分析中表现优异',
    summary: '最新研究表明，人工智能在法律文件分析和案例检索方面的能力已经接近专业律师水平。这项技术有望显著提高法律工作效率。',
    cover: 'https://picsum.photos/800/600?random=3',
    publishTime: new Date(2024, 0, 14, 9, 15),
    source: '法律科技报道',
    tags: ['AI', '法律科技', '效率提升'],
    likes: 567,
    comments: 73,
    isLiked: false,
    verified: false,
    sourceVerified: false,
    sourceType: ''
  },
  {
    id: 4,
    title: '突破性发现：新型AI算法大幅降低能耗',
    summary: '研究人员开发出新型AI训练算法，能够在保持模型性能的同时将能耗降低40%。这一发现对于绿色计算具有重要意义。',
    cover: 'https://picsum.photos/800/600?random=4',
    publishTime: new Date(2024, 0, 13, 14, 20),
    source: '环保科技网',
    tags: ['AI', '节能减排', '绿色计算'],
    likes: 923,
    comments: 156,
    isLiked: false,
    verified: false,
    sourceVerified: false,
    sourceType: ''
  },
  {
    id: 5,
    title: 'AI辅助教育系统显著提升学习效果',
    summary: '一项为期一年的研究显示，采用AI辅助教育系统的学生学习成绩平均提升了25%。该系统能够为每个学生提供个性化的学习方案。',
    cover: 'https://picsum.photos/800/600?random=5',
    publishTime: new Date(2024, 0, 13, 10, 45),
    source: '教育创新报',
    tags: ['AI', '教育科技', '个性化学习'],
    likes: 1102,
    comments: 245,
    isLiked: false,
    verified: false,
    sourceVerified: false,
    sourceType: ''
  },
  {
    id: 6,
    title: '新一代自然语言处理模型突破性能极限',
    summary: '研究团队发布新一代NLP模型，在多项基准测试中创下新纪录。该模型在理解和生成人类语言方面展现出前所未有的能力。',
    cover: 'https://picsum.photos/800/600?random=6',
    publishTime: new Date(2024, 0, 12, 16, 30),
    source: 'AI前沿快报',
    tags: ['AI', 'NLP', '技术突破'],
    likes: 1567,
    comments: 312,
    isLiked: false,
    verified: false,
    sourceVerified: false,
    sourceType: ''
  },
  {
    id: 7,
    title: 'AI艺术创作引发版权争议',
    summary: '随着AI艺术创作工具的普及，艺术界就AI生成作品的版权归属问题展开激烈讨论。多个国家开始着手制定相关法规。',
    cover: 'https://picsum.photos/800/600?random=7',
    publishTime: new Date(2024, 0, 12, 9, 20),
    source: '艺术科技报',
    tags: ['AI艺术', '版权法', '争议焦点'],
    likes: 892,
    comments: 467,
    isLiked: false,
    verified: false,
    sourceVerified: false,
    sourceType: ''
  },
  {
    id: 8,
    title: 'AI安全研究取得重要进展',
    summary: '网络安全专家开发出新的AI防御系统，能够有效预防和抵御针对AI系统的恶意攻击。该技术已在多个领域开始试点应用。',
    cover: 'https://picsum.photos/800/600?random=8',
    publishTime: new Date(2024, 0, 11, 14, 15),
    source: '网络安全周刊',
    tags: ['AI安全', '网络防御', '技术创新'],
    likes: 734,
    comments: 128,
    isLiked: false,
    verified: false,
    sourceVerified: false,
    sourceType: ''
  }
])

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 转换为分钟
  const minutes = Math.floor(diff / 1000 / 60)
  
  if (minutes < 60) {
    return `${minutes} 分钟前`
  }
  
  // 转换为小时
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} 小时前`
  }
  
  // 转换为天
  const days = Math.floor(hours / 24)
  if (days < 30) {
    return `${days} 天前`
  }
  
  // 转换为月
  const months = Math.floor(days / 30)
  if (months < 12) {
    return `${months} 个月前`
  }
  
  // 转换为年
  const years = Math.floor(months / 12)
  return `${years} 年前`
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const getTagType = (tag: string) => {
  const tagTypes: Record<string, string> = {
    'AI': 'primary',
    '医疗': 'success',
    '科技创新': 'warning'
  }
  return tagTypes[tag] || 'info'
}

const handleNewsClick = (item: any) => {
  console.log('Navigate to news detail:', item.id)
  // 添加点击动画类
  const newsItems = document.querySelectorAll('.news-item')
  newsItems.forEach(newsItem => {
    if ((newsItem as HTMLElement).dataset.id === item.id.toString()) {
      newsItem.classList.add('news-item-clicked')
    } else {
      newsItem.classList.add('news-item-fade')
    }
  })
  
  // 延迟后跳转或执行其他操作
  setTimeout(() => {
    // TODO: 在这里添加跳转逻辑
    newsItems.forEach(newsItem => {
      newsItem.classList.remove('news-item-clicked', 'news-item-fade')
    })
  }, 300)
}

const handleLike = (item: any) => {
  console.log('Like clicked')
  item.isLiked = !item.isLiked
  item.likes += item.isLiked ? 1 : -1
}

const handleComment = (item: any) => {
  console.log('Comment clicked')
  // TODO: 实现评论对话框
}

const handleShare = async (item: any) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: item.title,
        text: item.summary,
        url: window.location.href
      })
    } catch (err) {
      console.error('分享失败:', err)
    }
  } else {
    // 降级处理：复制链接
    const shareUrl = window.location.href
    await navigator.clipboard.writeText(shareUrl)
    ElMessage.success('链接已复制到剪贴板')
  }
}

const getVerifiedText = (type: string) => {
  const texts = {
    official: '官方认证',
    media: '媒体认证',
    expert: '专家认证'
  }
  return texts[type as keyof typeof texts] || '已认证'
}

const getSourceBadgeText = (type: string) => {
  const texts = {
    government: '政府机构',
    media: '官方媒体',
    research: '研究机构'
  }
  return texts[type as keyof typeof texts] || '认证来源'
}

// 修复鼠标跟随效果的实现
onMounted(() => {
  const items = document.querySelectorAll('.news-item')
  
  items.forEach((item, index) => {
    const element = item as HTMLElement
    element.style.setProperty('--index', index.toString())
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      element.style.setProperty('--mouse-x', `${x}px`)
      element.style.setProperty('--mouse-y', `${y}px`)
    }

    element.addEventListener('mousemove', handleMouseMove)

    // 可选：添加清理函数
    onUnmounted(() => {
      element.removeEventListener('mousemove', handleMouseMove)
    })
  })
})

const newsListRef = ref<HTMLElement | null>(null)

// 添加无限滚动加载功能
const isLoading = ref(false)
const loadMoreNews = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const moreNews = [
      {
        id: newsList.value.length + 1,
        title: '新的AI突破: ' + new Date().toLocaleString(),
        summary: '这是一条新加载的新闻内容...',
        cover: `https://picsum.photos/800/600?random=${newsList.value.length + 1}`,
        publishTime: new Date(),
        source: 'AI日报',
        tags: ['AI', '技术创新'],
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        isLiked: false,
        verified: Math.random() > 0.5,
        verifiedType: 'official',
        sourceVerified: Math.random() > 0.5,
        sourceType: 'media'
      }
    ]
    
    newsList.value.push(...moreNews)
  } finally {
    isLoading.value = false
  }
}

// 添加触底加载
const handleScroll = () => {
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  if (scrollTop + windowHeight >= documentHeight - 100 && !isLoading.value) {
    loadMoreNews()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 添加新闻阅读进度追踪
const readProgress = ref(0)
onMounted(() => {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY
    const maxHeight = document.documentElement.scrollHeight - window.innerHeight
    readProgress.value = (scrolled / maxHeight) * 100
  })
})

// 跟踪当前展开的新闻ID
const expandedId = ref<number | null>(null)

// 切换展开状态
const toggleExpand = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<style scoped>
.news-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  animation: newsAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation-fill-mode: both;
  animation-delay: var(--delay);
  position: relative;
  transform-origin: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.news-item:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.95);
}

.news-item:active {
  transform: translateY(-2px) scale(0.99);
}

.news-cover {
  flex: 0 0 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.news-cover :deep(.el-image) {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.news-item:hover .news-cover :deep(.el-image) {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
}

.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.news-title {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
  color: var(--el-text-color-primary);
  transition: color 0.3s ease;
  letter-spacing: -0.5px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(
    90deg,
    var(--el-text-color-primary) 0%,
    var(--el-color-primary) 50%,
    var(--el-text-color-primary) 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  transition: all 0.4s ease;
}

.news-item:hover .news-title {
  background-position: 100% 0;
}

.news-meta {
  display: flex;
  gap: 16px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.news-time,
.news-source {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.news-summary {
  font-size: 15px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: 0.2px;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  position: relative;
  z-index: 2;
}

.news-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.news-actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
}

.action-btn {
  padding: 6px 12px !important;
  height: 32px !important;
  border-radius: 16px !important;
  background: var(--el-fill-color-light) !important;
  transition: all 0.3s ease !important;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 500;
  letter-spacing: 0.3px;
  overflow: hidden;
  position: relative;
}

.action-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, 
    rgba(var(--el-color-primary-rgb), 0.2),
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.action-btn:hover::before {
  opacity: 1;
}

.action-btn .el-icon {
  font-size: 16px;
  margin-right: 4px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.action-btn:hover .el-icon {
  transform: scale(1.2);
}

.action-btn span {
  font-size: 13px;
  font-weight: 600;
}

@keyframes newsAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .news-item {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .news-item:hover {
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 
      0 12px 32px rgba(0, 0, 0, 0.3),
      0 2px 6px rgba(0, 0, 0, 0.2);
  }

  .action-btn::before {
    background: radial-gradient(circle at center, 
      rgba(255, 255, 255, 0.2),
      transparent 70%
    );
  }

  .news-title {
    color: rgba(255, 255, 255, 0.9);
  }

  .news-summary {
    color: rgba(255, 255, 255, 0.7);
  }

  .news-meta {
    color: rgba(255, 255, 255, 0.6);
  }
}

/* 响应式布局 */
@media (max-width: 768px) {
.news-item {
    flex-direction: column;
    gap: 16px;
  }

  .news-cover {
    flex: none;
    width: 100%;
    height: 200px;
  }

  .news-actions {
    padding: 8px 0;
    justify-content: flex-end;
    gap: 8px;
  }

  .action-btn {
    padding: 4px 8px !important;
  }

  .news-title {
    font-size: 20px;
  }

  .news-summary {
    font-size: 14px;
  }

  .news-meta {
    font-size: 13px;
  }
}

/* 优化标签字体 */
:deep(.el-tag) {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
  padding: 0 10px;
  height: 24px;
  line-height: 24px;
  border-radius: 6px;
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.el-tag:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.news-content-wrapper {
  display: flex;
  gap: 20px;
  flex: 1;
  cursor: pointer;
}

.news-actions-wrapper {
  padding: 0 20px;
  margin-top: auto;
  position: relative;
  z-index: 10;
}

.news-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.action-btn {
  position: relative !important;
  z-index: 11 !important;
  padding: 6px 12px !important;
  height: 32px !important;
  border-radius: 16px !important;
  background: var(--el-fill-color-light) !important;
  transition: all 0.3s ease !important;
  pointer-events: auto !important;
}

.action-btn:hover {
  transform: translateY(-2px);
  background: var(--el-fill-color) !important;
}

.action-btn:active {
  transform: translateY(0);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .news-content-wrapper {
    flex-direction: column;
  }

  .news-actions-wrapper {
    padding: 12px 20px;
  }

  .news-actions {
    justify-content: flex-end;
    gap: 8px;
  }
}

/* 添加新闻项的悬浮效果 */
.news-item {
  /* ... 保持原有样式 ... */
  transform-origin: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.news-item:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.95);
}

.news-item:active {
  transform: translateY(-2px) scale(0.99);
}

/* 添加按钮的动画效果 */
.action-btn {
  /* ... 保持原有样式 ... */
  overflow: hidden;
  position: relative;
}

.action-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, 
    rgba(var(--el-color-primary-rgb), 0.2),
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.action-btn:hover::before {
  opacity: 1;
}

.action-btn .el-icon {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.action-btn:hover .el-icon {
  transform: scale(1.2);
}

/* 添加标签的动画效果 */
:deep(.el-tag) {
  /* ... 保持原有样式 ... */
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.el-tag:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 添加图片的动画效果 */
.news-cover {
  /* ... 保持原有样式 ... */
  position: relative;
}

.news-cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.news-item:hover .news-cover::after {
  transform: translateX(100%);
}

/* 添加标题的动画效果 */
.news-title {
  /* ... 保持原有样式 ... */
  background: linear-gradient(
    90deg,
    var(--el-text-color-primary) 0%,
    var(--el-color-primary) 50%,
    var(--el-text-color-primary) 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  transition: all 0.4s ease;
}

.news-item:hover .news-title {
  background-position: 100% 0;
}

/* 添加点赞动画 */
@keyframes likeAnimation {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

.like-btn.is-active .el-icon {
  animation: likeAnimation 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: var(--el-color-danger);
}

/* 添加评论按钮效果 */
.comment-btn:hover .el-icon {
  transform: scale(1.2) rotate(10deg);
}

/* 添加分享按钮效果 */
.share-btn:hover .el-icon {
  transform: scale(1.2) rotate(-45deg);
}

/* 添加加载动画 */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.loading {
  background: linear-gradient(
    90deg,
    var(--el-fill-color-light) 25%,
    var(--el-fill-color) 50%,
    var(--el-fill-color-light) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* 添加新闻卡片的进场动画 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.news-item {
  animation: slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation-fill-mode: both;
  animation-delay: calc(var(--index, 0) * 0.1s);
}

/* 优化卡片悬浮效果 */
.news-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    800px circle at var(--mouse-x) var(--mouse-y),
    rgba(var(--el-color-primary-rgb), 0.06),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: inherit;
  pointer-events: none;
}

.news-item:hover::before {
  opacity: 1;
}

/* 添加点赞按钮的弹性动画 */
@keyframes heartBeat {
  0% { transform: scale(1); }
  15% { transform: scale(1.3); }
  30% { transform: scale(0.95); }
  45% { transform: scale(1.2); }
  60% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

.like-btn.is-active {
  animation: heartBeat 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
}

/* 优化图片加载效果 */
.news-cover {
  position: relative;
  overflow: hidden;
}

.news-cover::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: shimmerEffect 2s infinite;
}

@keyframes shimmerEffect {
  to {
    transform: translateX(100%);
  }
}

/* 添加标签的弹跳效果 */
:deep(.el-tag) {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.el-tag:hover) {
  transform: translateY(-4px) rotate(2deg);
  box-shadow: 0 6px 16px rgba(var(--el-color-primary-rgb), 0.2);
}

/* 优化按钮点击效果 */
.action-btn {
  transform-origin: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.action-btn:active {
  transform: scale(0.9);
}

/* 添加评论按钮波纹效果 */
.comment-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, 
    rgba(var(--el-color-info-rgb), 0.2),
    transparent 70%
  );
  opacity: 0;
  transition: all 0.4s ease;
  border-radius: inherit;
}

.comment-btn:hover::after {
  opacity: 1;
  transform: scale(1.2);
}

/* 添加分享按钮特效 */
.share-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: conic-gradient(
    from 0deg at 50% 50%,
    transparent,
    rgba(var(--el-color-primary-rgb), 0.2),
    transparent
  );
  opacity: 0;
  transition: all 0.4s ease;
  border-radius: inherit;
}

.share-btn:hover::before {
  opacity: 1;
  transform: rotate(180deg);
}

/* 优化深色模式效果 */
@media (prefers-color-scheme: dark) {
  .news-item {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .news-item:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  }

  .news-item::before {
    background: radial-gradient(
      800px circle at var(--mouse-x) var(--mouse-y),
      rgba(255, 255, 255, 0.1),
      transparent 40%
    );
  }
}

/* 添加加载状态动画 */
.loading-skeleton {
  background: linear-gradient(
    90deg,
    var(--el-fill-color-light) 25%,
    var(--el-fill-color) 50%,
    var(--el-fill-color-light) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}

/* 添加认证标识样式 */
.verified-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin-left: 8px;
  vertical-align: middle;
  font-size: 12px;
  transition: all 0.3s ease;
}

.verified-badge:hover {
  transform: scale(1.2) rotate(360deg);
}

.verified-badge.official {
  background: linear-gradient(135deg, #1989fa, #5cadff);
  box-shadow: 0 2px 6px rgba(25, 137, 250, 0.2);
}

.verified-badge.media {
  background: linear-gradient(135deg, #67c23a, #95d475);
  box-shadow: 0 2px 6px rgba(103, 194, 58, 0.2);
}

.verified-badge.expert {
  background: linear-gradient(135deg, #ff9f43, #ffc180);
  box-shadow: 0 2px 6px rgba(255, 159, 67, 0.2);
}

.verified-badge .el-icon {
  color: white;
  font-size: 12px;
  font-weight: bold;
}

/* 来源标识样式 */
.source-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.source-badge:hover {
  transform: translateY(-2px);
}

.source-badge.government {
  background: rgba(var(--el-color-primary-rgb), 0.1);
  color: var(--el-color-primary);
}

.source-badge.media {
  background: rgba(var(--el-color-success-rgb), 0.1);
  color: var(--el-color-success);
}

.source-badge.research {
  background: rgba(var(--el-color-warning-rgb), 0.1);
  color: var(--el-color-warning);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .source-badge {
    background: rgba(255, 255, 255, 0.1);
  }

  .verified-badge {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

/* 添加动画效果 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.verified-badge {
  animation: pulse 2s infinite;
}

.verified-badge:hover {
  animation: none;
}

/* 添加标题和描述的样式 */
.section-header {
  margin: 40px 0 48px;
  text-align: center;
  position: relative;
  padding: 0 24px;
}

.section-title {
  font-size: 42px;
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%,
    var(--el-color-danger) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -1.5px;
  text-shadow: 0 2px 12px rgba(var(--el-color-primary-rgb), 0.2);
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  font-size: 36px;
  color: var(--el-color-primary);
  filter: drop-shadow(0 2px 8px rgba(var(--el-color-primary-rgb), 0.3));
}

.section-desc {
  font-size: 20px;
  color: var(--el-text-color-regular);
  font-weight: 500;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  letter-spacing: 0.5px;
}

.highlight {
  position: relative;
  color: var(--el-color-primary);
  font-weight: 600;
  padding: 0 4px;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent,
    var(--el-color-primary-light-5),
    transparent
  );
  opacity: 0.6;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.highlight:hover::after {
  transform: scaleX(1);
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .highlight {
    color: var(--el-color-primary-light-3);
  }
  
  .section-desc {
    color: rgba(255, 255, 255, 0.7);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .section-desc {
    flex-direction: column;
    gap: 8px;
  }
}

.read-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    var(--el-color-primary), 
    var(--el-color-success)
  );
  z-index: 1000;
  transition: width 0.2s ease;
}

.refresh-indicator {
  position: absolute;
  top: -60px;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  transition: transform 0.3s ease;
}

.refresh-indicator.refreshing .refresh-icon {
  animation: spin 1s linear infinite;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 优化新闻卡片动画 */
.news-item {
  will-change: transform, opacity;
  transform: translateZ(0);
}

/* 优化图片加载 */
.news-cover img {
  will-change: transform;
  backface-visibility: hidden;
}

/* 添加骨架屏动画 */
.news-skeleton {
  background: linear-gradient(
    90deg,
    var(--el-fill-color-light) 25%,
    var(--el-fill-color) 50%,
    var(--el-fill-color-light) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* 优化加载状态样式 */
.load-more {
  padding: 32px 0;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.3s forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 优化下拉刷新指示器 */
.refresh-indicator {
  position: absolute;
  top: -60px;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-100%);
}

.refresh-indicator.refreshing {
  transform: translateY(0);
}

/* 优化新闻卡片hover效果 */
.news-item {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateZ(0);
}

.news-item:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 
    0 16px 36px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.06);
}

/* 优化标签动画 */
:deep(.el-tag) {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateZ(0);
}

:deep(.el-tag:hover) {
  transform: translateY(-4px) rotate(2deg);
  box-shadow: 0 6px 16px rgba(var(--el-color-primary-rgb), 0.2);
}

/* 优化按钮动画 */
.action-btn {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

.action-btn:hover {
  transform: translateY(-2px) !important;
  background: var(--el-color-primary-light-9) !important;
}

.action-btn:active {
  transform: translateY(0) scale(0.95) !important;
}

/* 优化深色模式 */
@media (prefers-color-scheme: dark) {
  .news-item {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.2),
      0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .news-item:hover {
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 
      0 16px 36px rgba(0, 0, 0, 0.3),
      0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .refresh-indicator {
    background: rgba(0, 0, 0, 0.8);
  }
}

/* 添加加载动画 */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.loading-skeleton {
  background: linear-gradient(
    90deg,
    var(--el-fill-color-light) 25%,
    var(--el-fill-color) 50%,
    var(--el-fill-color-light) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* 添加点击动画效果 */
.news-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  will-change: transform, opacity;
}

.news-item-clicked {
  transform: scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.08);
  z-index: 2;
}

.news-item-fade {
  opacity: 0.5;
  transform: scale(0.98);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .news-item-clicked {
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 8px 16px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.12);
  }
}

/* 优化动画性能 */
.news-item {
  backface-visibility: hidden;
  perspective: 1000px;
  transform: translateZ(0);
}

/* 添加点击涟漪效果 */
.news-item::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(var(--el-color-primary-rgb), 0.2),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  border-radius: inherit;
}

.news-item:active::after {
  opacity: 1;
}

/* 新闻列表项基础样式 */
.news-item.tech-enhanced {
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 20px;
  transform-origin: center;
  will-change: transform, box-shadow;
}

/* 悬浮效果 */
.news-item.tech-enhanced:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(var(--el-color-primary-rgb), 0.1);
}

/* 展开效果 */
.news-item.tech-enhanced.is-expanded {
  transform: scale(1.02);
  box-shadow: 
    0 24px 48px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(var(--el-color-primary-rgb), 0.15);
  z-index: 10;
}

/* 展开时的边框效果 */
.news-item.tech-enhanced.is-expanded .tech-border {
  opacity: 1;
  border-width: 2px;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-danger),
    var(--el-color-warning)
  ) border-box;
}

/* 展开时的光晕效果 */
.news-item.tech-enhanced.is-expanded .tech-glow {
  opacity: 0.8;
  filter: blur(20px);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .news-item.tech-enhanced.is-expanded {
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 
      0 24px 48px rgba(0, 0, 0, 0.3),
      0 4px 12px rgba(var(--el-color-primary-rgb), 0.2);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .news-item.tech-enhanced.is-expanded {
    transform: scale(1.01);
    box-shadow: 
      0 16px 32px rgba(0, 0, 0, 0.12),
      0 3px 8px rgba(var(--el-color-primary-rgb), 0.12);
  }
}

/* 添加展开区域样式 */
.expand-area {
  position: absolute;
  inset: 0;
  z-index: 0;
  cursor: pointer;
}

/* 确保内容区域在展开区域之上 */
.content-wrapper {
  position: relative;
  z-index: 1;
}

/* 确保操作按钮在最上层 */
.news-actions {
  position: relative;
  z-index: 2;
}

/* 展开触发区域 */
.expand-trigger {
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: pointer;
}

/* 确保其他元素在触发区域上方 */
.news-cover,
.news-title,
.news-actions {
  position: relative;
  z-index: 2;
  cursor: pointer;
}

/* 新闻列表项基础样式 */
.news-item.tech-enhanced {
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 20px;
  transform-origin: center;
  will-change: transform, box-shadow;
}

/* 悬浮效果 */
.news-item.tech-enhanced:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(var(--el-color-primary-rgb), 0.1);
}

/* 展开效果 */
.news-item.tech-enhanced.is-expanded {
  transform: scale(1.02);
  box-shadow: 
    0 24px 48px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(var(--el-color-primary-rgb), 0.15);
  z-index: 10;
}
</style> 