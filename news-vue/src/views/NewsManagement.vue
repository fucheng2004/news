<template>
  <div class="news-management">
    <div class="page-header">
      <h1 class="page-title">新闻管理</h1>
      <div class="page-actions">
        <el-button type="primary" @click="showAddNewsDialog = true">
          <el-icon><Plus /></el-icon>添加新闻
        </el-button>
        <el-button @click="refreshNewsList">
          <el-icon><Refresh /></el-icon>刷新
        </el-button>
      </div>
    </div>

    <!-- 添加快捷键提示 -->
    <el-popover
      v-model:visible="showShortcuts"
      placement="bottom-start"
      :width="300"
      trigger="click"
    >
      <template #reference>
        <el-button class="shortcut-btn" type="info" plain>
          <el-icon><Operation /></el-icon>
          快捷键
        </el-button>
      </template>
      <div class="shortcuts-list">
        <h4>可用快捷键：</h4>
        <ul>
          <li><kbd>Ctrl</kbd> + <kbd>N</kbd> 新建新闻</li>
          <li><kbd>Ctrl</kbd> + <kbd>F</kbd> 搜索</li>
          <li><kbd>Ctrl</kbd> + <kbd>R</kbd> 刷新列表</li>
          <li><kbd>Esc</kbd> 关闭对话框</li>
        </ul>
      </div>
    </el-popover>

    <!-- 添加导入/导出按钮 -->
    <div class="page-actions">
      <el-dropdown split-button type="primary" @command="handleImport">
        <template #default>
          <el-icon><Upload /></el-icon>
          导入
        </template>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="importExcel">
              <el-icon><Document /></el-icon>从 Excel 导入
            </el-dropdown-item>
            <el-dropdown-item command="importJson">
              <el-icon><Document /></el-icon>从 JSON 导入
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
      <el-dropdown split-button type="success" @command="handleExport">
        <template #default>
          <el-icon><Download /></el-icon>
          导出
        </template>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="exportAll">
              <el-icon><Document /></el-icon>导出全部
            </el-dropdown-item>
            <el-dropdown-item command="exportSelected" :disabled="!selectedNews.length">
              <el-icon><Document /></el-icon>导出选中 ({{ selectedNews.length }})
            </el-dropdown-item>
            <el-dropdown-item command="exportExcel">
              <el-icon><Document /></el-icon>导出为 Excel
            </el-dropdown-item>
            <el-dropdown-item command="exportJson">
              <el-icon><Document /></el-icon>导出为 JSON
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="hover">
      <div class="filter-header">
        <span class="filter-title">
          <el-icon><Filter /></el-icon> 筛选条件
        </span>
        <div class="filter-actions">
          <el-button type="primary" link @click="searchNews">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button type="info" link @click="resetFilters">
            <el-icon><Delete /></el-icon> 重置
          </el-button>
          <el-button type="text" @click="showFilter = !showFilter">
            {{ showFilter ? '收起' : '展开' }} 
            <el-icon>
              <ArrowDown v-if="!showFilter" />
              <ArrowUp v-else />
            </el-icon>
          </el-button>
        </div>
      </div>
      
      <el-collapse-transition>
        <div v-show="showFilter" class="filter-content">
          <el-form :inline="true" :model="newsFilters" class="filter-form">
            <el-form-item label="状态">
              <el-select v-model="newsFilters.status" placeholder="全部状态" clearable>
                <el-option 
                  v-for="option in statusOptions" 
                  :key="option.value" 
                  :label="option.label" 
                  :value="option.value" 
                />
              </el-select>
            </el-form-item>
            <el-form-item label="分类">
              <el-select v-model="newsFilters.category" placeholder="全部分类" clearable>
                <el-option 
                  v-for="category in categoryList" 
                  :key="category.id" 
                  :label="category.name" 
                  :value="category.id" 
                />
              </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="newsFilters.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :shortcuts="dateShortcuts"
                clearable
              />
            </el-form-item>
            <el-form-item label="关键词">
              <el-input 
                v-model="newsFilters.keyword" 
                placeholder="标题/内容关键词" 
                clearable
                @keyup.enter="searchNews"
              >
                <template #suffix>
                  <el-icon class="cursor-pointer" @click="searchNews"><Search /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
      
      <!-- 激活的筛选条件标签 -->
      <div v-if="hasActiveFilters" class="active-filters">
        <span class="active-filters-label">已筛选:</span>
        <el-tag 
          v-if="newsFilters.status" 
          closable 
          @close="newsFilters.status = ''"
          class="filter-tag"
          type="info"
        >
          状态: {{ getStatusLabel(newsFilters.status) }}
        </el-tag>
        <el-tag 
          v-if="newsFilters.category" 
          closable 
          @close="newsFilters.category = ''"
          class="filter-tag"
          type="info"
        >
          分类: {{ getCategoryName(newsFilters.category) }}
        </el-tag>
        <el-tag 
          v-if="newsFilters.dateRange && newsFilters.dateRange.length === 2" 
          closable 
          @close="newsFilters.dateRange = []"
          class="filter-tag"
          type="info"
        >
          时间: {{ newsFilters.dateRange[0] }} 至 {{ newsFilters.dateRange[1] }}
        </el-tag>
        <el-tag 
          v-if="newsFilters.keyword" 
          closable 
          @close="newsFilters.keyword = ''"
          class="filter-tag"
          type="info"
        >
          关键词: {{ newsFilters.keyword }}
        </el-tag>
      </div>
    </el-card>

    <!-- 批量操作按钮 -->
    <div v-if="selectedNews.length > 0" class="batch-actions">
      <span class="selected-count">已选择 {{ selectedNews.length }} 项</span>
      <el-button-group>
        <el-button type="primary" @click="batchPublish" :disabled="!hasEditableNewsSelected">
          <el-icon><Upload /></el-icon> 批量发布
        </el-button>
        <el-button type="danger" @click="batchDeleteNews">
          <el-icon><Delete /></el-icon> 批量删除
        </el-button>
      </el-button-group>
    </div>

    <!-- 数据统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="stats-card total-news">
          <div class="stats-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-value">{{ formatNumber(totalNews) }}</div>
            <div class="stats-label">总新闻数</div>
          </div>
          <div class="stats-trend" :class="{ 'up': newsGrowth > 0, 'down': newsGrowth < 0 }">
            <el-icon><ArrowUp v-if="newsGrowth > 0" /><ArrowDown v-else /></el-icon>
            {{ Math.abs(newsGrowth) }}%
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="stats-card total-views">
          <div class="stats-icon">
            <el-icon><View /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-value">{{ formatNumber(totalViews) }}</div>
            <div class="stats-label">总浏览量</div>
          </div>
          <div class="stats-trend" :class="{ 'up': viewsGrowth > 0, 'down': viewsGrowth < 0 }">
            <el-icon><ArrowUp v-if="viewsGrowth > 0" /><ArrowDown v-else /></el-icon>
            {{ Math.abs(viewsGrowth) }}%
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="stats-card total-comments">
          <div class="stats-icon">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-value">{{ formatNumber(totalComments) }}</div>
            <div class="stats-label">总评论数</div>
          </div>
          <div class="stats-trend" :class="{ 'up': commentsGrowth > 0, 'down': commentsGrowth < 0 }">
            <el-icon><ArrowUp v-if="commentsGrowth > 0" /><ArrowDown v-else /></el-icon>
            {{ Math.abs(commentsGrowth) }}%
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="stats-card avg-engagement">
          <div class="stats-icon">
            <el-icon><Star /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-value">{{ engagementRate }}%</div>
            <div class="stats-label">平均互动率</div>
          </div>
          <div class="stats-trend" :class="{ 'up': engagementGrowth > 0, 'down': engagementGrowth < 0 }">
            <el-icon><ArrowUp v-if="engagementGrowth > 0" /><ArrowDown v-else /></el-icon>
            {{ Math.abs(engagementGrowth) }}%
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表展示 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="chart-header">
              <h3>新闻发布趋势</h3>
              <el-radio-group v-model="publishTrendPeriod" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <div ref="publishTrendChart" style="width: 100%; height: 300px;"></div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="chart-header">
              <h3>分类统计</h3>
              <el-switch
                v-model="showCategoryPercentage"
                active-text="百分比"
                inactive-text="数量"
              />
            </div>
          </template>
          <div class="chart-container">
            <div ref="categoryStatsChart" style="width: 100%; height: 300px;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新闻列表表格 -->
    <el-card shadow="hover" class="news-table-card">
      <el-table
        v-loading="loading"
        :data="newsList"
        @selection-change="handleSelectionChange"
        border
        stripe
        style="width: 100%"
        :row-class-name="getRowClassName"
      >
        <el-table-column type="selection" width="50" fixed="left" />
        <el-table-column label="ID" prop="id" width="80" sortable />
        <el-table-column label="标题" prop="title" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="news-title-cell">
              <el-image 
                v-if="row.coverImage" 
                :src="row.coverImage" 
                fit="cover" 
                class="news-cover-thumbnail"
              >
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="news-title-content">
                <div class="news-title-text">{{ row.title }}</div>
                <div class="news-meta" v-if="row.author || row.source">
                  <span v-if="row.author">{{ row.author }}</span>
                  <span v-if="row.author && row.source">·</span>
                  <span v-if="row.source">{{ row.source }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="category" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.category" :type="getCategoryTagType(row.category)" size="small">
              {{ getCategoryName(row.category) }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="publishTime" width="160" sortable />
        <el-table-column label="浏览量" prop="viewCount" width="100" sortable>
          <template #default="{ row }">
            <span class="stat-item">
              <el-icon><View /></el-icon> {{ row.viewCount || 0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="评论" prop="commentCount" width="100" sortable>
          <template #default="{ row }">
            <span class="stat-item">
              <el-icon><ChatDotRound /></el-icon> {{ row.commentCount || 0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-tooltip content="查看详情" placement="top">
                <el-button size="small" type="primary" plain @click="viewNews(scope.row)">
                  <el-icon><View /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="编辑新闻" placement="top">
                <el-button size="small" type="warning" plain @click="editNews(scope.row)">
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除新闻" placement="top">
                <el-button size="small" type="danger" plain @click="deleteNews(scope.row.id)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-if="totalItems > 0"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalItems"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          background
        />
      </div>
    </el-card>

    <!-- 添加/编辑新闻对话框 -->
    <el-dialog
      v-model="showAddNewsDialog"
      :title="isEditing ? '编辑新闻' : '添加新闻'"
      width="60%"
      destroy-on-close
    >
      <el-form
        ref="newsFormRef"
        :model="newsForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="newsForm.title" placeholder="请输入新闻标题" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="newsForm.category" placeholder="请选择新闻分类" style="width: 100%">
            <el-option 
              v-for="category in categoryList" 
              :key="category.id" 
              :label="category.name" 
              :value="category.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input 
            v-model="newsForm.summary" 
            type="textarea" 
            placeholder="请输入新闻摘要"
            maxlength="300"
            show-word-limit
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <div class="editor-container">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="editorConfig"
              :mode="'default'"
            />
            <Editor
              style="height: 500px; overflow-y: hidden;"
              v-model="newsForm.content"
              :defaultConfig="editorConfig"
              :mode="'default'"
              @onCreated="handleCreated"
              @onChange="handleChange"
              @onDestroyed="handleDestroyed"
            />
          </div>
        </el-form-item>
        <el-form-item label="封面图片" prop="coverImage">
          <el-upload
            class="cover-upload"
            :before-upload="beforeUpload"
            :on-change="handleUpload"
            :on-remove="handleRemove"
            :file-list="fileList"
            :limit="1"
            :auto-upload="false"
          >
            <template #trigger>
              <el-button type="primary">选择图片</el-button>
            </template>
            
            <template #tip>
              <div class="el-upload__tip">
                只能上传 jpg/png 文件，且不超过 2MB
              </div>
            </template>
            
            <div class="cover-preview" v-if="newsForm.coverImage">
              <img :src="newsForm.coverImage" alt="封面预览" />
            </div>
          </el-upload>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="来源" prop="source">
              <el-input v-model="newsForm.source" placeholder="请输入新闻来源" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="newsForm.author" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="newsForm.status">
            <el-radio-button v-for="option in statusOptions" :key="option.value" :label="option.value">
              {{ option.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddNewsDialog = false">取消</el-button>
        <el-button type="primary" @click="submitNewsForm" :loading="submitting">
          {{ isEditing ? '保存修改' : '提交新闻' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 新闻详情对话框 -->
    <el-dialog
      v-model="showNewsDetailDialog"
      title="新闻详情"
      width="70%"
      class="news-detail-dialog"
      :fullscreen="isMobile"
    >
      <div v-if="currentNews" class="news-detail">
        <h1 class="news-detail-title">{{ currentNews.title }}</h1>
        
        <div class="news-detail-meta">
          <el-tag :type="getStatusTagType(currentNews.status)" size="small" class="status-tag" effect="dark">
            {{ getStatusLabel(currentNews.status) }}
          </el-tag>
          <el-tag :type="getCategoryTagType(currentNews.category)" size="small" class="category-tag" effect="dark">
            {{ getCategoryName(currentNews.category) }}
          </el-tag>
          <div class="meta-info">
            <span class="news-detail-time">
              <el-icon><Timer /></el-icon>
              {{ formatDate(currentNews.publishTime) }}
            </span>
            <span class="news-detail-source" v-if="currentNews.source">
              <el-icon><Collection /></el-icon>
              来源: {{ currentNews.source }}
            </span>
            <span class="news-detail-author" v-if="currentNews.author">
              <el-icon><User /></el-icon>
              作者: {{ currentNews.author }}
            </span>
          </div>
        </div>
        
        <div class="news-detail-stats">
          <div class="stat-card">
            <el-icon><View /></el-icon>
            <span class="stat-value">{{ formatNumber(currentNews.viewCount || 0) }}</span>
            <span class="stat-label">阅读</span>
          </div>
          <div class="stat-card">
            <el-icon><ChatDotRound /></el-icon>
            <span class="stat-value">{{ formatNumber(currentNews.commentCount || 0) }}</span>
            <span class="stat-label">评论</span>
          </div>
          <div class="stat-card">
            <el-icon><Star /></el-icon>
            <span class="stat-value">{{ formatNumber(currentNews.likes || 0) }}</span>
            <span class="stat-label">点赞</span>
          </div>
        </div>
        
        <div class="news-detail-summary" v-if="currentNews.summary">
          <div class="summary-label">
            <el-icon><Document /></el-icon>
            摘要
          </div>
          <div class="summary-content">{{ currentNews.summary }}</div>
        </div>
        
        <div class="news-detail-cover" v-if="currentNews.coverImage">
          <el-image 
            :src="currentNews.coverImage" 
            alt="新闻封面"
            :preview-src-list="[currentNews.coverImage]"
            fit="cover"
          >
            <template #placeholder>
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
                <span>加载中...</span>
              </div>
            </template>
            <template #error>
              <div class="image-placeholder">
                <el-icon><PictureFilled /></el-icon>
                <span>加载失败</span>
              </div>
            </template>
          </el-image>
        </div>
        
        <div class="news-detail-content">
          <div class="content-label">
            <el-icon><Reading /></el-icon>
            正文内容
          </div>
          <div class="content-text" v-html="currentNews.content"></div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showNewsDetailDialog = false">
            <el-icon><Close /></el-icon>
            关闭
          </el-button>
          <el-button type="primary" @click="editNews(currentNews)">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加文件上传对话框 -->
    <el-dialog
      v-model="showImportDialog"
      title="导入数据"
      width="500px"
    >
      <el-upload
        class="import-upload"
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleImportFile"
        :limit="1"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 .xlsx, .xls, .json 格式文件
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showImportDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmImport" :loading="importing">
            开始导入
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加加载动画 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <el-icon class="loading-icon" :size="40"><loading /></el-icon>
        <span class="loading-text">{{ loadingText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'
import { newsCategories } from '@/types/news'
import type { NewsCategory } from '@/types'
import { newsManagementApi, getNewsCategories } from '@/api'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { 
  Plus, 
  Refresh, 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  View, 
  Edit, 
  Delete, 
  Upload,
  Picture,
  ChatDotRound,
  Star,
  Timer,
  Collection,
  User,
  Document,
  Reading,
  Close,
  PictureFilled,
  Operation,
  Download,
  UploadFilled,
  Loading
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { onKeyStroke } from '@vueuse/core'
import * as XLSX from 'xlsx'
import storage from '@/utils/storage'

// 自定义新闻管理项类型
interface NewsManagementItem {
  id: number
  title: string
  summary: string
  content: string
  publishTime: string
  source: string
  category: string
  author?: string
  viewCount?: number
  commentCount?: number
  likes?: number
  status: string
  coverImage?: string
}

// 使用测试数据模式（当后端API未准备好时）
const useTestData = true

// 用户角色
const isAdmin = ref(true) // 这里应该从用户状态中获取，暂时设为 true

// 加载状态
const loading = ref(false)

// 新闻列表数据
const newsList = ref<NewsManagementItem[]>([])
const totalItems = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedNews = ref<NewsManagementItem[]>([])

// 筛选条件
const newsFilters = reactive({
  status: '',
  category: '',
  dateRange: [] as string[],
  keyword: ''
})

// 新闻分类列表
const categoryList = ref(newsCategories)

// 状态选项
const statusOptions = [
  { value: 'draft', label: '草稿' },
  { value: 'pending', label: '待审核' },
  { value: 'published', label: '已发布' },
  { value: 'rejected', label: '已拒绝' }
]

// 表单规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  summary: [
    { required: true, message: '请输入摘要', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ]
}

// 文件列表
const fileList = ref([])

// 富文本编辑器相关
const editor = ref(null)
const editorConfig = {
  placeholder: '请输入新闻内容...',
  autoFocus: false,
  MENU_CONF: {}
}
const handleCreated = (editor: any) => {
  console.log('富文本编辑器创建成功')
}
const handleChange = (editor: any) => {
  newsForm.content = editor.getHtml()
}
const handleDestroyed = (editor: any) => {
  console.log('富文本编辑器销毁')
}

// 数据统计
const totalNews = ref(0)
const totalViews = ref(0)
const totalComments = ref(0)
const newsGrowth = ref(5.2)
const viewsGrowth = ref(12.8)
const commentsGrowth = ref(-2.3)
const engagementRate = ref(8.5)
const engagementGrowth = ref(3.1)

// 图表相关
const publishTrendPeriod = ref('week')
const showCategoryPercentage = ref(true)
const publishTrendChart = ref<HTMLElement | null>(null)
const categoryStatsChart = ref<HTMLElement | null>(null)
let publishTrendInstance: echarts.ECharts | null = null
let categoryStatsInstance: echarts.ECharts | null = null

// 初始化图表
const initCharts = () => {
  if (publishTrendChart.value) {
    publishTrendInstance = echarts.init(publishTrendChart.value)
    updatePublishTrendChart()
  }
  
  if (categoryStatsChart.value) {
    categoryStatsInstance = echarts.init(categoryStatsChart.value)
    updateCategoryStatsChart()
  }
}

// 更新发布趋势图表
const updatePublishTrendChart = () => {
  if (!publishTrendInstance) return
  
  // 模拟数据
  const dates = []
  const publishedData = []
  const viewsData = []
  
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }))
    publishedData.push(Math.floor(Math.random() * 20 + 10))
    viewsData.push(Math.floor(Math.random() * 1000 + 500))
  }
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['发布数量', '浏览量'],
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '发布数量',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ddd'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#eee'
          }
        }
      },
      {
        type: 'value',
        name: '浏览量',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ddd'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#eee'
          }
        }
      }
    ],
    series: [
      {
        name: '发布数量',
        type: 'bar',
        data: publishedData,
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '浏览量',
        type: 'line',
        yAxisIndex: 1,
        data: viewsData,
        smooth: true,
        itemStyle: {
          color: '#67C23A'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(103,194,58,0.3)'
            },
            {
              offset: 1,
              color: 'rgba(103,194,58,0.1)'
            }
          ])
        }
      }
    ]
  }
  
  publishTrendInstance.setOption(option)
}

