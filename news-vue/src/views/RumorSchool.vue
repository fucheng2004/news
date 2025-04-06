<template>
  <div class="rumor-school">
    <div class="background-pattern">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="particles">
          <div v-for="n in 8" :key="n" class="particle"></div>
        </div>
        <div class="wave"></div>
        
        <div class="grid-pattern">
          <div class="grid-line" v-for="n in 10" :key="`h-${n}`"></div>
          <div class="grid-line vertical" v-for="n in 10" :key="`v-${n}`"></div>
        </div>
        
        <div class="light-spots">
          <div class="spot spot-1"></div>
          <div class="spot spot-2"></div>
          <div class="spot spot-3"></div>
        </div>
      </div>
      <div class="light-beam"></div>
    </div>
    <div class="school-header">
      <div class="header-logo">
        <div class="logo-circle">
          <div class="logo-inner">
            <i class="fas fa-shield-alt primary-icon"></i>
            <i class="fas fa-check secondary-icon"></i>
          </div>
          <div class="logo-ring"></div>
        </div>
      </div>
      <h1>辨谣学堂</h1>
      <p class="subtitle">提升媒介素养，培养批判性思维</p>
    </div>
    
    <div class="school-content">
      <div class="course-filters">
        <div class="filter-header">
          <h2>课程列表</h2>
          <p>{{ filterDescription }}</p>
        </div>
        <div class="filter-actions">
          <el-radio-group v-model="currentFilter" size="large">
            <el-radio-button v-for="filter in filters" 
              :key="filter.value" 
              :label="filter.value"
            >
              <i :class="filter.icon"></i>
              {{ filter.label }}
              <span class="count">({{ getFilterCount(filter.value) }})</span>
            </el-radio-button>
          </el-radio-group>
          <div class="view-mode">
            <el-tooltip content="网格视图" placement="top">
              <el-button 
                :type="viewMode === 'grid' ? 'primary' : 'default'"
                @click="viewMode = 'grid'"
              >
                <i class="fas fa-th-large"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip content="列表视图" placement="top">
              <el-button 
                :type="viewMode === 'list' ? 'primary' : 'default'"
                @click="viewMode = 'list'"
              >
                <i class="fas fa-list"></i>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </div>

      <div class="course-grid" :class="viewMode">
        <TransitionGroup 
          :name="viewMode === 'grid' ? 'course-grid' : 'course-list'"
          tag="div"
          class="course-container"
        >
          <div 
            v-for="course in filteredCourses" 
            :key="course.id" 
            class="course-card"
          >
            <div class="course-image">
              <el-image 
                :src="course.image" 
                :alt="course.title"
                fit="cover"
              >
                <template #error>
                  <div class="image-placeholder">
                    <i class="fas" :class="getPlaceholderIcon(course.category)"></i>
                    <span>{{ course.title }}</span>
                  </div>
                </template>
              </el-image>
              <div class="course-tag" :class="course.level">{{ course.levelText }}</div>
              <div class="course-overlay">
                <span class="enter-text">进入学习</span>
              </div>
            </div>
            <div class="course-info">
              <h3>{{ course.title }}</h3>
              <p>{{ course.description }}</p>
              <div class="course-meta">
                <span class="duration">
                  <i class="fas fa-clock"></i> {{ course.duration }}
                </span>
                <span class="students">
                  <i class="fas fa-user-graduate"></i> {{ course.studentCount }}人学习
                </span>
                <span class="progress" v-if="course.progress">
                  <i class="fas fa-bookmark"></i> 已完成{{ course.progress }}%
                </span>
              </div>
            </div>
            <div class="course-footer">
              <div class="course-actions">
                <el-button 
                  type="primary" 
                  class="start-btn"
                  :class="{ 'has-progress': course.progress }"
                  @click.stop="navigateToCourse(course.id)"
                >
                  {{ course.progress ? '继续学习' : '开始学习' }}
                  <i class="fas fa-arrow-right"></i>
                </el-button>
                <el-button 
                  type="text"
                  class="preview-btn"
                  @click.stop="previewCourse(course)"
                >
                  <i class="fas fa-eye"></i> 预览
                </el-button>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- 课程预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      :title="selectedCourse?.title"
      width="60%"
      class="course-preview-dialog"
    >
      <div v-if="selectedCourse" class="preview-content">
        <img :src="selectedCourse.image" :alt="selectedCourse.title" class="preview-image">
        <div class="preview-info">
          <h3>课程简介</h3>
          <p>{{ selectedCourse.description }}</p>
          <div class="preview-meta">
            <div class="meta-item">
              <i class="fas fa-clock"></i>
              <span>课程时长：{{ selectedCourse.duration }}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-signal"></i>
              <span>难度等级：{{ selectedCourse.levelText }}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-user-graduate"></i>
              <span>学习人数：{{ selectedCourse.studentCount }}人</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="startCourse">
            立即学习
          </el-button>
        </span>
      </template>
    </el-dialog>
    <div class="scroll-hint" v-if="showScrollHint"></div>

    <div class="ai-assistant" :class="{ 'is-speaking': isAssistantSpeaking }">
      <div class="assistant-avatar" @click="handleAvatarClick">
        <div class="avatar-face">
          <div class="face-container">
            <!-- 眼睛 -->
            <div class="eyes">
              <div class="eye left"></div>
              <div class="eye right"></div>
            </div>
            <!-- 嘴巴 -->
            <div class="mouth"></div>
          </div>
          <!-- 头发装饰 -->
          <div class="hair-decoration">
            <i class="fas fa-star"></i>
          </div>
        </div>
        <div class="assistant-status"></div>
      </div>
      
      <!-- 对话框 -->
      <div class="chat-box" v-show="showChat">
        <div class="chat-header">
          <span>AI 助手小谣</span>
          <i class="fas fa-times close-btn" @click="showChat = false"></i>
        </div>
        <div class="chat-messages" ref="messagesRef">
          <div 
            v-for="(msg, index) in messages" 
            :key="index"
            :class="['message', msg.from]"
            :data-thinking="msg.isThinking"
          >
            <div class="message-content">
              {{ msg.text }}
            </div>
          </div>
        </div>
        <div class="chat-input">
          <el-input 
            v-model="userInput"
            placeholder="请输入问题..."
            @keyup.enter="sendMessage"
            :disabled="isAssistantSpeaking"
          >
            <template #append>
              <el-button 
                @click="sendMessage"
                :loading="isAssistantSpeaking"
                type="primary"
              >
                <i class="fas fa-paper-plane"></i>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// 默认课程图片
