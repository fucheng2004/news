<template>
  <div class="history-page">
    <div class="page-loading" v-if="isInitialLoading">
      <div class="loading-spinner">
        <svg viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4"/>
        </svg>
        <span>加载中...</span>
      </div>
    </div>

    <transition name="fade" appear>
      <div class="history-header">
        <h2>检测历史</h2>
        <div class="header-actions">
          <el-button 
            type="primary" 
            class="start-verify-btn"
            @click="goToVerify"
            v-motion
            :initial="{ opacity: 0, x: 50 }"
            :enter="{ opacity: 1, x: 0 }"
          >
            <el-icon><Plus /></el-icon>
            开始新检测
          </el-button>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索历史记录..."
            prefix-icon="Search"
            clearable
          />
        </div>
      </div>
    </transition>

    <transition name="slide-fade">
      <el-card 
        class="history-card glass-effect"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0, delay: 200 }"
      >
        <div class="table-toolbar">
          <div class="toolbar-left">
            <el-button-group>
              <el-tooltip content="刷新数据" placement="top">
                <el-button :loading="loading" @click="refreshHistory">
                  <el-icon><Refresh /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="导出数据" placement="top">
                <el-button @click="exportData">
                  <el-icon><Download /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="清空记录" placement="top">
                <el-button type="danger" @click="confirmClear">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-tooltip>
            </el-button-group>
          </div>
          <div class="toolbar-right">
            <el-radio-group v-model="viewMode" size="small">
              <el-radio-button label="table">表格视图</el-radio-button>
              <el-radio-button label="card">卡片视图</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <el-table
          v-if="viewMode === 'table'"
          v-loading="loading"
          :data="filteredHistoryList"
          style="width: 100%"
          highlight-current-row
          @row-click="handleRowClick"
          :row-style="getRowStyle"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :empty-text="loading ? '加载中...' : '暂无检测记录'"
          :row-class-name="getRowClassName"
          @row-mouse-enter="handleRowHover"
          @row-mouse-leave="handleRowLeave"
          :class="{ 'table-loading': loading }"
          @sort-change="handleSortChange"
        >
          <el-table-column prop="createdAt" label="检测时间" width="180">
            <template #default="{ row }">
              <div class="time-cell animate-cell">
                <el-icon><time /></el-icon>
                {{ formatDate(row.createdAt) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="新闻标题" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="title-cell animate-cell">
                <el-icon><document /></el-icon>
                {{ row.title }}
                <div class="title-underline"></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="result" label="检测结果" width="120">
            <template #default="{ row }">
              <el-tag 
                :type="getResultType(row.result)"
                effect="light"
                class="result-tag"
                size="large"
                :class="{ 'pulse': row.isHovered }"
              >
                <el-icon>
                  <component :is="getResultIcon(row.result)" />
                </el-icon>
                <span class="result-text">{{ row.result }}</span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button 
                link 
                type="primary" 
                @click="viewDetail(row)"
                class="detail-button"
              >
                <el-icon><view /></el-icon>
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div v-else class="history-cards">
          <transition-group name="card-list">
            <div v-for="item in filteredHistoryList"
                 :key="item.id"
                 class="history-card-item"
                 @click="viewDetail(item)"
            >
              <div class="card-item-header">
                <span class="card-time">{{ formatDate(item.createdAt) }}</span>
                <el-tag :type="getResultType(item.result.toString())" size="small">
                  {{ item.result }}
                </el-tag>
              </div>
              <h4 class="card-title">{{ item.title }}</h4>
              <div class="card-actions">
                <el-button link type="primary" size="small">
                  <el-icon><View /></el-icon> 查看详情
                </el-button>
              </div>
            </div>
          </transition-group>
        </div>

        <div class="pagination-wrapper">
          <div class="page-info">
            <span>当前显示 {{ startIndex }}-{{ endIndex }} 条，共 {{ filteredTotal }} 条</span>
          </div>
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="filteredTotal"
            :page-sizes="[10, 20, 50, 100]"
            background
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>

        <div v-if="!loading && filteredHistoryList.length === 0" class="empty-state">
          <div class="empty-animation">
            <svg class="empty-icon" viewBox="0 0 100 100">
              <circle class="empty-circle" cx="50" cy="50" r="40"/>
              <path class="empty-path" d="M30,50 L45,65 L70,35"/>
            </svg>
          </div>
          <p class="empty-text">暂无检测记录</p>
          <el-button type="primary" @click="goToVerify" class="empty-action">
            立即开始检测
          </el-button>
        </div>
      </el-card>
    </transition>

    <el-dialog
      v-model="detailDialogVisible"
      title="检测详情"
      width="60%"
      class="detail-dialog detail-dialog-animated"
      :close-on-click-modal="false"
      :show-close="true"
      top="5vh"
      destroy-on-close
    >
      <div v-if="currentDetail" class="detail-content">
        <div class="detail-background">
          <div class="bg-pattern"></div>
          <div class="bg-glow"></div>
        </div>
        <div class="detail-header">
          <h3>{{ currentDetail.title }}</h3>
          <el-tag 
            :type="getResultType(currentDetail.result.toString())"
            size="large"
            effect="light"
            class="detail-result-tag"
          >
            <el-icon><component :is="getResultIcon(currentDetail.result.toString())" /></el-icon>
            <span class="result-text">{{ currentDetail.result.toString() }}</span>
          </el-tag>
        </div>
        <div class="detail-meta">
          <div class="meta-item">
            <el-icon><time /></el-icon>
            <span>检测时间：{{ formatDate(currentDetail.createdAt) }}</span>
          </div>
          <div class="meta-item">
            <el-icon><document /></el-icon>
            <span>类别：{{ currentDetail.category || '未分类' }}</span>
          </div>
        </div>
        <div class="detail-text">
          <h4>新闻内容：</h4>
          <div class="content-box">
            <p>{{ currentDetail.content }}</p>
          </div>
        </div>
        <div class="detail-analysis">
          <h4>
            <el-icon><data-analysis /></el-icon>
            详细分析
          </h4>
          <div class="analysis-grid">
            <div v-for="(item, index) in getAnalysisItems(currentDetail)" 
                 :key="index"
                 class="analysis-item"
            >
              <div class="item-header">
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.title }}</span>
              </div>
              <div class="item-content">
                <el-progress
                  :percentage="item.score"
                  :color="getProgressColor(item.score)"
                  :format="(val) => val + '%'"
                  :stroke-width="10"
                />
                <p class="item-description">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="currentDetail ? recheck(currentDetail) : ''">
            <el-icon><Refresh /></el-icon>
            重新检测
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Delete, 
  Refresh, 
  Calendar, 
  Document, 
  View,
  CircleCheck,
  Warning,
  CircleClose,
  Download,
  Search,
  DataLine,
  DataAnalysis,
  Connection,
  ChatDotRound,
  Plus,
  Timer
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { HistoryRecord } from '@/types'