// 更新分类统计图表
const updateCategoryStatsChart = () => {
  if (!categoryStatsInstance) return
  
  // 模拟数据
  const categoryData = newsCategories.map(category => ({
    name: category.name,
    value: Math.floor(Math.random() * 100 + 20)
  }))
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: showCategoryPercentage.value
        ? '{b}: {d}%'
        : '{b}: {c}'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: '新闻分类',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['65%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: showCategoryPercentage.value
            ? '{b}: {d}%'
            : '{b}: {c}'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        data: categoryData
      }
    ]
  }
  
  categoryStatsInstance.setOption(option)
}

// 监听图表配置变化
watch([publishTrendPeriod, showCategoryPercentage], () => {
  updatePublishTrendChart()
  updateCategoryStatsChart()
})

// 监听窗口大小变化
const handleResize = () => {
  publishTrendInstance?.resize()
  categoryStatsInstance?.resize()
}

// 生命周期钩子
onMounted(async () => {
  // 权限检查
  const isAdmin = storage.get('isAdmin') === true
  
  if (!isAdmin) {
    ElMessage.error('您没有权限访问新闻管理页面')
    router.push('/')
    return
  }

  // 尝试获取实际的新闻分类列表
  if (!useTestData) {
    try {
      const response = await getNewsCategories()
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        categoryList.value = response.data
      }
    } catch (error) {
      console.error('获取新闻分类列表失败:', error)
    }
  }
  
  fetchNewsList()
  
  // 初始化统计数据
  if (useTestData) {
    totalNews.value = 1234
    totalViews.value = 45678
    totalComments.value = 3456
  }
  
  // 初始化图表
  initCharts()
  window.addEventListener('resize', handleResize)

  // 监听主题变化
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })

  console.log('登录用户信息:', {
    isAdmin: storage.get('isAdmin'),
    userRole: storage.get('userRole')
  });
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  publishTrendInstance?.dispose()
  categoryStatsInstance?.dispose()
  observer.disconnect()
})