const defaultImages = {
  basic: `data:image/svg+xml;utf8,<svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:%23ECF5FF"/>
        <stop offset="100%" style="stop-color:%23F5F7FA"/>
      </linearGradient>
      <pattern id="grid1" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="%23409EFF" stroke-width="0.5" opacity="0.1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(%23bgGrad1)"/>
    <rect width="100%" height="100%" fill="url(%23grid1)"/>
    <circle cx="200" cy="100" r="50" fill="%23409EFF" opacity="0.1"/>
    <circle cx="200" cy="100" r="45" fill="none" stroke="%23409EFF" stroke-width="2" opacity="0.2"/>
    <path d="M175 100a25 25 0 1 1 50 0a25 25 0 1 1 -50 0" stroke="%23409EFF" fill="none" stroke-width="4"/>
    <path d="M215 115l20 20" stroke="%23409EFF" stroke-width="4"/>
    <circle cx="235" cy="135" r="5" fill="%23409EFF" opacity="0.6"/>
    <text x="200" y="180" text-anchor="middle" fill="%23409EFF" font-size="18" font-family="Arial">谣言识别基础</text>
  </svg>`,

  verify: `data:image/svg+xml;utf8,<svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:%23F0F9EB"/>
        <stop offset="100%" style="stop-color:%23F5F7FA"/>
      </linearGradient>
      <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="%2367C23A" stroke-width="0.5" opacity="0.1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(%23bgGrad2)"/>
    <rect width="100%" height="100%" fill="url(%23grid2)"/>
    <path d="M200 70l50 25v50l-50 25l-50-25v-50z" fill="%2367C23A" opacity="0.1"/>
    <path d="M200 75l45 22v45l-45 22l-45-22v-45z" fill="none" stroke="%2367C23A" stroke-width="2" opacity="0.2"/>
    <path d="M185 120l15 15l30-30" stroke="%2367C23A" stroke-width="4" fill="none"/>
    <text x="200" y="180" text-anchor="middle" fill="%2367C23A" font-size="18" font-family="Arial">信息真伪验证</text>
  </svg>`,

  cases: `data:image/svg+xml;utf8,<svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:%23FDF6EC"/>
        <stop offset="100%" style="stop-color:%23F5F7FA"/>
      </linearGradient>
      <pattern id="grid3" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="%23E6A23C" stroke-width="0.5" opacity="0.1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(%23bgGrad3)"/>
    <rect width="100%" height="100%" fill="url(%23grid3)"/>
    <rect x="150" y="90" width="25" height="70" fill="%23E6A23C" opacity="0.2"/>
    <rect x="185" y="60" width="25" height="100" fill="%23E6A23C" opacity="0.4"/>
    <rect x="220" y="100" width="25" height="60" fill="%23E6A23C" opacity="0.6"/>
    <path d="M150 160 L 245 160" stroke="%23E6A23C" stroke-width="2" opacity="0.3"/>
    <circle cx="150" cy="90" r="3" fill="%23E6A23C"/>
    <circle cx="185" cy="60" r="3" fill="%23E6A23C"/>
    <circle cx="220" cy="100" r="3" fill="%23E6A23C"/>
    <text x="200" y="180" text-anchor="middle" fill="%23E6A23C" font-size="18" font-family="Arial">典型案例分析</text>
  </svg>`
}

const router = useRouter()
const currentFilter = ref('all')
const viewMode = ref<'grid' | 'list'>('grid')
const previewDialogVisible = ref(false)
const selectedCourse = ref<Course | null>(null)
const showScrollHint = ref(true)

// 添加AI助手相关的状态
const isAssistantSpeaking = ref(false)
const assistantMessage = ref('')

// AI助手的提示消息
const assistantMessages = [
  '欢迎来到辨谣学堂！我是你的AI助手小谣，让我来帮你了解课程内容吧！',
  '你可以选择感兴趣的课程类型，我会为你推荐合适的课程~',
  '看到感兴趣的课程可以点击预览，了解更多详细信息哦！'
]

interface Course {
  id: number
  title: string
  description: string
  image: string
  duration: string
  level: 'basic' | 'intermediate' | 'advanced'
  levelText: string
  studentCount: number
  progress?: number
  category: string
  chapters?: {
    title: string
    duration: string
    content: string
  }[]
  objectives?: string[]
  skills?: {
    name: string
    level: string
    description: string
  }[]
  tools?: {
    name: string
    icon: string
    description: string
  }[]
}

const courses = ref<Course[]>([
  {
    id: 1,
    title: '谣言识别基础',
    description: '掌握谣言识别的基本方法，学习信息真伪判断的关键技巧，培养批判性思维能力',
    image: defaultImages.basic,
    duration: '45分钟',
    level: 'basic',
    levelText: '入门',
    studentCount: 1234,
    chapters: [
      {
        title: '什么是谣言',
        duration: '10分钟',
        content: '了解谣言的定义、特征和传播规律'
      },
      {
        title: '谣言的危害',
        duration: '10分钟',
        content: '分析谣言对个人和社会造成的影响'
      },
      {
        title: '识别方法',
        duration: '15分钟',
        content: '学习辨别谣言的基本方法和技巧'
      },
      {
        title: '实战练习',
        duration: '10分钟',
        content: '通过真实案例进行谣言识别练习'
      }
    ],
    objectives: [
      '理解谣言的本质和传播特点',
      '掌握基本的谣言识别方法',
      '学会使用工具验证信息真伪',
      '培养理性思考的习惯'
    ],
    skills: [
      {
        name: '信息甄别',
        level: 'basic',
        description: '学会分析信息来源可靠性'
      },
      {
        name: '逻辑思维',
        level: 'basic',
        description: '培养基本的逻辑推理能力'
      },
      {
        name: '工具使用',
        level: 'basic',
        description: '掌握常用的验证工具'
      }
    ],
    tools: [
      {
        name: '搜索引擎',
        icon: 'fa-search',
        description: '使用搜索引擎交叉验证信息'
      },
      {
        name: '图片识别',
        icon: 'fa-image',
        description: '学会使用图片反向搜索'
      },
      {
        name: '权威平台',
        icon: 'fa-check-circle',
        description: '了解可靠的信息验证平台'
      }
    ],
    category: 'basic'
  },
  {
    id: 2,
    title: '信息真伪验证',
    description: '掌握核实信息真实性的实用工具',
    image: defaultImages.verify,
    duration: '45分钟',
    level: 'intermediate',
    levelText: '进阶',
    studentCount: 856,
    progress: 60,
    category: 'advanced'
  },
  {
    id: 3,
    title: '典型案例分析',
    description: '深入分析真实谣言案例，提升实战能力',
    image: defaultImages.cases,
    duration: '60分钟',
    level: 'advanced',
    levelText: '高级',
    studentCount: 567,
    category: 'practice'
  }
])

