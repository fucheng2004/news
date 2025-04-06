<template>
  <div class="data-platform">
    <!-- 背景效果层 -->
    <div class="platform-bg">
      <!-- 网格背景 -->
      <div class="bg-grid"></div>
      
      <!-- 科技线路图背景 -->
      <div class="bg-circuit"></div>
      
      <!-- 动态粒子背景 -->
      <div class="bg-particles"></div>
      
      <!-- 光晕效果 -->
      <div class="bg-glow"></div>
    </div>

    <!-- 优化顶部标题区 -->
    <div class="platform-header">
      <div class="header-left">
        <div class="title-wrapper">
          <h1>AI新闻识谣数据中心</h1>
          <div class="title-decoration">
            <div class="decoration-line"></div>
            <div class="decoration-dot"></div>
          </div>
        </div>
        <div class="update-time">
          <el-icon><Timer /></el-icon>
          <span>最后更新时间：{{ data.lastUpdateTime }}</span>
          <div class="refresh-badge">
            <div class="pulse-dot"></div>
            <span>{{ data.refreshIntervalSeconds }}s 自动刷新</span>
          </div>
        </div>
      </div>
      <div class="header-right">
        <el-radio-group v-model="timeRange" size="large" class="time-range">
          <el-radio-button label="day">今日</el-radio-button>
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
        </el-radio-group>
        <el-button 
          type="primary" 
          :loading="loading" 
          class="refresh-button"
          @click="handleRefresh"
        >
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 核心指标区 -->
    <div class="core-metrics">
      <div v-for="(metric, index) in metrics" 
           :key="index" 
           class="metric-card"
           :class="metric.type">
        <div class="metric-icon">
          <el-icon><component :is="metric.icon" /></el-icon>
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-label">{{ metric.label }}</div>
          <div class="metric-trend" :class="metric.trend">
            <el-icon><component :is="metric.trend === 'up' ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
            <span>{{ metric.change }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-container">
      <div class="chart-row">
        <div class="chart-card trend-chart">
          <div class="chart-header">
            <h3>新闻检测趋势</h3>
            <div class="chart-actions">
              <el-select v-model="trendType" size="small">
                <el-option label="检测量" value="count" />
                <el-option label="准确率" value="accuracy" />
              </el-select>
            </div>
          </div>
          <div class="chart-body" ref="trendChartRef"></div>
        </div>
        <div class="chart-card distribution-chart">
          <div class="chart-header">
            <h3>谣言类型分布</h3>
          </div>
          <div class="chart-body" ref="pieChartRef"></div>
        </div>
      </div>
      <div class="chart-row">
        <div class="chart-card region-chart">
          <div class="chart-header">
            <h3>地域分布热力图</h3>
          </div>
          <div class="chart-body" ref="mapChartRef"></div>
        </div>
        <div class="chart-card realtime-list">
          <div class="chart-header">
            <h3>实时检测动态</h3>
            <el-tag size="small" type="success" effect="dark">实时</el-tag>
          </div>
          <div class="list-body">
            <div v-for="(item, index) in realtimeList" 
                 :key="index" 
                 class="list-item">
              <span class="time">{{ item.time }}</span>
              <span class="content">{{ item.content }}</span>
              <el-tag :type="item.type === '谣言' ? 'danger' : 'success'" 
                     size="small"
                     effect="dark">
                {{ item.type }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-row">
        <div class="chart-card">
          <div class="chart-header">
            <h3>谣言来源分析</h3>
          </div>
          <div class="chart-body" ref="bar3dChartRef"></div>
        </div>
        <div class="chart-card">
          <div class="chart-header">
            <h3>热点词云</h3>
          </div>
          <div class="chart-body" ref="wordCloudRef"></div>
        </div>
      </div>
      <div class="chart-row">
        <div class="chart-card">
          <div class="chart-header">
            <h3>谣言传播网络</h3>
          </div>
          <div class="chart-body" ref="graphRef"></div>
        </div>
        <div class="chart-card">
          <div class="chart-header">
            <h3>AI识别能力评估</h3>
          </div>
          <div class="chart-body" ref="radarChartRef"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { 
  LineChart,
  PieChart,
  MapChart,
  EffectScatterChart 
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  GeoComponent
} from 'echarts/components'
import * as echarts from 'echarts'
import { Timer, Refresh, Document, Check, User, ArrowUp, ArrowDown } from '@element-plus/icons-vue'

// 响应式数据
const timeRange = ref('day')
const loading = ref(false)
const data = ref({
  lastUpdateTime: new Date().toLocaleString(),
  refreshIntervalSeconds: 30
})

// 刷新方法
const handleRefresh = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    data.value.lastUpdateTime = new Date().toLocaleString()
    updateCharts()
    // 更新指标数据
    metrics.value = metrics.value.map(metric => ({
      ...metric,
      value: Math.floor(Math.random() * 10000).toLocaleString(),
      change: `${(Math.random() * 20).toFixed(1)}%`,
      trend: Math.random() > 0.5 ? 'up' : 'down'
    }))
  } finally {
    loading.value = false
  }
}