// 方法
// 获取新闻列表
const fetchNewsList = async () => {
  loading.value = true
  
  if (useTestData) {
    // 使用测试数据
    setTimeout(() => {
      const mockData = generateMockNewsData(pageSize.value, currentPage.value)
      newsList.value = mockData.items
      totalItems.value = mockData.total
      loading.value = false
    }, 500)
    return
  }
  
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      status: newsFilters.status || undefined,
      category: newsFilters.category || undefined,
      keyword: newsFilters.keyword || undefined,
      startDate: newsFilters.dateRange[0] || undefined,
      endDate: newsFilters.dateRange[1] || undefined
    }
    
    const response = await newsManagementApi.getNewsList(params)
    if (response && response.data) {
      newsList.value = response.data.items
      totalItems.value = response.data.total
    }
  } catch (error) {
    console.error('获取新闻列表失败:', error)
    ElMessage.error('获取新闻列表失败')
    
    // 如果API调用失败，回退到模拟数据（仅开发环境）
    if (import.meta.env.DEV) {
      const mockData = generateMockNewsData(pageSize.value, currentPage.value)
      newsList.value = mockData.items
      totalItems.value = mockData.total
    }
  } finally {
    loading.value = false
  }
}

// 生成模拟数据（仅开发测试使用）
const generateMockNewsData = (size: number, page: number): { items: NewsManagementItem[], total: number } => {
  const total = 243 // 模拟总数
  const items: NewsManagementItem[] = []
  
  const statuses = ['published', 'draft', 'pending', 'rejected']
  const sources = ['新华社', '人民日报', '央视新闻', '中国日报', '环球时报']
  const authors = ['张三', '李四', '王五', '赵六', '钱七']
  const categoryIds = newsCategories.map(c => c.id)
  
  for (let i = 0; i < size; i++) {
    const index = (page - 1) * size + i
    if (index >= total) break
    
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    
    items.push({
      id: 1000 + index,
      title: `测试新闻标题 ${index + 1}`,
      summary: `这是一段测试新闻摘要 ${index + 1}`,
      content: `这是新闻的详细内容 ${index + 1}，包含了详细的新闻描述和事件经过。`,
      publishTime: date.toLocaleString(),
      source: sources[Math.floor(Math.random() * sources.length)],
      category: categoryIds[Math.floor(Math.random() * categoryIds.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      viewCount: Math.floor(Math.random() * 10000),
      commentCount: Math.floor(Math.random() * 100),
      likes: Math.floor(Math.random() * 500),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      coverImage: Math.random() > 0.3 ? `https://picsum.photos/id/${1000 + i}/200/100` : ''
    })
  }
  
  return {
    items,
    total
  }
}

// 搜索新闻
const searchNews = () => {
  currentPage.value = 1 // 重置到第一页
  fetchNewsList()
}

// 刷新新闻列表
const refreshNewsList = () => {
  fetchNewsList()
}

// 处理页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchNewsList()
}

// 处理每页数量变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchNewsList()
}

