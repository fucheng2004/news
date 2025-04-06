<template>
  <div class="verification-report">
    <div class="report-header">
      <h3>检测结果</h3>
      <el-tag :type="getCredibilityType">
        {{ getCredibilityText }}
      </el-tag>
    </div>
    
    <div class="report-content">
      <div class="meta-info">
        <span>检测时间：{{ formatDate(result.verifiedAt) }}</span>
        <span>来源：{{ result.source }}</span>
      </div>
      
      <div class="summary-section">
        <h4>摘要分析</h4>
        <p>{{ result.summary }}</p>
      </div>
      
      <div class="details-section">
        <h4>详细分析</h4>
        <div v-for="(detail, index) in result.details" :key="index" class="detail-item">
          <div class="detail-header">
            <span>{{ getDetailTypeText(detail.type) }}</span>
            <el-progress 
              :percentage="Math.round(detail.score * 100)"
              :status="getProgressStatus(detail.score)"
            />
          </div>
          <p class="explanation">{{ detail.explanation }}</p>
          <div class="evidence-list">
            <el-tag 
              v-for="(evidence, idx) in detail.evidence" 
              :key="idx"
              size="small"
              effect="plain"
            >
              {{ evidence }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import type { VerificationResult } from '@/types'

const props = defineProps<{
  result: VerificationResult
}>()

const getCredibilityType = computed(() => {
  const score = props.result.credibility
  if (score >= 0.7) return 'success'
  if (score >= 0.4) return 'warning'
  return 'danger'
})

const getCredibilityText = computed(() => {
  const score = props.result.credibility
  if (score >= 0.7) return '高可信'
  if (score >= 0.4) return '中等可信'
  return '低可信'
})

const getProgressStatus = (score: number) => {
  if (score >= 0.7) return 'success'
  if (score >= 0.4) return 'warning'
  return 'exception'
}

const getDetailTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    factCheck: '事实核查',
    sourceAnalysis: '来源分析',
    textAnalysis: '文本分析'
  }
  return typeMap[type] || type
}

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}
</script>

<style scoped>
.verification-report {
  padding: 20px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.report-header h3 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.meta-info {
  display: flex;
  gap: 20px;
  color: var(--el-text-color-secondary);
  margin-bottom: 20px;
}

.summary-section,
.details-section {
  margin-bottom: 20px;
}

.summary-section h4,
.details-section h4 {
  margin-bottom: 10px;
  color: var(--el-text-color-primary);
}

.detail-item {
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 4px;
  background-color: var(--el-bg-color-page);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.explanation {
  margin: 10px 0;
  color: var(--el-text-color-regular);
}

.evidence-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style> 