// 注册必需的组件
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  MapChart,
  EffectScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  GeoComponent
])

// 添加在 onMounted 之前
const metrics = ref([
  {
    type: 'total-news',
    icon: 'Document',
    label: '总检测新闻量',
    value: '138,246',
    trend: 'up',
    change: '23.5%'
  },
  {
    type: 'accuracy',
    icon: 'Check',
    label: '识别准确率',
    value: '96.8%',
    trend: 'up',
    change: '2.1%'
  },
  {
    type: 'response',
    icon: 'Timer',
    label: '平均响应时间',
    value: '0.8s',
    trend: 'down',
    change: '0.2s'
  },
  {
    type: 'users',
    icon: 'User',
    label: '活跃用户数',
    value: '24,891',
    trend: 'up',
    change: '15.7%'
  }
])

// 添加图表引用
const trendChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()
const mapChartRef = ref<HTMLElement>()
const trendType = ref('count')
const mapType = ref('heatmap')
const bar3dChartRef = ref<HTMLElement>()
const wordCloudRef = ref<HTMLElement | null>(null)
const graphRef = ref<HTMLElement>()
const radarChartRef = ref<HTMLElement>()

// 添加实时列表数据
const realtimeList = ref([
  { id: 1, time: '12:30:45', content: '某热点新闻真实性核验', type: '真实' },
  { id: 2, time: '12:29:30', content: '网传视频真伪鉴定', type: '谣言' },
  { id: 3, time: '12:28:15', content: '社交媒体传闻核实', type: '真实' },
  { id: 4, time: '12:27:00', content: '短视频内容真实性检测', type: '谣言' }
])

// 添加自动刷新功能
let refreshTimer: NodeJS.Timer
onMounted(() => {
  startAutoRefresh()
})
onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer as NodeJS.Timeout)
  }
})

const startAutoRefresh = () => {
  refreshTimer = setInterval(() => {
    handleRefresh()
    updateRealtimeList()
  }, data.value.refreshIntervalSeconds * 1000)
}

// 更新实时列表
const updateRealtimeList = () => {
  const newItem = {
    id: Date.now(),
    time: new Date().toLocaleTimeString(),
    content: `新闻检测 ${Math.floor(Math.random() * 1000)}`,
    type: Math.random() > 0.5 ? '真实' : '谣言'
  }
  realtimeList.value.unshift(newItem)
  if (realtimeList.value.length > 10) {
    realtimeList.value.pop()
  }
}

// 图表配置更新函数
const updateCharts = () => {
  if (trendChartRef.value) {
    const trendChart = echarts.getInstanceByDom(trendChartRef.value)
    trendChart?.setOption({
      series: [{
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 300))
      }]
    })
  }
  // ... 其他图表更新
}