// 处理新闻选择
const handleSelectionChange = (selection: NewsManagementItem[]) => {
  selectedNews.value = selection
}

// 批量删除选中的新闻
const batchDeleteNews = async () => {
  if (selectedNews.value.length === 0) {
    ElMessage.warning('请先选择要删除的新闻')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedNews.value.length} 条新闻吗？此操作不可撤销！`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    if (useTestData) {
      // 模拟删除操作
      setTimeout(() => {
        ElMessage.success('批量删除成功')
        fetchNewsList()
      }, 500)
      return
    }
    
    const ids = selectedNews.value.map(item => Number(item.id)).filter(id => !isNaN(id))
    await newsManagementApi.batchDeleteNews(ids)
    ElMessage.success('批量删除成功')
    fetchNewsList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 重置筛选条件
const resetFilters = () => {
  newsFilters.status = ''
  newsFilters.category = ''
  newsFilters.dateRange = []
  newsFilters.keyword = ''
  currentPage.value = 1
  fetchNewsList()
}

// 添加/编辑新闻相关
const showAddNewsDialog = ref(false)
const isEditing = ref(false)
const newsFormRef = ref()
const newsForm = reactive({
  id: 0,
  title: '',
  category: '',
  summary: '',
  content: '',
  coverImage: '',
  source: '',
  author: '',
  status: 'draft'
})

// 添加新闻
const addNews = () => {
  isEditing.value = false
  resetNewsForm()
  showAddNewsDialog.value = true
}

// 编辑新闻
const editNews = async (news: NewsManagementItem | null) => {
  if (!news) return
  
  isEditing.value = true
  resetNewsForm() // 先重置表单
  
  if (useTestData) {
    Object.assign(newsForm, news)
    showAddNewsDialog.value = true
    return
  }
  
  try {
    // 获取完整的新闻详情
    const response = await newsManagementApi.getNewsDetail(Number(news.id))
    Object.assign(newsForm, response.data)
  } catch (error) {
    console.error('获取新闻详情失败:', error)
    // 如果获取详情失败，使用列表中的数据
    Object.assign(newsForm, news)
  }
  
  showAddNewsDialog.value = true
}

// 删除新闻
const deleteNews = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条新闻吗？此操作不可撤销！',
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    if (useTestData) {
      // 模拟删除操作
      setTimeout(() => {
        ElMessage.success('新闻删除成功')
        fetchNewsList()
      }, 500)
      return
    }
    
    await newsManagementApi.deleteNews(id)
    ElMessage.success('新闻删除成功')
    fetchNewsList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除新闻失败:', error)
      ElMessage.error('删除新闻失败')
    }
  }
}

// 重置新闻表单
const resetNewsForm = () => {
  newsForm.id = 0
  newsForm.title = ''
  newsForm.category = ''
  newsForm.summary = ''
  newsForm.content = ''
  newsForm.coverImage = ''
  newsForm.source = ''
  newsForm.author = ''
  newsForm.status = 'draft'
  
  if (newsFormRef.value) {
    newsFormRef.value.resetFields()
  }
}

// 处理图片上传前的验证
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
  }
  return isImage && isLt2M
}

// 处理图片上传
const handleUpload = async (options: any) => {
  try {
    const file = options.file
    const response = await newsManagementApi.uploadCoverImage(file)
    if (response.data && response.data.url) {
      newsForm.coverImage = response.data.url
      ElMessage.success('封面图片上传成功')
    } else {
      throw new Error('上传响应格式错误')
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('图片上传失败')
    
    // 如果API调用失败，回退到模拟上传（仅开发环境）
    if (import.meta.env.DEV) {
      const file = options.file
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        newsForm.coverImage = e.target?.result as string
        ElMessage.success('封面图片上传成功 (模拟)')
      }
    }
  }
}

// 新闻详情查看
const showNewsDetailDialog = ref(false)
const currentNews = ref<NewsManagementItem | null>(null)

// 查看新闻详情
const viewNews = async (news: NewsManagementItem) => {
  if (useTestData) {
    currentNews.value = news
    showNewsDetailDialog.value = true
    return
  }
  
  try {
    // 获取完整的新闻详情
    const response = await newsManagementApi.getNewsDetail(Number(news.id))
    currentNews.value = response.data
  } catch (error) {
    console.error('获取新闻详情失败:', error)
    // 如果获取详情失败，使用列表中的数据
    currentNews.value = news
  }
  
  showNewsDetailDialog.value = true
}

// 筛选相关
const showFilter = ref(false)

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

// 是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return newsFilters.status !== '' || 
    newsFilters.category !== '' || 
    (newsFilters.dateRange && newsFilters.dateRange.length === 2) || 
    newsFilters.keyword !== ''
})

// 获取状态标签
const getStatusLabel = (status: string): string => {
  const option = statusOptions.find(opt => opt.value === status)
  return option ? option.label : status
}

// 获取状态标签类型
const getStatusTagType = (status: string): 'success' | 'warning' | 'info' | 'danger' | 'primary' => {
  switch (status) {
    case 'published': return 'success'
    case 'pending': return 'warning'
    case 'draft': return 'info'
    case 'rejected': return 'danger'
    default: return 'info' // 默认返回info而不是空字符串
  }
}

// 获取分类标签类型
const getCategoryTagType = (category: string): 'success' | 'warning' | 'info' | 'danger' | 'primary' => {
  // 为每个分类指定固定的颜色类型
  // 可以根据categoryId返回对应的类型
  switch (category) {
    case 'latest': return 'primary'
    case 'tech': return 'success'
    case 'finance': return 'warning'
    case 'society': return 'info'
    default:
      // 如果没有预设，则根据索引分配颜色
      const index = categoryList.value.findIndex(c => c.id === category)
      if (index >= 0) {
        const types: Array<'success' | 'warning' | 'info' | 'danger' | 'primary'> = [
          'primary', 'success', 'warning', 'info', 'danger'
        ]
        return types[index % types.length]
      }
      return 'info'
  }
}

// 获取行样式
const getRowClassName = ({ row }: { row: NewsManagementItem }): string => {
  if (row.status === 'draft') return 'draft-row'
  if (row.status === 'rejected') return 'rejected-row'
  return ''
}

// 批量操作相关
// 检查是否有可编辑的新闻被选中
const hasEditableNewsSelected = computed(() => {
  return selectedNews.value.some(news => news.status !== 'published')
})

// 批量发布
const batchPublish = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要批量发布选中的 ${selectedNews.value.length} 条新闻吗？`,
      '批量发布确认',
      {
        confirmButtonText: '确定发布',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    if (useTestData) {
      // 模拟发布操作
      setTimeout(() => {
        ElMessage.success('批量发布成功')
        fetchNewsList()
      }, 500)
      return
    }
    
    // TODO: 调用批量发布API
    // 此处添加实际API调用
    
    ElMessage.success('批量发布成功')
    fetchNewsList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量发布失败:', error)
      ElMessage.error('批量发布失败')
    }
  }
}