const router = useRouter()
const loading = ref(false)
const historyList = ref<HistoryRecord[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const detailDialogVisible = ref(false)
const currentDetail = ref<HistoryRecord | null>(null)
const searchKeyword = ref('')
const isInitialLoading = ref(true)
const viewMode = ref<'table' | 'card' | undefined>('table')
const hoveredRow = ref<number | null>(null)

const filteredHistoryList = computed(() => {
  if (!searchKeyword.value) return historyList.value
  const keyword = searchKeyword.value.toLowerCase()
  return historyList.value.filter(item => 
    item.title.toLowerCase().includes(keyword) ||
    (item.result !== undefined && String(item.result).toLowerCase().includes(keyword))
  )
})

const filteredTotal = computed(() => filteredHistoryList.value.length)
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, filteredTotal.value))

const formatDate = (date: string | number | Date) => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getResultType = (result: string): 'success' | 'warning' | 'danger' | 'info' => {
  const resultMap: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    '真实': 'success',
    '可疑': 'warning',
    '虚假': 'danger'
  }
  return resultMap[result] || 'info'
}

const getResultIcon = (result: string) => {
  const iconMap: Record<string, any> = {
    '真实': CircleCheck,
    '可疑': Warning,
    '虚假': CircleClose
  }
  return iconMap[result] || Warning
}

const fetchHistory = async () => {
  loading.value = true
  try {
    const response = await fetch(`/api/history?page=${currentPage.value}&size=${pageSize.value}`)
    if (!response.ok) throw new Error('获取历史记录失败')
    const data = await response.json()
    historyList.value = data.records
  } catch (error) {
    console.error('获取历史记录失败:', error)
    ElMessage.error('获取历史记录失败，请重试')
  } finally {
    loading.value = false
  }
}

const refreshHistory = () => {
  fetchHistory()
}

