<template>
  <div class="history-page">
    <div class="background-animation">
      <div v-for="i in 5" :key="i" class="floating-circle"></div>
    </div>

    <el-row class="page-header">
      <el-col :span="24">
        <h1 class="gradient-text">检测历史</h1>
        <div class="stats-cards">
          <div class="stat-card">
            <el-icon><DataLine /></el-icon>
            <div class="stat-info">
              <span class="stat-value">{{ total }}</span>
              <span class="stat-label">总检测数</span>
            </div>
          </div>
          <div class="stat-card">
            <el-icon><Timer /></el-icon>
            <div class="stat-info">
              <span class="stat-value">{{ todayCount }}</span>
              <span class="stat-label">今日检测</span>
            </div>
          </div>
          <div class="stat-card">
            <el-icon><TrendCharts /></el-icon>
            <div class="stat-info">
              <span class="stat-value">{{ averageScore.toFixed(1) }}</span>
              <span class="stat-label">平均可信度</span>
            </div>
          </div>
        </div>
        <p class="subtitle">查看所有新闻检测记录</p>
      </el-col>
    </el-row>

    <el-row class="content-section">
      <el-col :span="24">
        <el-card class="filter-card glass-effect">
          <el-form :inline="true" :model="filterForm" class="filter-form">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="filterForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="新闻类别">
              <el-select v-model="filterForm.category" placeholder="全部类别">
                <el-option label="全部" value="" />
                <el-option
                  v-for="item in categories"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="可信度">
              <el-select v-model="filterForm.credibility" placeholder="全部">
                <el-option label="全部" value="" />
                <el-option label="高可信" value="high" />
                <el-option label="中等" value="medium" />
                <el-option label="低可信" value="low" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleFilter">
                <el-icon><Search /></el-icon>筛选
              </el-button>
              <el-button @click="resetFilter">
                <el-icon><Refresh /></el-icon>重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="history-list glass-effect" v-loading="loading">
          <template #header>
            <div class="list-header">
              <div class="header-left">
                <el-icon><Document /></el-icon>
                <span>检测记录</span>
              </div>
              <el-button-group>
                <el-button type="success">
                  <el-icon><Share /></el-icon>分享
                </el-button>
                <el-button @click="exportHistory">
                  <el-icon><Download /></el-icon>导出
                </el-button>
                <el-button type="danger" @click="clearHistory">
                  <el-icon><Delete /></el-icon>清空
                </el-button>
              </el-button-group>
            </div>
          </template>

          <el-table 
            :data="historyList" 
            style="width: 100%"
            :header-cell-style="{ background: 'var(--el-color-primary-light-9)' }"
            :row-class-name="tableRowClassName"
          >
            <el-table-column prop="verifiedAt" label="检测时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.verifiedAt) }}
              </template>
            </el-table-column>
            <el-table-column prop="title" label="新闻标题" min-width="200">
              <template #default="{ row }">
                <el-tooltip
                  :content="row.title"
                  placement="top"
                  :show-after="1000"
                >
                  <span class="truncate">{{ row.title }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="category" label="类别" width="120">
              <template #default="{ row }">
                <el-tag size="small">{{ getCategoryLabel(row.category) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="credibility" label="可信度" width="120">
              <template #default="{ row }">
                <el-progress
                  :percentage="Math.round(row.credibility * 100)"
                  :status="getCredibilityStatus(row.credibility)"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button-group>
                  <el-button 
                    size="small" 
                    type="primary" 
                    @click="viewDetail(row)"
                  >
                    详情
                  </el-button>
                  <el-button 
                    size="small" 
                    type="danger" 
                    @click="deleteRecord(row)"
                  >
                    删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              background
              class="custom-pagination"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="detailVisible"
      title="检测详情"
      width="80%"
      destroy-on-close
    >
      <verification-report 
        v-if="selectedRecord"
        :result="selectedRecord"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { 
  Search, 
  Refresh, 
  Download, 
  Delete, 
  Share, 
  Document, 
  DataLine, 
  Timer, 
  TrendCharts 
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import type { VerificationResult } from '@/types'
import { useDetectionStore } from '@/stores/detection'
import VerificationReport from '@/components/verification/VerificationReport.vue'

const detection = useDetectionStore()
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailVisible = ref(false)
const selectedRecord = ref<VerificationResult | null>(null)
const historyList = ref<VerificationResult[]>([])

const categories = [
  { label: '政治', value: 'politics' },
  { label: '科技', value: 'technology' },
  { label: '经济', value: 'economy' },
  { label: '社会', value: 'society' },
  { label: '国际', value: 'international' },
  { label: '其他', value: 'other' }
]

const filterForm = reactive({
  dateRange: [],
  category: '',
  credibility: ''
})

const getCategoryLabel = (value: string) => {
  const category = categories.find(item => item.value === value)
  return category ? category.label : value
}

const getCredibilityStatus = (value: number) => {
  if (value >= 0.8) return 'success'
  if (value >= 0.6) return 'warning'
  return 'exception'
}

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

const handleFilter = () => {
  fetchHistory()
}

const resetFilter = () => {
  filterForm.dateRange = []
  filterForm.category = ''
  filterForm.credibility = ''
  fetchHistory()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchHistory()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchHistory()
}

const viewDetail = (row: VerificationResult) => {
  selectedRecord.value = row
  detailVisible.value = true
}

const deleteRecord = async (row: VerificationResult) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条记录吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 实现删除逻辑
    ElMessage.success('删除成功')
    fetchHistory()
  } catch {
    // 用户取消删除
  }
}

const exportHistory = () => {
  // TODO: 实现导出逻辑
  ElMessage.success('导出成功')
}

const clearHistory = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有记录吗？此操作不可恢复！',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 实现清空逻辑
    ElMessage.success('清空成功')
    fetchHistory()
  } catch {
    // 用户取消清空
  }
}