// 表单提交状态
const submitting = ref(false)

// 提交新闻表单
const submitNewsForm = async () => {
  try {
    await newsFormRef.value.validate()
    
    submitting.value = true
    
    if (useTestData) {
      // 模拟提交操作
      setTimeout(() => {
        ElMessage.success(isEditing.value ? '新闻更新成功' : '新闻添加成功')
        showAddNewsDialog.value = false
        fetchNewsList()
        resetNewsForm()
        submitting.value = false
      }, 1000)
      return
    }
    
    if (isEditing.value) {
      // 更新现有新闻
      await newsManagementApi.updateNews(Number(newsForm.id), newsForm)
      ElMessage.success('新闻更新成功')
    } else {
      // 创建新新闻
      await newsManagementApi.createNews(newsForm)
      ElMessage.success('新闻添加成功')
    }
    
    showAddNewsDialog.value = false
    fetchNewsList()
    
    // 重置表单
    resetNewsForm()
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    submitting.value = false
  }
}

// 获取分类名称
const getCategoryName = (categoryId: string) => {
  const category = categoryList.value.find(c => c.id === categoryId)
  return category ? category.name : categoryId
}

// 处理移除文件
const handleRemove = () => {
  newsForm.coverImage = ''
  fileList.value = []
}

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 格式化日期
const formatDate = (date: string): string => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 检测是否为移动设备
const isMobile = computed(() => {
  return window.innerWidth <= 768
})