const viewDetail = (record: HistoryRecord) => {
  currentDetail.value = record
  detailDialogVisible.value = true
}

const recheck = (record: HistoryRecord) => {
  router.push({
    path: '/verify',
    query: { content: record.content }
  })
}

const clearHistory = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有历史记录吗？此操作不可恢复',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await fetch('/api/history/clear', {
      method: 'DELETE'
    })
    
    if (!response.ok) throw new Error('清空历史记录失败')
    
    ElMessage.success('历史记录已清空')
    fetchHistory()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('清空历史记录失败:', error)
      ElMessage.error('清空历史记录失败，请重试')
    }
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchHistory()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchHistory()
}

const getRowStyle = ({ row }: { row: HistoryRecord }) => {
  return {
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
}

const getRowClassName = ({ row, rowIndex }: { row: any, rowIndex: number }): string => {
  return [
    'table-row',
    hoveredRow.value === rowIndex ? 'row-hover' : '',
    `row-${rowIndex}`
  ].join(' ')
}

const handleRowHover = (row: any, column: any, rowIndex: number) => {
  hoveredRow.value = rowIndex
  row.isHovered = true
}

const handleRowLeave = (row: any) => {
  hoveredRow.value = null
  row.isHovered = false
}

const handleSortChange = ({ prop, order }: { prop: string, order: string }) => {
  console.log(`按 ${prop} 排序，顺序: ${order}`)
  // 实现排序逻辑
}

const confirmClear = () => {
  clearHistory()
}

const exportData = () => {
  const data = filteredHistoryList.value.map(item => ({
    时间: formatDate(item.createdAt),
    标题: item.title,
    结果: item.result
  }))
  
  const csvContent = "data:text/csv;charset=utf-8," 
    + Object.keys(data[0]).join(",") + "\n"
    + data.map(row => Object.values(row).join(",")).join("\n")
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `检测历史_${formatDate(new Date())}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const goToVerify = () => {
  router.push('/verify')
}

// 分析项目类型定义
interface AnalysisItem {
  title: string
  score: number
  description: string
  icon: any
}

// 处理行点击
const handleRowClick = (row: HistoryRecord) => {
  viewDetail(row)
}

// 获取分析项目
const getAnalysisItems = (detail: HistoryRecord): AnalysisItem[] => {
  return [
    {
      title: '文本分析',
      score: typeof detail.textScore === 'string' ? parseInt(detail.textScore) : (detail.textScore || 0),
      description: '基于文本内容的真实性分析',
      icon: DataLine
    },
    {
      title: '情感分析',
      score: typeof detail.sentimentScore === 'string' ? parseInt(detail.sentimentScore) : (detail.sentimentScore || 0),
      description: '新闻情感倾向性分析',
      icon: ChatDotRound
    },
    {
      title: '来源可信度',
      score: typeof detail.sourceScore === 'string' ? parseInt(detail.sourceScore) : (detail.sourceScore || 0),
      description: '新闻来源的可信度评估',
      icon: Connection
    },
    {
      title: '综合评分',
      score: typeof detail.overallScore === 'string' ? parseInt(detail.overallScore) : (detail.overallScore || 0),
      description: '多维度综合分析结果',
      icon: DataAnalysis
    }
  ]
}

// 获取进度条颜色
const getProgressColor = (score: number) => {
  if (score >= 80) return '#67C23A'
  if (score >= 60) return '#E6A23C'
  return '#F56C6C'
}

// 初始化
onMounted(async () => {
  try {
    await fetchHistory()
  } finally {
    isInitialLoading.value = false
  }
})

onUnmounted(() => {
  // 删除或注释掉这些行，因为变量未定义
  // showScrollHint.value = window.scrollY <= 100
  
  // if (parallaxBg.value) {
  //   const scrolled = window.scrollY
  //   parallaxBg.value.style.transform = `translateY(${scrolled * 0.5}px)`
  // }
})
</script>

<style scoped>
.history-page {
  padding: 24px;
  min-height: calc(100vh - 60px);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.table-row:hover {
  background-color: var(--el-fill-color-lighter);
}

.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-info {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

@media (max-width: 768px) {
  .history-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
}

.start-verify-btn {
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-success));
  border: none;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.start-verify-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.start-verify-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
  transform: scale(0);
  opacity: 0;
  transition: transform 0.6s, opacity 0.6s;
}

.start-verify-btn:hover::after {
  transform: scale(1);
  opacity: 1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .history-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .start-verify-btn {
    width: 100%;
  }
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* 装饰动画 */
.floating-dots .dot {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: var(--el-color-primary-light-5);
  border-radius: 50%;
  left: var(--x);
  top: var(--y);
  animation: floatDot 10s infinite ease-in-out;
  animation-delay: var(--delay);
  opacity: 0.3;
}

@keyframes floatDot {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(10px, -10px); }
  50% { transform: translate(-5px, 5px); }
  75% { transform: translate(5px, -5px); }
}

.glow-effect {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), 
    rgba(64, 158, 255, 0.1) 0%,
    transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.history-card:hover .glow-effect {
  opacity: 1;
}

/* 空状态动画 */
.empty-state {
  text-align: center;
  padding: 40px;
}

.empty-animation {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
}

.empty-circle {
  fill: none;
  stroke: var(--el-color-primary-light-5);
  stroke-width: 4;
  stroke-dasharray: 251;
  stroke-dashoffset: 251;
  animation: drawCircle 2s ease-out forwards;
}

.empty-path {
  fill: none;
  stroke: var(--el-color-primary);
  stroke-width: 4;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: drawPath 1s ease-out 1s forwards;
}

@keyframes drawCircle {
  to { stroke-dashoffset: 0; }
}

@keyframes drawPath {
  to { stroke-dashoffset: 0; }
}

/* 表格动画效果 */
.animate-cell {
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-cell {
  position: relative;
  padding: 4px 0;
}

.title-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--el-color-primary);
  transition: width 0.3s ease;
}

.row-hover .title-cell .title-underline {
  width: 100%;
}

.result-tag.pulse {
  animation: tagPulse 1s ease;
}

@keyframes tagPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* 详情对话框动画 */
.detail-dialog-animated {
  transform: scale(0.9);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-dialog-animated.el-dialog--center {
  transform: scale(1);
  opacity: 1;
}

.detail-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: -1;
}

.bg-pattern {
  position: absolute;
  width: 200%;
  height: 200%;
  background-image: 
    linear-gradient(45deg, var(--el-color-primary-light-9) 25%, transparent 25%),
    linear-gradient(-45deg, var(--el-color-primary-light-9) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--el-color-primary-light-9) 75%),
    linear-gradient(-45deg, transparent 75%, var(--el-color-primary-light-9) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  animation: patternMove 20s linear infinite;
  opacity: 0.1;
}

.bg-glow {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle at center,
    var(--el-color-primary-light-8) 0%,
    transparent 70%);
  opacity: 0.1;
  animation: glowPulse 4s ease-in-out infinite;
}

@keyframes patternMove {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes glowPulse {
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(1.2); opacity: 0.15; }
}

/* 页面加载动画 */
.page-loading {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  text-align: center;
}

.loading-spinner svg {
  width: 50px;
  height: 50px;
  animation: rotate 2s linear infinite;
}

.loading-spinner circle {
  stroke-dasharray: 150;
  stroke-dashoffset: 150;
  animation: dash 2s ease-in-out infinite;
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% { stroke-dashoffset: 150; }
  50% { stroke-dashoffset: 50; }
  100% { stroke-dashoffset: 150; }
}

/* 工具栏样式 */
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}

/* 卡片视图样式 */
.history-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px 0;
}

.history-card-item {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
}

.history-card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  margin: 0 0 16px;
  font-size: 16px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 列表动画 */
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.3s ease;
}

.card-list-enter-from,
.card-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.card-list-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .table-toolbar {
    flex-direction: column;
    gap: 12px;
  }
  
  .history-cards {
    grid-template-columns: 1fr;
  }
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .history-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
    gap: 12px;
  }

  .table-toolbar {
    flex-direction: column;
    gap: 12px;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
    justify-content: center;
  }
}

/* 详情样式 */
.detail-content {
  position: relative;
  padding: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
}

.detail-text {
  margin-bottom: 24px;
}

.content-box {
  background: var(--el-fill-color-light);
  padding: 16px;
  border-radius: 8px;
  margin-top: 12px;
}

.detail-analysis {
  h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.analysis-item {
  background: var(--el-fill-color-lighter);
  padding: 16px;
  border-radius: 8px;
  transition: transform 0.3s;
}

.analysis-item:hover {
  transform: translateY(-4px);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 500;
}

.item-description {
  margin-top: 8px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
</style> 