// 初始化图表的函数
const initCharts = () => {
  // 趋势图增强动画效果
  if (trendChartRef.value) {
    const trendChart = echarts.init(trendChartRef.value)
    trendChart.setOption({
      backgroundColor: 'transparent',
      grid: {
        top: 40,
        right: 20,
        bottom: 40,
        left: 60
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLine: { 
          lineStyle: { 
            color: 'rgba(0, 255, 157, 0.3)',
            shadowColor: 'rgba(0, 255, 157, 0.5)',
            shadowBlur: 10
          } 
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      },
      yAxis: {
        type: 'value',
        axisLine: { 
          lineStyle: { 
            color: 'rgba(0, 255, 157, 0.3)',
            shadowColor: 'rgba(0, 255, 157, 0.5)',
            shadowBlur: 10
          } 
        },
        splitLine: { 
          lineStyle: { 
            color: 'rgba(0, 255, 157, 0.1)' 
          } 
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(0, 255, 157, 0.2)',
        textStyle: {
          color: '#fff'
        }
      },
      series: [{
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
        smooth: true,
        symbolSize: 12,
        symbol: 'circle',
        showSymbol: true,
        lineStyle: {
          width: 4,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00ffd5' },
            { offset: 0.5, color: '#00ff9d' },
            { offset: 1, color: '#00ff62' }
          ]),
          shadowColor: 'rgba(0, 255, 157, 0.5)',
          shadowBlur: 20
        },
        itemStyle: {
          color: '#00ff9d',
          borderColor: '#fff',
          borderWidth: 2,
          shadowColor: 'rgba(0, 255, 157, 0.8)',
          shadowBlur: 10
        },
        areaStyle: {
          opacity: 0.3,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 255, 213, 0.5)' },
            { offset: 0.5, color: 'rgba(0, 255, 157, 0.3)' },
            { offset: 1, color: 'rgba(0, 255, 98, 0.1)' }
          ])
        },
        emphasis: {
          scale: true,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 255, 157, 0.8)'
          }
        },
        // 数据增长动画
        markPoint: {
          symbol: 'circle',
          symbolSize: 15,
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ],
          itemStyle: {
            color: '#00ff9d',
            shadowBlur: 20,
            shadowColor: 'rgba(0, 255, 157, 0.5)'
          },
          label: {
            formatter: '{c}',
            position: 'top'
          }
        },
        // 增加动态效果
        effect: {
          show: true,
          period: 4,
          delay: function(idx: number) {
            return idx * 100;
          },
          symbolSize: 8,
          color: '#00ff9d',
          shadowBlur: 10
        }
      }]
    })
  }

  // 饼图增强动画效果
  if (pieChartRef.value) {
    const pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption({
      backgroundColor: 'transparent',
      tooltip: { 
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(0, 255, 157, 0.2)',
        textStyle: {
          color: '#fff'
        }
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: { 
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 12
        }
      },
      series: [{
        type: 'pie',
        roseType: 'radius',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        animationType: 'expansion',
        animationDuration: 2000,
        animationEasing: 'cubicInOut',
        animationDelay: function(idx: number) {
          return idx * 100;
        },
        itemStyle: {
          borderColor: '#1a1c20',
          borderWidth: 2,
          borderRadius: 10,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowOffsetY: 10
        },
        label: { 
          show: false 
        },
        emphasis: {
          scale: true,
          scaleSize: 10,
          itemStyle: {
            shadowBlur: 30,
            shadowColor: 'rgba(0, 255, 157, 0.5)'
          }
        },
        data: [
          {
            value: 1048,
            name: '政治谣言',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: '#ff00a0'
                }, {
                  offset: 1,
                  color: '#ff0062'
                }],
                global: false
              }
            }
          },
          {
            value: 735,
            name: '社会谣言',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#00ffd5' },
                { offset: 1, color: '#00ff9d' }
              ])
            }
          },
          {
            value: 580,
            name: '科技谣言',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#0090ff' },
                { offset: 1, color: '#0062ff' }
              ])
            }
          },
          {
            value: 484,
            name: '健康谣言',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#ff9000' },
                { offset: 1, color: '#ff6200' }
              ])
            }
          },
          {
            value: 300,
            name: '其他',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#9000ff' },
                { offset: 1, color: '#6200ff' }
              ])
            }
          }
        ]
      }]
    })

    // 添加自动旋转动画
    let angle = 0
    setInterval(() => {
      angle = (angle + 1) % 360
      pieChart.setOption({
        series: [{
          rotation: angle
        }]
      })
    }, 100)
  }

  // 地图增强动画效果
  if (mapChartRef.value) {
    const mapChart = echarts.init(mapChartRef.value)
    mapChart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} 条'
      },
      visualMap: {
        min: 0,
        max: 1000,
        text: ['高', '低'],
        realtime: false,
        calculable: true,
        inRange: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(66,185,131,0.1)'
          }, {
            offset: 1,
            color: 'rgba(66,185,131,0.8)'
          }], false),
        },
        textStyle: {
          color: '#fff'
        }
      },
      geo: {
        map: 'china',
        roam: true,
        scaleLimit: {
          min: 1,
          max: 3
        },
        label: {
          show: true,
          color: '#fff',
          fontSize: 10,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        },
        itemStyle: {
          areaColor: 'rgba(66,185,131,0.1)',
          borderColor: '#42b983',
          borderWidth: 1,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 20,
          shadowOffsetY: 5
        },
        emphasis: {
          itemStyle: {
            areaColor: 'rgba(66,185,131,0.3)',
            shadowColor: 'rgba(66,185,131,0.5)',
            shadowBlur: 30,
            shadowOffsetY: 10
          },
          label: {
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }
        },
        light: {
          main: {
            intensity: 1.2,
            shadow: true,
            alpha: 30,
            beta: 40
          }
        }
      },
      series: [
        {
          name: '谣言分布',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: [
            { name: '北京', value: [116.46, 39.92, 800] },
            { name: '上海', value: [121.48, 31.22, 700] },
            { name: '广州', value: [113.23, 23.16, 600] }
          ],
          symbolSize: (val: number[]) => Math.sqrt(val[2]) / 3,
          showEffectOn: 'render',
          rippleEffect: {
            period: 4,
            scale: 4,
            brushType: 'stroke'
          },
          itemStyle: {
            color: '#42b983',
            shadowBlur: 20,
            shadowColor: 'rgba(66,185,131,0.8)'
          },
          emphasis: {
            scale: true,
            itemStyle: {
              shadowBlur: 30,
              shadowColor: 'rgba(66,185,131,1)'
            }
          },
          // 热力图扩散效果
          effect: {
            show: true,
            period: 4,
            trailLength: 0.4,
            symbolSize: 10,
            symbol: 'circle',
            loop: true
          }
        },
        {
          name: '热点城市',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: [
            { name: '北京', value: [116.46, 39.92, 800] },
            { name: '上海', value: [121.48, 31.22, 700] },
            { name: '广州', value: [113.23, 23.16, 600] }
          ],
          symbolSize: (val: number[]) => Math.sqrt(val[2]) / 3,
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
            scale: 4,
            period: 4
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{b}',
            color: '#fff',
            fontSize: 12,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          },
          itemStyle: {
            color: '#42b983',
            shadowBlur: 20,
            shadowColor: 'rgba(66,185,131,0.8)'
          },
          emphasis: {
            scale: true,
            itemStyle: {
              shadowBlur: 30,
              shadowColor: 'rgba(66,185,131,1)'
            }
          },
          zlevel: 1
        }
      ]
    })
  }

  // 3D柱状图初始化
  if (bar3dChartRef.value) {
    const bar3dChart = echarts.init(bar3dChartRef.value)
    bar3dChart.setOption({
      backgroundColor: 'transparent',
      tooltip: {},
      visualMap: {
        max: 1000,
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9']
        }
      },
      xAxis3D: {
        type: 'category',
        data: ['微博', '微信', '抖音', '知乎', '其他'],
        nameTextStyle: { color: '#fff' }
      },
      yAxis3D: {
        type: 'category',
        data: ['真实', '谣言', '待核实'],
        nameTextStyle: { color: '#fff' }
      },
      zAxis3D: {
        type: 'value',
        nameTextStyle: { color: '#fff' }
      },
      grid3D: {
        boxWidth: 100,
        boxHeight: 80,
        boxDepth: 80,
        viewControl: {
          // 3D旋转动画
          autoRotate: true,
          autoRotateSpeed: 10,
          rotateSensitivity: 1
        },
        light: {
          main: {
            intensity: 1.2,
            shadow: true
          },
          ambient: {
            intensity: 0.3
          }
        }
      },
      series: [{
        type: 'bar3D',
        data: [
          // 示例数据
          [0, 0, 800], [1, 0, 600], [2, 0, 900], [3, 0, 400], [4, 0, 300],
          [0, 1, 500], [1, 1, 400], [2, 1, 300], [3, 1, 200], [4, 1, 100],
          [0, 2, 200], [1, 2, 300], [2, 2, 400], [3, 2, 100], [4, 2, 200]
        ].map(item => {
          return {
            value: [item[0], item[1], item[2]],
          }
        }),
        shading: 'lambert',
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold'
            }
          }
        }
      }]
    })
  }

  // 词云图初始化
  if (wordCloudRef.value) {
    const wordCloudChart = echarts.init(wordCloudRef.value)
    const wordCloudOption = {
      backgroundColor: 'transparent',
      tooltip: {
        show: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(66, 185, 131, 0.2)',
        textStyle: { color: '#fff' }
      },
      series: [{
        type: 'wordCloud',
        shape: 'circle',
        left: 'center',
        top: 'center',
        width: '100%',
        height: '100%',
        right: null,
        bottom: null,
        sizeRange: [12, 40],
        rotationRange: [-45, 45],
        rotationStep: 5,
        gridSize: 8,
        drawOutOfBound: false,
        layoutAnimation: true,
        textStyle: {
          fontFamily: 'var(--font-tech)',
          fontWeight: 'bold',
          color: function() {
            return [
              '#42b983', '#33d2aa', '#00ffd5', 
              '#00ff9d', '#00ff62', '#4cd964'
            ][Math.floor(Math.random() * 6)]
          }
        },
        emphasis: {
          textStyle: {
            shadowBlur: 15,
            shadowColor: 'rgba(66, 185, 131, 0.5)'
          }
        },
        data: [
          { name: '新冠疫情', value: 1000 },
          { name: '人工智能', value: 800 },
          { name: '虚假新闻', value: 700 },
          { name: '网络谣言', value: 650 },
          { name: '科技创新', value: 600 },
          { name: '社会热点', value: 550 },
          { name: '医疗健康', value: 500 },
          { name: '教育资讯', value: 450 },
          { name: '经济动态', value: 400 },
          { name: '环境保护', value: 350 },
          { name: '食品安全', value: 300 },
          { name: '交通出行', value: 250 },
          { name: '科学研究', value: 200 },
          { name: '文化艺术', value: 150 },
          { name: '体育赛事', value: 100 },
          { name: '国际关系', value: 90 },
          { name: '政治动态', value: 85 },
          { name: '经济改革', value: 80 },
          { name: '社会保障', value: 75 },
          { name: '科技前沿', value: 70 },
          { name: '教育改革', value: 65 },
          { name: '医疗改革', value: 60 },
          { name: '环境治理', value: 55 },
          { name: '食品监管', value: 50 },
          { name: '交通安全', value: 45 },
          { name: '科学探索', value: 40 },
          { name: '文化交流', value: 35 },
          { name: '体育发展', value: 30 }
        ]
      }]
    }

    wordCloudChart.setOption(wordCloudOption)

    // 监听容器大小变化
    window.addEventListener('resize', () => {
      wordCloudChart.resize()
    })

    // 定时更新数据
    let updateTimer = setInterval(() => {
      const data = wordCloudOption.series[0].data
      wordCloudChart.setOption({
        series: [{
          data: data.map(item => ({
            name: item.name,
            value: Math.random() * 1000 + 100
          }))
        }]
      })
    }, 5000)

    // 组件卸载时清理定时器
    onUnmounted(() => {
      clearInterval(updateTimer)
      window.removeEventListener('resize', () => {
        wordCloudChart.resize()
      })
    })
  }

  // 关系图谱初始化
  if (graphRef.value) {
    const graphChart = echarts.init(graphRef.value)
    graphChart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}'
      },
      legend: {
        data: ['谣言源', '传播者', '辟谣者'],
        textStyle: { color: '#fff' }
      },
      series: [{
        type: 'graph',
        layout: 'force',
        animation: true,
        label: {
          show: true,
          position: 'right',
          color: '#fff',
          fontSize: 12,
          fontWeight: 'bold'
        },
        draggable: true,
        data: [
          { name: '谣言A', symbolSize: 50, category: 0 },
          { name: '用户1', symbolSize: 30, category: 1 },
          { name: '用户2', symbolSize: 30, category: 1 },
          { name: '用户3', symbolSize: 30, category: 1 },
          { name: '用户4', symbolSize: 30, category: 1 },
          { name: '用户5', symbolSize: 30, category: 1 },
          { name: '用户6', symbolSize: 30, category: 1 },
          { name: '用户7', symbolSize: 30, category: 1 },
          { name: '用户8', symbolSize: 30, category: 1 },
          { name: '用户9', symbolSize: 30, category: 1 },
          { name: '用户10', symbolSize: 30, category: 1 },
          { name: '官方', symbolSize: 40, category: 2 }
        ],
        categories: [
          { name: '谣言源' },
          { name: '传播者' },
          { name: '辟谣者' }
        ],
        force: {
          repulsion: 300,
          edgeLength: [50, 100],
          gravity: 0.1
        },
        edges: [
          { source: '谣言A', target: '用户1' },
          { source: '用户1', target: '用户2' },
          { source: '用户2', target: '用户3' },
          { source: '用户3', target: '用户4' },
          { source: '用户4', target: '用户5' },
          { source: '用户5', target: '用户6' },
          { source: '用户6', target: '用户7' },
          { source: '用户7', target: '用户8' },
          { source: '用户8', target: '用户9' },
          { source: '用户9', target: '用户10' },
          { source: '官方', target: '谣言A' }
        ],
        lineStyle: {
          color: 'source',
          curveness: 0.3,
          width: 2,
          opacity: 0.8
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 3,
            opacity: 1
          }
        }
      }]
    })

    // 监听容器大小变化
    window.addEventListener('resize', () => {
      graphChart.resize()
    })

    // 组件卸载时清理事件监听
    onUnmounted(() => {
      window.removeEventListener('resize', () => {
        graphChart.resize()
      })
    })
  }

  // 雷达图初始化
  if (radarChartRef.value) {
    const radarChart = echarts.init(radarChartRef.value)
    radarChart.setOption({
      backgroundColor: 'transparent',
      radar: {
        indicator: [
          { name: '文本分析', max: 100 },
          { name: '图像识别', max: 100 },
          { name: '视频检测', max: 100 },
          { name: '语音识别', max: 100 },
          { name: '多模态融合', max: 100 }
        ],
        splitArea: {
          areaStyle: {
            color: ['rgba(66, 185, 131, 0.1)']
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(66, 185, 131, 0.3)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(66, 185, 131, 0.3)'
          }
        }
      },
      series: [{
        name: 'AI能力评估',
        type: 'radar',
        data: [{
          value: [90, 85, 80, 75, 88],
          name: '当前水平',
          areaStyle: {
            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
              {
                color: 'rgba(66, 185, 131, 0.5)',
                offset: 0
              },
              {
                color: 'rgba(66, 185, 131, 0.1)',
                offset: 1
              }
            ])
          },
          lineStyle: {
            color: '#42b983',
            width: 2
          },
          itemStyle: {
            color: '#42b983'
          }
        }]
      }]
    })
  }
}