// 快捷键相关
const showShortcuts = ref(false)

// 导入/导出相关
const showImportDialog = ref(false)
const importing = ref(false)
const importFile = ref<File | null>(null)
const loadingText = ref('加载中...')

// 处理导入
const handleImport = (command: string) => {
  showImportDialog.value = true
}

const handleImportFile = (file: any) => {
  importFile.value = file.raw
}

const confirmImport = async () => {
  if (!importFile.value) {
    ElMessage.warning('请先选择要导入的文件')
    return
  }

  importing.value = true
  loadingText.value = '正在导入数据...'

  try {
    const fileExt = importFile.value.name.split('.').pop()?.toLowerCase()
    let data: any[] = []

    if (fileExt === 'json') {
      const text = await importFile.value.text()
      data = JSON.parse(text)
    } else if (['xlsx', 'xls'].includes(fileExt || '')) {
      const buffer = await importFile.value.arrayBuffer()
      const workbook = XLSX.read(buffer)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      data = XLSX.utils.sheet_to_json(worksheet)
    } else {
      throw new Error('不支持的文件格式')
    }

    // TODO: 处理导入的数据
    console.log('导入的数据:', data)
    
    ElMessage.success('数据导入成功')
    showImportDialog.value = false
    fetchNewsList()
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败，请检查文件格式是否正确')
  } finally {
    importing.value = false
    loadingText.value = '加载中...'
  }
}

// 处理导出
const handleExport = async (command: string) => {
  loadingText.value = '正在导出数据...'
  loading.value = true

  try {
    let data: any[] = []
    
    if (command === 'exportSelected') {
      data = selectedNews.value
    } else {
      // 获取所有数据
      data = newsList.value
    }

    if (command.includes('Excel')) {
      // 导出为Excel
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'News')
      XLSX.writeFile(workbook, '新闻数据.xlsx')
    } else {
      // 导出为JSON
      const jsonStr = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '新闻数据.json'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    loading.value = false
    loadingText.value = '加载中...'
  }
}

// 注册快捷键
onKeyStroke(['ctrl+n', 'meta+n'], (e) => {
  e.preventDefault()
  showAddNewsDialog.value = true
})

onKeyStroke(['ctrl+f', 'meta+f'], (e) => {
  e.preventDefault()
  const searchInput = document.querySelector('.filter-form input[type="text"]') as HTMLInputElement
  searchInput?.focus()
})

onKeyStroke(['ctrl+r', 'meta+r'], (e) => {
  e.preventDefault()
  refreshNewsList()
})

onKeyStroke('escape', () => {
  showAddNewsDialog.value = false
  showNewsDetailDialog.value = false
  showImportDialog.value = false
})

