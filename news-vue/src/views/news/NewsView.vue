<template>
  <div class="page-background">
    <div class="news-container">
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="搜索新闻..."
          class="search-input"
          :prefix-icon="Search"
          clearable
          @keyup.enter="handleSearch"
          @focus="showHotNews = true"
          @blur="handleSearchBlur"
        >
          <template #append>
            <el-button type="primary" :icon="Search" @click="handleSearch">
              搜索
            </el-button>
          </template>
          <template #suffix>
            <el-dropdown trigger="click" @command="handleSearchFilter">
              <el-icon class="search-filter-icon"><Filter /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="all">全部内容</el-dropdown-item>
                  <el-dropdown-item command="title">仅标题</el-dropdown-item>
                  <el-dropdown-item command="content">仅内容</el-dropdown-item>
                  <el-dropdown-item divided command="date">
                    <el-icon><Calendar /></el-icon>
                    按日期筛选
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-input>

        <div 
          v-show="showHotNews" 
          class="hot-news-dropdown"
          @mouseenter="isHoveringDropdown = true"
          @mouseleave="isHoveringDropdown = false"
        >
          <div class="dropdown-header">
            <span class="dropdown-title">
              <el-icon><Histogram /></el-icon>
              热门搜索
            </span>
            <el-button 
              link 
              type="primary" 
              size="small"
              @click="refreshHotNews"
              :loading="refreshing"
            >
              <el-icon><Refresh /></el-icon>
              换一批
            </el-button>
          </div>
          <div class="dropdown-content">
            <div 
              v-for="(item, index) in hotNewsList" 
              :key="item.id"
              class="dropdown-item"
              @click="handleHotNewsClick(item)"
              :style="{ '--delay': `${index * 0.05}s` }"
            >
              <span class="item-index" :class="{ 
                'top1': index === 0,
                'top2': index === 1,
                'top3': index === 2
              }">{{ index + 1 }}</span>
              <span class="item-title">{{ item.title }}</span>
              <span class="item-views">
                <el-icon><View /></el-icon>
                {{ formatNumber(item.views) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="news-header">
        <div class="category-tabs">
          <el-tabs 
            v-model="activeCategory" 
            @tab-click="handleCategoryChange"
            type="border-card"
            stretch
          >
            <el-tab-pane 
              v-for="category in newsCategories" 
              :key="category.id"
              :label="category.name"
              :name="category.path"
            >
              <template #label>
                <div class="tab-label">
                  <el-icon><Document /></el-icon>
                  {{ category.name }}
                </div>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
        
        <div class="news-filters">
          <el-radio-group v-model="sortBy" size="large">
            <el-radio-button label="latest">
              <el-icon><Timer /></el-icon>最新发布
            </el-radio-button>
            <el-radio-button label="hot">
              <el-icon><View /></el-icon>最多阅读
            </el-radio-button>
            <el-radio-button label="credibility">
              <el-icon><Star /></el-icon>最高可信
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="news-content">
        <el-row :gutter="24">
          <el-col :span="16">
            <news-list 
              :category="activeCategory"
              :sort-by="sortBy"
              :key="`${activeCategory}-${sortBy}`"
            />
          </el-col>
          
          <el-col :span="8">
            <div class="side-content">
              <el-card class="hot-news" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span class="card-title">
                      <el-icon><TrendCharts /></el-icon>
                      热门新闻
                    </span>
                    <el-button text>查看更多</el-button>
                  </div>
                </template>
                <div class="hot-news-list">
                  <div v-for="i in 5" :key="i" class="hot-news-item">
                    <span class="hot-index" :class="{ 'top3': i <= 3 }">{{ i }}</span>
                    <span class="hot-title">热门新闻标题 {{ i }}</span>
                    <span class="hot-views">{{ formatNumber(Math.floor(Math.random() * 10000)) }}阅读</span>
                  </div>
                </div>
              </el-card>

              <el-card class="credibility-stats" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span class="card-title">
                      <el-icon><DataLine /></el-icon>
                      可信度分析
                    </span>
                    <el-tooltip content="实时数据" placement="top">
                      <el-tag size="small" effect="plain" type="success">
                        <el-icon><Timer /></el-icon>
                        实时
                      </el-tag>
                    </el-tooltip>
                  </div>
                </template>
                <div class="stats-content">
                  <div class="credibility-main">
                    <div class="progress-ring">
                      <el-progress 
                        type="dashboard"
                        :percentage="credibilityStats.avgScore"
                        :width="160"
                        :stroke-width="16"
                        :show-text="false"
                        :color="getProgressColor"
                      >
                        <template #default>
                          <div class="progress-content">
                            <span class="progress-value">
                              {{ credibilityStats.avgScore }}
                              <small>%</small>
                            </span>
                            <span class="progress-label">综合可信度</span>
                            <div class="progress-trend">
                              <el-icon color="var(--el-color-success)"><ArrowUp /></el-icon>
                              <span>+2.5%</span>
                              <span class="trend-period">本周</span>
                            </div>
                          </div>
                        </template>
                      </el-progress>
                    </div>
                  </div>

                  <div class="stats-details">
                    <div class="stat-row">
                      <div class="stat-item">
                        <div class="stat-header">
                          <el-icon><Document /></el-icon>
                          <span>今日新闻</span>
                        </div>
                        <div class="stat-number">{{ credibilityStats.todayCount }}</div>
                        <div class="stat-trend up">
                          <el-icon><ArrowUp /></el-icon>
                          <span>+{{ credibilityStats.todayIncrease }}%</span>
                          <span class="trend-period">较昨日</span>
                        </div>
                      </div>
                      <div class="stat-item warning">
                        <div class="stat-header">
                          <el-icon><Warning /></el-icon>
                          <span>可疑新闻</span>
                        </div>
                        <div class="stat-number">{{ credibilityStats.suspiciousCount }}</div>
                        <div class="stat-trend down">
                          <el-icon><ArrowDown /></el-icon>
                          <span>-15%</span>
                          <span class="trend-period">较上周</span>
                        </div>
                      </div>
                    </div>

                    <div class="credibility-distribution">
                      <div class="distribution-header">
                        <span>可信度分布</span>
                        <el-tooltip content="查看详情" placement="top">
                          <el-button link type="primary" size="small">
                            <el-icon><More /></el-icon>
                          </el-button>
                        </el-tooltip>
                      </div>
                      <div class="distribution-bars">
                        <div 
                          v-for="(level, index) in credibilityLevels" 
                          :key="index"
                          class="distribution-bar"
                        >
                          <div class="bar-label">{{ level.label }}</div>
                          <div class="bar-wrapper">
                            <div 
                              class="bar-fill"
                              :style="{
                                width: `${level.percentage}%`,
                                background: level.gradient
                              }"
                            >
                              <div class="bar-glow" :style="{ background: level.glow }"></div>
                            </div>
                          </div>
                          <div class="bar-value">{{ level.percentage }}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>

  <!-- 实时资讯标题区域 -->
  <div class="section-header">
    <div class="title-group">
      <h2 class="section-title">
        <el-icon class="title-icon"><DataLine /></el-icon>
        实时资讯
      </h2>
      <!-- 移除了这部分重复的徽章 -->
      <!-- <div class="title-badges">
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
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { newsCategories } from '@/types/news'
import NewsList from '@/components/news/NewsList.vue'
import { 
  Document, 
  Timer, 
  View, 
  Star, 
  Search, 
  Filter, 
  Calendar,
  Refresh,
  TrendCharts,
  DataLine,
  Warning,
  ArrowUp,
  ArrowDown,
  More,
  Histogram
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activeCategory = ref(route.params.category as string || 'latest')
const sortBy = ref<'latest' | 'hot' | 'credibility'>('latest')
const searchQuery = ref('')
const searchFilter = ref('all')
const showHotNews = ref(false)
const isHoveringDropdown = ref(false)
const refreshing = ref(false)

const hotNewsList = ref([
  { id: 1, title: '震惊！人工智能新突破引发全球关注', views: 174000 },
  { id: 2, title: '最新研究：每天喝咖啡的人更长寿', views: 158000 },
  { id: 3, title: '全球气候变化加剧，专家呼吁立即行动', views: 146000 },
  { id: 4, title: '新能源汽车市场迎来爆发性增长', views: 132000 },
  { id: 5, title: '数字经济引领未来发展新方向', views: 125000 }
])

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

const getProgressColor = (percentage: number): string => {
  if (percentage < 20) return '#f56c6c'  // 红色
  if (percentage < 40) return '#e6a23c'  // 橙色
  if (percentage < 60) return '#5cb87a'  // 绿色
  if (percentage < 80) return '#1989fa'  // 蓝色
  return '#67c23a'                       // 深绿色
}

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

const handleCategoryChange = (tab: any) => {
  router.push(`/news/${tab.props.name}`)
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  showHotNews.value = false
  console.log('搜索:', searchQuery.value)
}

const handleSearchFilter = (command: string) => {
  console.log('搜索过滤:', command)
}

const handleSearchBlur = () => {
  setTimeout(() => {
    if (!isHoveringDropdown.value) {
      showHotNews.value = false
    }
  }, 200)
}

const handleHotNewsClick = (item: any) => {
  searchQuery.value = item.title
  showHotNews.value = false
  handleSearch()
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

const refreshHotNews = () => {
  refreshing.value = true
  setTimeout(() => {
    hotNewsList.value = Array(10).fill(null).map((_, index) => {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)]
      const baseViews = 50000 + Math.floor(Math.random() * 150000)
      return {
        id: Date.now() + index,
        title: `${randomTopic}：${Math.random().toString(36).substring(2, 8)}`,
        views: baseViews - (index * 5000),
        style: {
          '--delay': `${index * 0.05}s`
        }
      }
    })
    refreshing.value = false
  }, 600)
}
</script>

<style scoped>
/* 搜索区域基础样式 */
.search-section {
  position: relative;
  margin-bottom: 24px;
  z-index: 1000;
}

.search-input {
  width: 100%;
}

/* 热门搜索下拉框基础样式 */
.hot-news-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dropdown-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-content {
  max-height: 400px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: var(--el-color-primary-light-9);
}

/* 全局字体优化 */
.news-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 
    'PingFang SC', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  letter-spacing: 0.2px;
}