// 修改 onMounted
onMounted(async () => {
  try {
    // 获取地图数据
    const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
    const geoJson = await response.json()
    echarts.registerMap('china', geoJson)

    // 初始化所有图表
    initCharts()
    
    // 开始自动刷新
    startAutoRefresh()

    // 添加窗口大小变化监听
    window.addEventListener('resize', () => {
      const charts = [
        trendChartRef.value && echarts.getInstanceByDom(trendChartRef.value),
        pieChartRef.value && echarts.getInstanceByDom(pieChartRef.value),
        mapChartRef.value && echarts.getInstanceByDom(mapChartRef.value)
      ].filter(Boolean)

      charts.forEach(chart => chart?.resize())
    })
  } catch (error) {
    console.error('初始化图表失败:', error)
  }
})

// 添加鼠标跟踪效果
const handleMouseMove = (e: MouseEvent) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  document.documentElement.style.setProperty('--mouse-x', `${x}%`);
  document.documentElement.style.setProperty('--mouse-y', `${y}%`);
};

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
.data-platform {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #1a1c20 0%, #2d3436 100%);
  color: #fff;
  position: relative;
}

.data-platform::before {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(66, 185, 131, 0.1) 0%,
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.data-platform:hover::before {
  opacity: 1;
}

.platform-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left h1 {
  font-family: var(--font-tech);
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #42b983 0%, #33d2aa 50%, #42b983 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 
    0 0 10px rgba(66, 185, 131, 0.3),
    0 0 20px rgba(66, 185, 131, 0.2),
    0 0 30px rgba(66, 185, 131, 0.1);
  animation: shine 3s linear infinite;
  letter-spacing: 1px;
}

.update-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8c8c8c;
  margin-top: 8px;
}

