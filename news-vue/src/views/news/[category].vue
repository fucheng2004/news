<template>
  <div class="page-container">
    <!-- 添加科技感背景装饰 -->
    <div class="tech-background">
      <div class="grid-overlay"></div>
      <div class="particle-field"></div>
      <div class="glow-effects">
        <div class="glow-circle primary"></div>
        <div class="glow-circle danger"></div>
        <div class="glow-circle warning"></div>
      </div>
    </div>

    <!-- 添加背景装饰 -->
    <div class="background-decorations">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
      <div class="decoration-line line-1"></div>
      <div class="decoration-line line-2"></div>
      <div class="decoration-dots"></div>
    </div>

    <!-- 标题和搜索区域 -->
    <div class="header-section">
      <div class="brand">
        <div class="brand-decorations">
          <!-- 左侧装饰 -->
          <div class="decoration left">
            <div class="tech-circles">
              <div class="tech-circle"></div>
              <div class="tech-circle"></div>
              <div class="tech-circle"></div>
            </div>
            <div class="data-flow">
              <div class="data-line"></div>
              <div class="data-line"></div>
              <div class="data-line"></div>
              <div class="data-particles"></div>
            </div>
          </div>

          <!-- 标题 -->
          <div class="title-wrapper">
          <h1>AI识谣</h1>
          <p class="subtitle">有争议的才是有价值的</p>
            <div class="title-backdrop"></div>
          </div>

          <!-- 右侧装饰 -->
          <div class="decoration right">
            <div class="neural-network">
              <div class="nodes">
                <div class="node" v-for="i in 6" :key="i"></div>
              </div>
              <div class="connections">
                <div class="connection" v-for="i in 8" :key="i"></div>
              </div>
            </div>
            <div class="analysis-waves">
              <div class="wave" v-for="i in 3" :key="i"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="搜索AI行业资讯、热点新闻、技术动态..."
          class="search-input"
          :prefix-icon="Search"
          clearable
          @keyup.enter="handleSearch"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
        >
          <template #append>
            <el-button 
              type="primary" 
              class="search-button"
              :class="{ 'is-searching': isSearching }"
              @click="handleSearch"
              @mousedown="handleSearchButtonDown"
              @mouseup="handleSearchButtonUp"
            >
              <el-icon class="search-icon"><Search /></el-icon>
              搜索
            </el-button>
          </template>
          <template #suffix>
            <el-tooltip 
              content="高级筛选" 
              placement="bottom" 
              :show-after="500"
            >
              <el-icon 
                class="filter-icon"
                @click="showFilterDropdown = true"
              >
                <Filter />
              </el-icon>
            </el-tooltip>
          </template>
        </el-input>

        <!-- 热门搜索下拉框 -->
        <div 
          v-show="showHotNews" 
          class="hot-news-dropdown"
          @mouseenter="isHoveringDropdown = true"
          @mouseleave="isHoveringDropdown = false"
        >
          <div class="dropdown-header">
            <div class="title-wrapper">
            <span class="dropdown-title">
                <el-icon class="title-icon"><TrendCharts /></el-icon>
              热门搜索
            </span>
              <el-button 
                link 
                type="primary" 
                size="small"
                class="refresh-button"
                @click="refreshHotNews"
                :loading="refreshing"
              >
                <el-icon><Refresh /></el-icon>
                换一批
              </el-button>
            </div>
          </div>
          <div class="dropdown-content">
            <div 
              v-for="(item, index) in displayedHotNews" 
              :key="item.id"
              class="dropdown-item"
              @click="handleHotNewsClick(item)"
            >
              <span class="item-index" :class="{ 'top3': index < 3 }">
                {{ index + 1 }}
              </span>
              <div class="item-content">
                <span class="item-title">{{ item.title }}</span>
                <div class="item-meta">
                  <div class="heat-indicator">
                    <div class="heat-bar-wrapper">
                      <div 
                        class="heat-bar" 
                        :style="{ 
                          width: `${getHeatPercentage(item.views)}%`,
                          background: getHeatGradient(item.views)
                        }"
                      ></div>
                    </div>
                    <div class="heat-info">
                      <el-icon class="heat-icon"><Histogram /></el-icon>
                      <span class="heat-value">{{ formatHeat(item.views) }}</span>
                    </div>
                  </div>
                  <span class="item-views">
                    <el-icon><View /></el-icon>
                    {{ formatNumber(item.views) }}
                  </span>
                  <span class="item-trend" :class="item.trend">
                    <el-icon><ArrowUp v-if="item.trend === 'up'" /><ArrowDown v-else /></el-icon>
                    {{ item.trendValue }}
                  </span>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div class="nav-tabs-wrapper">
        <div class="nav-tabs">
          <div 
              v-for="category in newsCategories" 
              :key="category.id"
            class="nav-tab"
            :class="{ 
              'active': activeCategory === category.path,
              'with-divider': category.id !== newsCategories.length - 1
            }"
            @click="handleCategoryChange(category.path)"
          >
            <div class="tab-content">
              <el-icon class="tab-icon">
                <component :is="category.icon" />
              </el-icon>
              <span>{{ category.name }}</span>
              <el-badge 
                v-if="category.count" 
                :value="category.count" 
                :max="99"
                class="news-count"
              />
                </div>
            <div class="active-indicator"></div>
        </div>
        </div>
        </div>
      </div>

    <!-- 主要内容区域 -->
    <div class="content-section">
      <div class="content-grid">
        <!-- 左侧主内容 -->
        <div class="main-content">
          <!-- 实时资讯标题区域 -->
          <div class="section-header">
            <div class="title-group">
              <h2 class="section-title">
                <el-icon class="title-icon"><DataLine /></el-icon>
                实时资讯
              </h2>
              <div class="title-badges">
                <div class="badge">
                  <el-icon><Monitor /></el-icon>
                  实时更新
                  <div class="pulse-dot"></div>
                </div>
                <div class="badge">
                  <el-icon><Connection /></el-icon>
                  智能聚合
              </div>
                <div class="badge">
                  <el-icon><Reading /></el-icon>
                  深度解读
              </div>
              </div>
            </div>
          </div>
          
          <div class="news-list-wrapper" v-loading="loading">
              <news-list 
                :category="activeCategory"
                :sort-by="sortBy"
                :key="`${activeCategory}-${sortBy}`"
              />
            </div>
        </div>

        <!-- 分隔装饰 -->
        <div class="content-divider">
          <div class="divider-line"></div>
          <div class="divider-dot">
            <el-icon><Right /></el-icon>
          </div>
          <div class="divider-line"></div>
        </div>

        <!-- 右侧热门新闻 -->
            <div class="side-content">
          <div class="side-header">
            <div class="title-wrapper">
              <h3>
                <el-icon class="title-icon"><TrendCharts /></el-icon>
                热门推荐
              </h3>
              <div class="title-tags">
                <el-tag size="small" type="danger" class="hot-tag" effect="dark">
                        <el-icon><Timer /></el-icon>
                        实时
                      </el-tag>
                    </div>
                    </div>
                  </div>

                <div class="hot-news-list">
                  <div 
                    v-for="(item, index) in hotNewsList" 
                    :key="item.id"
                    class="hot-news-item"
                    :style="{ '--delay': `${index * 0.05}s` }"
                  >
                    <span class="hot-index" :class="{ 'top3': index < 3 }">{{ index + 1 }}</span>
                    <div class="item-content">
                      <div class="item-title">{{ item.title }}</div>
                      <div class="item-meta">
                        <span class="item-tag" :class="item.tagType" v-if="item.tag">
                          {{ item.tag }}
                        </span>
                        <span class="item-views">
                          <el-icon><View /></el-icon>
                          {{ formatNumber(item.views) }}
                        </span>
                        <span class="item-trend" :class="item.trend">
                          <el-icon><ArrowUp v-if="item.trend === 'up'" /><ArrowDown v-else /></el-icon>
                          {{ item.trendValue }}
                        </span>
                        </div>
                      </div>
                    </div>
                  </div>

          <div class="side-footer">
                  <el-button link type="primary">
                    查看更多
                    <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                  </el-button>
                </div>
                  </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { NewsCategory } from '@/types/news'