// 优化图表交互
const updateChartTheme = () => {
  const isDark = document.documentElement.classList.contains('dark')
  const theme = {
    backgroundColor: 'transparent',
    textStyle: {
      color: isDark ? '#E5EAF3' : '#333'
    },
    title: {
      textStyle: {
        color: isDark ? '#E5EAF3' : '#333'
      }
    },
    legend: {
      textStyle: {
        color: isDark ? '#E5EAF3' : '#333'
      }
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: isDark ? '#4C4D4F' : '#ddd'
        }
      },
      axisLabel: {
        color: isDark ? '#E5EAF3' : '#333'
      }
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: isDark ? '#4C4D4F' : '#ddd'
        }
      },
      axisLabel: {
        color: isDark ? '#E5EAF3' : '#333'
      },
      splitLine: {
        lineStyle: {
          color: isDark ? '#4C4D4F' : '#eee'
        }
      }
    }
  }

  publishTrendInstance?.setOption({ ...theme })
  categoryStatsInstance?.setOption({ ...theme })
}

// 监听主题变化
const observer = new MutationObserver(() => {
  updateChartTheme()
})
</script>

<style scoped>
.news-management {
  padding: 20px;
  min-height: calc(100vh - 60px);
  position: relative;
  background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, #ffffff 100%);
  
  /* 添加背景装饰图案 */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 10% 10%, rgba(var(--el-color-primary-rgb), 0.03) 0%, transparent 50%),
      radial-gradient(circle at 90% 90%, rgba(var(--el-color-success-rgb), 0.03) 0%, transparent 50%),
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.6;
    z-index: 0;
  }
  
  /* 添加动态光效 */
  &::after {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%);
    opacity: 0.4;
    animation: lightMove 20s infinite linear;
    pointer-events: none;
    z-index: 0;
  }
  
  /* 确保内容在背景之上 */
  > * {
    position: relative;
    z-index: 1;
  }
}

/* 添加光效动画 */
@keyframes lightMove {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(-20%, -20%) rotate(360deg);
  }
}

/* 优化暗色模式背景 */
:deep(.dark) .news-management {
  background: linear-gradient(135deg, var(--el-color-primary-light-1) 0%, #1a1a1a 100%);
  
  &::before {
    background: 
      radial-gradient(circle at 10% 10%, rgba(var(--el-color-primary-rgb), 0.05) 0%, transparent 50%),
      radial-gradient(circle at 90% 90%, rgba(var(--el-color-success-rgb), 0.05) 0%, transparent 50%),
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.4;
  }
  
  &::after {
    background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 60%);
    opacity: 0.2;
  }
}

/* 优化卡片背景 */
.filter-card, .news-table-card, .stats-card, .chart-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.95);
  }
}

/* 暗色模式下的卡片背景 */
:deep(.dark) {
  .filter-card, .news-table-card, .stats-card, .chart-card {
    background: rgba(30, 30, 30, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
      background: rgba(40, 40, 40, 0.95);
    }
  }
}

/* 优化页面头部背景 */
.page-header {
  background: linear-gradient(135deg, 
    var(--el-color-primary-light-7) 0%, 
    var(--el-color-primary-light-9) 100%
  );
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%),
      repeating-linear-gradient(45deg, 
        rgba(255,255,255,0.1) 0px, 
        rgba(255,255,255,0.1) 2px,
        transparent 2px, 
        transparent 8px
      );
    animation: headerGlow 10s infinite linear;
    opacity: 0.4;
  }
}

@keyframes headerGlow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 暗色模式下的页面头部 */
:deep(.dark) .page-header {
  background: linear-gradient(135deg, 
    var(--el-color-primary-dark-2) 0%, 
    var(--el-color-primary) 100%
  );
  
  &::before {
    opacity: 0.2;
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--el-color-primary-light-8) 0%, var(--el-color-primary-light-9) 100%);
  padding: 20px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%);
  opacity: 0.6;
}

.page-title {
  font-size: 24px;
  margin: 0;
  color: var(--el-color-primary);
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.page-actions {
  display: flex;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.filter-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.filter-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  padding-bottom: 12px;
}

.filter-title {
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-color-primary);
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-content {
  margin-top: 16px;
}

.active-filters {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  animation: fadeIn 0.3s ease-in-out;
}

.active-filters-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.filter-tag {
  margin-right: 8px;
  transition: all 0.2s ease;
}

.filter-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 12px 20px;
  background: linear-gradient(to right, var(--el-color-info-light-9), var(--el-color-info-light-8));
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  animation: slideInFromLeft 0.4s ease-out;
}

.selected-count {
  font-weight: 600;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-count::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: var(--el-color-primary);
  border-radius: 50%;
}

.news-table-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.news-table-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.news-title-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.news-cover-thumbnail {
  width: 60px;
  height: 36px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.news-cover-thumbnail:hover {
  transform: scale(1.1);
}

.image-placeholder {
  width: 60px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  color: var(--el-text-color-placeholder);
  border: 1px dashed var(--el-border-color);
}

.news-title-content {
  display: flex;
  flex-direction: column;
}

.news-title-text {
  font-weight: 500;
  color: var(--el-text-color-primary);
  transition: color 0.3s ease;
}

.news-title-text:hover {
  color: var(--el-color-primary);
}

.news-meta {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--el-text-color-secondary);
  transition: all 0.3s ease;
}