/* 标题字体优化 */
.card-title {
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, 
    var(--el-text-color-primary) 0%,
    var(--el-text-color-regular) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
}

/* 热门新闻标题优化 */
.hot-title {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--el-text-color-primary);
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.hot-news-item:hover .hot-title {
  color: var(--el-color-primary);
  transform: translateX(4px);
}

/* 数字样式优化 */
.hot-views, .stat-number {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%,
    var(--el-color-primary-light-3) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* 搜索框文字优化 */
.search-input :deep(.el-input__inner) {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.search-input :deep(.el-input__inner::placeholder) {
  font-weight: 400;
  color: var(--el-text-color-placeholder);
}

/* 标签页文字优化 */
:deep(.el-tabs__item) {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

:deep(.el-tabs__item.is-active) {
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 下拉菜单文字优化 */
.dropdown-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.dropdown-title .el-icon {
  font-size: 18px;
  color: var(--el-color-danger);
  transition: transform 0.3s ease;
}

.item-title {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.dropdown-item:hover .item-title {
  color: var(--el-color-primary);
  transform: translateX(4px);
}

.item-index {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.item-index.top1 {
  background: linear-gradient(135deg, #ff4e50, #f9d423);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.item-index.top2 {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.item-index.top3 {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 热门新闻样式优化 */
.hot-news .card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg,
    var(--el-color-danger) 0%,
    var(--el-color-danger-light-3) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hot-news-item {
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.hot-news-item .hot-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin: 0 8px;
  transition: all 0.3s ease;
}

.hot-news-item:hover .hot-title {
  color: var(--el-color-primary);
  transform: translateX(4px);
}

.hot-news-item .hot-views {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.hot-news-item:hover .hot-views {
  color: var(--el-color-primary);
}

.hot-news-item .hot-index {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  transition: all 0.3s ease;
}

.hot-news-item .hot-index.top3 {
  background: linear-gradient(135deg, #ff4e50, #f9d423);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 统计标签优化 */
.stat-header {
  font-size: 15px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  letter-spacing: 0.3px;
}

.stat-trend {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  font-weight: 500;
}

.trend-period {
  font-size: 13px;
  font-weight: 400;
  color: var(--el-text-color-secondary);
}

/* 分布图文字优化 */
.bar-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  letter-spacing: 0.2px;
}

.bar-value {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.2px;
}

/* 响应式字体优化 */
@media (max-width: 768px) {
  .card-title {
    font-size: 16px;
  }

  .hot-title {
    font-size: 14px;
  }

  .stat-number {
    font-size: 28px;
  }

  .dropdown-title {
    font-size: 15px;
  }

  :deep(.el-tabs__item) {
    font-size: 14px;
  }

  .dropdown-title,
  .hot-news .card-title {
    font-size: 15px;
  }

  .item-title,
  .hot-news-item .hot-title {
    font-size: 13px;
  }

  .item-index,
  .hot-news-item .hot-index {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }

  .hot-news-item .hot-views {
    font-size: 12px;
  }
}

/* 可信度分析卡片样式优化 */
.credibility-stats {
  margin-top: 24px;
}

.credibility-main {
  display: flex;
  justify-content: center;
  padding: 24px 0;
  position: relative;
}

.progress-ring {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-content {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.progress-value {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: var(--el-color-primary);
  line-height: 1;
  display: flex;
  align-items: baseline;
}

.progress-value small {
  font-size: 16px;
  font-weight: 500;
  margin-left: 2px;
  opacity: 0.8;
}

.progress-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.progress-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
  padding: 2px 8px;
  border-radius: 12px;
  margin-top: 8px;
}

.stats-details {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.stat-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  flex: 1;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  background: var(--el-fill-color);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-regular);
  margin-bottom: 12px;
}

.stat-header .el-icon {
  font-size: 18px;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-color-primary);
  margin: 8px 0;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  padding: 2px 8px;
  border-radius: 12px;
  width: fit-content;
}

.stat-trend.up {
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.stat-trend.down {
  color: var(--el-color-danger);
  background: var(--el-color-danger-light-9);
}

.warning .stat-number {
  color: var(--el-color-danger);
}

.credibility-distribution {
  margin-top: 24px;
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.distribution-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.distribution-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  width: 60px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.bar-wrapper {
  flex: 1;
  height: 8px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.bar-glow {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 30px;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

.bar-value {
  width: 40px;
  font-size: 13px;
  color: var(--el-text-color-regular);
  text-align: right;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .credibility-main {
    padding: 16px 0;
  }

  .progress-value {
    font-size: 28px;
  }

  .progress-value small {
    font-size: 14px;
  }

  .stat-row {
    flex-direction: column;
    gap: 12px;
  }

  .stat-item {
    padding: 12px;
  }

  .stat-number {
    font-size: 24px;
  }

  .distribution-bar {
    gap: 8px;
  }

  .bar-label {
    width: 50px;
    font-size: 12px;
  }

  .bar-value {
    width: 35px;
    font-size: 12px;
  }
}

/* 移除相关样式 */
.title-badges,
.badge,
.pulse-dot {
  display: none;
}

/* 调整标题间距 */
.title-group {
  gap: 0;
}
</style> 