import NewsList from '@/components/news/NewsList.vue'
import { Document, Timer, View, Star, TrendCharts, DataLine, Search, Filter, Calendar, Refresh, Warning, ArrowUp, ArrowDown, Loading, More, ArrowRight, ChatDotRound, Histogram, Monitor, Connection, Reading } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activeCategory = ref(route.params.category as string || 'latest')
const sortBy = ref<'latest' | 'hot' | 'credibility'>('latest')
const searchQuery = ref('')
const searchFilter = ref('all')

const getCategoryTitle = computed(() => {
  const category = newsCategories.find(c => c.path === activeCategory.value)
  return category?.name || '最新资讯'
})

const getCategoryDescription = computed(() => {
  switch (activeCategory.value) {
    case 'latest':
      return '实时更新，第一时间获取最新资讯'
    case 'tech':
      return '关注科技前沿，把握创新动态'
    case 'finance':
      return '深度财经分析，洞察市场趋势'
    case 'society':
      return '聚焦社会热点，关注民生话题'
    default:
      return '新闻资讯，及时掌握'
  }
})

const handleCategoryChange = (path: string) => {
  activeCategory.value = path
  router.push(`/news/${path}`)
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

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  console.log('Searching for:', searchQuery.value, 'with filter:', searchFilter.value)
  showHotNews.value = false
  // TODO: 实现搜索逻辑
}

const handleSearchFilter = (command: string) => {
  searchFilter.value = command
  if (command === 'date') {
    // TODO: 显示日期选择器
  }
}

const showHotNews = ref(false)
const isHoveringDropdown = ref(false)

const refreshing = ref(false)
const autoRefresh = ref(false)

const timeRange = ref<'day' | 'week'>('day')

const hotNewsList = ref([
  {
    id: 1,
    title: '重要政策解读：最新AI监管框架发布',
    views: 125000,
    likes: 3200,
    comments: 458,
    isLiked: false,
    tag: '热门',
    tagType: 'hot',
    trend: 'up',
    trendValue: '15%'
  },
  {
    id: 2,
    title: '突发：某科技公司推出革命性AI模型',
    views: 98000,
    tag: '突发',
    tagType: 'breaking',
    trend: 'up',
    trendValue: '12%'
  },
  {
    id: 3,
    title: '深度分析：AI在医疗领域的最新突破',
    views: 85000,
    tag: '科技',
    tagType: 'tech',
    trend: 'up',
    trendValue: '8%'
  },
  {
    id: 4,
    title: 'AI安全问题引发全球关注',
    views: 75000,
    tag: '焦点',
    tagType: 'focus',
    trend: 'down',
    trendValue: '5%'
  },
  {
    id: 5,
    title: '人工智能教育应用最新进展',
    views: 62000,
    tag: '教育',
    tagType: 'edu',
    trend: 'up',
    trendValue: '10%'
  }
])

const displayedHotNews = ref(hotNewsList.value.slice(0, 10))

const refreshHotNews = async () => {
  refreshing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    displayedHotNews.value = hotNewsList.value
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
  } finally {
    refreshing.value = false
  }
}

const handleSearchBlur = () => {
  setTimeout(() => {
    if (!isHoveringDropdown.value) {
      showHotNews.value = false
    }
  }, 200)
}

const handleHotNewsClick = (news: any) => {
  searchQuery.value = news.title
  showHotNews.value = false
  handleSearch()
}

const credibilityStats = ref({
  avgScore: 85,
  todayCount: 128,
  todayIncrease: 12,
  suspiciousCount: 5
})

const credibilityLevels = ref([
  { 
    label: '高可信', 
    percentage: 45, 
    gradient: 'linear-gradient(90deg, var(--el-color-success) 0%, var(--el-color-success-light-3) 100%)',
    glow: 'radial-gradient(circle at right, var(--el-color-success-light-5), transparent 80%)'
  },
  { 
    label: '较可信', 
    percentage: 30, 
    gradient: 'linear-gradient(90deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%)',
    glow: 'radial-gradient(circle at right, var(--el-color-primary-light-5), transparent 80%)'
  },
  { 
    label: '一般', 
    percentage: 15, 
    gradient: 'linear-gradient(90deg, var(--el-color-warning) 0%, var(--el-color-warning-light-3) 100%)',
    glow: 'radial-gradient(circle at right, var(--el-color-warning-light-5), transparent 80%)'
  },
  { 
    label: '低可信', 
    percentage: 10, 
    gradient: 'linear-gradient(90deg, var(--el-color-danger) 0%, var(--el-color-danger-light-3) 100%)',
    glow: 'radial-gradient(circle at right, var(--el-color-danger-light-5), transparent 80%)'
  }
])

const getCredibilityGradient = computed(() => {
  const score = credibilityStats.value.avgScore
  if (score >= 80) {
    return {
      '0%': 'var(--el-color-success)',
      '100%': 'var(--el-color-success-light-3)'
    }
  }
  if (score >= 60) {
    return {
      '0%': 'var(--el-color-warning)',
      '100%': 'var(--el-color-warning-light-3)'
    }
  }
  return {
    '0%': 'var(--el-color-danger)',
    '100%': 'var(--el-color-danger-light-3)'
  }
})