.stat-item:hover {
  color: var(--el-color-primary);
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.cover-upload {
  display: flex;
  flex-direction: column;
}

.cover-preview {
  margin-top: 16px;
  width: 240px;
  height: 140px;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid var(--el-border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.cover-preview:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.cover-preview:hover img {
  transform: scale(1.05);
}

.news-detail {
  padding: 16px;
}

.news-detail-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: var(--el-color-primary-dark-2);
  line-height: 1.4;
  position: relative;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.news-detail-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.news-detail-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  color: var(--el-text-color-secondary);
  background-color: var(--el-fill-color-light);
  padding: 12px 16px;
  border-radius: 8px;
}

.news-detail-summary {
  background: var(--el-fill-color-light);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  position: relative;
  border-left: 4px solid var(--el-color-primary-light-5);
}

.summary-label, .content-label {
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-label::before, .content-label::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  background-color: var(--el-color-primary);
  border-radius: 2px;
}

.news-detail-cover {
  margin-bottom: 24px;
  text-align: center;
}

.news-detail-cover img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.news-detail-cover img:hover {
  transform: scale(1.02);
}

.news-detail-content {
  margin-bottom: 24px;
  line-height: 1.8;
}

.content-text {
  white-space: pre-line;
  color: var(--el-text-color-primary);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* 行样式 */
.draft-row {
  background-color: rgba(144, 147, 153, 0.08);
}

.rejected-row {
  background-color: rgba(245, 108, 108, 0.08);
}

.cursor-pointer {
  cursor: pointer;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInFromLeft {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.el-button {
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 添加表格行悬停效果 */
:deep(.el-table__row) {
  transition: all 0.3s ease;
}

:deep(.el-table__row:hover) {
  background-color: var(--el-color-primary-light-9) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 2;
  position: relative;
}

/* 改进表单样式 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--el-color-primary);
}

/* 响应式设计优化 */
@media screen and (max-width: 768px) {
  .news-management {
    padding: 10px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .page-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-form {
    flex-direction: column;
  }
  
  .filter-form .el-form-item {
    margin-right: 0 !important;
    width: 100%;
  }
}

.editor-container {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.editor-container :deep(.w-e-text-container) {
  background-color: white;
}

.editor-container :deep(.w-e-toolbar) {
  border-bottom: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
}

.editor-container :deep(.w-e-bar-item) {
  transition: all 0.3s ease;
}

.editor-container :deep(.w-e-bar-item:hover) {
  background-color: var(--el-color-primary-light-9);
}

.news-detail-dialog {
  --detail-spacing: 24px;
}

.news-detail {
  padding: var(--detail-spacing);
  max-width: 1200px;
  margin: 0 auto;
}

.news-detail-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-color-primary-dark-2);
  line-height: 1.4;
  margin-bottom: var(--detail-spacing);
  padding-bottom: 16px;
  border-bottom: 2px solid var(--el-border-color-light);
  position: relative;
}

.news-detail-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100px;
  height: 2px;
  background: var(--el-color-primary);
}

.news-detail-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: var(--detail-spacing);
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.meta-info span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.news-detail-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: var(--detail-spacing);
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-color-primary);
  margin: 8px 0;
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.news-detail-summary {
  background: var(--el-color-primary-light-9);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: var(--detail-spacing);
  position: relative;
  border-left: 4px solid var(--el-color-primary);
}

.summary-label, .content-label {
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
}

.summary-content {
  color: var(--el-text-color-regular);
  line-height: 1.8;
  font-size: 16px;
}

.news-detail-cover {
  margin-bottom: var(--detail-spacing);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.news-detail-cover .el-image {
  width: 100%;
  max-height: 500px;
  transition: all 0.5s ease;
}

.news-detail-cover:hover .el-image {
  transform: scale(1.02);
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  gap: 8px;
}

.news-detail-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.content-text {
  line-height: 1.8;
  color: var(--el-text-color-primary);
  font-size: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-light);
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .news-detail {
    padding: 16px;
  }
  
  .news-detail-title {
    font-size: 22px;
  }
  
  .news-detail-meta {
    padding: 12px;
    gap: 12px;
  }
  
  .meta-info {
    flex-direction: column;
    gap: 8px;
  }
  
  .stat-card {
    padding: 12px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .news-detail-summary,
  .news-detail-content {
    padding: 16px;
  }
  
  .summary-label,
  .content-label {
    font-size: 16px;
  }
  
  .content-text {
    font-size: 14px;
  }
}

.stats-row {
  margin-bottom: 24px;
}

.stats-card {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  height: 120px;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.total-news .stats-icon {
  background: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}

.total-views .stats-icon {
  background: rgba(103, 194, 58, 0.1);
  color: #67C23A;
}

.total-comments .stats-icon {
  background: rgba(230, 162, 60, 0.1);
  color: #E6A23C;
}

.avg-engagement .stats-icon {
  background: rgba(144, 147, 153, 0.1);
  color: #909399;
}

.stats-info {
  flex: 1;
}

.stats-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
}

.stats-trend.up {
  color: #67C23A;
}

.stats-trend.down {
  color: #F56C6C;
}

.charts-row {
  margin-bottom: 24px;
}

.chart-card {
  margin-bottom: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.chart-container {
  padding: 12px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .stats-card {
    margin-bottom: 16px;
    height: auto;
    padding: 16px;
  }
  
  .stats-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .stats-value {
    font-size: 20px;
  }
  
  .chart-card {
    margin-bottom: 16px;
  }
  
  .chart-container {
    padding: 8px;
  }
}

.shortcut-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 100;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.shortcuts-list {
  padding: 12px;
}

.shortcuts-list h4 {
  margin: 0 0 12px;
  color: var(--el-text-color-primary);
}

.shortcuts-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.shortcuts-list li {
  margin-bottom: 8px;
  color: var(--el-text-color-regular);
  display: flex;
  align-items: center;
  gap: 8px;
}

.shortcuts-list kbd {
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 12px;
  color: var(--el-text-color-primary);
}

.import-upload {
  text-align: center;
}

.import-upload .el-upload {
  width: 100%;
}

.import-upload .el-upload-dragger {
  width: 100%;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.loading-content {
  text-align: center;
}

.loading-icon {
  font-size: 40px;
  color: var(--el-color-primary);
  animation: rotate 1s linear infinite;
}

.loading-text {
  margin-top: 12px;
  color: var(--el-text-color-primary);
  font-size: 14px;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 添加更多过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* 优化暗色模式 */
:deep(.dark) {
  .loading-overlay {
    background: rgba(0, 0, 0, 0.9);
  }

  .shortcuts-list kbd {
    background: var(--el-fill-color-darker);
    border-color: var(--el-border-color-darker);
  }
}
</style> 