const filteredCourses = computed(() => {
  if (currentFilter.value === 'all') return courses.value
  return courses.value.filter(course => course.category === currentFilter.value)
})

const navigateToCourse = (courseId: number) => {
  router.push(`/rumor-school/course/${courseId}`)
}

const getFilterCount = (filterValue: string) => {
  if (filterValue === 'all') return courses.value.length
  return courses.value.filter(course => course.category === filterValue).length
}

const previewCourse = (course: Course) => {
  selectedCourse.value = course
  previewDialogVisible.value = true
}

const startCourse = () => {
  if (selectedCourse.value) {
    previewDialogVisible.value = false
    navigateToCourse(selectedCourse.value.id)
  }
}

const filters = [
  { value: 'all', label: '全部课程', icon: 'fas fa-th-large' },
  { value: 'basic', label: '基础入门', icon: 'fas fa-book-reader' },
  { value: 'advanced', label: '进阶提升', icon: 'fas fa-chart-line' },
  { value: 'practice', label: '实战演练', icon: 'fas fa-laptop-code' }
]

const filterDescription = computed(() => {
  const filter = filters.find(f => f.value === currentFilter.value)
  switch (filter?.value) {
    case 'basic': return '掌握辨别谣言的基本技能和方法'
    case 'advanced': return '深入学习信息验证的进阶知识'
    case 'practice': return '通过实际案例提升实战能力'
    default: return '探索全部课程内容，提升媒介素养'
  }
})

// 监听滚动以隐藏提示
onMounted(() => {
  const hideScrollHint = () => {
    if (window.scrollY > 100) {
      showScrollHint.value = false
    }
  }
  window.addEventListener('scroll', hideScrollHint)
  onUnmounted(() => {
    window.removeEventListener('scroll', hideScrollHint)
  })

  // 在页面加载时显示欢迎消息
  setTimeout(() => {
    showAssistantMessage(assistantMessages[0])
  }, 1000)

  // 监听过滤器变化
  watch(currentFilter, () => {
    showAssistantMessage(assistantMessages[1])
  })

  // 监听预览对话框
  watch(previewDialogVisible, (newVal) => {
    if (newVal) {
      showAssistantMessage(assistantMessages[2])
    }
  })
})

// 显示AI助手消息
const showAssistantMessage = (message: string) => {
  assistantMessage.value = message
  isAssistantSpeaking.value = true
  setTimeout(() => {
    isAssistantSpeaking.value = false
    setTimeout(() => {
      assistantMessage.value = ''
    }, 300)
  }, 5000)
}

// 添加新的对话功能
const showChat = ref(false)
const userInput = ref('')
const messagesRef = ref<HTMLElement | null>(null)

interface ChatMessage {
  text: string
  from: 'user' | 'ai'
  isThinking?: boolean
}

const messages = ref<ChatMessage[]>([
  {
    text: '你好！我是 AI 助手小谣，请问有什么我可以帮你的吗？',
    from: 'ai'
  }
])

const handleAvatarClick = () => {
  showChat.value = true
  // 确保消息滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

// 更新接口定义
interface SparkResponse {
  generations: Array<Array<{
    text: string;
    message: {
      content: string;
      type: string;
    }
  }>>;
  llm_output: {
    token_usage: {
      question_tokens: number;
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    }
  };
  run: Array<{
    run_id: string;
  }>;
}

// 修改发送消息函数
const sendMessage = async () => {
  const text = userInput.value.trim()
  if (!text) return

  // 添加用户消息
  messages.value.push({
    text,
    from: 'user'
  })

  // 清空输入
  userInput.value = ''

  // 添加AI思考状态消息
  const thinkingMessage = {
    text: '正在思考中...',
    from: 'ai' as const,
    isThinking: true
  }
  messages.value.push(thinkingMessage)

  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })

  try {
    // 显示AI正在输入状态
    isAssistantSpeaking.value = true

    // 调用星火 API
    const response = await callSparkAPI(text)
    
    // 移除思考状态消息
    messages.value = messages.value.filter(msg => !msg.isThinking)
    
    // 从返回的数据结构中提取 AI 回复的文本
    if (response.generations?.[0]?.[0]?.text) {
      // 添加AI回复
      messages.value.push({
        text: response.generations[0][0].text,
        from: 'ai'
      })
    } else {
      throw new Error('未获取到有效回复')
    }

  } catch (error) {
    // 移除思考状态消息
    messages.value = messages.value.filter(msg => !msg.isThinking)
    
    messages.value.push({
      text: '抱歉，我暂时无法回复，请稍后再试。',
      from: 'ai'
    })
    console.error('处理回复出错:', error)
  } finally {
    isAssistantSpeaking.value = false
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 修改 API 调用函数
const callSparkAPI = async (text: string): Promise<SparkResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 100000); // 10秒超时

    const response = await fetch('http://localhost:8080/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({
        message: text
      }),
      credentials: 'include',
      signal: controller.signal,
      keepalive: true
    })

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('调用星火API出错:', error)
    throw error
  }
}

const getPlaceholderIcon = (category: string) => {
  switch (category) {
    case 'basic':
      return 'fa-book-reader'
    case 'advanced':
      return 'fa-chart-line'
    case 'practice':
      return 'fa-laptop-code'
    default:
      return 'fa-graduation-cap'
  }
}
</script>