.core-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 8px 32px rgba(66, 185, 131, 0.2),
    inset 0 0 0 1px rgba(66, 185, 131, 0.1);
}

.metric-icon {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  transition: all 0.3s ease;
}

.metric-icon::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: inherit;
  border-radius: inherit;
  filter: blur(8px);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.metric-card:hover .metric-icon {
  transform: scale(1.1);
}

.metric-card:hover .metric-icon::before {
  opacity: 0.8;
  filter: blur(12px);
}

.total-news .metric-icon {
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
}

.accuracy .metric-icon {
  background: linear-gradient(135deg, #52c41a 0%, #13c2c2 100%);
}

.response .metric-icon {
  background: linear-gradient(135deg, #722ed1 0%, #eb2f96 100%);
}

.users .metric-icon {
  background: linear-gradient(135deg, #fa8c16 0%, #fa541c 100%);
}

.metric-value {
  font-family: var(--font-tech);
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff, #a8e6cf);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 
    0 0 10px rgba(255, 255, 255, 0.3),
    0 0 20px rgba(66, 185, 131, 0.2);
  position: relative;
  animation: value-pulse 2s ease-in-out infinite;
}

.metric-label {
  font-family: var(--font-code);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
}

.metric-trend {
  position: relative;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  width: fit-content;
  font-family: var(--font-code);
}

.metric-trend.up {
  background: rgba(82, 196, 26, 0.1);
  border: 1px solid rgba(82, 196, 26, 0.2);
}

.metric-trend.down {
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid rgba(255, 77, 79, 0.2);
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.chart-card {
  background: rgba(26, 28, 32, 0.8);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(66, 185, 131, 0.1);
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(66, 185, 131, 0.05);
  transform-style: preserve-3d;
  perspective: 1000px;
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 8px 32px rgba(66, 185, 131, 0.15),
    inset 0 0 0 1px rgba(66, 185, 131, 0.1);
}

.chart-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.chart-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  font-family: var(--font-tech);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background: linear-gradient(135deg, #fff, #a8e6cf);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 
    0 0 10px rgba(66, 185, 131, 0.3),
    0 0 20px rgba(66, 185, 131, 0.2);
  position: relative;
  padding-left: 16px;
}

.chart-header h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: linear-gradient(to bottom, #42b983, #33d2aa);
  border-radius: 2px;
}

.chart-header h3::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  color: rgba(66, 185, 131, 0.4);
  filter: blur(8px);
  animation: glow-pulse 2s ease-in-out infinite;
}

.chart-body {
  height: 300px;
  position: relative;
  transform: translateZ(20px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.2),
    0 4px 12px rgba(66, 185, 131, 0.1);
}

.list-body {
  height: 300px;
  overflow-y: auto;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(66, 185, 131, 0.1);
  position: relative;
  animation: slideIn 0.5s ease-out;
}

.list-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    transparent,
    rgba(66, 185, 131, 0.05),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.list-item:hover::before {
  opacity: 1;
}

.list-item .time {
  color: #8c8c8c;
  font-size: 12px;
  width: 80px;
  font-family: var(--font-code);
  letter-spacing: 1px;
}

.list-item .content {
  flex: 1;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 背景动画 */
.platform-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1c20 0%, #2d3436 100%);
}

/* 网格背景 */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(66, 185, 131, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(66, 185, 131, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  transform: perspective(1000px) rotateX(60deg);
  transform-origin: top;
  animation: grid-move 20s linear infinite;
  opacity: 0.5;
  mask-image: linear-gradient(to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0) 100%
  );
}

/* 科技线路图背景 */
.bg-circuit {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(66, 185, 131, 0.1) 0%, transparent 50%),
    linear-gradient(45deg, transparent 48%, rgba(66, 185, 131, 0.05) 50%, transparent 52%),
    linear-gradient(-45deg, transparent 48%, rgba(66, 185, 131, 0.05) 50%, transparent 52%);
  background-size: 
    100% 100%,
    60px 60px,
    60px 60px;
  opacity: 0.3;
  animation: circuit-pulse 4s ease-in-out infinite;
}

/* 动态粒子背景 */
.bg-particles {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(66, 185, 131, 0.1) 0%, transparent 2px),
    radial-gradient(circle at 30% 70%, rgba(51, 210, 170, 0.1) 0%, transparent 2px),
    radial-gradient(circle at 70% 30%, rgba(66, 185, 131, 0.1) 0%, transparent 2px);
  background-size: 
    60px 60px,
    50px 50px,
    40px 40px;
  animation: particles-float 20s linear infinite;
  opacity: 0.6;
}

/* 光晕效果 */
.bg-glow {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(66, 185, 131, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(51, 210, 170, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(66, 185, 131, 0.05) 0%, transparent 70%);
  filter: blur(60px);
  animation: glow-pulse 8s ease-in-out infinite alternate;
  mix-blend-mode: screen;
}

/* 动画定义 */
@keyframes grid-move {
  0% {
    transform: perspective(1000px) rotateX(60deg) translateY(0);
  }
  100% {
    transform: perspective(1000px) rotateX(60deg) translateY(40px);
  }
}

@keyframes circuit-pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes particles-float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(-60px) rotate(360deg);
  }
}

