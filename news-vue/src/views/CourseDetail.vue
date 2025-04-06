<template>
  <div class="course-detail">
    <!-- 顶部进度条 -->
    <div class="progress-bar">
      <el-progress 
        :percentage="courseProgress" 
        :format="format => `学习进度: ${format}%`"
        :stroke-width="15"
        :color="progressColor"
        status="success"
      />
    </div>

    <!-- 课程头部 -->
    <div class="course-header">
      <div class="header-background"></div>
      <div class="header-content">
        <div class="header-top">
          <el-breadcrumb>
            <el-breadcrumb-item to="/rumor-school">辨谣学堂</el-breadcrumb-item>
            <el-breadcrumb-item>{{ course?.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="actions">
            <el-button type="text" @click="toggleFavorite">
              <i class="fas fa-heart" :class="{ 'is-favorite': isFavorite }"></i>
              {{ isFavorite ? '已收藏' : '收藏课程' }}
            </el-button>
            <el-button type="text" @click="shareDialog = true">
              <i class="fas fa-share-alt"></i> 分享
            </el-button>
          </div>
        </div>
        <h1>{{ course?.title }}</h1>
        <p class="description">{{ course?.description }}</p>
        <div class="meta-info">
          <span><i class="fas fa-clock"></i> {{ course?.duration }}</span>
          <span><i class="fas fa-signal"></i> {{ course?.levelText }}</span>
          <span><i class="fas fa-user-graduate"></i> {{ course?.studentCount }}人学习</span>
          <span class="rating">
            <i class="fas fa-star"></i>
            <span class="score">{{ course?.rating || 4.5 }}</span>
            <div class="stars">
              <div class="stars-fill" :style="{ width: `${(course?.rating || 4.5) * 20}%` }"></div>
            </div>
          </span>
        </div>
      </div>
    </div>

    <!-- 课程内容 -->
    <div class="course-content">
      <el-row :gutter="20">
        <!-- 左侧主要内容 -->
        <el-col :span="18">
          <div class="main-content">
            <!-- 学习区域 -->
            <div class="learning-area" v-if="activeChapter !== -1">
              <div class="content-viewer">
                <div class="chapter-content">
                  <h3>{{ course?.chapters[activeChapter].title }}</h3>
                  <div class="text-content">
                    {{ course?.chapters[activeChapter].textContent }}
                  </div>
                  <div class="study-section">
                    <div class="key-points" v-if="course?.chapters[activeChapter].keyPoints?.length">
                      <h4><i class="fas fa-lightbulb"></i> 关键要点</h4>
                      <ul>
                        <li v-for="(point, index) in course?.chapters[activeChapter].keyPoints" 
                            :key="index">{{ point }}</li>
                      </ul>
                    </div>
                    <div class="study-tips" v-if="course?.chapters[activeChapter].tips?.length">
                      <h4><i class="fas fa-book-reader"></i> 学习建议</h4>
                      <ul>
                        <li v-for="(tip, index) in course?.chapters[activeChapter].tips" 
                            :key="index">{{ tip }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="learning-controls">
                <el-button-group>
                  <el-button type="primary" @click="previousChapter" :disabled="activeChapter === 0">
                    <i class="fas fa-step-backward"></i> 上一章
                  </el-button>
                  <el-button type="primary" @click="nextChapter" :disabled="activeChapter === (course?.chapters.length || 0) - 1">
                    下一章 <i class="fas fa-step-forward"></i>
                  </el-button>
                </el-button-group>
                <el-button type="success" @click="completeChapter" :disabled="isPlaying">
                  <i class="fas fa-check"></i> {{ isPlaying ? '已完成' : '完成学习' }}
                </el-button>
              </div>
            </div>

            <div class="chapter-list">
              <h2><i class="fas fa-list"></i> 课程大纲</h2>
              <div v-for="(chapter, index) in course?.chapters" :key="index" class="chapter-item">
                <div class="chapter-header" @click="toggleChapter(index)">
                  <span class="chapter-number">{{ index + 1 }}</span>
                  <h3>{{ chapter.title }}</h3>
                  <span class="duration">{{ chapter.duration }}</span>
                  <el-tag 
                    size="small" 
                    :type="getChapterStatus(index)"
                    class="chapter-status"
                    :effect="activeChapter === index ? 'light' : 'plain'"
                  >
                    {{ getChapterStatusText(index) }}
                  </el-tag>
                  <i class="fas" :class="activeChapter === index ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                </div>
                <div class="chapter-content" v-show="activeChapter === index">
                  <p>{{ chapter.textContent }}</p>
                  <div class="chapter-resources" v-if="chapter.resources">
                    <h4><i class="fas fa-paperclip"></i> 学习资料</h4>
                    <ul>
                      <li v-for="(resource, rIndex) in chapter.resources" :key="rIndex">
                        <el-tooltip :content="resource.name" placement="top">
                          <el-button size="small" circle @click="openResource(resource.url)">
                            <i :class="getResourceIcon(resource.type)"></i>
                          </el-button>
                        </el-tooltip>
                      </li>
                    </ul>
                  </div>
                  <el-button type="primary" @click="startLesson(index)">
                    开始学习
                    <i class="fas fa-play-circle"></i>
                  </el-button>
                </div>
              </div>
            </div>

            <!-- 学习笔记 -->
            <div class="notes-section">
              <h2><i class="fas fa-edit"></i> 学习笔记</h2>
              <el-input
                type="textarea"
                v-model="noteContent"
                :rows="4"
                placeholder="记录你的学习心得..."
              />
              <div class="notes-actions">
                <el-button type="primary" @click="saveNote">
                  <i class="fas fa-save"></i> 保存笔记
                </el-button>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 右侧信息栏 -->
        <el-col :span="6">
          <div class="side-content">
            <!-- 学习目标 -->
            <div class="objectives-card">
              <h3><i class="fas fa-bullseye"></i> 学习目标</h3>
              <ul>
                <li v-for="(objective, index) in course?.objectives" :key="index">
                  <i class="fas fa-check"></i>
                  <span>{{ objective }}</span>
                </li>
              </ul>
            </div>

            <!-- 技能培养 -->
            <div class="skills-card">
              <h3><i class="fas fa-brain"></i> 技能培养</h3>
              <div v-for="(skill, index) in course?.skills" :key="index" class="skill-item">
                <div class="skill-header">
                  <span>{{ skill.name }}</span>
                  <span class="level">{{ skill.level }}</span>
                </div>
                <el-progress :percentage="skill.level === 'basic' ? 30 : 60" :stroke-width="8" />
                <p>{{ skill.description }}</p>
              </div>
            </div>

            <!-- 相关工具 -->
            <div class="tools-card">
              <h3><i class="fas fa-tools"></i> 相关工具</h3>
              <div class="tools-grid">
                <div v-for="(tool, index) in course?.tools" :key="index" class="tool-item">
                  <i class="fas" :class="tool.icon"></i>
                  <h4>{{ tool.name }}</h4>
                  <p>{{ tool.description }}</p>
                </div>
              </div>
            </div>

            <!-- 学习进度 -->
            <div class="progress-card">
              <h3><i class="fas fa-chart-line"></i> 学习进度</h3>
              <el-progress type="circle" :percentage="courseProgress" />
              <div class="progress-stats">
                <div class="stat-item">
                  <span class="label">已学习</span>
                  <span class="value">{{ completedChapters.length }}/{{ course?.chapters.length }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">学习时长</span>
                  <span class="value">{{ studyTime }}分钟</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 分享对话框 -->
    <el-dialog v-model="shareDialog" title="分享课程" width="400px">
      <div class="share-options">
        <div class="share-item" v-for="option in shareOptions" :key="option.type">
          <el-button :type="option.type as EpPropMergeType<StringConstructor, '' | 'text' | 'primary' | 'success' | 'warning' | 'info' | 'default' | 'danger', unknown> | undefined" circle>
            <i class="fab" :class="option.icon"></i>
          </el-button>
          <span>{{ option.label }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { EpPropMergeType } from 'element-plus/es/utils/index.mjs'

// 定义课程相关的接口
interface Course {
  id: number
  title: string
  description: string
  duration: string
  level: 'basic' | 'intermediate' | 'advanced'
  levelText: string
  studentCount: number
  rating?: number
  chapters: {
    title: string
    duration: string
    content: string
    textContent: string
    keyPoints?: string[]
    tips?: string[]
    resources?: {
      name: string
      type: string
      url: string
    }[]
  }[]
  objectives: string[]
  skills: {
    name: string
    level: string
    description: string
  }[]
  tools: {
    name: string
    icon: string
    description: string
  }[]
}

// 定义定时器变量
let timer: number

const course = ref<Course | null>(null)
const activeChapter = ref(0)
const courseProgress = ref(0)
const isFavorite = ref(false)
const shareDialog = ref(false)
const noteContent = ref('')
const studyTime = ref(0)
const completedChapters = ref<number[]>([])
const isLoading = ref(false)

// 分享选项
const shareOptions = [
  { type: 'primary', icon: 'fa-weixin', label: '微信' },
  { type: 'success', icon: 'fa-weibo', label: '微博' },
  { type: 'warning', icon: 'fa-qq', label: 'QQ' },
  { type: 'info', icon: 'fa-link', label: '复制链接' }
]

onMounted(async () => {
  // 这里应该从API获取课程数据
  // 临时使用模拟数据
  course.value = {
    id: 1,
    title: '谣言识别基础',
    description: '掌握谣言识别的基本方法，学习信息真伪判断的关键技巧，培养批判性思维能力',
    duration: '45分钟',
    level: 'basic',
    levelText: '入门',
    studentCount: 1234,
    chapters: [
      {
        title: '什么是谣言',
        duration: '10分钟',
        content: '了解谣言的定义、特征和传播规律',
        textContent: `谣言是指未经证实的、在社会上流传的信息。它具有以下特征：
          1. 传播速度快：通过社交媒体和即时通讯工具快速传播
          2. 真假难辨：往往混合真实和虚假信息
          3. 情绪化：容易引起人们的恐慌、愤怒等情绪
          4. 具有目的性：可能出于各种动机传播
          
          谣言的传播规律：
          - 信息空白期最容易滋生谣言
          - 重大事件后谣言传播活跃
          - 与民众切身利益相关的话题易引发谣言
          - 谣言往往随时间推移自行消亡`,
        keyPoints: [
          '谣言的四个主要特征：传播速度快、真假难辨、情绪化、目的性',
          '谣言传播的关键时期：信息空白期和重大事件后',
          '谣言的自然消亡规律与时间关系'
        ],
        tips: [
          '在接收信息时保持理性思考',
          '注意观察信息的传播时机和背景',
          '关注信息的情绪引导倾向'
        ],
        resources: [
          { name: '什么是谣言.pdf', type: 'pdf', url: 'https://example.com/what-is-rumor.pdf' },
          { name: '什么是谣言.doc', type: 'doc', url: 'https://example.com/what-is-rumor.doc' },
          { name: '什么是谣言.video', type: 'video', url: 'https://example.com/what-is-rumor.mp4' },
          { name: '什么是谣言.link', type: 'link', url: 'https://example.com/what-is-rumor' }
        ]
      },
      {
        title: '谣言的危害',
        duration: '10分钟',
        content: '分析谣言对个人和社会造成的影响',
        textContent: `谣言的危害主要表现在以下方面：
          1. 个人层面：
             - 造成不必要的恐慌和焦虑
             - 影响正常生活和工作
             - 可能导致错误决策
          
          2. 社会层面：
             - 破坏社会秩序和稳定
             - 损害公共信任体系
             - 干扰正常的信息传播
             - 浪费社会资源`,
        keyPoints: [
          '谣言对个人心理和行为的负面影响',
          '谣言对社会信任和秩序的破坏作用',
          '谣言传播带来的资源浪费问题'
        ],
        tips: [
          '学会识别谣言对自身的影响',
          '培养对信息的免疫力',
          '参与谣言治理，从自身做起'
        ],
        resources: [
          { name: '谣言的危害.pdf', type: 'pdf', url: 'https://example.com/rumor-harm.pdf' },
          { name: '谣言的危害.doc', type: 'doc', url: 'https://example.com/rumor-harm.doc' },
          { name: '谣言的危害.video', type: 'video', url: 'https://example.com/rumor-harm.mp4' },
          { name: '谣言的危害.link', type: 'link', url: 'https://example.com/rumor-harm' }
        ]
      },
      {
        title: '识别方法',
        duration: '15分钟',
        content: '学习辨别谣言的基本方法和技巧',
        textContent: `识别谣言的基本方法包括：
          1. 信息来源核实
             - 检查信息发布者的身份和可信度
             - 追溯信息的最初来源
             - 查证官方或权威机构的相关声明
          
          2. 内容真实性验证
             - 运用逻辑思维分析内容的合理性
             - 使用搜索引擎交叉验证
             - 查看其他媒体的相关报道
          
          3. 图片真伪鉴别
             - 使用图片反向搜索工具
             - 分析图片的细节和背景
             - 注意图片的时间和地点信息`,
        keyPoints: [
          '信息来源的可靠性验证方法',
          '内容真实性的交叉验证技巧',
          '图片真伪的鉴别要点'
        ],
        tips: [
          '建立完整的信息验证流程',
          '保持客观中立的态度',
          '及时更新验证方法'
        ],
        resources: [
          { name: '谣言识别方法.pdf', type: 'pdf', url: 'https://example.com/rumor-identification.pdf' },
          { name: '谣言识别工具.doc', type: 'doc', url: 'https://example.com/rumor-tools.doc' }
        ]
      },
      {
        title: '实战练习',
        duration: '10分钟',
        content: '通过真实案例进行谣言识别练习',
        textContent: `让我们通过以下案例来练习谣言识别：
          案例分析：
          1. 社交媒体谣言案例
             - 分析传播特征
             - 识别关键信息点
             - 运用验证方法
          
          2. 图片类谣言案例
             - 图片真实性验证
             - 上下文关系分析
             - 时间线梳理
          
          3. 综合性谣言案例
             - 多维度信息核实
             - 证据链完整性检查
             - 结论形成过程`,
        keyPoints: [
          '实际案例中的谣言特征识别',
          '不同类型谣言的验证方法',
          '完整的谣言分析流程'
        ],
        tips: [
          '注意收集完整的证据',
          '系统性思考问题',
          '总结经验教训'
        ],
        resources: [
          { name: '谣言案例分析.pdf', type: 'pdf', url: 'https://example.com/case-study.pdf' },
          { name: '实战技巧总结.doc', type: 'doc', url: 'https://example.com/practical-tips.doc' }
        ]
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
    ]
  }

  // 初始化学习进度
  updateProgress()

  // 监听学习时长
  timer = window.setInterval(() => {
    if (activeChapter.value !== -1) {
      studyTime.value++
    }
  }, 60000) // 每分钟更新一次
})

onUnmounted(() => {
  // 清理定时器
  clearInterval(timer)
})

const toggleChapter = (index: number) => {
  if (activeChapter.value === index) {
    // 如果点击当前章节，不做任何操作
    return
  }
  activeChapter.value = index
  // 滚动到学习区域
  nextTick(() => {
    const learningArea = document.querySelector('.learning-area')
    if (learningArea) {
      learningArea.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const startLesson = (chapterIndex: number) => {
  activeChapter.value = chapterIndex
  nextTick(() => {
    const learningArea = document.querySelector('.learning-area')
    if (learningArea) {
      learningArea.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

// 章节状态
const getChapterStatus = (index: number) => {
  if (completedChapters.value.includes(index)) return 'success'
  if (index === activeChapter.value) return 'primary'
  return 'info'
}

const getChapterStatusText = (index: number) => {
  if (completedChapters.value.includes(index)) return '已完成'
  if (index === activeChapter.value) return '学习中'
  return '未开始'
}

// 资源图标
const getResourceIcon = (type: string) => {
  const icons = {
    pdf: ['fas', 'fa-file-pdf'],
    doc: ['fas', 'fa-file-word'],
    video: ['fas', 'fa-file-video'],
    link: ['fas', 'fa-link']
  }
  return icons[type as keyof typeof icons] || ['fas', 'fa-file']
}

// 章节控制
const previousChapter = () => {
  if (activeChapter.value > 0) {
    activeChapter.value--
    nextTick(() => {
      const learningArea = document.querySelector('.learning-area')
      if (learningArea) {
        learningArea.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }
}

const nextChapter = () => {
  if (course.value && activeChapter.value < course.value.chapters.length - 1) {
    activeChapter.value++
    nextTick(() => {
      const learningArea = document.querySelector('.learning-area')
      if (learningArea) {
        learningArea.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }
}

const completeChapter = () => {
  if (activeChapter.value === -1) return
  if (!completedChapters.value.includes(activeChapter.value)) {
    completedChapters.value.push(activeChapter.value)
    updateProgress()
    ElMessage.success('恭喜完成本章学习！')
    // 自动进入下一章
    if (course.value && activeChapter.value < course.value.chapters.length - 1) {
      // 延迟切换到下一章，给用户一个视觉反馈的时间
      setTimeout(() => {
        nextChapter()
        // 更新学习状态提示
        ElMessage.info('已自动进入下一章')
      }, 800)
    } else {
      // 如果是最后一章
      ElMessage.success('恭喜你完成所有章节的学习！')
    }
  }
}

// 更新进度
const updateProgress = () => {
  if (course.value) {
    courseProgress.value = Math.round((completedChapters.value.length / course.value.chapters.length) * 100)
  }
}

// 收藏课程
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // TODO: 调用收藏API
}

// 保存笔记
const saveNote = () => {
  if (noteContent.value.trim()) {
    // TODO: 调用保存笔记API
    ElMessage.success('笔记保存成功')
  }
}

// 进度条颜色
const progressColor = computed(() => {
  if (courseProgress.value < 30) return '#909399'
  if (courseProgress.value < 70) return '#409EFF'
  return '#67C23A'
})

// 打开资源
const openResource = (url: string) => {
  window.open(url, '_blank')
}

// 修改视频播放相关函数

const isPlaying = computed(() => completedChapters.value.includes(activeChapter.value))

// 修改章节监听
watch(
  () => activeChapter.value,
  (newVal) => {
    // 重置加载状态
    isLoading.value = false
    // 更新学习状态
    if (completedChapters.value.includes(newVal)) {
      // 避免频繁提示
      if (!isPlaying.value) {
        ElMessage.info('你已经完成本章学习')
      }
    }
    // 更新页面标题
    if (course.value) {
      document.title = `${course.value.chapters[newVal].title} - ${course.value.title}`
    }
  }
)
</script>

<style lang="scss" scoped>
.course-detail {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;

  .course-header {
    position: relative;
    overflow: hidden;
    background: white;
    padding: 40px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .header-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(103, 194, 58, 0.1));
      z-index: 0;
      
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: url('@/assets/pattern.svg') repeat;
        opacity: 0.1;
        background-size: 200px;
        animation: patternMove 20s linear infinite;
      }
    }

    .header-content {
      position: relative;
      z-index: 1;

      .actions {
        .el-button {
          transition: all 0.3s;
          
          i {
            transition: all 0.3s;
            
            &.is-favorite {
              color: #F56C6C;
              transform: scale(1.2);
            }
          }
          
          &:hover {
            transform: translateY(-2px);
          }
        }
      }

      h1 {
        font-size: 32px;
        color: #303133;
        margin: 20px 0;
      }

      .description {
        font-size: 16px;
        color: #606266;
        margin-bottom: 20px;
        line-height: 1.6;
      }

      .meta-info {
        display: flex;
        gap: 20px;
        color: #909399;
        background: rgba(255, 255, 255, 0.8);
        padding: 15px;
        border-radius: 8px;
        backdrop-filter: blur(5px);
        
        span {
          display: flex;
          align-items: center;
          gap: 8px;

          i {
            color: #409EFF;
            font-size: 18px;
            background: rgba(64, 158, 255, 0.1);
            padding: 8px;
            border-radius: 50%;
          }
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .score {
            font-weight: 500;
            color: #F56C6C;
          }
          
          .stars {
            position: relative;
            width: 80px;
            height: 16px;
            background: #DCDFE6;
            border-radius: 8px;
            overflow: hidden;
            
            .stars-fill {
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              background: linear-gradient(90deg, #F56C6C, #E6A23C);
              transition: width 0.3s;
            }
          }
        }
      }
    }
  }

  .course-content {
    .main-content {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      .learning-area {
        margin-bottom: 30px;
        
        .content-viewer {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

          .chapter-content {
            h3 {
              font-size: 24px;
              color: #303133;
              margin-bottom: 20px;
              padding-bottom: 16px;
              border-bottom: 1px solid #EBEEF5;
            }

            .text-content {
              font-size: 16px;
              line-height: 1.8;
              color: #606266;
              white-space: pre-line;
              margin-bottom: 24px;
            }

            .study-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-top: 24px;

              .key-points, .study-tips {
                background: #f5f7fa;
                padding: 20px;
                border-radius: 8px;
                
                h4 {
                  color: #409EFF;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  margin-bottom: 16px;
                  font-size: 18px;
                  
                  i {
                    font-size: 20px;
                  }
                }

                ul {
                  list-style: none;
                  padding: 0;
                  margin: 0;

                  li {
                    position: relative;
                    padding-left: 24px;
                    margin-bottom: 12px;
                    color: #606266;
                    line-height: 1.6;

                    &::before {
                      content: '';
                      position: absolute;
                      left: 0;
                      top: 8px;
                      width: 6px;
                      height: 6px;
                      border-radius: 50%;
                      background: #409EFF;
                    }

                    &:last-child {
                      margin-bottom: 0;
                    }
                  }
                }
              }

              .study-tips {
                h4 {
                  color: #67C23A;
                }

                ul li::before {
                  background: #67C23A;
                }
              }
            }
          }
        }
        
        .learning-controls {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          
          .el-button {
            &[disabled] {
              opacity: 0.7;
              cursor: not-allowed;
            }
            
            &.el-button--success {
              background: var(--el-color-success);
              border-color: var(--el-color-success);
              
              &:hover:not([disabled]) {
                background: var(--el-color-success-light-3);
                border-color: var(--el-color-success-light-3);
              }
            }
          }
        }
      }

      .chapter-list {
        .chapter-item {
          border-bottom: 1px solid #EBEEF5;
          
          &:last-child {
            border-bottom: none;
          }

          .chapter-header {
            padding: 20px;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s;
            border-radius: 8px;
            margin: 8px 0;
            
            &:hover {
              background: linear-gradient(90deg, rgba(64, 158, 255, 0.1), transparent);
            }

            .chapter-number {
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: linear-gradient(135deg, #409EFF, #67C23A);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 16px;
              box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
            }

            h3 {
              flex: 1;
              margin: 0;
              font-size: 16px;
              color: #303133;
            }

            .duration {
              color: #909399;
              margin: 0 16px;
            }
          }

          .chapter-content {
            padding: 20px;
            background: #f5f7fa;
            border-top: 1px solid #EBEEF5;
            border-radius: 0 0 8px 8px;

            p {
              color: #606266;
              margin-bottom: 16px;
            }

            .el-button {
              width: 100%;
              margin-top: 16px;
              background: linear-gradient(90deg, #409EFF, #67C23A);
              border: none;
              
              &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
              }
            }

            .chapter-resources {
              background: rgba(64, 158, 255, 0.05);
              padding: 15px;
              border-radius: 8px;
              margin: 15px 0;

              h4 {
                color: #409EFF;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
                
                i {
                  font-size: 16px;
                }
              }

              ul {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                list-style: none;
                padding: 0;
                margin: 0;

                li {
                  .el-button {
                    background: white;
                    border: 1px solid #DCDFE6;
                    transition: all 0.3s;
                    
                    i {
                      color: #409EFF;
                    }
                    
                    &:hover {
                      background: #409EFF;
                      border-color: #409EFF;
                      transform: translateY(-2px);
                      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
                      
                      i {
                        color: white;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      .notes-section {
        margin-top: 30px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        
        h2 {
          margin-bottom: 16px;
        }
        
        .el-input {
          .el-textarea__inner {
            min-height: 120px !important;
            resize: vertical;
            transition: all 0.3s;
            border-color: #DCDFE6;
            
            &:hover, &:focus {
              border-color: #409EFF;
              box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
            }
          }
        }
        
        .notes-actions {
          margin-top: 16px;
          text-align: right;
          
          .el-button {
            background: linear-gradient(90deg, #409EFF, #67C23A);
            border: none;
            padding: 12px 24px;
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
            }
            
            i {
              margin-right: 6px;
            }
          }
        }
      }
    }

    .side-content {
      > div {
        background: white;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        h3 {
          font-size: 18px;
          color: #303133;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;

          i {
            color: #409EFF;
          }
        }
      }

      .objectives-card {
        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            color: #606266;

            i {
              color: #67C23A;
            }
          }
        }
      }

      .skills-card {
        .skill-item {
          background: #f5f7fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          
          .skill-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;

            .level {
              color: #909399;
            }
          }

          p {
            color: #606266;
            font-size: 14px;
            margin-top: 8px;
          }

          .el-progress {
            margin: 10px 0;
            
            :deep(.el-progress-bar__inner) {
              background: linear-gradient(90deg, #409EFF, #67C23A);
            }
          }
        }
      }

      .tools-grid {
        display: grid;
        gap: 16px;

        .tool-item {
          text-align: center;
          padding: 16px;
          border-radius: 8px;
          background: #f5f7fa;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          i {
            font-size: 24px;
            color: #409EFF;
            margin-bottom: 8px;
          }

          h4 {
            color: #303133;
            margin: 8px 0;
          }

          p {
            color: #606266;
            font-size: 14px;
          }
        }
      }

      .progress-card {
        text-align: center;
        
        .progress-stats {
          margin-top: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          
          .stat-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
            
            .label {
              color: #909399;
              font-size: 14px;
            }
            
            .value {
              color: #303133;
              font-size: 18px;
              font-weight: 500;
            }
          }
        }
      }
    }
  }
}

.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 10px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  
  :deep(.el-progress-bar__inner) {
    background: linear-gradient(90deg, #409EFF, #67C23A);
    transition: all 0.3s;
  }
}

.learning-area {
  margin-bottom: 30px;
  
  .content-viewer {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .chapter-content {
      h3 {
        font-size: 24px;
        color: #303133;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #EBEEF5;
      }

      .text-content {
        font-size: 16px;
        line-height: 1.8;
        color: #606266;
        white-space: pre-line;
        margin-bottom: 24px;
      }

      .study-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-top: 24px;

        .key-points, .study-tips {
          background: #f5f7fa;
          padding: 20px;
          border-radius: 8px;
          
          h4 {
            color: #409EFF;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
            font-size: 18px;
            
            i {
              font-size: 20px;
            }
          }

          ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
              position: relative;
              padding-left: 24px;
              margin-bottom: 12px;
              color: #606266;
              line-height: 1.6;

              &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 8px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #409EFF;
              }

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }

        .study-tips {
          h4 {
            color: #67C23A;
          }

          ul li::before {
            background: #67C23A;
          }
        }
      }
    }
  }
  
  .learning-controls {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
}

.notes-section {
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin-bottom: 16px;
  }
  
  .notes-actions {
    margin-top: 16px;
    text-align: right;
  }
}

.progress-card {
  text-align: center;
  
  .progress-stats {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      .label {
        color: #909399;
        font-size: 14px;
      }
      
      .value {
        color: #303133;
        font-size: 18px;
        font-weight: 500;
      }
    }
  }
}

.share-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  
  .share-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    
    span {
      font-size: 14px;
      color: #606266;
    }

    .el-button {
      width: 50px;
      height: 50px;
      
      i {
        font-size: 20px;
      }
      
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

@keyframes patternMove {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 200px 200px;
  }
}

// 添加全局渐变定义
:root {
  --primary-gradient: linear-gradient(90deg, #409EFF, #67C23A);
  --hover-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

// 优化滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #909399;
  border-radius: 4px;
  
  &:hover {
    background: #606266;
  }
}

// 添加页面切换动画
.course-detail {
  animation: fadeIn 0.3s ease-out;
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

.player-placeholder {
  .error-text {
    color: #F56C6C;
    font-size: 16px;
  }
  
  .play-button {
    .is-loading {
      font-size: 40px;
      color: white;
      animation: rotate 1s linear infinite;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .study-section {
    grid-template-columns: 1fr;
  }
}

// 添加资源按钮图标样式
.chapter-resources {
  ul {
    li {
      .el-button {
        i {
          font-size: 16px;
        }
        
        &:hover {
          i {
            color: white;
          }
        }
      }
    }
  }
}
</style> 