const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 这里可以添加实际的数据加载逻辑
  } finally {
    loading.value = false
  }
}

watch([() => activeCategory.value, () => sortBy.value], () => {
  loadData()
})

onMounted(() => {
  const container = document.querySelector('.news-container')
  if (!container) return

  container.addEventListener('mousemove', (e: Event) => {
    const mouseEvent = e as MouseEvent
    const rect = container.getBoundingClientRect()
    const x = mouseEvent.clientX - rect.left
    const y = mouseEvent.clientY - rect.top
    ;(container as HTMLElement).style.setProperty('--mouse-x', `${x}px`)
    ;(container as HTMLElement).style.setProperty('--mouse-y', `${y}px`)
  })

  loadData()
})

watch(autoRefresh, (newValue) => {
  if (newValue) {
    const timer = setInterval(refreshHotNews, 30000) // 每30秒刷新一次
    onUnmounted(() => clearInterval(timer))
  }
})

const handleLike = (item: any) => {
  event?.preventDefault()
  event?.stopPropagation()
  item.isLiked = !item.isLiked
  if (item.isLiked) {
    item.likes = (item.likes || 0) + 1
  } else {
    item.likes = Math.max(0, (item.likes || 0) - 1)
  }
}

const handleComment = (item: any) => {
  event?.preventDefault()
  event?.stopPropagation()
  console.log('Open comment dialog for:', item.title)
  // TODO: 实现评论对话框
}

// 添加导航标签数据
const newsCategories = [
  { 
    id: 1, 
    name: '最新资讯', 
    path: 'latest', 
    icon: 'Timer',
    count: 12 
  },
  { 
    id: 2, 
    name: '科技新闻', 
    path: 'tech', 
    icon: 'Monitor',
    count: 8 
  },
  { 
    id: 3, 
    name: '财经新闻', 
    path: 'finance', 
    icon: 'Money',
    count: 5 
  },
  { 
    id: 4, 
    name: '社会新闻', 
    path: 'society', 
    icon: 'User',
    count: 15 
  },
  { 
    id: 5, 
    name: '国际新闻', 
    path: 'world', 
    icon: 'Globe',
    count: 7 
  }
]

// 添加路由监听
watch(
  () => route.params.category,
  (newCategory) => {
    if (newCategory) {
      activeCategory.value = newCategory as string
    }
  },
  { immediate: true }
)

// 搜索相关状态
const isSearching = ref(false)
const showFilterDropdown = ref(false)

// 搜索按钮交互处理
const handleSearchButtonDown = () => {
  isSearching.value = true
}

const handleSearchButtonUp = () => {
  setTimeout(() => {
    isSearching.value = false
  }, 200)
}

// 搜索框焦点处理
const handleSearchFocus = () => {
  showHotNews.value = true
}

// 热度相关方法
const getHeatPercentage = (views: number) => {
  const maxViews = 150000 // 设定最大基准值
  return Math.min((views / maxViews) * 100, 100)
}

const getHeatGradient = (views: number) => {
  const percentage = getHeatPercentage(views)
  if (percentage >= 80) {
    return 'linear-gradient(90deg, var(--el-color-danger) 0%, var(--el-color-danger-light-3) 100%)'
  } else if (percentage >= 50) {
    return 'linear-gradient(90deg, var(--el-color-warning) 0%, var(--el-color-warning-light-3) 100%)'
  } else {
    return 'linear-gradient(90deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%)'
  }
}

const formatHeat = (views: number) => {
  if (views >= 100000) {
    return '🔥 极热'
  } else if (views >= 50000) {
    return '📈 热门'
  } else {
    return '📊 常规'
  }
}

// 添加鼠标跟踪效果
onMounted(() => {
  const items = document.querySelectorAll('.news-item.tech-enhanced');
  items.forEach((item) => {
    item.addEventListener('mousemove', (e) => {
      const mouseEvent = e as MouseEvent;
      const rect = item.getBoundingClientRect();
      const x = ((mouseEvent.clientX - rect.left) / rect.width) * 100;
      const y = ((mouseEvent.clientY - rect.top) / rect.height) * 100;
      (item as HTMLElement).style.setProperty('--mouse-x', `${x}%`);
      (item as HTMLElement).style.setProperty('--mouse-y', `${y}%`);
    });
  });
});

// 获取标签类型
const getTagType = (tag: string) => {
  const tagTypes = {
    'AI': 'primary',
    '科技': 'success',
    '热点': 'danger',
    '争议': 'warning'
  } as Record<string, string>;
  return tagTypes[tag] || '';
};

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN', {
    hour12: false,
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 控制展开状态
const isExpanded = ref(false)

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
/* 页面容器 */
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    var(--el-color-primary-light-9) 0%, 
    var(--el-bg-color) 50%,
    var(--el-color-success-light-9) 100%
  );
  padding: 24px;
  position: relative;
  overflow: hidden;
}

/* 添加背景装饰 */
.background-decorations {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-danger)
  );
  filter: blur(50px);
  animation: floatCircle 20s infinite ease-in-out;
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  animation-delay: -5s;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  left: -50px;
  background: linear-gradient(135deg,
    var(--el-color-success),
    var(--el-color-warning)
  );
  animation-delay: -10s;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 40%;
  right: 15%;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-success)
  );
  animation-delay: -15s;
}

.decoration-line {
  position: absolute;
  background: linear-gradient(90deg,
    transparent,
    var(--el-color-primary-light-5),
    transparent
  );
  height: 1px;
  width: 100%;
  opacity: 0.1;
  animation: floatLine 15s infinite ease-in-out;
}

.line-1 {
  top: 20%;
  animation-delay: -7s;
}

.line-2 {
  bottom: 30%;
  animation-delay: -3s;
}

.decoration-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    rgba(var(--el-color-primary-rgb), 0.1) 1px,
    transparent 1px
  );
  background-size: 30px 30px;
  animation: rotateDots 120s infinite linear;
}

@keyframes floatCircle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, 20px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 40px) scale(0.9);
  }
  75% {
    transform: translate(-40px, -20px) scale(1.05);
  }
}

@keyframes floatLine {
  0%, 100% {
    transform: translateY(0) scaleX(1);
    opacity: 0.1;
  }
  50% {
    transform: translateY(20px) scaleX(0.95);
    opacity: 0.15;
  }
}