@keyframes glow-pulse {
  0% {
    opacity: 0.3;
    filter: blur(60px);
  }
  50% {
    opacity: 0.5;
    filter: blur(80px);
  }
  100% {
    opacity: 0.3;
    filter: blur(60px);
  }
}

/* 鼠标交互效果 */
.data-platform {
  position: relative;
}

.data-platform::before {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(66, 185, 131, 0.1) 0%,
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.data-platform:hover::before {
  opacity: 1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .bg-grid {
    background-size: 20px 20px;
  }
  
  .bg-circuit {
    background-size: 
      100% 100%,
      30px 30px,
      30px 30px;
  }
  
  .bg-particles {
    background-size: 
      30px 30px,
      25px 25px,
      20px 20px;
  }
}

/* 列表动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-move {
  transition: transform 0.5s ease;
}

/* 图表卡片悬浮效果增强 */
.chart-card {
  transform: translateZ(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chart-card:hover {
  transform: translateY(-2px) translateZ(0);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.chart-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 动画关键帧 */
@keyframes grid-move {
  0% {
    transform: perspective(1000px) rotateX(60deg) translateY(0);
  }
  100% {
    transform: perspective(1000px) rotateX(60deg) translateY(30px);
  }
}

@keyframes glow-pulse {
  0% {
    opacity: 0.5;
    filter: blur(40px);
  }
  100% {
    opacity: 0.8;
    filter: blur(60px);
  }
}

.metric-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: 0.5s;
}

.metric-card:hover::after {
  left: 100%;
}

.metric-value::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s ease;
}

.metric-card:hover .metric-value::after {
  width: 100%;
}

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

.chart-body::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.chart-card[loading] .chart-body::before {
  opacity: 1;
}

/* 动画效果 */
@keyframes shine {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

/* 数据更新动画 */
.metric-value {
  position: relative;
  overflow: hidden;
}

.metric-value::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(66, 185, 131, 0.2),
    transparent
  );
  animation: value-shine 2s ease-in-out infinite;
}

@keyframes value-shine {
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

/* 实时列表增强 */
.list-item {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(66, 185, 131, 0.05),
    transparent
  );
  border-radius: 8px;
  margin: 4px 0;
  padding: 12px;
  transition: all 0.3s ease;
}

.list-item:hover {
  background: rgba(66, 185, 131, 0.1);
  transform: translateX(4px);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .bg-grid {
    background-size: 20px 20px;
  }
  
  .metric-card {
    padding: 16px;
  }
  
  .header-left h1 {
    font-size: 24px;
  }
}

/* 数据加载动画 */
@keyframes data-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.metric-value.loading {
  animation: data-pulse 1.5s ease-in-out infinite;
}

/* 图表加载效果 */
.chart-body.loading::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    transparent,
    rgba(66, 185, 131, 0.1),
    transparent
  );
  animation: loading-shine 1.5s ease-in-out infinite;
}