const fetchHistory = async () => {
  loading.value = true
  try {
    await detection.fetchHistory()
    historyList.value = detection.results
    total.value = historyList.value.length
  } catch (error) {
    ElMessage.error('获取历史记录失败')
  } finally {
    loading.value = false
  }
}

const todayCount = computed(() => {
  const today = dayjs().startOf('day')
  return historyList.value.filter(item => 
    dayjs(item.verifiedAt).isAfter(today)
  ).length
})

const averageScore = computed(() => {
  if (historyList.value.length === 0) return 0
  const sum = historyList.value.reduce((acc, curr) => acc + curr.credibility, 0)
  return (sum / historyList.value.length) * 100
})

const tableRowClassName = ({ row }: { row: VerificationResult }) => {
  if (row.credibility >= 0.8) return 'high-credibility-row'
  if (row.credibility >= 0.6) return 'medium-credibility-row'
  return 'low-credibility-row'
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
.history-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
  text-align: center;
}

.page-header h1 {
  font-size: 2rem;
  color: var(--el-color-primary);
  margin-bottom: 8px;
}

.subtitle {
  color: var(--el-text-color-secondary);
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.truncate {
  display: inline-block;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .filter-form {
    flex-direction: column;
  }
  
  .filter-form .el-form-item {
    margin-right: 0;
  }
  
  .list-header {
    flex-direction: column;
    gap: 10px;
  }
}

.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.floating-circle {
  position: absolute;
  background: linear-gradient(45deg, var(--el-color-primary-light-8), var(--el-color-success-light-8));
  border-radius: 50%;
  opacity: 0.3;
  animation: float 15s infinite linear;
}

.floating-circle:nth-child(1) { width: 300px; height: 300px; top: 10%; left: 10%; animation-delay: 0s; }
.floating-circle:nth-child(2) { width: 200px; height: 200px; top: 60%; left: 80%; animation-delay: -3s; }
.floating-circle:nth-child(3) { width: 150px; height: 150px; top: 30%; left: 60%; animation-delay: -6s; }
.floating-circle:nth-child(4) { width: 250px; height: 250px; top: 70%; left: 20%; animation-delay: -9s; }
.floating-circle:nth-child(5) { width: 180px; height: 180px; top: 40%; left: 30%; animation-delay: -12s; }

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(100px, 100px) rotate(360deg); }
}

.gradient-text {
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.stats-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.stat-card {
  background: var(--el-color-primary-light-9);
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.stat-card .el-icon {
  font-size: 32px;
  color: var(--el-color-primary);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-color-primary);
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.glass-effect {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.custom-pagination {
  margin-top: 20px;
  padding: 10px;
  background: var(--el-color-primary-light-9);
  border-radius: 4px;
}

:deep(.high-credibility-row) {
  background-color: var(--el-color-success-light-9);
}

:deep(.medium-credibility-row) {
  background-color: var(--el-color-warning-light-9);
}

:deep(.low-credibility-row) {
  background-color: var(--el-color-danger-light-9);
}

.el-button {
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style> 