@keyframes rotateDots {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .decoration-circle {
    opacity: 0.05;
  }

  .decoration-line {
    opacity: 0.05;
  }

  .decoration-dots {
    background-image: radial-gradient(
      rgba(255, 255, 255, 0.1) 1px,
      transparent 1px
    );
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .decoration-circle {
    opacity: 0.08;
  }

  .circle-1 {
    width: 200px;
    height: 200px;
  }

  .circle-2 {
    width: 150px;
    height: 150px;
  }

  .circle-3 {
    width: 100px;
    height: 100px;
  }

  .decoration-dots {
    background-size: 20px 20px;
  }
}

/* 头部区域 */
.header-section {
  max-width: 1440px;
  margin: 0 auto 48px;
  position: relative;
  z-index: 10;
}

/* 标题样式 */
.page-title {
  text-align: center;
  padding: 48px 0;
  margin-bottom: 32px;
  position: relative;
}

.ai-title h1 {
  font-size: 52px;
  font-weight: 900;
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%,
    var(--el-color-danger) 35%,
    var(--el-color-success) 65%,
    var(--el-color-warning) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -1.5px;
  text-shadow: 
    0 2px 12px rgba(var(--el-color-primary-rgb), 0.2),
    0 4px 24px rgba(var(--el-color-danger-rgb), 0.1);
  position: relative;
  display: inline-block;
}

.ai-title h1::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg,
    transparent,
    var(--el-color-primary-light-5) 20%,
    var(--el-color-danger-light-5) 50%,
    var(--el-color-success-light-5) 80%,
    transparent
  );
  border-radius: 2px;
  opacity: 0.6;
}

.ai-title .subtitle {
  font-size: 18px;
  color: var(--el-text-color-regular);
  margin: 0;
  opacity: 0.8;
  letter-spacing: 1px;
  position: relative;
  display: inline-block;
  padding: 0 24px;
}

/* 搜索区域 */
.search-section {
  max-width: 720px;
  margin: 0 auto 32px;
  position: relative;
  z-index: 100;
}

/* 搜索框基础样式 */
:deep(.el-input__wrapper) {
  border-radius: 16px !important;
  padding: 4px 8px;
  height: 52px;
  background: linear-gradient(135deg,
    rgba(var(--el-color-primary-rgb), 0.05),
    rgba(var(--el-color-danger-rgb), 0.05)
  );
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.04),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

/* 搜索框渐变边框 */
:deep(.el-input__wrapper)::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 18px;
  padding: 2px;
  background: linear-gradient(135deg,
    var(--el-color-primary-light-5),
    var(--el-color-danger-light-5)
  );
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

/* 搜索框悬浮状态 */
:deep(.el-input__wrapper:hover) {
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}

:deep(.el-input__wrapper:hover)::before {
    opacity: 1;
}

/* 搜索框焦点状态 */
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 
    0 8px 24px rgba(var(--el-color-primary-rgb), 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
  transform: translateY(-1px);
}

/* 搜索框占位符 */
:deep(.el-input__inner::placeholder) {
  color: var(--el-text-color-secondary);
  font-size: 15px;
}

/* 搜索按钮样式 */
.search-button {
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  height: 44px !important;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-primary-light-3)
  ) !important;
  border: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
}

.search-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.2);
}

.search-button.is-searching {
  transform: scale(0.96);
  box-shadow: none;
}

.search-icon {
  font-size: 16px;
  transition: transform 0.3s ease;
}

.search-button:hover .search-icon {
  transform: scale(1.1);
}

/* 筛选图标样式 */
.filter-icon {
  font-size: 18px;
  padding: 6px;
  border-radius: 8px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-icon:hover {
  color: var(--el-color-primary);
  background: rgba(var(--el-color-primary-rgb), 0.1);
  transform: rotate(90deg);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  :deep(.el-input__wrapper) {
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.05)
    );
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .search-button {
    background: linear-gradient(135deg,
      var(--el-color-primary),
      var(--el-color-primary-dark-2)
    ) !important;
  }

  :deep(.el-input__inner::placeholder) {
    color: rgba(255, 255, 255, 0.5);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  :deep(.el-input__wrapper) {
    height: 48px;
  }

  .search-button {
    padding: 10px 20px !important;
    height: 40px !important;
    font-size: 14px !important;
  }

  :deep(.el-input__inner::placeholder) {
    font-size: 14px;
  }
}

/* 内容区域 */
.content-section {
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* 内容网格布局 */
.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 360px;
  gap: 24px;
  position: relative;
}

/* 主内容区样式 */
.main-content {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  min-height: 600px;
  transition: all 0.3s ease;
}

.main-content:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 36px rgba(0, 0, 0, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.8);
}

/* 内容头部 */
.content-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid rgba(var(--el-color-primary-rgb), 0.1);
}

.content-header h2 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%, 
    var(--el-color-primary-light-3) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
}

.content-header h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg,
    var(--el-color-primary),
    var(--el-color-danger)
  );
  border-radius: 1.5px;
  opacity: 0.8;
}

.section-desc {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  margin: 0;
}

/* 分隔装饰 */
.content-divider {
  width: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
  margin: 0 24px;
}

.divider-line {
  flex: 1;
  width: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(var(--el-color-primary-rgb), 0.2),
    transparent
  );
}

.divider-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%,
    var(--el-color-danger) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 16px 0;
  box-shadow: 
    0 0 0 4px rgba(var(--el-color-primary-rgb), 0.1),
    0 0 0 8px rgba(var(--el-color-primary-rgb), 0.05);
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.divider-dot:hover {
  transform: scale(1);
  box-shadow: 
    0 0 0 6px var(--el-bg-color),
    0 0 0 8px var(--el-color-primary-light-3);
}

/* 右侧内容区 */
.side-content {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.side-content:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 36px rgba(0, 0, 0, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.8);
}

/* 动画效果 */
@keyframes titleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .page-container {
    background: linear-gradient(135deg,
      rgba(var(--el-color-primary-rgb), 0.1) 0%,
      var(--el-bg-color-darker) 50%,
      rgba(var(--el-color-success-rgb), 0.1) 100%
    );
  }

  .main-content,
  .side-content {
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .divider-dot {
  box-shadow: 
      0 0 0 4px var(--el-bg-color-darker),
      0 0 0 6px var(--el-color-primary-light-5);
  }
}

/* 响应式布局 */
@media (max-width: 1400px) {
  .content-grid {
    grid-template-columns: minmax(0, 1fr) auto 320px;
  }
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr 280px;
  }

  .content-divider {
    display: none;
  }
}