@keyframes loading-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 响应式优化补充 */
@media (max-width: 768px) {
  .metric-card {
    grid-template-columns: 1fr;
    gap: 12px;
    text-align: center;
  }

  .metric-icon {
    margin: 0 auto;
  }

  .metric-trend {
    margin: 0 auto;
  }

  .chart-row {
    grid-template-columns: 1fr;
  }
}

/* 新增粒子效果 */
.bg-particles {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at center,
    rgba(66, 185, 131, 0.1) 0%,
    transparent 2px
  );
  background-size: 40px 40px;
  animation: particles-float 20s linear infinite;
}

@keyframes particles-float {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-40px);
  }
}

/* 优化标题区域 */
.title-wrapper {
  position: relative;
  margin-bottom: 16px;
}

.title-decoration {
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 2px;
  overflow: hidden;
}

.decoration-line {
  height: 100%;
  background: linear-gradient(90deg,
    rgba(66, 185, 131, 0.3),
    rgba(66, 185, 131, 0.8),
    rgba(66, 185, 131, 0.3)
  );
  animation: line-flow 2s linear infinite;
}

.decoration-dot {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: #42b983;
  border-radius: 50%;
  animation: dot-move 2s linear infinite;
}

@keyframes line-flow {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes dot-move {
  0% {
    left: 0;
  }
  100% {
    left: 100%;
  }
}

/* 优化更新时间显示 */
.refresh-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: rgba(66, 185, 131, 0.1);
  border: 1px solid rgba(66, 185, 131, 0.2);
  border-radius: 20px;
  font-size: 13px;
  color: #42b983;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #42b983;
  animation: pulse 2s ease-in-out infinite;
}

