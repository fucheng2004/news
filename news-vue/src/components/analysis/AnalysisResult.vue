<template>
  <div class="analysis-result">
    <!-- 主要结果展示区 -->
    <div class="result-overview glass-effect">
      <div class="score-section">
        <div class="score-ring">
          <el-progress
            type="dashboard"
            :percentage="credibilityScore"
            :color="getScoreGradient"
            :width="150"
            :stroke-width="15"
          >
            <template #default="{ percentage }">
              <div class="score-content">
                <span class="score-value">{{ percentage }}</span>
                <span class="score-unit">%</span>
                <span class="score-label">可信度</span>
              </div>
            </template>
          </el-progress>
        </div>
        <div class="score-indicators">
          <div class="indicator" v-for="(score, type) in detailScores" :key="type">
            <div class="indicator-label">{{ type }}</div>
            <el-progress 
              :percentage="score" 
              :color="getScoreColor(score)"
              :show-text="false"
              :stroke-width="8"
              class="indicator-progress"
            />
            <span class="indicator-value">{{ score }}%</span>
          </div>
        </div>
      </div>
      
      <div class="result-info">
        <div class="result-header">
          <el-tag 
            :type="getResultType" 
            size="large" 
            effect="dark"
            class="result-tag"
          >
            <el-icon><component :is="getResultIcon" /></el-icon>
            {{ finalResult }}
          </el-tag>
          <div class="confidence-level">
            置信度: <span>{{ confidenceLevel }}</span>
          </div>
        </div>
        <div class="key-findings">
          <h4>
            <el-icon><data-analysis /></el-icon>
            关键发现
          </h4>
          <ul>
            <li v-for="(finding, index) in keyFindings" :key="index">
              {{ finding }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 详细分析区域 -->
    <div class="analysis-details">
      <div class="analysis-tabs">
        <el-tabs v-model="activeTab" class="custom-tabs">
          <el-tab-pane name="factCheck" label="事实核查">
            <div class="analysis-content">
              <div class="fact-check-results">
                <div v-for="(item, index) in analysisData.factCheckResults" :key="index" 
                     class="fact-item" :class="item.status">
                  <div class="fact-icon">
                    <el-icon><component :is="getFactIcon(item.status)" /></el-icon>
                  </div>
                  <div class="fact-content">
                    <h5>{{ item.claim }}</h5>
                    <p>{{ item.explanation }}</p>
                    <div class="fact-sources" v-if="item.sources?.length">
                      <span class="source-label">来源：</span>
                      <el-tag 
                        v-for="(source, idx) in item.sources" 
                        :key="idx"
                        size="small"
                        effect="plain"
                      >
                        {{ source }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane name="textAnalysis" label="文本分析">
            <div class="analysis-content">
              <div class="text-analysis-charts">
                <div class="chart-container">
                  <div ref="sentimentChartRef" class="sentiment-chart"></div>
                </div>
                <div class="chart-container">
                  <div ref="keywordsChartRef" class="keywords-chart"></div>
                </div>
              </div>
              <div class="text-metrics">
                <div class="metric-card" v-for="metric in analysisData.textMetrics" :key="metric.name">
                  <div class="metric-icon">
                    <el-icon><component :is="metric.icon" /></el-icon>
                  </div>
                  <div class="metric-info">
                    <span class="metric-value">{{ metric.value }}</span>
                    <span class="metric-name">{{ metric.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane name="sourceAnalysis" label="来源分析">
            <div class="analysis-content">
              <div ref="sourceGraphRef" class="source-graph"></div>
              <div class="source-reliability">
                <h4>来源可靠性评估</h4>
                <div class="reliability-items">
                  <div v-for="item in analysisData.sourceReliability" :key="item.name" 
                       class="reliability-item">
                    <div class="reliability-header">
                      <span class="name">{{ item.name }}</span>
                      <el-rate 
                        v-model="item.score" 
                        disabled 
                        :colors="['#F7BA2A', '#F7BA2A', '#F7BA2A']"
                      />
                    </div>
                    <p class="description">{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button-group>
        <el-button type="primary" @click="recheck">
          <el-icon><refresh /></el-icon>
          重新检测
        </el-button>
        <el-button @click="exportReport">
          <el-icon><download /></el-icon>
          导出报告
        </el-button>
        <el-button type="success" @click="shareResult">
          <el-icon><share /></el-icon>
          分享结果
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import type { ProgressColor } from 'element-plus'
import type { ECharts } from 'echarts'
import {
  CircleCheck,
  Warning,
  CircleClose,
  DataLine,
  Connection,
  Document,
  InfoFilled,
  Refresh,
  Download,
  Share
} from '@element-plus/icons-vue'
import type { VerificationResult, VerificationDetail } from '@/types'
import * as echarts from 'echarts'

const props = defineProps<{
  result: VerificationResult
}>()

const emit = defineEmits(['recheck', 'export'])

const credibilityScore = computed(() => Math.round(props.result.credibility * 100))

const getScoreColor = (score: number) => {
  if (score >= 80) return '#67C23A'
  if (score >= 60) return '#E6A23C'
  return '#F56C6C'
}

const finalResult = computed(() => {
  const score = credibilityScore.value
  if (score >= 80) return '真实'
  if (score >= 60) return '可疑'
  return '虚假'
})

const getResultType = computed(() => {
  const score = credibilityScore.value
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'danger'
})

const getResultIcon = computed(() => {
  const score = credibilityScore.value
  if (score >= 80) return CircleCheck
  if (score >= 60) return Warning
  return CircleClose
})

const getFactIcon = (status: string) => {
  const icons: Record<string, any> = {
    true: Document,
    false: Warning,
    unknown: InfoFilled
  }
  return icons[status] || Document
}

const getDetailTitle = (type: string) => {
  const titles: Record<string, string> = {
    factCheck: '事实核查',
    sourceAnalysis: '来源分析',
    textAnalysis: '文本分析'
  }
  return titles[type] || '其他分析'
}

const getDetailScoreType = (score: number) => {
  if (score >= 8) return 'success'
  if (score >= 6) return 'warning'
  return 'danger'
}

const recheck = () => {
  emit('recheck')
}

const exportReport = () => {
  emit('export')
}

const shareResult = () => {
  // 实现分享结果的逻辑
}

// 新增的响应式数据
const activeTab = ref('factCheck')
const sentimentChartRef = ref<HTMLElement>()
const keywordsChartRef = ref<HTMLElement>()
const sourceGraphRef = ref<HTMLElement>()

// 图表实例
let sentimentChart: ECharts | null = null
let keywordsChart: ECharts | null = null
let sourceGraph: ECharts | null = null

// 计算属性
const getScoreGradient = computed<ProgressColor[]>(() => [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 60 },
  { color: '#67c23a', percentage: 80 }
])

const confidenceLevel = computed(() => {
  const score = credibilityScore.value
  if (score >= 90) return '极高'
  if (score >= 80) return '高'
  if (score >= 60) return '中等'
  if (score >= 40) return '低'
  return '极低'
})

const detailScores = computed(() => {
  return props.result.details.reduce((acc, detail) => {
    acc[getDetailTitle(detail.type)] = Math.round(detail.score * 100)
    return acc
  }, {} as Record<string, number>)
})

const keyFindings = computed(() => {
  return props.result.details.map(detail => detail.explanation)
})

// 修改分析数据的初始化
const analysisData = computed(() => ({
  factCheckResults: props.result.details
    .filter(detail => detail.type === 'factCheck')
    .map(detail => ({
      status: detail.score >= 0.8 ? 'true' : detail.score >= 0.6 ? 'unknown' : 'false',
      claim: getDetailTitle(detail.type),
      explanation: detail.explanation,
      sources: detail.evidence
    })),
  textMetrics: props.result.details
    .filter(detail => detail.type === 'textAnalysis')
    .map(detail => ({
      name: getDetailTitle(detail.type),
      value: `${Math.round(detail.score * 100)}%`,
      icon: 'DataAnalysis'
    })),
  sourceReliability: props.result.details
    .filter(detail => detail.type === 'sourceAnalysis')
    .map(detail => ({
      name: getDetailTitle(detail.type),
      score: detail.score * 5, // 转换为5分制
      description: detail.explanation
    }))
}))

// 初始化图表
const initCharts = () => {
  if (sentimentChartRef.value) {
    sentimentChart = echarts.init(sentimentChartRef.value)
    const sentimentOption = {
      title: {
        text: '情感分析',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 60, name: '积极' },
            { value: 30, name: '中性' },
            { value: 10, name: '消极' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    sentimentChart.setOption(sentimentOption)
  }

  if (keywordsChartRef.value) {
    keywordsChart = echarts.init(keywordsChartRef.value)
    const keywordsOption = {
      title: {
        text: '关键词分析',
        left: 'center'
      },
      tooltip: {},
      series: [{
        type: 'wordCloud',
        data: [
          { name: '真实性', value: 100 },
          { name: '可信度', value: 80 },
          { name: '新闻', value: 60 },
          // ... 更多关键词
        ],
        textStyle: {
          normal: {
            color: function() {
              return 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(',') + ')'
            }
          }
        }
      }]
    }
    keywordsChart.setOption(keywordsOption)
  }
}

// 监听结果变化，重新初始化图表
watch(() => props.result, () => {
  nextTick(() => {
    initCharts()
  })
}, { deep: true })

// 生命周期钩子
onMounted(() => {
  initCharts()
})

// 监听标签页切换，重新渲染图表
watch(activeTab, () => {
  nextTick(() => {
    if (activeTab.value === 'textAnalysis') {
      sentimentChart?.resize()
      keywordsChart?.resize()
    } else if (activeTab.value === 'sourceAnalysis') {
      sourceGraph?.resize()
    }
  })
})
</script>

<style scoped>
.analysis-result {
  padding: 24px;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.result-overview {
  display: flex;
  gap: 40px;
  padding: 30px;
  border-radius: 16px;
  margin-bottom: 30px;
}

.score-section {
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.score-ring {
  text-align: center;
}

.score-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-value {
  font-size: 36px;
  font-weight: bold;
  line-height: 1;
  background: linear-gradient(45deg, var(--el-color-primary), #36cfc9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.score-unit {
  font-size: 16px;
  color: var(--el-text-color-secondary);
}

.score-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-top: 8px;
}

.score-indicators {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.indicator-label {
  width: 80px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.indicator-progress {
  flex: 1;
}

.indicator-value {
  width: 45px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.result-tag {
  font-size: 16px;
  padding: 8px 16px;
}

.confidence-level {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.confidence-level span {
  color: var(--el-color-primary);
  font-weight: 500;
}

.key-findings {
  background: var(--el-fill-color-light);
  padding: 20px;
  border-radius: 8px;
}

.key-findings h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px;
  color: var(--el-text-color-primary);
}

.key-findings ul {
  margin: 0;
  padding-left: 20px;
}

.key-findings li {
  color: var(--el-text-color-regular);
  line-height: 1.8;
}

.analysis-details {
  margin-top: 30px;
}

.custom-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.custom-tabs :deep(.el-tabs__nav) {
  border: none;
}

.custom-tabs :deep(.el-tabs__item) {
  padding: 0 24px;
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  font-weight: 600;
  background: var(--el-color-primary-light-9);
  border-radius: 8px 8px 0 0;
}

.analysis-content {
  padding: 24px;
  background: var(--el-bg-color);
  border-radius: 0 8px 8px 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.chart-container {
  height: 300px;
  margin-bottom: 24px;
}

.action-buttons {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .result-overview {
    flex-direction: column;
    gap: 24px;
  }

  .score-section {
    flex: none;
    width: 100%;
  }
}
</style> 