@media (max-width: 992px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .side-content {
    margin-top: 24px;
  }

  .page-title {
    padding: 32px 0;
  }

  .ai-title h1 {
    font-size: 42px;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .header-section {
    margin-bottom: 32px;
  }

  .main-content,
  .side-content {
    padding: 24px;
  }

  .content-header h2 {
    font-size: 28px;
  }
}

/* 热门搜索样式优化 */
.dropdown-item {
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  animation: itemSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation-fill-mode: both;
  animation-delay: var(--delay);
}

.dropdown-item:hover {
  background: var(--el-color-primary-light-9);
  transform: translateX(4px);
}

.item-index {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
  transition: all 0.3s ease;
}

.item-index.top1 {
  background: linear-gradient(135deg, #ff4e50, #f9d423);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 78, 80, 0.2);
}

.item-index.top2 {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.2);
}

.item-index.top3 {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.2);
}

.item-main {
  flex: 1;
  min-width: 0;
}

.item-title {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 6px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.item-views {
  display: flex;
  align-items: center;
  gap: 4px;
}

.item-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.item-trend.up {
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.item-trend.down {
  color: var(--el-color-danger);
  background: var(--el-color-danger-light-9);
}

/* 导航标签数量标记优化 */
.news-count {
  margin-left: 6px;
}

:deep(.el-badge__content) {
  background: var(--el-color-danger);
  border: none;
  box-shadow: 0 2px 6px rgba(var(--el-color-danger-rgb), 0.2);
  font-weight: 600;
  transform: scale(0.8) translateY(-2px);
}

.nav-tab.active :deep(.el-badge__content) {
  background: var(--el-color-primary);
  box-shadow: 0 2px 6px rgba(var(--el-color-primary-rgb), 0.2);
}

@keyframes itemSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .dropdown-item:hover {
    background: rgba(var(--el-color-primary-rgb), 0.15);
  }

  .item-index {
    background: rgba(255, 255, 255, 0.1);
  }

  .item-trend.up {
    background: rgba(var(--el-color-success-rgb), 0.15);
  }

  .item-trend.down {
    background: rgba(var(--el-color-danger-rgb), 0.15);
  }
}

/* 导航标签容器优化 */
.nav-tabs-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  margin: -24px -24px 24px;
  padding: 24px;
  border-bottom: 1px solid rgba(var(--el-color-primary-rgb), 0.1);
  transition: all 0.3s ease;
}

.nav-tabs-wrapper:hover {
  background: rgba(255, 255, 255, 0.9);
}

.nav-tabs {
  display: flex;
  gap: 8px;
  background: linear-gradient(135deg,
    rgba(var(--el-color-primary-rgb), 0.05),
    rgba(var(--el-color-success-rgb), 0.05)
  );
  padding: 6px;
  border-radius: 16px;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.04),
    inset 0 0 0 1.5px rgba(255, 255, 255, 0.8);
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

/* 标签样式优化 */
.nav-tab {
  position: relative;
  flex: 1;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  background: transparent;
  user-select: none;
}

.nav-tab::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    transparent,
    rgba(var(--el-color-primary-rgb), 0.1)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-tab:hover::before {
  opacity: 1;
}

.nav-tab.active::before {
  background: linear-gradient(135deg,
    rgba(var(--el-color-primary-rgb), 0.1),
    rgba(var(--el-color-primary-rgb), 0.2)
  );
  opacity: 1;
}

.tab-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--el-text-color-regular);
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* 图标样式优化 */
.tab-icon {
  font-size: 18px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 数量标记样式优化 */
.news-count {
  margin-left: 4px;
  transform-origin: right center;
}

:deep(.el-badge__content) {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.85);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

/* 不同数量范围的样式优化 */
.nav-tab:has(.el-badge__content[class*="content"]:not(:empty)) {
  :deep(.el-badge__content) {
  background: linear-gradient(135deg,
      var(--el-color-info) 0%,
      var(--el-color-info-light-3) 100%
    );
    color: white;
  }
}

.nav-tab:has(.el-badge__content[class*="content"]:not(:empty)[class*="is-fixed"]) {
  :deep(.el-badge__content) {
    background: linear-gradient(135deg,
      var(--el-color-danger) 0%,
      var(--el-color-danger-light-3) 100%
    );
    color: white;
    animation: pulse 2s infinite;
  }
}

/* 活动状态优化 */
.nav-tab.active {
  background: linear-gradient(135deg,
    var(--el-color-primary-light-9) 0%,
    var(--el-color-success-light-9) 100%
  );
}

.nav-tab.active .tab-content {
  color: var(--el-color-primary);
  font-weight: 600;
  transform: translateY(-1px);
}

.nav-tab.active .tab-icon {
  transform: scale(1.2);
  color: var(--el-color-primary);
}

.nav-tab.active :deep(.el-badge__content) {
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%, 
    var(--el-color-primary-light-3) 100%
  );
  color: white;
  transform: scale(1);
  box-shadow: 
    0 4px 12px rgba(var(--el-color-primary-rgb), 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

/* 悬浮效果优化 */
.nav-tab:hover {
  background: rgba(var(--el-color-primary-rgb), 0.05);
}

.nav-tab:hover .tab-icon {
  transform: scale(1.2) rotate(10deg);
}

.nav-tab:hover :deep(.el-badge__content) {
  transform: scale(1.1);
}

/* 添加动画 */
@keyframes pulse {
  0% { transform: scale(0.85); }
  50% { transform: scale(1); }
  100% { transform: scale(0.85); }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .nav-tabs-wrapper {
    background: rgba(0, 0, 0, 0.85);
    border-bottom-color: rgba(255, 255, 255, 0.08);
  }

  .nav-tabs {
    background: rgba(255, 255, 255, 0.03);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.2),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .nav-tab:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .nav-tab.active {
    background: rgba(var(--el-color-primary-rgb), 0.15);
  }

  :deep(.el-badge__content) {
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .nav-tabs-wrapper {
    margin: -16px -16px 16px;
    padding: 16px;
  }

  .nav-tabs {
    padding: 4px;
    gap: 4px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    mask-image: linear-gradient(
      to right,
      transparent,
      black 10px,
      black calc(100% - 10px),
      transparent
    );
  }

  .nav-tab {
    padding: 10px 16px;
    flex: 0 0 auto;
  }

  .tab-content {
    font-size: 14px;
    gap: 6px;
  }

  .tab-icon {
    font-size: 16px;
  }
  
  :deep(.el-badge__content) {
    min-width: 18px;
    height: 18px;
    font-size: 11px;
  }
}

/* 添加点击反馈效果 */
.nav-tab {
  position: relative;
  flex: 1;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  background: transparent;
  user-select: none;
}

.nav-tab:active {
  transform: scale(0.98);
}

.nav-tab:active .tab-content {
  transform: scale(0.95);
}

/* 活动指示器动画 */
.active-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 24px;
  height: 3px;
  background: var(--el-color-primary);
  border-radius: 1.5px;
  transform: translateX(-50%) scaleX(0);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}

.nav-tab.active .active-indicator {
  transform: translateX(-50%) scaleX(1);
}

/* 点击涟漪效果 */
.nav-tab::after {
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

.nav-tab:active::after {
  opacity: 1;
}

/* 右侧热门推荐样式优化 */
.side-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(var(--el-color-primary-rgb), 0.1);
}

.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 标题文字样式 */
.side-header h3 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 28px;
  font-weight: 900;
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%,
    var(--el-color-danger) 50%,
    var(--el-color-warning) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 10px rgba(var(--el-color-primary-rgb), 0.2);
}

/* 标题图标样式 */
.title-icon {
  font-size: 20px;
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%,
    var(--el-color-danger) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 4px rgba(var(--el-color-primary-rgb), 0.3));
}