<style lang="scss" scoped>
.rumor-school {
  position: relative;
  min-height: calc(100vh - 60px);
  padding: 40px 20px;
  overflow: hidden;

  // 添加字体变量
  --font-heading: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  font-family: var(--font-body);

  .background-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(135deg, rgba(252, 254, 255, 0.99) 0%, rgba(248, 250, 255, 0.97) 100%),
      radial-gradient(circle at 15% 15%, rgba(64, 158, 255, 0.06) 0%, transparent 70%),
      radial-gradient(circle at 85% 85%, rgba(103, 194, 58, 0.06) 0%, transparent 70%),
      radial-gradient(circle at 50% 50%, rgba(230, 162, 60, 0.03) 0%, transparent 60%),
      linear-gradient(45deg, 
        rgba(64, 158, 255, 0.015) 25%, 
        transparent 25%, 
        transparent 75%, 
        rgba(64, 158, 255, 0.015) 75%
      );
    background-size: auto, auto, auto, auto, 50px 50px;
    backdrop-filter: blur(70px);
    z-index: -1;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        linear-gradient(135deg, rgba(252, 254, 255, 0.99) 0%, rgba(248, 250, 255, 0.97) 100%),
        radial-gradient(circle at 15% 15%, rgba(64, 158, 255, 0.06) 0%, transparent 70%),
        radial-gradient(circle at 85% 85%, rgba(103, 194, 58, 0.06) 0%, transparent 70%),
        radial-gradient(circle at 50% 50%, rgba(230, 162, 60, 0.03) 0%, transparent 60%),
        linear-gradient(45deg, 
          rgba(64, 158, 255, 0.015) 25%, 
          transparent 25%, 
          transparent 75%, 
          rgba(64, 158, 255, 0.015) 75%
        );
      background-size: auto, auto, auto, auto, 50px 50px;
      backdrop-filter: blur(70px);
      animation: backgroundShift 30s ease-in-out infinite;
    }

    // 添加新的星光效果
    .starlight {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;

      .star {
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(64, 158, 255, 0.6);
        opacity: 0;

        @for $i from 1 through 20 {
          &:nth-child(#{$i}) {
            $randomTop: 5% * $i;
            $randomLeft: 5% * ($i + 3);
            
            top: $randomTop;
            left: $randomLeft;
            animation: 
              starTwinkle 2s ease-in-out infinite,
              starMove 15s linear infinite;
            animation-delay: -0.2s * $i;
          }
        }
      }
    }

    // 优化光斑效果
    .light-spots {
      .spot {
        &::before {
          content: '';
          position: absolute;
          inset: -20%;
          border-radius: inherit;
          background: inherit;
          filter: blur(50px);
          opacity: 0.3;
          animation: spotRipple 8s ease-in-out infinite;
        }

        &-1 {
          background: radial-gradient(circle at center,
            rgba(64, 158, 255, 0.25) 0%,
            rgba(64, 158, 255, 0.08) 40%,
            transparent 70%
          );
        }

        &-2 {
          background: radial-gradient(circle at center,
            rgba(103, 194, 58, 0.25) 0%,
            rgba(103, 194, 58, 0.08) 40%,
            transparent 70%
          );
        }

        &-3 {
          background: radial-gradient(circle at center,
            rgba(230, 162, 60, 0.25) 0%,
            rgba(230, 162, 60, 0.08) 40%,
            transparent 70%
          );
        }
      }
    }

    // 优化现有的浮动形状效果
    .floating-shapes {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      pointer-events: none;

      .shape {
        position: absolute;
        border-radius: 50%;
        opacity: 0.3;
        animation: float 20s infinite linear;

        &::before {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: inherit;
          background: inherit;
          filter: blur(15px);
          animation: glowPulse 4s ease-in-out infinite;
        }

        &::after {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: inherit;
          background: inherit;
          filter: blur(20px);
          opacity: 0.4;
          animation: shapeGlow 6s ease-in-out infinite;
        }

        &-1 {
          width: 300px;
          height: 300px;
          background: conic-gradient(
            from 0deg,
            rgba(64, 158, 255, 0.2),
            rgba(64, 158, 255, 0.05),
            rgba(64, 158, 255, 0.2)
          );
          top: -100px;
          left: -100px;
          animation-duration: 25s;
          mix-blend-mode: screen;
        }

        &-2 {
          width: 400px;
          height: 400px;
          background: conic-gradient(
            from 120deg,
            rgba(103, 194, 58, 0.2),
            rgba(103, 194, 58, 0.05),
            rgba(103, 194, 58, 0.2)
          );
          bottom: -150px;
          right: -150px;
          animation-duration: 30s;
          animation-delay: -5s;
          mix-blend-mode: screen;
        }

        &-3 {
          width: 250px;
          height: 250px;
          background: conic-gradient(
            from 240deg,
            rgba(230, 162, 60, 0.2),
            rgba(230, 162, 60, 0.05),
            rgba(230, 162, 60, 0.2)
          );
          top: 40%;
          left: 60%;
          animation-duration: 20s;
          animation-delay: -10s;
          mix-blend-mode: screen;
        }
      }

      .particles {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;

        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: rgba(64, 158, 255, 0.15);
          border-radius: 50%;
          animation: particleFloat 20s infinite linear;
          filter: blur(2px);

          @for $i from 1 through 8 {
            &:nth-child(#{$i}) {
              top: math.div(math.random() * 100%, 1);
              left: math.div(math.random() * 100%, 1);
              transform-origin: 
                math.div(math.random() * 100%, 1)
                math.div(math.random() * 100%, 1);
              animation-duration: math.div(15s + math.random() * 20s, 1);
              animation-delay: math.div(math.random() * -10s, 1);
              opacity: math.div(0.1 + math.random() * 0.5, 1);
              filter: blur(math.div(math.random() * 2px, 1));
            }
          }
        }
      }

      .wave {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 120px;
        background: 
          linear-gradient(
            transparent 0%,
            rgba(248, 250, 255, 0.3) 50%,
            rgba(244, 247, 255, 0.5) 100%
          );
        transform-origin: bottom;
        animation: waveMove 8s ease-in-out infinite;

        &::before,
        &::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 100%;
          background: inherit;
          opacity: 0.3;
          filter: blur(5px);
        }

        &::before {
          animation: waveMove 10s ease-in-out infinite;
          animation-delay: -2s;
        }

        &::after {
          animation: waveMove 12s ease-in-out infinite;
          animation-delay: -4s;
          opacity: 0.3;
        }
      }

      .grid-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        opacity: 0.02;

        .grid-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(64, 158, 255, 0.1) 50%,
            transparent 100%
          );
          animation: gridFloat 8s infinite ease-in-out;

          @for $i from 1 through 10 {
            &:nth-child(#{$i}) {
              top: math.div($i * 100%, 10);
              animation-delay: math.div($i * 0.2s, 1);
            }
          }

          &.vertical {
            top: 0;
            bottom: 0;
            width: 1px;
            height: auto;
            background: linear-gradient(180deg, 
              transparent 0%, 
              rgba(64, 158, 255, 0.1) 50%,
              transparent 100%
            );
            animation: gridFloatVertical 8s infinite ease-in-out;

            @for $i from 1 through 10 {
              &:nth-child(#{$i + 10}) {
                left: math.div($i * 100%, 10);
                animation-delay: math.div($i * 0.2s, 1);
              }
            }
          }

          &::before {
            content: '';
            position: absolute;
            inset: 0;
            background: inherit;
            filter: blur(2px);
            opacity: 0.5;
          }

          &.vertical::before {
            filter: blur(2px) brightness(1.2);
          }
        }
      }
    }

    // 添加新的动画关键帧
    @keyframes trailFloat {
      0% {
        transform: translateY(-100%) rotate(5deg);
      }
      100% {
        transform: translateY(100%) rotate(-5deg);
      }
    }

    @keyframes trailFade {
      0%, 100% {
        opacity: 0;
      }
      50% {
        opacity: 0.6;
      }
    }

    @keyframes shapeGlow {
      0%, 100% {
        filter: blur(20px) brightness(1);
        opacity: 0.4;
      }
      50% {
        filter: blur(25px) brightness(1.2);
        opacity: 0.5;
      }
    }

    @keyframes starTwinkle {
      0%, 100% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 0.8;
        transform: scale(1);
      }
    }

    @keyframes starMove {
      0% {
        transform: translateY(0) translateX(0);
      }
      50% {
        transform: translateY(30px) translateX(20px);
      }
      100% {
        transform: translateY(0) translateX(0);
      }
    }

    @keyframes spotRipple {
      0%, 100% {
        transform: scale(0.95);
        opacity: 0.3;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.4;
      }
    }

    @keyframes waveMove {
      0%, 100% {
        transform: scaleY(1) translateY(0);
      }
      50% {
        transform: scaleY(1.1) translateY(-5px);
      }
    }

    @keyframes waveScale {
      0%, 100% {
        transform: scaleX(1);
      }
      50% {
        transform: scaleX(1.1);
      }
    }
  }

  .school-header {
    text-align: center;
    margin-bottom: 60px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, 
        rgba(64, 158, 255, 0.8),
        rgba(103, 194, 58, 0.8)
      );
      border-radius: 3px;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
    }
    
    h1 {
      font-family: var(--font-heading);
      font-size: 38px;
      font-weight: 600;
      background: linear-gradient(120deg, #409EFF, #67C23A);
      -webkit-background-clip: text;
      color: transparent;
      letter-spacing: 0.05em;
      margin-bottom: 18px;
      text-shadow: 0 2px 10px rgba(64, 158, 255, 0.1);
    }
    
    .subtitle {
      font-size: 18px;
      color: #606266;
      letter-spacing: 0.03em;
      line-height: 1.6;
      font-weight: 400;
    }

    .header-logo {
      width: 120px;
      height: 120px;
      margin: 0 auto 24px;
      position: relative;
      
      .logo-circle {
        width: 100%;
        height: 100%;
        position: relative;
        animation: logoFloat 3s ease-in-out infinite;

        .logo-inner {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #409EFF, #67C23A);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 
            0 8px 30px rgba(64, 158, 255, 0.2),
            inset 0 2px 10px rgba(255, 255, 255, 0.3);
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            inset: -5px;
            background: inherit;
            filter: blur(10px);
            opacity: 0.5;
          }

          .primary-icon {
            font-size: 42px;
            color: white;
            position: relative;
            z-index: 2;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
            animation: iconPulse 2s ease-in-out infinite;
          }

          .secondary-icon {
            position: absolute;
            font-size: 24px;
            color: #67C23A;
            background: white;
            padding: 8px;
            border-radius: 50%;
            bottom: 15%;
            right: 15%;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 3;
            animation: checkBounce 2s ease-in-out infinite;
          }
        }

        .logo-ring {
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border: 2px solid rgba(64, 158, 255, 0.2);
          border-radius: 50%;
          animation: ringRotate 10s linear infinite;

          &::before,
          &::after {
            content: '';
            position: absolute;
            inset: -4px;
            border: 2px dashed rgba(103, 194, 58, 0.15);
            border-radius: 50%;
          }

          &::after {
            animation: ringRotate 15s linear infinite reverse;
          }
        }
      }
    }
  }

  .course-filters {
    text-align: center;
    margin-bottom: 40px;

    .filter-header {
      margin-bottom: 20px;

      h2 {
        font-family: var(--font-heading);
        font-size: 26px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 10px;
        letter-spacing: 0.02em;
      }

      p {
        font-size: 15px;
        color: #909399;
        line-height: 1.5;
      }
    }

    .filter-actions {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;

      .view-mode {
        display: flex;
        gap: 8px;
      }

      .count {
        font-size: 12px;
        opacity: 0.8;
        margin-left: 4px;
      }
    }

    :deep(.el-radio-button__inner) {
      font-family: var(--font-body);
      font-weight: 500;
      letter-spacing: 0.02em;
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(64, 158, 255, 0.2);
      
      &:hover {
        color: #409EFF;
        border-color: #409EFF;
        transform: translateY(-1px);
      }
      i {
        margin-right: 6px;
        font-size: 14px;
      }
    }
    
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
      background: #409EFF;
      border-color: #409EFF;
      box-shadow: -1px 0 0 0 #409EFF;
    }
  }

  .course-grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;

    &-inner {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }

    &.list {
      .course-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .course-card {
        display: flex;
        height: 160px;

        .course-image {
          width: 280px;
          height: 100%;
          flex-shrink: 0;
        }

        .course-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .course-footer {
          margin-top: auto;
          padding: 12px 24px;
        }
      }
    }

    // 添加网格视图的过渡动画
    &-enter-active,
    &-leave-active {
      transition: all 0.5s ease-out;
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
      transform: translateY(30px);
    }

    &-move {
      transition: transform 0.5s ease;
    }

    // 添加列表视图的过渡
    .course-list-move {
      transition: transform 0.5s ease;
    }

    .course-list-enter-active,
    .course-list-leave-active {
      transition: all 0.5s ease;
    }

    .course-list-enter-from,
    .course-list-leave-to {
      opacity: 0;
      transform: translateX(-30px);
    }

    .course-list-leave-active {
      position: absolute;
    }
  }

  .course-card {
    background: rgba(255, 255, 255, 0.98);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 
      0 4px 20px rgba(64, 158, 255, 0.06),
      0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(64, 158, 255, 0.1);
    cursor: pointer;

    &:hover {
      transform: translateY(-6px) scale(1.02);
      
      .course-image {
        img, .el-image {
          transform: scale(1.05);
          filter: brightness(1.05);
        }
        
        &::after {
          opacity: 0.8;
          height: 60px;
        }
      }
      
      .course-tag {
        transform: translateY(-4px) scale(1.05);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      }
    }

    .course-image {
      height: 200px;
      overflow: hidden;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 40px;
        background: linear-gradient(to top, 
          rgba(255, 255, 255, 0.95),
          rgba(255, 255, 255, 0.6) 40%,
          transparent
        );
      }
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }
      }

      .course-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg,
          rgba(64, 158, 255, 0.85) 0%,
          rgba(64, 158, 255, 0.75) 100%
        );
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;

        .enter-text {
          font-family: var(--font-heading);
          font-weight: 500;
          letter-spacing: 0.05em;
          color: white;
          font-size: 18px;
          padding: 12px 24px;
          border: none;
          backdrop-filter: blur(4px);
          transform: translateY(20px);
          transition: transform 0.3s ease;
          background: rgba(64, 158, 255, 0.9);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      }

      .course-tag {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 4px 12px;
        border-radius: 4px;
        color: white;
        font-size: 12px;
        font-family: var(--font-body);
        font-weight: 500;
        letter-spacing: 0.02em;
        z-index: 1;

        &.basic {
          background: linear-gradient(135deg, #67C23A, #85CE61);
        }

        &.intermediate {
          background: linear-gradient(135deg, #E6A23C, #F5A623);
        }

        &.advanced {
          background: linear-gradient(135deg, #F56C6C, #FF7875);
        }
      }

      .image-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
        color: #909399;
        gap: 12px;
        
        i {
          font-size: 36px;
          color: #409EFF;
          animation: iconPulse 2s infinite;
        }
        
        span {
          font-size: 16px;
          font-weight: 500;
          background: linear-gradient(90deg, #409EFF, #67C23A);
          -webkit-background-clip: text;
          color: transparent;
        }
      }

      :deep(.el-image) {
        width: 100%;
        height: 100%;
      }
    }

    .course-info {
      padding: 24px;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(250, 253, 255, 0.98) 100%
      );

      h3 {
        font-family: var(--font-heading);
        font-size: 20px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 12px;
        letter-spacing: 0.01em;
        line-height: 1.4;
      }

      p {
        font-size: 15px;
        color: #606266;
        line-height: 1.6;
        letter-spacing: 0.01em;
      }

      .course-meta {
        display: flex;
        gap: 16px;
        margin-top: 12px;
        font-size: 14px;
        font-weight: 500;
        color: #909399;
        transition: all 0.3s ease;

        span {
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.3s ease;

          i {
            font-size: 13px;
            color: #409EFF;
            transition: transform 0.3s ease;
          }

          &:hover {
            color: #409EFF;
            
            i {
              transform: scale(1.2) rotate(10deg);
            }
          }
        }

        .progress {
          i {
            color: #67C23A;
          }
          &:hover {
            color: #67C23A;
          }
        }

        .students {
          i {
            color: #E6A23C;
          }
          &:hover {
            color: #E6A23C;
          }
        }
      }
    }

    .course-footer {
      padding: 16px 24px;
      border-top: 1px solid rgba(64, 158, 255, 0.1);
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.9),
        rgba(250, 253, 255, 0.95)
      );

      .course-actions {
        display: flex;
        gap: 16px;
        align-items: center;

        .start-btn {
          flex: 1;
          padding: 8px 20px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(
            135deg,
            #409EFF,
            #4B9FFF
          );
          border: none;
          color: white;
          box-shadow: 0 2px 6px rgba(64, 158, 255, 0.2);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
            
            i {
              transform: translateX(4px);
            }
          }

          &.has-progress {
            background: linear-gradient(
              135deg,
              #67C23A,
              #85CE61
            );
            box-shadow: 0 2px 6px rgba(103, 194, 58, 0.2);

            &:hover {
              box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
            }
          }

          i {
            margin-left: 6px;
            transition: transform 0.3s ease;
          }
        }

        .preview-btn {
          padding: 6px 12px;
          color: #909399;
          transition: all 0.3s ease;

          &:hover {
            color: #409EFF;
            transform: translateY(-2px);
            
            i {
              transform: scale(1.2);
            }
          }

          i {
            margin-right: 4px;
            transition: transform 0.3s ease;
          }
        }
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .school-header {
    animation: fadeIn 0.8s ease-out;
  }

  .course-card {
    animation: fadeIn 0.8s ease-out;
    animation-fill-mode: both;

    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.1}s;
      }
    }
  }

  @keyframes float {
    0% {
      transform: rotate(0deg) translate(20px) rotate(0deg) scale(1);
      filter: blur(10px) brightness(1);
    }
    50% {
      transform: rotate(180deg) translate(30px) rotate(-180deg) scale(1.1);
      filter: blur(15px) brightness(1.1);
    }
    100% {
      transform: rotate(360deg) translate(20px) rotate(-360deg) scale(1);
      filter: blur(10px) brightness(1);
    }
  }

  .course-preview-dialog {
    :deep(.el-dialog) {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      
      .el-dialog__header {
        padding: 20px 24px;
        border-bottom: 1px solid rgba(64, 158, 255, 0.1);
        margin: 0;
        
        .el-dialog__title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 600;
          color: #303133;
        }
      }
      
      .el-dialog__footer {
        padding: 16px 24px;
        border-top: 1px solid rgba(64, 158, 255, 0.1);
        background: linear-gradient(
          to bottom,
          rgba(250, 253, 255, 0.95),
          rgba(248, 250, 255, 0.98)
        );
      }
    }

    .preview-content {
      .preview-image {
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(
            to top,
            rgba(255, 255, 255, 0.95),
            transparent
          );
        }
      }

      .preview-info {
        .preview-meta {
          .meta-item {
            padding: 12px;
            background: rgba(64, 158, 255, 0.05);
            border-radius: 8px;
            transition: all 0.3s ease;

            &:hover {
              background: rgba(64, 158, 255, 0.1);
              transform: translateY(-2px);
              
              i {
                transform: scale(1.2);
              }
            }

            i {
              transition: transform 0.3s ease;
            }
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: 20px 10px;

    .school-header {
      margin-bottom: 40px;

      h1 {
        font-size: 32px;
      }

      .subtitle {
        font-size: 16px;
      }

      .header-logo {
        width: 90px;
        height: 90px;
        margin-bottom: 20px;

        .logo-inner {
          .primary-icon {
            font-size: 32px;
          }

          .secondary-icon {
            font-size: 18px;
            padding: 6px;
          }
        }
      }
    }

    .course-grid {
      gap: 20px;
      padding: 10px;
    }

    .course-card {
      .course-image {
        height: 160px;
      }

      .course-info {
        padding: 16px;

        h3 {
          font-size: 18px;
        }

        p {
          font-size: 14px;
        }
      }

      .course-footer {
        padding: 12px 16px;
        flex-direction: column;
        gap: 12px;

        .course-meta {
          width: 100%;
          justify-content: space-around;
        }

        .start-btn {
          width: 100%;
        }
      }
    }

    .background-pattern {
      &::before {
        animation: none;
      }
    }

    .course-grid {
      &-enter-active,
      &-leave-active,
      &-move {
        transition-duration: 0.3s;
      }
    }

    .course-card {
      &:hover {
        animation: none;
      }
    }

    .course-filters {
      .filter-header {
        h2 {
          font-size: 22px;
        }
      }

      :deep(.el-radio-button__inner) {
        padding: 8px 12px;
        
        i {
          margin-right: 4px;
        }
      }
    }

    .course-preview-dialog {
      .preview-content {
        .preview-image {
          height: 200px;
        }
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .background-pattern {
      .wave,
      .wave::before,
      .wave::after {
        animation: none;
      }

      .particles .particle {
        animation: none;
      }

      .grid-pattern .grid-line,
      .light-spots .spot {
        animation: none;
      }
    }
    
    .school-header {
      .header-logo {
        .logo-circle,
        .logo-ring,
        .primary-icon,
        .secondary-icon {
          animation: none;
        }
      }
    }

    .course-grid,
    .background-pattern,
    .course-card,
    .light-spots {
      &-enter-active,
      &-leave-active,
      &-move,
      &::before,
      &:hover,
      .spot {
        animation: none;
        transition: none;
      }
    }
  }

  @keyframes particleFloat {
    0% {
      transform: rotate(0deg) translate(30px) rotate(0deg) scale(1);
    }
    50% {
      transform: rotate(180deg) translate(50px) rotate(-180deg) scale(1.2);
    }
    100% {
      transform: rotate(360deg) translate(30px) rotate(-360deg) scale(1);
    }
  }

  @keyframes gridFloat {
    0%, 100% {
      transform: scaleY(1) translateY(0);
      opacity: 0.03;
    }
    50% {
      transform: scaleY(1.5) translateY(10px);
      opacity: 0.05;
    }
  }

  @keyframes gridFloatVertical {
    0%, 100% {
      transform: scaleX(1) translateX(0);
      opacity: 0.2;
    }
    50% {
      transform: scaleX(1.5) translateX(10px);
      opacity: 0.3;
    }
  }

  @keyframes spotPulse {
    0%, 100% {
      transform: scale(1);
      filter: blur(90px) brightness(1);
    }
    50% {
      transform: scale(1.15);
      filter: blur(100px) brightness(1.1);
    }
  }

  @keyframes backgroundShift {
    0%, 100% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 2% 2%;
    }
  }

  @keyframes glowPulse {
    0%, 100% {
      filter: blur(15px) brightness(1);
    }
    50% {
      filter: blur(20px) brightness(1.2);
    }
  }

  @keyframes spotGlow {
    0%, 100% {
      filter: blur(30px) brightness(1);
      opacity: 0.3;
    }
    50% {
      filter: blur(40px) brightness(1.3);
      opacity: 0.4;
    }
  }

  @keyframes logoFloat {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes iconPulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  @keyframes checkBounce {
    0%, 100% {
      transform: scale(1) translateY(0);
    }
    50% {
      transform: scale(1.1) translateY(-5px);
    }
  }

  @keyframes ringRotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  // 添加背景动画
  @keyframes backgroundFlow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  // 添加悬浮效果动画
  @keyframes floatEffect {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  // 添加光晕效果动画
  @keyframes glowEffect {
    0%, 100% {
      opacity: 0.5;
      filter: blur(20px);
    }
    50% {
      opacity: 0.7;
      filter: blur(25px);
    }
  }

  // 添加波纹效果动画
  @keyframes rippleEffect {
    0% {
      transform: scale(1);
      opacity: 0.4;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.2;
    }
    100% {
      transform: scale(1);
      opacity: 0.4;
    }
  }

  // 添加光束效果
  .light-beam {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 200px;
      height: 1000px;
      background: linear-gradient(
        to bottom,
        rgba(64, 158, 255, 0.03),
        rgba(64, 158, 255, 0.08),
        rgba(64, 158, 255, 0.03)
      );
      transform: rotate(-45deg);
      animation: beamMove 8s ease-in-out infinite;
      filter: blur(20px);
    }

    &::after {
      animation-delay: -4s;
      background: linear-gradient(
        to bottom,
        rgba(103, 194, 58, 0.03),
        rgba(103, 194, 58, 0.08),
        rgba(103, 194, 58, 0.03)
      );
    }
  }

  // 添加新的动画关键帧
  @keyframes beamMove {
    0%, 100% {
      transform: rotate(-45deg) translateX(-50%) translateY(-50%);
      opacity: 0.5;
    }
    50% {
      transform: rotate(-45deg) translateX(50%) translateY(50%);
      opacity: 0.8;
    }
  }

  @keyframes cardHover {
    0% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-6px) scale(1.02);
    }
    100% {
      transform: translateY(0) scale(1);
    }
  }

  // 添加滚动提示动画
  .scroll-hint {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    animation: scrollHint 2s ease-in-out infinite;
    pointer-events: none;

    &::before {
      content: '';
      display: block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(64, 158, 255, 0.5);
      border-right: none;
      border-bottom: none;
      transform: rotate(45deg);
    }
  }

  @keyframes scrollHint {
    0%, 100% {
      opacity: 0;
      transform: translateX(-50%) translateY(0);
    }
    50% {
      opacity: 1;
      transform: translateX(-50%) translateY(-10px);
    }
  }

  // 优化过滤器切换动画
  .filter-actions {
    :deep(.el-radio-button__inner) {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
      }
    }
  }

  .ai-assistant {
    position: fixed;
    right: 30px;
    bottom: 30px;
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    gap: 12px;

    .assistant-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: white;
      box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.1),
        0 0 0 4px rgba(64, 158, 255, 0.1);
      position: relative;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: assistantFloat 3s ease-in-out infinite;
      pointer-events: auto;
      z-index: 2;

      &:hover {
        transform: scale(1.1);
        box-shadow: 
          0 6px 16px rgba(0, 0, 0, 0.15),
          0 0 0 6px rgba(64, 158, 255, 0.2);

        .avatar-face {
          .face-container {
            .eyes {
              animation: blinking 4s ease-in-out infinite;
            }
          }
        }
      }
    }

    .avatar-face {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(135deg, #FFB6C1, #FFC0CB);
      position: relative;
      overflow: hidden;
      
      .face-container {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        animation: faceBounce 3s ease-in-out infinite;

        .eyes {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;

          .eye {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #333;
            position: relative;
            animation: blinking 4s ease-in-out infinite;

            &::before {
              content: '';
              position: absolute;
              top: -1px;
              left: 2px;
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background: white;
              opacity: 0.8;
            }

            &.left {
              transform: rotate(-5deg);
            }

            &.right {
              transform: rotate(5deg);
            }
          }
        }

        .mouth {
          width: 16px;
          height: 8px;
          border-radius: 0 0 16px 16px;
          background: #333;
          position: relative;
          transition: all 0.3s ease;

          &::before {
            content: '';
            position: absolute;
            top: 2px;
            left: 4px;
            width: 8px;
            height: 4px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.3);
          }
        }
      }

      .hair-decoration {
        position: absolute;
        top: 4px;
        right: 4px;
        color: #FFD700;
        font-size: 14px;
        animation: starTwinkle 2s ease-in-out infinite;
        filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.5));
      }

      &::before {
        content: '';
        position: absolute;
        inset: -50%;
        background: radial-gradient(circle at 70% 30%,
          rgba(255, 255, 255, 0.8) 0%,
          transparent 60%
        );
        animation: faceGlow 3s ease-in-out infinite;
      }
    }
  }

  .assistant-bubble {
    background: white;
    border-radius: 16px;
    padding: 16px 20px;
    max-width: 280px;
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(64, 158, 255, 0.1);
    position: relative;
    pointer-events: auto;
    transform-origin: bottom right;
    animation: bubbleAppear 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(135deg,
        rgba(64, 158, 255, 0.05),
        rgba(103, 194, 58, 0.05)
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover::before {
      opacity: 1;
    }

    .bubble-content {
      .bubble-icon {
        color: #FFB900;
        margin-right: 8px;
        animation: iconFloat 2s ease-in-out infinite;
      }
    }

    .bubble-tail {
      position: absolute;
      right: -8px;
      bottom: 20px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 8px 0 8px 10px;
      border-color: transparent transparent transparent white;
      filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.1));

      &::before {
        content: '';
        position: absolute;
        left: -11px;
        top: -8px;
        border-style: solid;
        border-width: 8px 0 8px 10px;
        border-color: transparent transparent transparent rgba(64, 158, 255, 0.1);
        filter: blur(1px);
      }
    }
  }

  &.is-speaking {
    .avatar-face {
      .mouth {
        height: 12px;
        border-radius: 12px;
        animation: talking 0.3s ease-in-out infinite;
      }

      .eyes {
        animation: eyesHappy 0.3s ease-in-out infinite;
      }
    }

    .assistant-bubble {
      animation: bubblePulse 0.5s ease-in-out infinite;
    }
  }

  .chat-box {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 300px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    animation: slideUp 0.3s ease-out;
    pointer-events: auto;
    z-index: 1;

    .chat-header {
      padding: 12px 16px;
      background: linear-gradient(135deg, #409EFF, #67C23A);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;

      .close-btn {
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.3s;

        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    .chat-messages {
      height: 300px;
      padding: 16px;
      overflow-y: auto;
      background: #F5F7FA;
      
      &::-webkit-scrollbar {
        width: 6px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: #C0C4CC;
        border-radius: 3px;
      }
      
      &::-webkit-scrollbar-track {
        background: #F5F7FA;
      }

      .message {
        max-width: 80%;
        padding: 8px 12px;
        margin-bottom: 12px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.4;
        word-break: break-word;
        animation: messageSlide 0.3s ease-out;
        user-select: text;

        &.user {
          margin-left: auto;
          background: #409EFF;
          color: white;
          border-radius: 12px 12px 0 12px;
        }

        &.ai {
          margin-right: auto;
          background: white;
          color: #303133;
          border-radius: 12px 12px 12px 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
      }
    }

    .chat-input {
      padding: 12px;
      background: white;
      border-top: 1px solid #EBEEF5;
      pointer-events: auto;
      z-index: 2;

      :deep(.el-input) {
        .el-input__wrapper {
          border-radius: 20px 0 0 20px;
          box-shadow: 0 0 0 1px #DCDFE6 inset;
          
          &.is-focus {
            box-shadow: 0 0 0 1px #409EFF inset;
          }
        }

        .el-input-group__append {
          padding: 0;
          border-radius: 0 20px 20px 0;
          background: #409EFF;
          border: none;
          
          .el-button {
            border: none;
            background: transparent;
            color: white;
            padding: 8px 16px;
            pointer-events: auto;
            cursor: pointer;
            
            &:hover {
              background: #66B1FF;
            }
            
            &:active {
              background: #3a8ee6;
            }
            
            .fa-paper-plane {
              margin: 0;
            }
          }
        }
      }
    }
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 移动端适配
@media (max-width: 768px) {
  .ai-assistant {
    right: 20px;
    bottom: 20px;

    .assistant-avatar {
      width: 50px;
      height: 50px;
    }

    .assistant-bubble {
      max-width: 220px;
      padding: 10px 14px;
      font-size: 13px;
    }

    .chat-box {
      width: calc(100vw - 40px);
      left: 20px;
      right: 20px;
    }
  }
}

@keyframes shimmer {
  0% {
    transform: translate(-30%, -30%) rotate(30deg);
  }
  100% {
    transform: translate(30%, 30%) rotate(30deg);
  }
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

.message.ai {
  background: var(--el-color-primary-light-9);
  align-self: flex-start;
  
  &[data-thinking="true"] {
    .message-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    &::after {
      content: "...";
      animation: thinking 1.5s infinite;
      font-weight: bold;
    }
  }
}

@keyframes thinking {
  0%, 100% { content: "."; }
  33% { content: ".."; }
  66% { content: "..."; }
}
</style> 