/* 优化时间范围选择器 */
.time-range :deep(.el-radio-button__inner) {
  background: transparent;
  border-color: rgba(66, 185, 131, 0.2);
  color: #8c8c8c;
  transition: all 0.3s ease;
}

.time-range :deep(.el-radio-button__inner:hover) {
  color: #42b983;
  border-color: rgba(66, 185, 131, 0.4);
}

.time-range :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: rgba(66, 185, 131, 0.1);
  border-color: #42b983;
  color: #42b983;
  box-shadow: -1px 0 0 0 #42b983;
}

/* 优化刷新按钮 */
.refresh-button {
  background: linear-gradient(135deg, #42b983, #33d2aa);
  border: none;
  padding: 12px 24px;
  transition: all 0.3s ease;
}

.refresh-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.refresh-button:active {
  transform: translateY(0);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .platform-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-right {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .time-range {
    width: 100%;
  }

  .refresh-button {
    width: 100%;
  }
}

/* 悬浮效果增强 */
.chart-card:hover .chart-body {
  transform: translateZ(30px);
}

/* 图表容器动画效果 */
.chart-body {
  position: relative;
  overflow: hidden;
}

.chart-body::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(66, 185, 131, 0.1),
    transparent
  );
  animation: chart-shine 3s ease-in-out infinite;
}

@keyframes chart-shine {
  0% {
    left: -100%;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

/* 定义字体变量 */
:root {
  --font-tech: 'Orbitron', sans-serif;
  --font-code: 'Source Code Pro', monospace;
}

/* 标签和数值样式 */
.metric-label {
  font-family: var(--font-code);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
}

.metric-trend {
  font-family: var(--font-code);
  font-weight: 600;
}

/* 实时列表样式 */
.list-item .time {
  font-family: var(--font-code);
  font-size: 12px;
  letter-spacing: 1px;
}

/* 动态发光效果 */
@keyframes value-pulse {
  0%, 100% {
    text-shadow: 
      0 0 10px rgba(255, 255, 255, 0.3),
      0 0 20px rgba(66, 185, 131, 0.2);
  }
  50% {
    text-shadow: 
      0 0 15px rgba(255, 255, 255, 0.4),
      0 0 25px rgba(66, 185, 131, 0.3),
      0 0 35px rgba(66, 185, 131, 0.2);
  }
}

/* 标题闪烁效果 */
@keyframes title-flicker {
  0%, 100% {
    text-shadow: 
      0 0 10px rgba(66, 185, 131, 0.3),
      0 0 20px rgba(66, 185, 131, 0.2);
  }
  33% {
    text-shadow: 
      0 0 10px rgba(66, 185, 131, 0.3),
      0 0 20px rgba(66, 185, 131, 0.2),
      0 0 30px rgba(66, 185, 131, 0.1);
  }
  66% {
    text-shadow: 
      0 0 15px rgba(66, 185, 131, 0.4),
      0 0 25px rgba(66, 185, 131, 0.3);
  }
}

/* 图表标题发光效果 */
.chart-header h3::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  color: rgba(66, 185, 131, 0.4);
  filter: blur(8px);
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.5;
    filter: blur(8px);
  }
  50% {
    opacity: 0.8;
    filter: blur(12px);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header-left h1 {
    font-size: 24px;
  }
  
  .metric-value {
    font-size: 24px;
  }
  
  .chart-header h3 {
    font-size: 16px;
  }
}

/* 新增图表样式 */
.chart-body {
  position: relative;
  height: 400px; /* 增加图表高度 */
}

/* 3D图表特殊样式 */
.chart-card:has(.bar3d-chart) {
  perspective: 1000px;
}

/* 词云图特殊样式 */
.chart-card:has(.word-cloud) {
  overflow: hidden;
}

/* 关系图谱特殊样式 */
.chart-card:has(.graph) {
  background: rgba(26, 28, 32, 0.9);
}

/* 雷达图特殊样式 */
.chart-card:has(.radar-chart) {
  background: rgba(26, 28, 32, 0.8);
}

/* 优化词云图容器样式 */
.chart-card .chart-body {
  width: 100%;
  height: 100%;
  min-height: 200px;
}

/* 确保词云图容器有足够空间 */
.chart-card:has([ref="wordCloudRef"]) {
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.chart-card:has([ref="wordCloudRef"]) .chart-body {
  flex: 1;
  overflow: hidden;
}

/* 优化关系图谱容器样式 */
.chart-card:has([ref="graphRef"]) {
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.chart-card:has([ref="graphRef"]) .chart-body {
  flex: 1;
  overflow: hidden;
}
</style> 