/* 热门标签样式 */
.hot-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 10px;
  height: 22px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  background: linear-gradient(135deg,
    var(--el-color-danger) 0%,
    var(--el-color-danger-light-3) 100%
  );
  box-shadow: 
    0 2px 8px rgba(var(--el-color-danger-rgb), 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.hot-tag .el-icon {
  font-size: 14px;
  margin-right: 2px;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .side-header h3 {
    text-shadow: 0 2px 10px rgba(var(--el-color-primary-rgb), 0.4);
  }

  .side-header {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .hot-tag {
  box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .side-header h3 {
    font-size: 24px;
  }

  .title-icon {
    font-size: 18px;
  }

  .hot-tag {
    height: 20px;
    font-size: 11px;
  }
}

.header-actions :deep(.el-button-group) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.header-actions :deep(.el-button) {
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  transition: all 0.3s ease;
}

.header-actions :deep(.el-button.active) {
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%,
    var(--el-color-primary-light-3) 100%
  );
  color: white;
  box-shadow: 0 2px 8px rgba(var(--el-color-primary-rgb), 0.2);
}

.hot-news-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hot-news-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.9),
    rgba(var(--el-color-primary-rgb), 0.05)
  );
  border: 1px solid rgba(var(--el-color-primary-rgb), 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  animation: slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation-fill-mode: both;
  animation-delay: var(--delay);
}

.hot-news-item:hover {
  background: rgba(var(--el-color-primary-rgb), 0.05);
  transform: translateX(8px);
}

.hot-index {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
  transition: all 0.3s ease;
}

.hot-index.top3 {
    background: linear-gradient(135deg,
    var(--el-color-danger) 0%,
    var(--el-color-danger-light-3) 100%
  );
  color: white;
  box-shadow: 0 4px 12px rgba(var(--el-color-danger-rgb), 0.2);
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.item-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.item-tag.hot {
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.item-tag.breaking {
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}

.item-tag.tech {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.item-views {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.item-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.item-trend.up {
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.item-trend.down {
  color: var(--el-color-danger);
  background: var(--el-color-danger-light-9);
}

.side-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  text-align: center;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .hot-news-item {
    background: rgba(255, 255, 255, 0.03);
  }

  .hot-news-item:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .hot-index {
    background: rgba(255, 255, 255, 0.1);
  }

  .item-tag {
    background: rgba(255, 255, 255, 0.1);
  }

  .item-trend.up {
    background: rgba(var(--el-color-success-rgb), 0.15);
  }

  .item-trend.down {
    background: rgba(var(--el-color-danger-rgb), 0.15);
  }
}

/* 热度指示器样式 */
.heat-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border-radius: 6px;
  background: var(--el-fill-color-light);
  transition: all 0.3s ease;
}

.heat-bar-wrapper {
  width: 60px;
  height: 4px;
  background: var(--el-fill-color);
  border-radius: 2px;
  overflow: hidden;
}

.heat-bar {
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.heat-bar::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 15px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

.heat-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.heat-icon {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.heat-value {
  color: var(--el-text-color-regular);
  white-space: nowrap;
}

/* 热度条动画 */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 悬浮效果 */
.dropdown-item:hover .heat-indicator {
  background: var(--el-color-primary-light-9);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .heat-indicator {
    background: rgba(255, 255, 255, 0.1);
  }

  .heat-bar-wrapper {
    background: rgba(255, 255, 255, 0.05);
  }

  .dropdown-item:hover .heat-indicator {
    background: rgba(var(--el-color-primary-rgb), 0.2);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .heat-bar-wrapper {
    width: 40px;
  }

  .heat-info {
    font-size: 11px;
  }

  .heat-icon {
  font-size: 12px;
  }
}

/* 下拉框标题区域 */
.dropdown-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-light);
  background: linear-gradient(135deg,
    rgba(var(--el-color-primary-rgb), 0.05),
    rgba(var(--el-color-danger-rgb), 0.05)
  );
  border-radius: 12px 12px 0 0;
}

.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 标题文字样式 */
.dropdown-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 800;
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%,
    var(--el-color-danger) 50%,
    var(--el-color-warning) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.3px;
  text-shadow: 0 2px 8px rgba(var(--el-color-primary-rgb), 0.2);
}

/* 标题图标样式 */
.title-icon {
  font-size: 20px;
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%,
    var(--el-color-danger) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 4px rgba(var(--el-color-primary-rgb), 0.3));
}

/* 刷新按钮样式 */
.refresh-button {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.refresh-button:hover {
  background: rgba(var(--el-color-primary-rgb), 0.1);
  transform: translateY(-1px);
}

.refresh-button:active {
    transform: translateY(0);
  }

.refresh-button .el-icon {
  font-size: 14px;
  transition: transform 0.3s ease;
}

.refresh-button:hover .el-icon {
  transform: rotate(180deg);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .dropdown-header {
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.02)
    );
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .dropdown-title {
    text-shadow: 0 2px 8px rgba(var(--el-color-primary-rgb), 0.4);
  }

  .refresh-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .dropdown-header {
    padding: 12px 16px;
  }

  .dropdown-title {
    font-size: 16px;
  }

  .title-icon {
    font-size: 18px;
  }

  .refresh-button {
    font-size: 12px;
    padding: 4px 10px;
  }
}

/* 品牌标题区域 */
.brand {
  text-align: center;
  padding: 48px 0;
  position: relative;
  overflow: hidden;
}

.brand-decorations {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

/* 标题样式优化 */
.title-wrapper {
  position: relative;
  z-index: 2;
}

.title-wrapper h1 {
  font-size: 56px;
  font-weight: 900;
  margin: 0 0 8px;
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%,
    var(--el-color-danger) 50%,
    var(--el-color-warning) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -1px;
  position: relative;
  text-shadow: 
    0 2px 15px rgba(var(--el-color-primary-rgb), 0.2),
    0 4px 30px rgba(var(--el-color-danger-rgb), 0.1);
}

.subtitle {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  margin: 0;
  letter-spacing: 1px;
  opacity: 0.8;
}

.title-backdrop {
  position: absolute;
  inset: -20px;
  background: radial-gradient(
    circle at center,
    rgba(var(--el-color-primary-rgb), 0.1) 0%,
    transparent 70%
  );
  filter: blur(20px);
  z-index: -1;
}

/* 左侧装饰优化 */
.tech-circles {
  position: relative;
  width: 120px;
  height: 60px;
}

.tech-circle {
  position: absolute;
  border-radius: 50%;
  border: 2px solid var(--el-color-primary-light-5);
  animation: techPulse 3s infinite;
}

.tech-circle:nth-child(1) {
  width: 40px;
  height: 40px;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  animation-delay: 0s;
}

.tech-circle:nth-child(2) {
  width: 30px;
  height: 30px;
  left: 30px;
  top: 0;
  animation-delay: -1s;
}

.tech-circle:nth-child(3) {
  width: 20px;
  height: 20px;
  left: 50px;
  bottom: 0;
  animation-delay: -2s;
}

.data-flow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.data-line {
  height: 2px;
  margin: 6px 0;
  background: linear-gradient(90deg,
    transparent,
    var(--el-color-primary-light-5) 50%,
    var(--el-color-primary)
  );
  animation: dataFlow 2s infinite;
  transform-origin: right;
}

.data-particles {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    var(--el-color-primary-light-5) 30%,
    transparent 70%
  );
  filter: blur(1px);
  opacity: 0.5;
  animation: particleFloat 4s infinite;
}

/* 右侧装饰优化 */
.neural-network {
  position: relative;
  width: 120px;
  height: 80px;
}

.nodes {
  position: absolute;
  inset: 0;
}

.node {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--el-color-danger);
  border-radius: 50%;
  animation: nodeGlow 2s infinite;
}

.connections {
  position: absolute;
  inset: 0;
}

.connection {
  position: absolute;
  height: 1px;
  background: linear-gradient(90deg,
    var(--el-color-danger-light-5),
    var(--el-color-danger)
  );
  animation: connectionFlow 3s infinite;
}

.analysis-waves {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.wave {
  position: absolute;
  border: 1px solid var(--el-color-warning-light-5);
  border-radius: 50%;
  animation: waveExpand 3s infinite;
}

/* 动画效果优化 */
@keyframes techPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

@keyframes dataFlow {
  0% { transform: scaleX(0); opacity: 0; }
  50% { transform: scaleX(1); opacity: 1; }
  100% { transform: scaleX(0); opacity: 0; }
}

@keyframes particleFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.2); }
}

@keyframes nodeGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--el-color-danger-rgb), 0.4); }
  50% { box-shadow: 0 0 15px 3px rgba(var(--el-color-danger-rgb), 0.2); }
}

@keyframes connectionFlow {
  0% { transform: scaleX(0); opacity: 0; }
  50% { transform: scaleX(1); opacity: 0.5; }
  100% { transform: scaleX(0); opacity: 0; }
}

@keyframes waveExpand {
  0% { width: 0; height: 0; opacity: 1; }
  100% { width: 40px; height: 40px; opacity: 0; }
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  .title-wrapper h1 {
    text-shadow: 
      0 2px 15px rgba(var(--el-color-primary-rgb), 0.4),
      0 4px 30px rgba(var(--el-color-danger-rgb), 0.2);
  }

  .title-backdrop {
    opacity: 0.15;
  }

  .tech-circle {
    border-color: rgba(var(--el-color-primary-rgb), 0.3);
  }

  .data-line {
    opacity: 0.7;
  }

  .node {
    box-shadow: 0 0 20px rgba(var(--el-color-danger-rgb), 0.4);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .brand {
    padding: 32px 0;
  }

  .brand-decorations {
    gap: 16px;
  }

  .title-wrapper h1 {
    font-size: 40px;
  }

  .subtitle {
    font-size: 14px;
  }

  .tech-circles,
  .neural-network {
    width: 80px;
  }

  .wave {
    animation: waveExpand 3s infinite;
  }

  @keyframes waveExpand {
    100% { width: 30px; height: 30px; }
  }
}

/* 科技感背景 */
.tech-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: linear-gradient(135deg,
    var(--el-bg-color) 0%,
    var(--el-color-primary-light-9) 100%
  );
}

/* 网格效果 */
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--el-color-primary-light-8) 1px, transparent 1px),
    linear-gradient(90deg, var(--el-color-primary-light-8) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.1;
  animation: gridMove 60s linear infinite;
}

/* 粒子效果 */
.particle-field {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at center,
    var(--el-color-primary-light-7) 1px,
    transparent 1px
  );
  background-size: 30px 30px;
  opacity: 0.1;
  animation: particleFloat 40s linear infinite;
}

/* 光晕效果 */
.glow-effects {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.glow-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: glowPulse 10s infinite;
}

.glow-circle.primary {
  width: 600px;
  height: 600px;
  top: -10%;
  right: -10%;
  background: var(--el-color-primary);
  animation-delay: 0s;
}

.glow-circle.danger {
  width: 500px;
  height: 500px;
  bottom: -10%;
  left: -10%;
  background: var(--el-color-danger);
  animation-delay: -3s;
}

.glow-circle.warning {
  width: 400px;
  height: 400px;
  top: 40%;
  right: 20%;
  background: var(--el-color-warning);
  animation-delay: -6s;
}

/* 卡片样式增强 */
.main-content,
.side-content {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

/* 导航栏增强 */
.nav-tabs {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
}

.nav-tab {
  position: relative;
  overflow: hidden;
}

.nav-tab::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    transparent,
    rgba(var(--el-color-primary-rgb), 0.1)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-tab:hover::before {
  opacity: 1;
}

.nav-tab.active::before {
  background: linear-gradient(135deg,
    rgba(var(--el-color-primary-rgb), 0.1),
    rgba(var(--el-color-primary-rgb), 0.2)
  );
  opacity: 1;
}

/* 动画效果 */
@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(40px, 40px);
  }
}

@keyframes particleFloat {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(30px, 30px);
  }
}

@keyframes glowPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.15;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.1;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .tech-background {
    background: linear-gradient(135deg,
      var(--el-bg-color) 0%,
      rgba(var(--el-color-primary-rgb), 0.2) 100%
    );
  }

  .grid-overlay,
  .particle-field {
    opacity: 0.05;
  }

  .glow-circle {
    opacity: 0.1;
  }

  .main-content,
  .side-content {
    background: rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .nav-tabs {
    background: rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .grid-overlay {
    background-size: 20px 20px;
  }

  .particle-field {
    background-size: 15px 15px;
  }

  .glow-circle {
    opacity: 0.1;
  }

  .glow-circle.primary {
    width: 300px;
    height: 300px;
  }

  .glow-circle.danger {
    width: 250px;
    height: 250px;
  }

  .glow-circle.warning {
    width: 200px;
    height: 200px;
  }
}

/* 新闻列表项科技感增强 */
.news-item.tech-enhanced {
  --mouse-x: 50%;
  --mouse-y: 50%;
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 20px;
  cursor: pointer;
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

/* 科技边框效果 */
.tech-border {
  position: absolute;
  inset: 0;
  border: 2px solid transparent;
  border-radius: inherit;
  background: linear-gradient(135deg,
    var(--el-color-primary-light-5),
    var(--el-color-danger-light-5)
  ) border-box;
  -webkit-mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

/* 光晕效果 */
.tech-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(var(--el-color-primary-rgb), 0.1),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.news-item.tech-enhanced:hover .tech-glow {
  opacity: 1;
}

/* 内容区域增强 */
.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 20px;
}

/* 标题增强 */
.news-title {
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-danger)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* 标签增强 */
.news-tag {
  background: linear-gradient(135deg,
    rgba(var(--el-color-primary-rgb), 0.1),
    rgba(var(--el-color-danger-rgb), 0.1)
  );
  border: 1px solid rgba(var(--el-color-primary-rgb), 0.2);
  backdrop-filter: blur(4px);
}

/* 动画效果 */
@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(40px, 40px); }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .news-item.tech-enhanced {
    background: rgba(0, 0, 0, 0.6);
  }

  .tech-border {
    opacity: 0.3;
  }

  .tech-glow {
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(var(--el-color-primary-rgb), 0.2),
      transparent 60%
    );
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .news-item.tech-enhanced {
    margin: 12px 0;
  }

  .content-wrapper {
    padding: 16px;
  }

  .news-title {
    font-size: 16px;
  }
}

/* 最新资讯列表项 */
.news-item.tech-enhanced {
  --mouse-x: 50%;
  --mouse-y: 50%;
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 20px;
}

.news-item.tech-enhanced:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(var(--el-color-primary-rgb), 0.1);
}

/* 科技感边框 */
.tech-border {
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(135deg,
    var(--el-color-primary-light-5),
    var(--el-color-danger-light-5),
    var(--el-color-warning-light-5)
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

/* 内容区域 */
.content-wrapper {
  position: relative;
  padding: 24px;
  z-index: 1;
}

/* 资讯头部样式 */
.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

/* 时间和来源标签 */
.news-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
}

.time-badge, .source-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(var(--el-color-primary-rgb), 0.1);
  color: var(--el-color-primary);
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--el-color-danger);
  animation: pulse 2s infinite;
}

/* 统计数据样式 */
.news-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(var(--el-color-primary-rgb), 0.05);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(var(--el-color-primary-rgb), 0.1);
  transform: translateY(-1px);
}

.stat-item.trend.up {
  color: var(--el-color-success);
  background: rgba(var(--el-color-success-rgb), 0.1);
}

.stat-item.trend.down {
  color: var(--el-color-danger);
  background: rgba(var(--el-color-danger-rgb), 0.1);
}

/* 标题样式 */
.news-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
  margin: 16px 0;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-danger)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* 标签样式 */
.news-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.tech-tag {
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  background: linear-gradient(135deg,
    rgba(var(--el-color-primary-rgb), 0.1),
    rgba(var(--el-color-danger-rgb), 0.1)
  );
  border: 1px solid rgba(var(--el-color-primary-rgb), 0.2);
  backdrop-filter: blur(4px);
}

/* 动画效果 */
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .news-item.tech-enhanced {
    background: rgba(0, 0, 0, 0.6);
  }

  .time-badge, .source-badge {
    background: rgba(var(--el-color-primary-rgb), 0.2);
  }

  .stat-item {
    background: rgba(255, 255, 255, 0.1);
  }

  .tech-tag {
    border-color: rgba(255, 255, 255, 0.1);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
  }

  .news-title {
    font-size: 18px;
  }

  .news-meta {
    font-size: 13px;
  }

  .stat-item {
    padding: 4px 8px;
  }
}

/* 标题区域样式 */
.section-header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(var(--el-color-primary-rgb), 0.1);
  position: relative;
}

/* 标题组样式 */
.title-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 主标题样式 */
.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 32px;
  font-weight: 900;
    background: linear-gradient(135deg,
      var(--el-color-primary) 0%,
    var(--el-color-danger) 50%,
    var(--el-color-warning) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 10px rgba(var(--el-color-primary-rgb), 0.2);
}

/* 标题图标 */
.title-icon {
  font-size: 28px;
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%,
    var(--el-color-danger) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 4px rgba(var(--el-color-primary-rgb), 0.3));
}

/* 标题徽章组 */
.title-badges {
  display: flex;
  gap: 16px;
  margin-left: 4px;
}

/* 徽章样式 */
.badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-color-primary);
  background: linear-gradient(135deg,
    rgba(var(--el-color-primary-rgb), 0.1),
    rgba(var(--el-color-danger-rgb), 0.1)
  );
  border: 1px solid rgba(var(--el-color-primary-rgb), 0.2);
  transition: all 0.3s ease;
}

.badge:hover {
  transform: translateY(-1px);
  background: linear-gradient(135deg,
    rgba(var(--el-color-primary-rgb), 0.15),
    rgba(var(--el-color-danger-rgb), 0.15)
  );
  box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.1);
}

.badge .el-icon {
  font-size: 16px;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-danger)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* 脉冲点 */
.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--el-color-danger);
  margin-left: 4px;
  animation: pulse 2s infinite;
}

/* 装饰线条 */
.section-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg,
    var(--el-color-primary),
    var(--el-color-danger)
  );
  border-radius: 1px;
}

/* 动画效果 */
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .section-title {
    text-shadow: 0 2px 10px rgba(var(--el-color-primary-rgb), 0.4);
  }

  .badge {
    background: rgba(var(--el-color-primary-rgb), 0.15);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .badge:hover {
    background: rgba(var(--el-color-primary-rgb), 0.2);
  }

  .section-header {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .section-header {
    margin-bottom: 24px;
    padding-bottom: 12px;
  }

  .section-title {
    font-size: 24px;
  }

  .title-icon {
    font-size: 22px;
  }

  .title-badges {
    gap: 8px;
    flex-wrap: wrap;
  }

  .badge {
    padding: 4px 10px;
    font-size: 12px;
  }

  .badge .el-icon {
    font-size: 14px;
  }

  .section-header::after {
    width: 60px;
  }
}
</style> 