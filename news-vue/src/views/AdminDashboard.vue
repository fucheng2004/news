<template>
  <div class="admin-dashboard" :class="{ 'dark-mode': isDarkMode }">
    <el-row class="dashboard-header">
      <el-col :span="24">
        <div class="welcome-panel">
          <div class="welcome-text">
            <h1>管理员后台</h1>
            <p>欢迎回来，<span class="username">{{ userInfo.username }}</span></p>
            <p class="current-time">{{ currentTime }}</p>
          </div>
          <div class="user-avatar">
            <el-dropdown trigger="click" @command="handleUserCommand">
              <div class="avatar-wrapper">
                <el-avatar :src="userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" :size="50">{{ userInfo.username.charAt(0) }}</el-avatar>
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><user /></el-icon>个人信息
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <el-icon><setting /></el-icon>设置
                  </el-dropdown-item>
                  <el-dropdown-item command="toggleTheme">
                    <el-icon><moon v-if="!isDarkMode" /><sunny v-else /></el-icon>
                    {{ isDarkMode ? '浅色模式' : '深色模式' }}
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><switch-button /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="dashboard-content">
      <el-col :xs="24" :sm="8" :md="6" :lg="5" :xl="4">
        <el-card class="menu-card">
          <el-menu
            class="admin-menu"
            :default-active="activeMenu"
            @select="handleMenuSelect"
          >
            <el-menu-item index="overview">
              <el-icon><DataLine /></el-icon>
              <span>总览</span>
            </el-menu-item>
            <el-menu-item index="tasks">
              <el-icon><List /></el-icon>
              <span>待处理事项</span>
              <el-badge :value="stats.pendingTasks" class="menu-badge" v-if="stats.pendingTasks > 0" />
            </el-menu-item>
            <el-menu-item index="news">
              <el-icon><Document /></el-icon>
              <span>新闻管理</span>
              <el-badge :value="stats.pendingNews" class="menu-badge" v-if="stats.pendingNews > 0" />
            </el-menu-item>
            <el-menu-item index="users">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="settings">
              <el-icon><Setting /></el-icon>
              <span>系统设置</span>
            </el-menu-item>
          </el-menu>
          <div class="menu-footer">
            <el-button type="danger" plain size="small" @click="handleLogout">
              退出登录
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="16" :md="18" :lg="19" :xl="20">
        <el-card class="main-content-card">
          <!-- 总览面板 -->
          <div v-if="activeMenu === 'overview'" class="overview-panel">
            <div class="overview-header">
              <div class="header-left">
                <h2 class="panel-title">
                  <el-icon><DataBoard /></el-icon>
                  系统概览
                </h2>
                <div class="refresh-info">
                  <span class="last-update">最后更新：{{ lastUpdateTime }}</span>
                  <el-button type="primary" link size="small" @click="refreshData">
                    <el-icon><Refresh /></el-icon>
                    刷新数据
                  </el-button>
                </div>
              </div>
              <div class="header-right">
                <el-radio-group v-model="timeRange" size="small" @change="handleTimeRangeChange">
                  <el-radio-button label="today">今日</el-radio-button>
                  <el-radio-button label="week">本周</el-radio-button>
                  <el-radio-button label="month">本月</el-radio-button>
                </el-radio-group>
              </div>
            </div>

            <el-divider>
              <el-icon><DataLine /></el-icon>
              数据统计
            </el-divider>

            <el-row :gutter="20" class="stats-row">
              <el-col :xs="24" :sm="12" :md="6">
                <el-card class="stat-card" :body-style="{ padding: '20px' }">
                  <div class="stat-content">
                    <div class="stat-header">
                      <div class="stat-icon news-icon">
                        <el-icon><ChatDotRound /></el-icon>
                      </div>
                      <div class="stat-title">
                        <span class="label">待审新闻</span>
                        <el-tooltip content="点击查看详情" placement="top">
                          <el-button link type="primary" size="small" @click="viewNewsList">
                            <el-icon><ArrowRight /></el-icon>
                          </el-button>
                        </el-tooltip>
                      </div>
                    </div>
                    <div class="stat-body">
                      <div class="stat-main">
                        <span class="value">{{ stats.pendingNews }}</span>
                        <span class="unit">条</span>
                      </div>
                      <div class="stat-trend">
                        <span class="trend-label">较昨日</span>
                        <span class="trend-value up">
                          <el-icon><CaretTop /></el-icon>
                          +2
                        </span>
                      </div>
                    </div>
                    <div class="stat-footer">
                      <el-progress 
                        :percentage="Math.min((stats.pendingNews / 20) * 100, 100)" 
                        :color="getProgressColor(stats.pendingNews / 20)"
                        :stroke-width="4"
                        :show-text="false"
                      />
                    </div>
                  </div>
                </el-card>
              </el-col>

              <el-col :xs="24" :sm="12" :md="6">
                <el-card class="stat-card" :body-style="{ padding: '20px' }">
                  <div class="stat-content">
                    <div class="stat-header">
                      <div class="stat-icon task-icon">
                        <el-icon><List /></el-icon>
                      </div>
                      <div class="stat-title">
                        <span class="label">待处理事项</span>
                        <el-tooltip content="点击查看详情" placement="top">
                          <el-button link type="primary" size="small" @click="viewTaskList">
                            <el-icon><ArrowRight /></el-icon>
                          </el-button>
                        </el-tooltip>
                      </div>
                    </div>
                    <div class="stat-body">
                      <div class="stat-main">
                        <span class="value">{{ stats.pendingTasks }}</span>
                        <span class="unit">项</span>
                      </div>
                      <div class="stat-trend">
                        <span class="trend-label">较昨日</span>
                        <span class="trend-value down">
                          <el-icon><CaretBottom /></el-icon>
                          -1
                        </span>
                      </div>
                    </div>
                    <div class="stat-footer">
                      <el-progress 
                        :percentage="Math.min((stats.pendingTasks / 15) * 100, 100)" 
                        :color="getProgressColor(stats.pendingTasks / 15)"
                        :stroke-width="4"
                        :show-text="false"
                      />
                    </div>
                  </div>
                </el-card>
              </el-col>

              <el-col :xs="24" :sm="12" :md="6">
                <el-card class="stat-card" :body-style="{ padding: '20px' }">
                  <div class="stat-content">
                    <div class="stat-header">
                      <div class="stat-icon user-icon">
                        <el-icon><User /></el-icon>
                      </div>
                      <div class="stat-title">
                        <span class="label">在线用户</span>
                        <el-tooltip content="实时数据" placement="top">
                          <el-icon class="animate-ping"><Loading /></el-icon>
                        </el-tooltip>
                      </div>
                    </div>
                    <div class="stat-body">
                      <div class="stat-main">
                        <span class="value">{{ stats.onlineUsers }}</span>
                        <span class="unit">人</span>
                      </div>
                      <div class="stat-trend">
                        <span class="trend-label">活跃度</span>
                        <span class="trend-value normal">
                          <el-icon><DataLine /></el-icon>
                          正常
                        </span>
                      </div>
                    </div>
                    <div class="stat-footer">
                      <el-progress 
                        :percentage="Math.min((stats.onlineUsers / 100) * 100, 100)" 
                        :color="getProgressColor(stats.onlineUsers / 100)"
                        :stroke-width="4"
                        :show-text="false"
                      />
                    </div>
                  </div>
                </el-card>
              </el-col>

              <el-col :xs="24" :sm="12" :md="6">
                <el-card class="stat-card" :body-style="{ padding: '20px' }">
                  <div class="stat-content">
                    <div class="stat-header">
                      <div class="stat-icon system-icon">
                        <el-icon><Monitor /></el-icon>
                      </div>
                      <div class="stat-title">
                        <span class="label">系统状态</span>
                        <el-tag size="small" type="success" effect="dark">正常</el-tag>
                      </div>
                    </div>
                    <div class="stat-body">
                      <div class="stat-main">
                        <span class="value">98.9</span>
                        <span class="unit">%</span>
                      </div>
                      <div class="stat-trend">
                        <span class="trend-label">运行时长</span>
                        <span class="trend-value normal">
                          <el-icon><Timer /></el-icon>
                          30天
                        </span>
                      </div>
                    </div>
                    <div class="stat-footer">
                      <el-progress 
                        :percentage="98.9"
                        :color="getProgressColor(0.989)"
                        :stroke-width="4"
                        :show-text="false"
                      />
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            
            <el-divider content-position="center">快捷操作</el-divider>
            
            <el-row :gutter="20" class="quick-actions">
              <el-col :xs="24" :sm="24" :md="24">
                <el-space wrap size="large" class="quick-action-space">
                  <el-card class="action-card hoverable-card" @click="activeMenu = 'tasks'">
                    <el-icon class="action-icon"><List /></el-icon>
                    <div class="action-title">管理任务</div>
                  </el-card>
                  <el-card class="action-card hoverable-card" @click="activeMenu = 'news'">
                    <el-icon class="action-icon"><Document /></el-icon>
                    <div class="action-title">管理新闻</div>
                  </el-card>
                  <el-card class="action-card hoverable-card" @click="activeMenu = 'users'">
                    <el-icon class="action-icon"><User /></el-icon>
                    <div class="action-title">管理用户</div>
                  </el-card>
                  <el-card class="action-card hoverable-card" @click="activeMenu = 'settings'">
                    <el-icon class="action-icon"><Setting /></el-icon>
                    <div class="action-title">系统设置</div>
                  </el-card>
                </el-space>
              </el-col>
            </el-row>
            
            <el-divider content-position="center">系统状态</el-divider>
            
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="16">
                <el-card class="chart-card hoverable-card">
                  <template #header>
                    <div class="stat-header">
                      <div class="stat-icon data-icon">
                        <el-icon><DataLine /></el-icon>
                      </div>
                      <span>系统访问量趋势</span>
                      <div>
                        <el-button type="primary" size="small" @click="refreshCharts" circle>
                          <el-icon><Refresh /></el-icon>
                        </el-button>
                        <el-button type="success" size="small" @click="exportChartData('trend')" circle>
                          <el-icon><Download /></el-icon>
                        </el-button>
                        <el-radio-group v-model="timeRange" size="small" @change="handleTimeRangeChange">
                          <el-radio-button label="week">本周</el-radio-button>
                          <el-radio-button label="month">本月</el-radio-button>
                          <el-radio-button label="year">全年</el-radio-button>
                        </el-radio-group>
                      </div>
                    </div>
                  </template>
                  <div class="chart-container">
                    <div class="chart-header">
                      <div class="chart-title">最近七天访问量对比</div>
                      <div class="chart-legend">
                        <span class="legend-item"><span class="legend-color this-week"></span>本周</span>
                        <span class="legend-item"><span class="legend-color last-week"></span>上周</span>
                      </div>
                    </div>
                    <div class="chart-placeholder">
                      <div class="chart-mock">
                        <div v-for="(h, i) in currentChartData" :key="i" class="chart-column">
                          <div class="chart-bar last-week" :style="{ height: lastWeekData[i] + '%' }">
                            <div class="chart-tooltip">{{ lastWeekData[i] }}次</div>
                          </div>
                          <div class="chart-bar this-week" :style="{ height: h + '%' }">
                            <div class="chart-tooltip">{{ h }}次</div>
                          </div>
                        </div>
                      </div>
                      <div class="chart-labels">
                        <span v-for="(d, i) in ['周一', '周二', '周三', '周四', '周五', '周六', '周日']" :key="i">{{ d }}</span>
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="24" :md="8">
                <el-card class="realtime-card hoverable-card">
                  <template #header>
                    <div class="stat-header">
                      <div class="stat-icon realtime-icon">
                        <el-icon><Clock /></el-icon>
                      </div>
                      <span>实时动态</span>
                    </div>
                  </template>
                  <div class="realtime-list">
                    <div v-for="(item, index) in realtimeActivities" :key="index"
                         class="realtime-item" :class="{'highlight': index === 0}">
                      <div class="realtime-time">{{ item.time }}</div>
                      <div class="realtime-content">
                        <div class="realtime-icon-small" :class="item.type">
                          <el-icon v-if="item.type === 'news'"><Document /></el-icon>
                          <el-icon v-else-if="item.type === 'user'"><User /></el-icon>
                          <el-icon v-else-if="item.type === 'system'"><Setting /></el-icon>
                          <el-icon v-else><List /></el-icon>
                        </div>
                        <div class="realtime-text">{{ item.content }}</div>
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <!-- 待处理事项面板 -->
          <div v-if="activeMenu === 'tasks'" class="tasks-panel">
            <div class="panel-header">
              <div class="panel-title-area">
                <h2>待处理事项</h2>
                <div class="panel-stats">
                  <div class="panel-stat-item">
                    <div class="stat-value">{{ filteredTasks.length }}</div>
                    <div class="stat-label">总事项</div>
                  </div>
                  <div class="panel-stat-item">
                    <div class="stat-value">{{ taskStats.pending }}</div>
                    <div class="stat-label">待处理</div>
                  </div>
                  <div class="panel-stat-item">
                    <div class="stat-value">{{ taskStats.inProgress }}</div>
                    <div class="stat-label">进行中</div>
                  </div>
                  <div class="panel-stat-item">
                    <div class="stat-value">{{ taskStats.completed }}</div>
                    <div class="stat-label">已完成</div>
                  </div>
                </div>
              </div>
              <div class="header-actions">
                <el-button type="success" @click="batchOperate('complete')" :disabled="!hasTaskSelected">
                  <el-icon><Check /></el-icon>批量完成
                </el-button>
                <el-button type="primary" @click="showAddTaskDialog">
                  <el-icon><Plus /></el-icon>添加事项
                </el-button>
              </div>
            </div>

            <!-- 任务统计卡片行 -->
            <el-row :gutter="20" class="task-stats-row">
              <el-col :xs="24" :sm="12" :md="6">
                <el-card class="task-stat-card" shadow="hover">
                  <div class="task-stat-inner">
                    <div class="task-stat-icon pending">
                      <el-icon><Timer /></el-icon>
                    </div>
                    <div class="task-stat-content">
                      <div class="task-stat-label">待处理</div>
                      <div class="task-stat-value">{{ taskStats.pending }}</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-card class="task-stat-card" shadow="hover">
                  <div class="task-stat-inner">
                    <div class="task-stat-icon in-progress">
                      <el-icon><Loading /></el-icon>
                    </div>
                    <div class="task-stat-content">
                      <div class="task-stat-label">进行中</div>
                      <div class="task-stat-value">{{ taskStats.inProgress }}</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-card class="task-stat-card" shadow="hover">
                  <div class="task-stat-inner">
                    <div class="task-stat-icon completed">
                      <el-icon><CircleCheck /></el-icon>
                    </div>
                    <div class="task-stat-content">
                      <div class="task-stat-label">已完成</div>
                      <div class="task-stat-value">{{ taskStats.completed }}</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-card class="task-stat-card" shadow="hover">
                  <div class="task-stat-inner">
                    <div class="task-stat-icon delayed">
                      <el-icon><WarningFilled /></el-icon>
                    </div>
                    <div class="task-stat-content">
                      <div class="task-stat-label">已延期</div>
                      <div class="task-stat-value">{{ taskStats.delayed }}</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <!-- 筛选条件 -->
            <el-card class="filter-card" shadow="hover">
              <div class="filter-header">
                <span class="filter-title"><el-icon><Filter /></el-icon>筛选条件</span>
                <el-button type="primary" link @click="expandFilters = !expandFilters">
                  {{ expandFilters ? '收起' : '展开' }}
                  <el-icon><ArrowDown :class="{ 'is-rotate': expandFilters }" /></el-icon>
                </el-button>
              </div>
              <el-collapse-transition>
                <div v-show="expandFilters">
                  <el-form :inline="true" class="filter-form">
                    <el-form-item label="状态筛选">
                      <el-select v-model="taskFilters.status" placeholder="选择状态" clearable>
                        <el-option label="待处理" value="pending">
                          <div class="option-with-icon">
                            <div class="option-icon pending"></div>待处理
                          </div>
                        </el-option>
                        <el-option label="进行中" value="in_progress">
                          <div class="option-with-icon">
                            <div class="option-icon in-progress"></div>进行中
                          </div>
                        </el-option>
                        <el-option label="已完成" value="completed">
                          <div class="option-with-icon">
                            <div class="option-icon completed"></div>已完成
                          </div>
                        </el-option>
                        <el-option label="已拒绝" value="rejected">
                          <div class="option-with-icon">
                            <div class="option-icon rejected"></div>已拒绝
                          </div>
                        </el-option>
                        <el-option label="已延期" value="delayed">
                          <div class="option-with-icon">
                            <div class="option-icon delayed"></div>已延期
                          </div>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="优先级">
                      <el-select v-model="taskFilters.priority" placeholder="选择优先级" clearable>
                        <el-option label="低" value="low">
                          <div class="option-with-icon">
                            <el-tag size="small" type="info">低</el-tag>
                          </div>
                        </el-option>
                        <el-option label="中" value="medium">
                          <div class="option-with-icon">
                            <el-tag size="small" type="success">中</el-tag>
                          </div>
                        </el-option>
                        <el-option label="高" value="high">
                          <div class="option-with-icon">
                            <el-tag size="small" type="warning">高</el-tag>
                          </div>
                        </el-option>
                        <el-option label="紧急" value="urgent">
                          <div class="option-with-icon">
                            <el-tag size="small" type="danger">紧急</el-tag>
                          </div>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间">
                      <el-date-picker
                        v-model="taskFilters.dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="YYYY-MM-DD"
                        :shortcuts="dateShortcuts"
                      />
                    </el-form-item>
                    <el-form-item label="关键词">
                      <el-input
                        v-model="taskFilters.keyword"
                        placeholder="搜索标题或描述"
                        clearable
                        prefix-icon="Search"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="applyTaskFilters">筛选</el-button>
                      <el-button @click="resetTaskFilters">重置</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </el-collapse-transition>
              <div class="active-filters" v-if="hasActiveFilters">
                <span class="filter-label">已选筛选条件:</span>
                <el-tag v-if="taskFilters.status" closable @close="removeFilter('status')" class="filter-tag" effect="dark">
                  状态: {{ getStatusLabel(taskFilters.status) }}
                </el-tag>
                <el-tag v-if="taskFilters.priority" closable @close="removeFilter('priority')" class="filter-tag" effect="dark">
                  优先级: {{ getPriorityLabel(taskFilters.priority) }}
                </el-tag>
                <el-tag v-if="taskFilters.dateRange && taskFilters.dateRange.length === 2" closable @close="removeFilter('dateRange')" class="filter-tag" effect="dark">
                  时间: {{ taskFilters.dateRange[0] }} 至 {{ taskFilters.dateRange[1] }}
                </el-tag>
                <el-tag v-if="taskFilters.keyword" closable @close="removeFilter('keyword')" class="filter-tag" effect="dark">
                  关键词: {{ taskFilters.keyword }}
                </el-tag>
              </div>
            </el-card>
            
            <!-- 待处理事项列表 -->
            <el-card class="table-card" shadow="hover">
              <div class="table-top-bar">
                <div class="table-info">
                  <span>共 {{ filteredTasks.length }} 项记录</span>
                  <el-radio-group v-model="tableView" size="small" class="view-toggle">
                    <el-radio-button label="table"><el-icon><Grid /></el-icon></el-radio-button>
                    <el-radio-button label="card"><el-icon><Operation /></el-icon></el-radio-button>
                  </el-radio-group>
                </div>
                <div class="batch-actions" v-if="tableView === 'table'">
                  <el-button size="small" :disabled="!hasTaskSelected" @click="batchOperate('delete')">
                    <el-icon><Delete /></el-icon>批量删除
                  </el-button>
                </div>
              </div>

              <!-- 表格视图 -->
              <div v-if="tableView === 'table'">
                <el-table
                  :data="filteredTasks"
                  style="width: 100%"
                  v-loading="loading.tasks"
                  :row-class-name="getTaskRowClass"
                  @row-click="rowClick"
                  @selection-change="handleSelectionChange"
                  border
                  stripe
                  highlight-current-row
                  class="custom-table"
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="id" label="ID" width="70" sortable />
                  <el-table-column prop="title" label="事项标题" min-width="200" show-overflow-tooltip>
                    <template #default="scope">
                      <div class="task-title-cell">
                        <div class="status-dot" :class="scope.row.status"></div>
                        <span class="task-title-text">{{ scope.row.title }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="类型" width="120">
                    <template #default="scope">
                      <el-tag :type="getTaskTypeTag(scope.row.type)" effect="plain" class="type-tag">{{ scope.row.type }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="priority" label="优先级" width="100">
                    <template #default="scope">
                      <el-tag :type="getPriorityTag(scope.row.priority)" class="priority-tag" effect="dark">
                        {{ getPriorityLabel(scope.row.priority) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="状态" width="100">
                    <template #default="scope">
                      <el-tag :type="getStatusTag(scope.row.status)" class="status-tag" effect="light">
                        {{ getStatusLabel(scope.row.status) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="dueDate" label="截止日期" width="120">
                    <template #default="scope">
                      <div class="due-date" :class="{ overdue: isOverdue(scope.row.dueDate) }">
                        <el-icon><Timer /></el-icon>
                        {{ formatDate(scope.row.dueDate, 'YYYY-MM-DD') }}
                        <el-tooltip content="已逾期" placement="top" v-if="isOverdue(scope.row.dueDate)">
                          <el-icon class="overdue-icon"><WarningFilled /></el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createdAt" label="创建时间" width="120">
                    <template #default="scope">
                      {{ formatDate(scope.row.createdAt, 'YYYY-MM-DD') }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="200" fixed="right">
                    <template #default="scope">
                      <div class="table-actions">
                        <el-button text type="primary" @click.stop="viewTask(scope.row)" title="查看详情">
                          <el-icon><View /></el-icon>
                        </el-button>
                        <el-button text type="success" @click.stop="handleTask(scope.row)" title="处理事项">
                          <el-icon><Edit /></el-icon>
                        </el-button>
                        <el-button text type="danger" @click.stop="deleteTask(scope.row)" title="删除事项">
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 卡片视图 -->
              <div v-else class="task-cards-view">
                <el-empty description="暂无数据" v-if="filteredTasks.length === 0" />
                <el-row :gutter="20" v-else>
                  <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="task in filteredTasks" :key="task.id">
                    <div class="task-card-container">
                      <el-card class="task-card" shadow="hover" :class="{'task-overdue': isOverdue(task.dueDate)}">
                        <div class="task-card-status-bar" :class="task.status"></div>
                        <div class="task-card-header">
                          <div class="task-card-priority">
                            <el-tag size="small" :type="getPriorityTag(task.priority)" effect="dark">{{ getPriorityLabel(task.priority) }}</el-tag>
                          </div>
                          <div class="task-card-id">#{{ task.id }}</div>
                        </div>
                        <div class="task-card-title" @click="viewTask(task)">{{ task.title }}</div>
                        <div class="task-card-desc">{{ task.description.substring(0, 60) }}{{ task.description.length > 60 ? '...' : '' }}</div>
                        <div class="task-card-meta">
                          <div class="task-due-date" :class="{ overdue: isOverdue(task.dueDate) }">
                            <el-icon><Timer /></el-icon>
                            {{ formatDate(task.dueDate, 'YYYY-MM-DD') }}
                            <el-tooltip content="已逾期" placement="top" v-if="isOverdue(task.dueDate)">
                              <el-icon class="overdue-icon"><WarningFilled /></el-icon>
                            </el-tooltip>
                          </div>
                          <div class="task-assignee">
                            <el-icon><User /></el-icon>
                            {{ getAssigneeName(task.assignee) }}
                          </div>
                        </div>
                        <div class="task-card-footer">
                          <div class="task-status-badge" :class="task.status">
                            {{ getStatusLabel(task.status) }}
                          </div>
                          <div class="task-buttons">
                            <el-button text type="primary" @click="viewTask(task)" title="查看详情">
                              <el-icon><View /></el-icon>
                            </el-button>
                            <el-button text type="success" @click="handleTask(task)" title="处理事项">
                              <el-icon><Edit /></el-icon>
                            </el-button>
                            <el-button text type="danger" @click="deleteTask(task)" title="删除事项">
                              <el-icon><Delete /></el-icon>
                            </el-button>
                          </div>
                        </div>
                      </el-card>
                    </div>
                  </el-col>
                </el-row>
              </div>

              <!-- 分页 -->
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="pagination.currentPage"
                  v-model:page-size="pagination.pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="pagination.total"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </el-card>
          </div>

          <!-- 其他面板根据需要添加 -->
          <div v-if="activeMenu === 'news'" class="news-panel">
            <h2>新闻管理</h2>
            <p>新闻管理功能正在开发中...</p>
          </div>

          <div v-if="activeMenu === 'users'" class="users-panel">
            <div class="panel-header">
              <div class="panel-title-area">
                <h2>用户管理</h2>
                <div class="panel-stats">
                  <div class="panel-stat-item">
                    <div class="stat-value">{{ userStats.total }}</div>
                    <div class="stat-label">总用户</div>
                  </div>
                  <div class="panel-stat-item">
                    <div class="stat-value">{{ userStats.active }}</div>
                    <div class="stat-label">活跃用户</div>
                  </div>
                  <div class="panel-stat-item">
                    <div class="stat-value">{{ userStats.new }}</div>
                    <div class="stat-label">新增用户</div>
                  </div>
                  <div class="panel-stat-item">
                    <div class="stat-value">{{ userStats.blocked }}</div>
                    <div class="stat-label">已封禁</div>
                  </div>
                </div>
              </div>
              <div class="header-actions">
                <el-button type="primary" @click="showAddUserDialog">
                  <el-icon><Plus /></el-icon>添加用户
                </el-button>
                <el-button type="success" @click="exportUserData">
                  <el-icon><Download /></el-icon>导出数据
                </el-button>
              </div>
            </div>

            <!-- 用户列表 -->
            <el-card class="table-card" shadow="hover">
              <div class="table-top-bar">
                <div class="table-info">
                  <span>共 {{ filteredUsers.length }} 位用户</span>
                  <el-radio-group v-model="userTableView" size="small" class="view-toggle">
                    <el-radio-button label="table"><el-icon><Grid /></el-icon></el-radio-button>
                    <el-radio-button label="card"><el-icon><Operation /></el-icon></el-radio-button>
                  </el-radio-group>
                </div>
                <div class="batch-actions" v-if="userTableView === 'table'">
                  <el-button size="small" :disabled="!hasUserSelected" @click="batchUserOperation('block')">
                      <el-icon><Lock /></el-icon>批量封禁
                    </el-button>
                  <el-button size="small" :disabled="!hasUserSelected" @click="batchUserOperation('delete')">
                      <el-icon><Delete /></el-icon>批量删除
                    </el-button>
                </div>
              </div>

              <!-- 表格视图 -->
              <div v-if="userTableView === 'table'">
                <el-table
                  :data="filteredUsers"
                  style="width: 100%"
                  v-loading="loading.users"
                  @selection-change="handleUserSelectionChange"
                  border
                  stripe
                  highlight-current-row
                  class="custom-table"
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="id" label="ID" width="80" sortable />
                  <el-table-column label="用户信息" min-width="200">
                    <template #default="scope">
                      <div class="user-info-cell">
                        <el-avatar :size="32" :src="scope.row.avatar">
                          {{ scope.row.username.charAt(0).toUpperCase() }}
                        </el-avatar>
                        <div class="user-info-details">
                          <div class="username">{{ scope.row.username }}</div>
                          <div class="email">{{ scope.row.email }}</div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="role" label="角色" width="120">
                    <template #default="scope">
                      <el-tag :type="getUserRoleType(scope.row.role)" effect="plain">
                        {{ getUserRoleLabel(scope.row.role) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="状态" width="100">
                    <template #default="scope">
                      <el-tag :type="getUserStatusType(scope.row.status)">
                        {{ getUserStatusLabel(scope.row.status) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="lastLogin" label="最后登录" width="160">
                    <template #default="scope">
                      <div class="last-login">
                        <el-icon><Timer /></el-icon>
                        {{ formatDate(scope.row.lastLogin) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createdAt" label="注册时间" width="160">
                    <template #default="scope">
                      {{ formatDate(scope.row.createdAt) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="200" fixed="right">
                    <template #default="scope">
                      <div class="table-actions">
                        <el-button text type="primary" @click="viewUser(scope.row)" title="查看详情">
                            <el-icon><View /></el-icon>
                          </el-button>
                        <el-button text type="success" @click="editUser(scope.row)" title="编辑用户">
                            <el-icon><Edit /></el-icon>
                          </el-button>
                          <el-button 
                            text 
                            :type="scope.row.status === 'blocked' ? 'success' : 'warning'"
                            @click="toggleUserStatus(scope.row)"
                          :title="scope.row.status === 'blocked' ? '解除封禁' : '封禁用户'"
                          >
                            <el-icon>
                              <component :is="scope.row.status === 'blocked' ? 'Unlock' : 'Lock'" />
                            </el-icon>
                          </el-button>
                        <el-button text type="danger" @click="deleteUser(scope.row)" title="删除用户">
                            <el-icon><Delete /></el-icon>
                          </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 分页 -->
              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="userPagination.currentPage"
                  v-model:page-size="userPagination.pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="userPagination.total"
                  @size-change="handleUserSizeChange"
                  @current-change="handleUserCurrentChange"
                />
              </div>
            </el-card>
          </div>

          <div v-if="activeMenu === 'settings'" class="settings-panel">
            <h2>系统设置</h2>
            
            <el-tabs v-model="settingsActiveTab">
              <el-tab-pane label="个人偏好" name="preferences">
                <el-card class="settings-card">
                  <template #header>
                    <div class="settings-header">
                      <span>显示设置</span>
                    </div>
                  </template>
                  <el-form label-position="top">
                    <el-form-item label="主题模式">
                      <el-switch
                        v-model="isDarkMode"
                        active-text="深色模式"
                        inactive-text="浅色模式"
                        @change="toggleDarkMode"
                      />
                    </el-form-item>
                    <el-form-item label="强调色">
                      <el-color-picker v-model="accentColor" show-alpha @change="updateAccentColor" />
                    </el-form-item>
                    <el-form-item label="字体大小">
                      <el-slider v-model="fontSizeAdjust" :min="-2" :max="4" :step="1" show-stops @change="updateFontSize">
                        <template #default="{ value }">
                          <div class="slider-demo-value">{{ value >= 0 ? '+' + value : value }}</div>
                        </template>
                      </el-slider>
                    </el-form-item>
                  </el-form>
                </el-card>
                
                <el-card class="settings-card">
                  <template #header>
                    <div class="settings-header">
                      <span>通知设置</span>
                    </div>
                  </template>
                  <el-form label-position="top">
                    <el-form-item label="桌面通知">
                      <el-switch v-model="notificationSettings.desktop" @change="saveNotificationSettings" />
                    </el-form-item>
                    <el-form-item label="声音提醒">
                      <el-switch v-model="notificationSettings.sound" @change="saveNotificationSettings" />
                    </el-form-item>
                    <el-form-item label="邮件通知">
                      <el-switch v-model="notificationSettings.email" @change="saveNotificationSettings" />
                    </el-form-item>
                  </el-form>
                </el-card>
              </el-tab-pane>
              
              <el-tab-pane label="系统设置" name="system">
                <el-result icon="info" title="系统设置" sub-title="该功能仅对超级管理员开放">
                  <template #extra>
                    <el-button type="primary" @click="requestSystemAccess">申请权限</el-button>
                  </template>
                </el-result>
              </el-tab-pane>
              
              <el-tab-pane label="关于系统" name="about">
                <el-card class="settings-card">
                  <template #header>
                    <div class="settings-header">
                      <span>系统信息</span>
                    </div>
                  </template>
                  <el-descriptions :column="1" border>
                    <el-descriptions-item label="系统名称">谣言检测管理系统</el-descriptions-item>
                    <el-descriptions-item label="当前版本">v1.2.0</el-descriptions-item>
                    <el-descriptions-item label="更新日期">2023-11-20</el-descriptions-item>
                    <el-descriptions-item label="技术架构">Vue 3 + Element Plus</el-descriptions-item>
                    <el-descriptions-item label="开发者">谣言检测项目组</el-descriptions-item>
                  </el-descriptions>
                  
                  <div class="update-info">
                    <div class="update-header">最近更新</div>
                    <el-timeline>
                      <el-timeline-item timestamp="2023-11-20" type="primary">
                        <h4>v1.2.0 新特性</h4>
                        <p>- 优化管理员仪表盘界面</p>
                        <p>- 增加深色模式支持</p>
                        <p>- 改进数据可视化图表</p>
                      </el-timeline-item>
                      <el-timeline-item timestamp="2023-10-15" type="success">
                        <h4>v1.1.0 功能增强</h4>
                        <p>- 完善任务管理系统</p>
                        <p>- 优化新闻审核流程</p>
                        <p>- 修复已知bug</p>
                      </el-timeline-item>
                      <el-timeline-item timestamp="2023-09-01" type="info">
                        <h4>v1.0.0 正式发布</h4>
                        <p>- 基础功能上线</p>
                        <p>- 支持谣言检测和管理</p>
                      </el-timeline-item>
                    </el-timeline>
                  </div>
                </el-card>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加事项对话框 -->
    <el-dialog
      v-model="dialogs.addTask"
      title="添加待处理事项"
      width="600px"
      top="5vh"
    >
      <el-form
        :model="taskForm"
        :rules="taskRules"
        ref="taskFormRef"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="taskForm.title" placeholder="请输入事项标题" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="taskForm.type" placeholder="请选择事项类型" style="width: 100%">
            <el-option label="新闻审核" value="news_review" />
            <el-option label="用户反馈" value="user_feedback" />
            <el-option label="系统维护" value="system_maintenance" />
            <el-option label="内容更新" value="content_update" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="taskForm.priority">
            <el-radio-button label="low">低</el-radio-button>
            <el-radio-button label="medium">中</el-radio-button>
            <el-radio-button label="high">高</el-radio-button>
            <el-radio-button label="urgent">紧急</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="截止日期" prop="dueDate">
          <el-date-picker
            v-model="taskForm.dueDate"
            type="datetime"
            placeholder="选择截止日期和时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="详细描述" prop="description">
          <el-input
            v-model="taskForm.description"
            type="textarea"
            :rows="5"
            placeholder="请输入详细描述"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="assignee">
          <el-select v-model="taskForm.assignee" placeholder="请选择负责人" style="width: 100%">
            <el-option
              v-for="admin in adminList"
              :key="admin.id"
              :label="admin.username"
              :value="admin.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogs.addTask = false">取消</el-button>
          <el-button type="primary" @click="submitTask" :loading="loading.addTask">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看事项对话框 -->
    <el-dialog
      v-model="dialogs.viewTask"
      title="事项详情"
      width="700px"
      top="5vh"
    >
      <div v-if="currentTask" class="task-detail">
        <h3>{{ currentTask.title }}</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID" :span="2">{{ currentTask.id }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ currentTask.type }}</el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityTag(currentTask.priority)">
              {{ getPriorityLabel(currentTask.priority) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTag(currentTask.status)">
              {{ getStatusLabel(currentTask.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(currentTask.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="截止日期" :span="2">{{ formatDate(currentTask.dueDate) }}</el-descriptions-item>
          <el-descriptions-item label="负责人">{{ getAssigneeName(currentTask.assignee) }}</el-descriptions-item>
          <el-descriptions-item label="创建者">{{ currentTask.createdBy }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">
            <div class="task-description">{{ currentTask.description }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 处理事项对话框 -->
    <el-dialog
      v-model="dialogs.handleTask"
      title="处理事项"
      width="600px"
      top="10vh"
    >
      <div v-if="currentTask" class="handle-task-form">
        <h3>{{ currentTask.title }}</h3>
        <el-form
          :model="handleForm"
          :rules="handleRules"
          ref="handleFormRef"
          label-width="100px"
        >
          <el-form-item label="处理状态" prop="status">
            <el-select v-model="handleForm.status" placeholder="请选择状态" style="width: 100%">
              <el-option label="进行中" value="in_progress" />
              <el-option label="已完成" value="completed" />
              <el-option label="已拒绝" value="rejected" />
              <el-option label="已延期" value="delayed" />
            </el-select>
          </el-form-item>
          <el-form-item label="处理意见" prop="comment">
            <el-input
              v-model="handleForm.comment"
              type="textarea"
              :rows="5"
              placeholder="请输入处理意见或备注"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogs.handleTask = false">取消</el-button>
          <el-button type="primary" @click="submitHandleTask" :loading="loading.handleTask">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <div class="overview-section">
      <el-row :gutter="24">
        <!-- ... existing stat cards ... -->
      </el-row>
      
      <!-- 添加可视化图表部分 -->
      <el-row :gutter="24" class="chart-section">
        <el-col :span="16">
          <el-card class="chart-card trend-chart-card">
            <template #header>
              <div class="chart-header">
                <span class="chart-title">
                  <el-icon><TrendCharts /></el-icon>
                  趋势分析
                </span>
                <div>
                  <el-button type="primary" size="small" @click="refreshCharts" circle>
                    <el-icon><Refresh /></el-icon>
                  </el-button>
                  <el-button type="success" size="small" @click="exportChartData('trend')" circle>
                    <el-icon><Download /></el-icon>
                  </el-button>
                  <el-radio-group v-model="timeRange" size="small" @change="handleTimeRangeChange">
                    <el-radio-button label="week">本周</el-radio-button>
                    <el-radio-button label="month">本月</el-radio-button>
                    <el-radio-button label="year">全年</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </template>
            <div ref="trendChartRef" class="chart-container" v-loading="chartsLoading.trend"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="chart-card distribution-chart-card">
            <template #header>
              <div class="chart-header">
                <span class="chart-title">
                  <el-icon><PieChart /></el-icon>
                  分类分布
                </span>
                <el-button type="primary" size="small" @click="refreshCharts" circle>
                  <el-icon><Refresh /></el-icon>
                </el-button>
                <el-button type="success" size="small" @click="exportChartData('distribution')" circle>
                  <el-icon><Download /></el-icon>
                </el-button>
              </div>
            </template>
            <div ref="distributionChartRef" class="chart-container" v-loading="chartsLoading.distribution"></div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="24" class="chart-section">
        <el-col :span="24">
          <el-card class="chart-card activity-chart-card">
            <template #header>
              <div class="chart-header">
                <span class="chart-title">
                  <el-icon><DataLine /></el-icon>
                  活动分析
                </span>
                <div class="chart-actions">
                  <el-button type="primary" size="small" @click="refreshCharts" circle>
                    <el-icon><Refresh /></el-icon>
                  </el-button>
                  <el-button type="success" size="small" @click="exportChartData('activity')" circle>
                    <el-icon><Download /></el-icon>
                  </el-button>
                </div>
              </div>
            </template>
            <div ref="activityChartRef" class="chart-container" v-loading="chartsLoading.activity"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 添加用户对话框 -->
    <el-dialog
      v-model="dialogsUsers.addUser"
      title="添加用户"
      width="500px"
    >
      <el-form
        :model="userForm"
        :rules="userRules"
        ref="userFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="onAvatarSuccess"
            :before-upload="onAvatarBeforeUpload"
          >
            <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="用户" value="user" />
            <el-option label="游客" value="guest" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="userForm.status" placeholder="请选择状态">
            <el-option label="活跃" value="active" />
            <el-option label="已封禁" value="blocked" />
            <el-option label="新用户" value="new" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogsUsers.addUser = false">取消</el-button>
          <el-button type="primary" @click="submitUser" :loading="loadingUsers.addUser">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      v-model="dialogsUsers.editUser"
      title="编辑用户"
      width="500px"
    >
      <el-form
        :model="handleUserForm"
        :rules="handleUserRules"
        ref="handleUserFormRef"
        label-width="100px"
      >
        <el-form-item label="状态" prop="status">
          <el-select v-model="handleUserForm.status" placeholder="请选择状态">
            <el-option label="活跃" value="active" />
            <el-option label="已封禁" value="blocked" />
            <el-option label="新用户" value="new" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理意见" prop="comment">
          <el-input
            v-model="handleUserForm.comment"
            type="textarea"
            :rows="5"
            placeholder="请输入处理意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogsUsers.editUser = false">取消</el-button>
          <el-button type="primary" @click="submitUserEdit" :loading="loadingUsers.editUser">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import type { UploadFile, UploadFiles, UploadRawFile } from 'element-plus'
import { Document, Setting, List, DataLine, Plus, ChatDotRound, View, Edit, Delete, Clock, 
  ArrowDown, Moon, Sunny, SwitchButton, Check, Filter, Timer, CircleCheck, WarningFilled, 
  Loading, Grid, Operation, Search, DataBoard, Refresh, CaretTop, CaretBottom, Monitor, ArrowRight, 
  TrendCharts, PieChart, Download, Lock, Unlock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { formatDate as formatDateUtil } from '../utils/format'
import storage from '@/utils/storage'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import type { User, UserForm, HandleUserForm, UserStats, UserPagination, UserDialogs, UserLoading } from '@/types/user'
import { handleAvatarSuccess as handleAvatarSuccessUtil, beforeAvatarUpload as beforeAvatarUploadUtil } from '@/utils/upload'

// 定义标签类型
type TagType = 'info' | 'success' | 'warning' | 'danger' | 'primary' | '';

// 定义Element Plus标签类型
type ElTagType = 'info' | 'success' | 'warning' | 'danger' | 'primary';

// 定义任务类型
interface Task {
  id: number;
  title: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'delayed';
  createdAt: Date;
  dueDate: Date;
  description: string;
  assignee: number;
  createdBy: string;
}

// 定义管理员类型
interface Admin {
  id: number;
  username: string;
}

// 用户信息与路由
const userStore = useUserStore()
const router = useRouter()
const userInfo = computed(() => ({
  username: userStore.username || '管理员',
  id: userStore.id,
  avatar: userStore.avatar
}))

// 图表数据
const currentChartData = ref([30, 45, 25, 60, 75, 40, 50])
const lastWeekData = ref([25, 40, 30, 55, 65, 35, 45])

// 刷新图表数据
const refreshChart = () => {
  // 模拟数据更新
  currentChartData.value = currentChartData.value.map(() => Math.floor(Math.random() * 80) + 20)
  lastWeekData.value = lastWeekData.value.map(() => Math.floor(Math.random() * 70) + 10)
  ElMessage.success('图表数据已刷新')
}

// 实时动态数据
const realtimeActivities = ref([
  { time: '14:32', type: 'news', content: '新增5篇待审核新闻' },
  { time: '13:45', type: 'user', content: '用户李明注册成功' },
  { time: '12:20', type: 'system', content: '系统完成数据备份' },
  { time: '11:15', type: 'task', content: '完成2个待处理事项' },
  { time: '10:03', type: 'news', content: '审核通过3篇新闻' }
])

// 实时数据定时更新
let realtimeTimer: number | undefined

const updateRealtimeData = () => {
  const types = ['news', 'user', 'system', 'task']
  const contents = [
    '新增待审核新闻',
    '用户注册成功',
    '系统自动备份完成',
    '完成待处理事项',
    '审核通过新闻',
    '更新用户权限'
  ]
  
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const time = `${hours}:${minutes}`
  
  const type = types[Math.floor(Math.random() * types.length)]
  const content = contents[Math.floor(Math.random() * contents.length)]
  
  // 在列表前端添加新项目
  realtimeActivities.value.unshift({
    time,
    type,
    content
  })
  
  // 保持列表长度为5
  if (realtimeActivities.value.length > 5) {
    realtimeActivities.value.pop()
  }
}

// 检查是否是管理员
const checkAdmin = () => {
  console.log('[管理员仪表盘] 检查管理员权限');
  const isAdmin = storage.get('isAdmin') === true;
  const userRole = storage.get('userRole');
  
  if (!isAdmin || userRole !== 'admin') {
    console.log('[管理员仪表盘] 用户非管理员，重定向到首页');
    ElMessage.error('您没有权限访问管理员后台');
    router.push('/');
    return false;
  }
  
  console.log('[管理员仪表盘] 管理员权限验证通过');
  return true;
}

// 在页面加载时检查权限
onMounted(() => {
  if (!checkAdmin()) {
    return;
  }
  // ... 其他初始化代码 ...
})

// 菜单选择
const activeMenu = ref('tasks')

const handleMenuSelect = (key: string) => {
  if (key === 'news') {
    router.push('/news-management')
    return
  }
  activeMenu.value = key
}

// 状态数据
const stats = reactive({
  pendingNews: 12,
  registeredUsers: 245,
  pendingTasks: 8,
  onlineUsers: 100
})

// 管理员列表
const adminList = ref<Admin[]>([
  { id: 1, username: '系统管理员' },
  { id: 2, username: '内容审核员' },
  { id: 3, username: '技术支持' }
])

// 待处理事项数据
const tasks = ref<Task[]>([
  {
    id: 1,
    title: '审核新提交的谣言新闻',
    type: 'news_review',
    priority: 'high',
    status: 'pending',
    createdAt: new Date('2023-11-15T10:30:00'),
    dueDate: new Date('2023-11-17T18:00:00'),
    description: '有10条新的谣言新闻等待审核，需要验证内容真实性并做出判断。',
    assignee: 2,
    createdBy: '系统管理员'
  },
  {
    id: 2,
    title: '处理用户投诉反馈',
    type: 'user_feedback',
    priority: 'medium',
    status: 'in_progress',
    createdAt: new Date('2023-11-14T09:15:00'),
    dueDate: new Date('2023-11-16T17:00:00'),
    description: '多位用户反馈在使用检测功能时出现了问题，需要核实并解决。',
    assignee: 3,
    createdBy: '系统管理员'
  },
  {
    id: 3,
    title: '更新系统检测算法',
    type: 'system_maintenance',
    priority: 'urgent',
    status: 'pending',
    createdAt: new Date('2023-11-13T14:20:00'),
    dueDate: new Date('2023-11-14T18:00:00'),
    description: '需要更新系统的检测算法，提高对新型谣言的识别准确率。',
    assignee: 3,
    createdBy: '系统管理员'
  }
])

// 分页状态
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 3
})

// 对话框状态
const dialogs = reactive({
  addTask: false,
  viewTask: false,
  handleTask: false
})

// 加载状态
const loading = reactive({
  tasks: false,
  addTask: false,
  handleTask: false,
  users: false
})

// 当前选中的任务
const currentTask = ref<Task | null>(null)

// 任务表单
const taskFormRef = ref<FormInstance>()
const taskForm = reactive({
  title: '',
  type: '',
  priority: 'medium' as const,
  dueDate: new Date(),
  description: '',
  assignee: 0
})

// 处理表单
const handleFormRef = ref<FormInstance>()
const handleForm = reactive({
  status: '',
  comment: ''
})

// 表单验证规则
const taskRules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入事项标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度应在2到100个字符之间', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择事项类型', trigger: 'change' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ],
  dueDate: [
    { required: true, message: '请选择截止日期', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入详细描述', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度应在10到500个字符之间', trigger: 'blur' }
  ],
  assignee: [
    { required: true, message: '请选择负责人', trigger: 'change' }
  ]
})

const handleRules = reactive<FormRules>({
  status: [
    { required: true, message: '请选择处理状态', trigger: 'change' }
  ],
  comment: [
    { required: true, message: '请输入处理意见', trigger: 'blur' },
    { min: 5, max: 500, message: '意见长度应在5到500个字符之间', trigger: 'blur' }
  ]
})

// 格式化日期
const formatDate = (date: Date | string | null, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  if (!date) return '暂无'
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  let result = format
  result = result.replace('YYYY', year.toString())
  result = result.replace('MM', month)
  result = result.replace('DD', day)
  result = result.replace('HH', hours)
  result = result.replace('mm', minutes)
  result = result.replace('ss', seconds)
  
  return result
}

// 获取优先级标签
const getPriorityLabel = (priority: string): string => {
  const map: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急'
  }
  return map[priority] || priority
}

// 计算优先级标签类型（修复类型错误）
const getPriorityTag = (priority: string): ElTagType => {
  switch (priority) {
    case 'low':
      return 'info';
    case 'medium':
      return 'success';
    case 'high':
      return 'warning';
    case 'urgent':
      return 'danger';
    default:
      return 'info';
  }
}

// 获取状态标签
const getStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    pending: '待处理',
    in_progress: '进行中',
    completed: '已完成',
    rejected: '已拒绝',
    delayed: '已延期'
  }
  return map[status] || status
}

// 计算状态标签类型（修复类型错误）
const getStatusTag = (status: string): ElTagType => {
  switch (status) {
    case 'pending':
      return 'info';
    case 'in_progress':
      return 'primary';
    case 'completed':
      return 'success';
    case 'rejected':
      return 'danger';
    case 'delayed':
      return 'warning';
    default:
      return 'info';
  }
}

// 获取任务类型标签
const getTaskTypeTag = (type: string): ElTagType => {
  const map: Record<string, ElTagType> = {
    news_review: 'primary',
    user_feedback: 'success',
    system_maintenance: 'danger',
    content_update: 'warning',
    other: 'info'
  }
  return map[type] || 'info';
}

// 获取负责人名称
const getAssigneeName = (assigneeId: number): string => {
  const admin = adminList.value.find(a => a.id === assigneeId)
  return admin ? admin.username : '未分配'
}

// 打开添加事项对话框
const showAddTaskDialog = () => {
  Object.keys(taskForm).forEach(key => {
    if (key !== 'priority') {
      if (key === 'dueDate') {
        taskForm.dueDate = new Date()
      } else if (key === 'assignee') {
        taskForm.assignee = 0
      } else {
        // @ts-ignore - 动态设置属性
        taskForm[key] = ''
      }
    }
  })
  dialogs.addTask = true
}

// 查看任务详情
const viewTask = (task: Task) => {
  currentTask.value = task
  dialogs.viewTask = true
}

// 处理任务
const handleTask = (task: Task) => {
  currentTask.value = task
  handleForm.status = ''
  handleForm.comment = ''
  dialogs.handleTask = true
}

// 删除任务
const deleteTask = (task: Task) => {
  ElMessageBox.confirm(
    `确定要删除事项"${task.title}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟删除操作
    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
      pagination.total--
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchTasks()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  fetchTasks()
}

// 提交新任务
const submitTask = async () => {
  if (!taskFormRef.value) return
  
  await taskFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.addTask = true
      
      // 模拟提交操作
      setTimeout(() => {
        if (taskForm.dueDate && taskForm.assignee !== 0) {
          const newTask: Task = {
            id: Math.max(...tasks.value.map(t => t.id)) + 1,
            title: taskForm.title,
            type: taskForm.type,
            priority: taskForm.priority,
            status: 'pending',
            createdAt: new Date(),
            dueDate: new Date(taskForm.dueDate),
            description: taskForm.description,
            assignee: taskForm.assignee,
            createdBy: userInfo.value.username
          }
          
          tasks.value.unshift(newTask)
          pagination.total++
          
          dialogs.addTask = false
          loading.addTask = false
          ElMessage.success('添加成功')
        } else {
          ElMessage.error('表单数据不完整')
          loading.addTask = false
        }
      }, 1000)
    }
  })
}

// 提交任务处理
const submitHandleTask = async () => {
  if (!handleFormRef.value || !currentTask.value) return
  
  await handleFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.handleTask = true
      
      // 模拟处理操作
      setTimeout(() => {
        const taskIndex = tasks.value.findIndex(t => t.id === (currentTask.value as Task).id)
        if (taskIndex !== -1) {
          tasks.value[taskIndex].status = handleForm.status as Task['status']
          
          // 如果状态是已完成，更新数据
          if (handleForm.status === 'completed') {
            stats.pendingTasks = Math.max(0, stats.pendingTasks - 1)
          }
        }
        
        dialogs.handleTask = false
        loading.handleTask = false
        ElMessage.success('处理成功')
      }, 1000)
    }
  })
}

// 获取任务列表
const fetchTasks = () => {
  loading.tasks = true
  
  // 模拟API请求
  setTimeout(() => {
    // 这里可以替换为实际的API调用
    loading.tasks = false
  }, 500)
}

// 新增当前时间显示
const currentTime = ref('')
const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = formatDateUtil(now, 'YYYY年MM月DD日 HH:mm:ss')
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '退出登录',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    userStore.logout()
    ElMessage.success('已成功退出登录')
    router.push('/login')
  }).catch(() => {
    // 取消操作
  })
}

// 获取进度条颜色
const getProgressColor = (percentage: number) => {
  if (percentage < 0.5) return '#67C23A'
  if (percentage < 0.8) return '#E6A23C'
  return '#F56C6C'
}

// 任务统计数据
const taskStats = computed(() => {
  return {
    pending: tasks.value.filter(t => t.status === 'pending').length,
    inProgress: tasks.value.filter(t => t.status === 'in_progress').length,
    completed: tasks.value.filter(t => t.status === 'completed').length,
    delayed: tasks.value.filter(t => t.status === 'delayed').length
  }
})

// 任务筛选相关
const expandFilters = ref(false)
const taskFilters = reactive({
  status: '',
  priority: '',
  dateRange: [] as string[],
  keyword: ''
})

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
  return taskFilters.status !== '' || 
    taskFilters.priority !== '' || 
    (taskFilters.dateRange && taskFilters.dateRange.length === 2) || 
    taskFilters.keyword !== ''
})

// 移除单个筛选条件
const removeFilter = (filterName: string) => {
  if (filterName === 'dateRange') {
    taskFilters.dateRange = []
  } else {
    // @ts-ignore - 动态访问属性
    taskFilters[filterName] = ''
  }
  applyTaskFilters()
}

// 获取过滤后的任务列表
const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    // 状态筛选
    if (taskFilters.status && task.status !== taskFilters.status) return false
    
    // 优先级筛选
    if (taskFilters.priority && task.priority !== taskFilters.priority) return false
    
    // 日期范围筛选
    if (taskFilters.dateRange && taskFilters.dateRange.length === 2) {
      const taskDate = new Date(task.createdAt).toISOString().split('T')[0]
      const startDate = taskFilters.dateRange[0]
      const endDate = taskFilters.dateRange[1]
      if (taskDate < startDate || taskDate > endDate) return false
    }
    
    // 关键词筛选
    if (taskFilters.keyword) {
      const keyword = taskFilters.keyword.toLowerCase()
      return task.title.toLowerCase().includes(keyword) || 
        task.description.toLowerCase().includes(keyword)
    }
    
    return true
  })
})

// 应用筛选条件
const applyTaskFilters = () => {
  nextTick(() => {
    pagination.currentPage = 1
  })
  ElMessage.success('筛选条件已应用')
}

// 重置筛选条件
const resetTaskFilters = () => {
  taskFilters.status = ''
  taskFilters.priority = ''
  taskFilters.dateRange = []
  taskFilters.keyword = ''
  applyTaskFilters()
  ElMessage.success('筛选条件已重置')
}

// 视图切换
const tableView = ref('table')

// 批量操作
const selectedTasks = ref<Task[]>([])
const hasTaskSelected = computed(() => selectedTasks.value.length > 0)

const handleSelectionChange = (selection: Task[]) => {
  selectedTasks.value = selection
}

const batchOperate = (operation: string) => {
  if (selectedTasks.value.length === 0) {
    ElMessage.warning('请先选择要操作的事项')
    return
  }
  
  if (operation === 'delete') {
    ElMessageBox.confirm(
      `确定要删除选中的 ${selectedTasks.value.length} 项事项吗？此操作不可恢复！`,
      '批量删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // 模拟批量删除
      const idsToDelete = selectedTasks.value.map(t => t.id)
      tasks.value = tasks.value.filter(t => !idsToDelete.includes(t.id))
      pagination.total -= selectedTasks.value.length
      selectedTasks.value = []
      ElMessage.success(`已成功删除 ${idsToDelete.length} 项事项`)
    }).catch(() => {
      ElMessage.info('已取消删除')
    })
  } else if (operation === 'complete') {
    ElMessageBox.confirm(
      `确定要将选中的 ${selectedTasks.value.length} 项事项标记为已完成吗？`,
      '批量完成',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    ).then(() => {
      // 模拟批量完成
      const idsToUpdate = selectedTasks.value.map(t => t.id)
      tasks.value.forEach(task => {
        if (idsToUpdate.includes(task.id)) {
          task.status = 'completed'
        }
      })
      selectedTasks.value = []
      ElMessage.success(`已成功完成 ${idsToUpdate.length} 项事项`)
    }).catch(() => {
      ElMessage.info('已取消操作')
    })
  }
}

// 判断是否逾期
const isOverdue = (dueDate: Date | string | null): boolean => {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

// 获取行样式
const getTaskRowClass = ({ row }: { row: Task }) => {
  if (row.priority === 'urgent') return 'urgent-row'
  if (row.status === 'delayed') return 'delayed-row'
  return ''
}

// 行点击处理
const rowClick = (row: Task) => {
  viewTask(row)
}

// 页面加载时执行
onMounted(() => {
  if (!checkAdmin()) {
    return;
  }
  console.log('[管理员仪表盘] 页面加载');
  fetchTasks()
  updateCurrentTime()
  setInterval(updateCurrentTime, 1000)
  
  // 启动实时数据更新定时器，每30秒更新一次
  realtimeTimer = window.setInterval(updateRealtimeData, 30000)
  
  // 加载深色模式设置
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode) {
    isDarkMode.value = savedDarkMode === 'true'
  }
  
  // 加载其他个性化设置
  const savedAccentColor = localStorage.getItem('accentColor')
  if (savedAccentColor) {
    accentColor.value = savedAccentColor
    document.documentElement.style.setProperty('--el-color-primary', savedAccentColor)
  }
  
  const savedFontSize = localStorage.getItem('fontSizeAdjust')
  if (savedFontSize) {
    fontSizeAdjust.value = parseInt(savedFontSize)
    document.documentElement.style.setProperty('--font-size-adjust', savedFontSize + 'px')
  }
  
  const savedNotificationSettings = localStorage.getItem('notificationSettings')
  if (savedNotificationSettings) {
    const settings = JSON.parse(savedNotificationSettings)
    Object.assign(notificationSettings, settings)
  }

  // 使用延迟初始化替换直接初始化
  initChartsWithDelay()
  window.addEventListener('resize', handleResize)
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (realtimeTimer) {
    clearInterval(realtimeTimer)
  }
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  distributionChart?.dispose()
  activityChart?.dispose()
})

// 深色模式设置
const isDarkMode = ref(false)

// 处理用户头像下拉菜单命令
const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人信息功能开发中...')
      break
    case 'settings':
      activeMenu.value = 'settings'
      break
    case 'toggleTheme':
      toggleDarkMode()
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 切换深色模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value ? 'true' : 'false')
  
  // 重新初始化图表以应用新主题
  if (activeMenu.value === 'overview') {
    initChartsWithDelay()
  }
  
  ElMessage.success(`已切换到${isDarkMode.value ? '深色' : '浅色'}模式`)
}

// 设置页面数据
const settingsActiveTab = ref('preferences')
const accentColor = ref('#409EFF')
const fontSizeAdjust = ref(0)
const notificationSettings = reactive({
  desktop: true,
  sound: true,
  email: false
})

// 更新强调色
const updateAccentColor = (color: string | null) => {
  if (color) {
    document.documentElement.style.setProperty('--el-color-primary', color)
    localStorage.setItem('accentColor', color)
    ElMessage.success('主题色已更新')
  }
}

// 更新字体大小
const updateFontSize = (size: number | number[]) => {
  const sizeValue = Array.isArray(size) ? size[0] : size
  document.documentElement.style.setProperty('--font-size-adjust', sizeValue + 'px')
  localStorage.setItem('fontSizeAdjust', sizeValue.toString())
  ElMessage.success('字体大小已调整')
}

// 保存通知设置
const saveNotificationSettings = () => {
  localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings))
  ElMessage.success('通知设置已保存')
}

// 申请系统设置权限
const requestSystemAccess = () => {
  ElMessageBox.prompt('请输入申请理由', '权限申请', {
    confirmButtonText: '提交申请',
    cancelButtonText: '取消',
    inputPlaceholder: '请简要说明申请原因...'
  }).then(({ value }) => {
    ElMessage({
      type: 'success',
      message: `申请已提交，等待管理员审核：${value}`
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消申请'
    })
  })
}

// 时间范围选择
const timeRange = ref('today')
const lastUpdateTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))

// 刷新数据
const refreshData = async () => {
  try {
    // TODO: 实现数据刷新逻辑
    lastUpdateTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
    ElMessage.success('数据已更新')
  } catch (error) {
    ElMessage.error('数据更新失败')
  }
}

// 处理时间范围变化
const handleTimeRangeChange = (val: string | number | boolean | undefined) => {
  if (typeof val === 'string') {
    timeRange.value = val
    // 重新初始化趋势图表，以反映新的时间范围
    nextTick(() => {
      if (trendChart) {
        trendChart.dispose();
        trendChart = null;
        initTrendChart();
      }
    });
    refreshData()
  }
}

// 查看新闻列表
const viewNewsList = () => {
  router.push('/news-management')
}

// 查看任务列表
const viewTaskList = () => {
  router.push('/task-management')
}

// 图表实例
const trendChartRef = ref<HTMLElement | null>(null)
const distributionChartRef = ref<HTMLElement | null>(null)
const activityChartRef = ref<HTMLElement | null>(null)
let trendChart: ECharts | null = null
let distributionChart: ECharts | null = null
let activityChart: ECharts | null = null

// 添加图表加载状态
const chartsLoading = ref({
  trend: false,
  distribution: false,
  activity: false
})

// 添加时间段随机数据生成函数
const generateRandomData = (min: number, max: number, count: number): number[] => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// 初始化趋势图表
const initTrendChart = () => {
  if (trendChartRef.value) {
    ensureChartSize(trendChartRef.value);
    chartsLoading.value.trend = true;
    trendChart = echarts.init(trendChartRef.value, isDarkMode.value ? 'dark' : undefined)
    
    // 根据时间范围生成不同的数据
    let daysData: string[];
    let newsData: number[];
    let tasksData: number[];
    
    if (timeRange.value === 'week') {
      daysData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      newsData = generateRandomData(80, 200, 7);
      tasksData = generateRandomData(150, 300, 7);
    } else if (timeRange.value === 'month') {
      daysData = Array.from({ length: 30 }, (_, i) => `${i + 1}日`);
      newsData = generateRandomData(50, 250, 30);
      tasksData = generateRandomData(100, 350, 30);
    } else { // year
      daysData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      newsData = generateRandomData(1000, 3000, 12);
      tasksData = generateRandomData(2000, 5000, 12);
    }
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      legend: {
        data: ['新闻发布量', '任务完成量']
      },
      xAxis: {
        type: 'category',
        data: daysData,
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#eee'
          }
        }
      },
      series: [
        {
          name: '新闻发布量',
          type: 'line',
          smooth: true,
          data: newsData,
          itemStyle: {
            color: '#1890ff'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24,144,255,0.3)' },
              { offset: 1, color: 'rgba(24,144,255,0.1)' }
            ])
          }
        },
        {
          name: '任务完成量',
          type: 'line',
          smooth: true,
          data: tasksData,
          itemStyle: {
            color: '#fa8c16'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(250,140,22,0.3)' },
              { offset: 1, color: 'rgba(250,140,22,0.1)' }
            ])
          }
        }
      ]
    }
    trendChart.setOption(option)
    chartsLoading.value.trend = false;
  }
}

// 初始化分布图表
const initDistributionChart = () => {
  if (distributionChartRef.value) {
    ensureChartSize(distributionChartRef.value);
    chartsLoading.value.distribution = true;
    distributionChart = echarts.init(distributionChartRef.value, isDarkMode.value ? 'dark' : undefined)
    
    // 生成随机数据
    const categories = ['政治', '经济', '科技', '文化', '体育', '教育', '健康'];
    const data = categories.map(name => {
      return {
        value: Math.floor(Math.random() * 1000) + 300,
        name
      };
    });
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: categories
      },
      series: [
        {
          name: '新闻分类分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    }
    distributionChart.setOption(option)
    chartsLoading.value.distribution = false;
  }
}

// 初始化活动图表
const initActivityChart = () => {
  if (activityChartRef.value) {
    ensureChartSize(activityChartRef.value);
    chartsLoading.value.activity = true;
    activityChart = echarts.init(activityChartRef.value, isDarkMode.value ? 'dark' : undefined)
    
    // 生成随机活动数据
    const activities = ['系统访问', '新闻发布', '任务分配', '用户注册', '评论互动', '消息发送', '谣言举报'];
    const data = activities.map(() => Math.floor(Math.random() * 400) + 200);
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLine: {
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
      yAxis: {
        type: 'category',
        data: activities,
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        }
      },
      series: [
        {
          name: '活动量',
          type: 'bar',
          data: data,
          itemStyle: {
            color: function(params: any) {
              // 使用渐变颜色，根据数值大小变化
              const colorList = [
                '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'
              ];
              return colorList[params.dataIndex % colorList.length];
            }
          }
        }
      ]
    }
    activityChart.setOption(option)
    chartsLoading.value.activity = false;
  }
}

// 添加一个延迟初始化图表的函数，确保DOM已经渲染完成
const initChartsWithDelay = () => {
  setTimeout(() => {
    initTrendChart()
    initDistributionChart()
    initActivityChart()
  }, 300)
}

// 添加图表自适应功能
const resizeAllCharts = () => {
  trendChart?.resize();
  distributionChart?.resize();
  activityChart?.resize();
}

// 监听窗口大小变化
const handleResize = () => {
  resizeAllCharts();
}

// 添加确保图表容器大小的函数
const ensureChartSize = (element: HTMLElement | null) => {
  if (element) {
    // 确保容器有正确的高度
    if (element.clientHeight < 200) {
      element.style.height = '300px';
    }
    // 确保容器有正确的宽度
    if (element.clientWidth === 0) {
      element.style.width = '100%';
    }
  }
}

onMounted(() => {
  if (!checkAdmin()) {
    return;
  }
  fetchTasks()
  updateCurrentTime()
  setInterval(updateCurrentTime, 1000)
  
  // 启动实时数据更新定时器，每30秒更新一次
  realtimeTimer = window.setInterval(updateRealtimeData, 30000)
  
  // 加载深色模式设置
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode) {
    isDarkMode.value = savedDarkMode === 'true'
  }
  
  // 加载其他个性化设置
  const savedAccentColor = localStorage.getItem('accentColor')
  if (savedAccentColor) {
    accentColor.value = savedAccentColor
    document.documentElement.style.setProperty('--el-color-primary', savedAccentColor)
  }
  
  const savedFontSize = localStorage.getItem('fontSizeAdjust')
  if (savedFontSize) {
    fontSizeAdjust.value = parseInt(savedFontSize)
    document.documentElement.style.setProperty('--font-size-adjust', savedFontSize + 'px')
  }
  
  const savedNotificationSettings = localStorage.getItem('notificationSettings')
  if (savedNotificationSettings) {
    const settings = JSON.parse(savedNotificationSettings)
    Object.assign(notificationSettings, settings)
  }

  // 使用延迟初始化替换直接初始化
  initChartsWithDelay()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  distributionChart?.dispose()
  activityChart?.dispose()
})

// ... existing code ...

// 监听activeMenu变化，在需要时重新渲染图表
watch(activeMenu, (newValue) => {
  if (newValue === 'overview') {
    nextTick(() => {
      initChartsWithDelay()
    })
  }
})

// ... existing code ...

// 添加刷新图表的方法
const refreshCharts = () => {
  ElMessage.success('正在刷新图表...')
  // 重新初始化所有图表
  initChartsWithDelay()
}

// 添加导出功能
const exportChartData = (chartType: 'trend' | 'distribution' | 'activity') => {
  let data: any[] = [];
  let filename = '导出数据';
  let headers: string[] = [];
  
  try {
    if (chartType === 'trend' && trendChart) {
      const option = trendChart.getOption();
      const xAxisData = option.xAxis && Array.isArray(option.xAxis) && option.xAxis[0]?.data;
      const series = option.series && Array.isArray(option.series) ? option.series : [];
      
      if (xAxisData && series.length >= 2) {
        headers = ['日期', '新闻发布量', '任务完成量'];
        filename = '趋势分析数据';
        
        const categories = xAxisData as string[];
        const newsData = series[0]?.data as number[] || [];
        const tasksData = series[1]?.data as number[] || [];
        
        for (let i = 0; i < categories.length; i++) {
          data.push({
            date: categories[i],
            news: newsData[i] || 0,
            tasks: tasksData[i] || 0
          });
        }
      }
    } else if (chartType === 'distribution' && distributionChart) {
      const option = distributionChart.getOption();
      const series = option.series && Array.isArray(option.series) ? option.series[0] : null;
      
      if (series && series.data && Array.isArray(series.data)) {
        headers = ['分类', '数量'];
        filename = '分类分布数据';
        
        for (const item of series.data) {
          if (item && typeof item === 'object' && 'name' in item && 'value' in item) {
            data.push({
              category: item.name as string,
              value: item.value as number
            });
          }
        }
      }
    } else if (chartType === 'activity' && activityChart) {
      const option = activityChart.getOption();
      const yAxisData = option.yAxis && Array.isArray(option.yAxis) && option.yAxis[0]?.data;
      const series = option.series && Array.isArray(option.series) ? option.series[0] : null;
      
      if (yAxisData && series && series.data && Array.isArray(series.data)) {
        headers = ['活动', '数量'];
        filename = '活动分析数据';
        
        const categories = yAxisData as string[];
        const values = series.data as number[];
        
        for (let i = 0; i < categories.length; i++) {
          data.push({
            activity: categories[i],
            value: values[i] || 0
          });
        }
      }
    }
    
    if (data.length === 0) {
      ElMessage.warning('没有可导出的数据');
      return;
    }
    
    // 生成CSV内容
    let csvContent = headers.join(',') + '\n';
    
    for (const row of data) {
      const values = Object.values(row).map(value => {
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`; // 如果包含逗号，用引号包裹
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    }
    
    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    ElMessage.success('数据导出成功');
  } catch (error) {
    console.error('导出数据失败:', error);
    ElMessage.error('导出数据失败');
  }
}

// 监听深色模式变化
watch(isDarkMode, () => {
  // 在深色模式变化时，延迟重新初始化图表以确保DOM已更新
  if (activeMenu.value === 'overview') {
    nextTick(() => {
      initChartsWithDelay();
    });
  }
});

// ... existing code ...

// 用户数据
const users = ref<User[]>([
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    role: 'admin',
    status: 'active',
    lastLogin: new Date('2023-11-15T10:30:00'),
    createdAt: new Date('2023-11-15T10:30:00')
  },
  {
    id: 2,
    username: 'user',
    email: 'user@example.com',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    role: 'user',
    status: 'blocked',
    lastLogin: new Date('2023-11-14T09:15:00'),
    createdAt: new Date('2023-11-14T09:15:00')
  },
  {
    id: 3,
    username: 'guest',
    email: 'guest@example.com',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    role: 'guest',
    status: 'new',
    lastLogin: new Date('2023-11-13T14:20:00'),
    createdAt: new Date('2023-11-13T14:20:00')
  }
])

// 分页状态
const userPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 3
})

// 对话框状态
const dialogsUsers = reactive({
  addUser: false,
  editUser: false
})

// 加载状态
const loadingUsers = reactive({
  users: false,
  addUser: false,
  editUser: false
})

// 当前选中的用户
const currentUser = ref<User | null>(null)

// 用户表单
const userFormRef = ref<FormInstance>()
const userForm = reactive<UserForm>({
  username: '',
  email: '',
  avatar: '',
  role: 'user' as const,
  status: 'active' as const
})

// 处理表单
const handleUserFormRef = ref<FormInstance>()
const handleUserForm = reactive<HandleUserForm>({
  status: 'active' as const,
  comment: ''
})

// 表单验证规则
const userRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 100, message: '用户名长度应在2到100个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  avatar: [
    { required: true, message: '请上传头像', trigger: 'change' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
})

const handleUserRules = reactive<FormRules>({
  status: [
    { required: true, message: '请选择处理状态', trigger: 'change' }
  ],
  comment: [
    { required: true, message: '请输入处理意见', trigger: 'blur' },
    { min: 5, max: 500, message: '意见长度应在5到500个字符之间', trigger: 'blur' }
  ]
})

// 格式化日期
const formatDateUser = (date: Date | string | null, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  if (!date) return '暂无'
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  let result = format
  result = result.replace('YYYY', year.toString())
  result = result.replace('MM', month)
  result = result.replace('DD', day)
  result = result.replace('HH', hours)
  result = result.replace('mm', minutes)
  result = result.replace('ss', seconds)
  
  return result
}

// 获取用户角色标签
const getUserRoleLabel = (role: string): string => {
  const map: Record<string, string> = {
    admin: '管理员',
    user: '用户',
    guest: '游客'
  }
  return map[role] || role
}

// 计算用户角色标签类型（修复类型错误）
const getUserRoleType = (role: string): ElTagType => {
  switch (role) {
    case 'admin':
      return 'success';
    case 'user':
      return 'info';
    case 'guest':
      return 'warning';
    default:
      return 'info';
  }
}

// 获取用户状态标签
const getUserStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    active: '活跃',
    blocked: '已封禁',
    new: '新用户'
  }
  return map[status] || status
}

// 计算用户状态标签类型（修复类型错误）
const getUserStatusType = (status: string): ElTagType => {
  switch (status) {
    case 'active':
      return 'success';
    case 'blocked':
      return 'danger';
    case 'new':
      return 'warning';
    default:
      return 'info';
  }
}

// 打开添加用户对话框
const showAddUserDialog = () => {
  Object.keys(userForm).forEach(key => {
    if (key !== 'avatar') {
      if (key === 'status') {
        userForm.status = 'active'
      } else {
        // @ts-ignore - 动态设置属性
        userForm[key] = ''
      }
    }
  })
  dialogsUsers.addUser = true
}

// 查看用户详情
const viewUser = (user: User) => {
  currentUser.value = user
  dialogsUsers.editUser = true
}

// 编辑用户
const editUser = (user: User) => {
  if (currentUser.value) {
    currentUser.value = user
    handleUserForm.status = user.status
    handleUserForm.comment = user.comment || ''
    dialogsUsers.editUser = true
  }
}

// 删除用户
const deleteUser = (user: User) => {
  ElMessageBox.confirm(
    `确定要删除用户"${user.username}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟删除操作
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value.splice(index, 1)
      userPagination.total--
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 分页处理
const handleUserSizeChange = (size: number) => {
  userPagination.pageSize = size
  fetchUsers()
}

const handleUserCurrentChange = (page: number) => {
  userPagination.currentPage = page
  fetchUsers()
}

// 提交新用户
const submitUser = async () => {
  if (!userFormRef.value) return
  
  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      loadingUsers.addUser = true
      
      // 模拟提交操作
      setTimeout(() => {
        const newUser: User = {
          id: Math.max(...users.value.map(u => u.id)) + 1,
          username: userForm.username,
          email: userForm.email,
          avatar: userForm.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // 使用默认头像
          role: userForm.role,
          status: userForm.status,
          lastLogin: new Date(),
          createdAt: new Date()
        }
        
        users.value.unshift(newUser)
        userPagination.total++
        
        dialogsUsers.addUser = false
        loadingUsers.addUser = false
        ElMessage.success('添加成功')
      }, 1000)
    }
  })
}

// 提交用户编辑
const submitUserEdit = async () => {
  if (!handleUserFormRef.value || !currentUser.value) return
  
  await handleUserFormRef.value.validate(async (valid) => {
    if (valid) {
      loadingUsers.editUser = true
      
      // 模拟编辑操作
      setTimeout(() => {
        if (currentUser.value) {
          currentUser.value.status = handleUserForm.status
          currentUser.value.lastLogin = new Date()
          currentUser.value.comment = handleUserForm.comment
        }
        
        dialogsUsers.editUser = false
        loadingUsers.editUser = false
        ElMessage.success('编辑成功')
      }, 1000)
    }
  })
}

// 获取用户列表
const fetchUsers = () => {
  loadingUsers.users = true
  
  // 模拟API请求
  setTimeout(() => {
    // 这里可以替换为实际的API调用
    loadingUsers.users = false
  }, 500)
}

// 使用导入的头像上传工具函数
const onAvatarSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (uploadFile.raw) {
    // 创建一个新的 Blob URL
    const blob = new Blob([uploadFile.raw], { type: uploadFile.raw.type })
    const url = URL.createObjectURL(blob)
    userForm.avatar = url
  }
}

const onAvatarBeforeUpload = (rawFile: UploadRawFile) => {
  return beforeAvatarUploadUtil(rawFile)
}

// 用户数据
const userStats = computed(() => {
  return {
    total: users.value.length,
    active: users.value.filter(u => u.status === 'active').length,
    new: users.value.filter(u => u.status === 'new').length,
    blocked: users.value.filter(u => u.status === 'blocked').length
  }
})

// 任务筛选相关
const userTableView = ref('table')
const hasUserSelected = computed(() => selectedUsers.value.length > 0)

const selectedUsers = ref<User[]>([])
const handleUserSelectionChange = (selection: User[]) => {
  selectedUsers.value = selection
}

const batchUserOperation = (operation: string) => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请先选择要操作的用户')
    return
  }
  
  if (operation === 'block') {
    ElMessageBox.confirm(
      `确定要将选中的 ${selectedUsers.value.length} 位用户标记为已封禁吗？`,
      '批量封禁',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    ).then(() => {
      // 模拟批量封禁
      const idsToBlock = selectedUsers.value.map(u => u.id)
      users.value = users.value.filter(u => !idsToBlock.includes(u.id))
      userPagination.total -= selectedUsers.value.length
      selectedUsers.value = []
      ElMessage.success(`已成功封禁 ${idsToBlock.length} 位用户`)
    }).catch(() => {
      ElMessage.info('已取消封禁')
    })
  } else if (operation === 'delete') {
    ElMessageBox.confirm(
      `确定要删除选中的 ${selectedUsers.value.length} 位用户吗？此操作不可恢复！`,
      '批量删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // 模拟批量删除
      const idsToDelete = selectedUsers.value.map(u => u.id)
      users.value = users.value.filter(u => !idsToDelete.includes(u.id))
      userPagination.total -= selectedUsers.value.length
      selectedUsers.value = []
      ElMessage.success(`已成功删除 ${idsToDelete.length} 位用户`)
    }).catch(() => {
      ElMessage.info('已取消删除')
    })
  }
}

// 切换用户状态
const toggleUserStatus = (user: User) => {
  user.status = user.status === 'active' ? 'blocked' : 'active'
  ElMessage.success(`用户"${user.username}"状态已切换为${user.status === 'active' ? '活跃' : '已封禁'}`)
}

// 添加 filteredUsers 计算属性
const filteredUsers = computed(() => {
  return users.value
})

// 添加导出数据函数
const exportUserData = () => {
  try {
    const data = users.value.map(user => ({
      ID: user.id,
      用户名: user.username,
      邮箱: user.email,
      角色: getUserRoleLabel(user.role),
      状态: getUserStatusLabel(user.status),
      注册时间: formatDate(user.createdAt),
      最后登录: formatDate(user.lastLogin)
    }))
    
    // 生成CSV内容
    const headers = ['ID', '用户名', '邮箱', '角色', '状态', '注册时间', '最后登录']
    let csvContent = headers.join(',') + '\n'
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header as keyof typeof row]
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      })
      csvContent += values.join(',') + '\n'
    })
    
    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `用户数据_${formatDate(new Date(), 'YYYY-MM-DD')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    ElMessage.success('数据导出成功')
  } catch (error) {
    console.error('导出数据失败:', error)
    ElMessage.error('导出数据失败')
  }
}

// 修改头像上传相关函数
const handleAvatarSuccess = (response: any, uploadFile: UploadFile) => {
  userForm.avatar = URL.createObjectURL(uploadFile.raw as File)
}

const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传头像图片格式不正确')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB')
  }
  return isImage && isLt2M
}
</script>

<style scoped>
.admin-dashboard {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  min-height: 100vh;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  /* 添加动态背景装饰 */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 0% 0%, rgba(147, 197, 253, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 100% 0%, rgba(96, 165, 250, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 0% 100%, rgba(37, 99, 235, 0.1) 0%, transparent 50%);
    background-size: 100% 100%;
    opacity: 0.8;
    pointer-events: none;
    z-index: 0;
    animation: gradientMove 15s ease-in-out infinite alternate;
  }
  
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239BA9B4' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  &.dark-mode {
    background: linear-gradient(135deg, #0f172a, #1e293b);
    
    &::before {
      background: 
        radial-gradient(circle at 0% 0%, rgba(30, 58, 138, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 100% 0%, rgba(30, 64, 175, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 100% 100%, rgba(29, 78, 216, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 0% 100%, rgba(37, 99, 235, 0.2) 0%, transparent 50%);
    }
    
    &::after {
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
  }
}

@keyframes gradientMove {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}

.welcome-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 32px;
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  border-radius: 16px;
  margin-bottom: 28px;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  /* 添加装饰元素 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml;utf8,<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg"><path d="M0,50 Q50,0 100,50 T200,50" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" /></svg>');
    background-size: 100px 100px;
    opacity: 0.3;
    animation: panelWave 20s linear infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
    pointer-events: none;
    animation: panelGlow 10s ease-in-out infinite alternate;
  }
  
  .welcome-text {
    position: relative;
    z-index: 1;
    
    h1 {
      color: white;
      font-size: 32px;
      margin-bottom: 10px;
      font-weight: 700;
      text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      letter-spacing: -0.5px;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 40px;
        height: 3px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 3px;
      }
    }
    
    p {
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      font-size: 16px;
      
      .username {
        font-weight: 700;
        color: #ffffff;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        position: relative;
        display: inline-block;
        
        &::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 100%;
          height: 2px;
          background: rgba(255, 255, 255, 0.5);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }
        
        &:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
      }
    }
    
    .current-time {
      font-size: 14px;
      margin-top: 6px;
      opacity: 0.8;
      color: rgba(255, 255, 255, 0.9);
    }
  }
  
  .user-avatar {
    position: relative;
    z-index: 1;
    
    .avatar-wrapper {
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      padding: 6px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      animation: pulse 3s infinite;
      
      &:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      }
      
      .el-avatar {
        border: 2px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      
      .el-icon {
        margin-left: 6px;
        color: rgba(255, 255, 255, 0.9);
        transition: transform 0.3s ease;
      }
      
      &:hover .el-icon {
        transform: rotate(180deg);
      }
    }
  }
}

.menu-card {
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
}

.admin-menu {
  border-right: none;
  background: transparent;
  flex: 1;
  
  .el-menu-item {
    margin: 8px 12px;
    border-radius: 10px;
    height: 50px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      background-color: rgba(59, 130, 246, 0.08);
      color: #3b82f6;
      padding-left: 24px;
    }
    
    &.is-active {
      background: linear-gradient(135deg, #3b82f6, #60a5fa);
      color: white;
      padding-left: 24px;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      
      .el-icon {
        color: white;
        transform: scale(1.1);
      }
    }
    
    .el-icon {
      margin-right: 12px;
      font-size: 18px;
      transition: all 0.3s ease;
    }
    
    .menu-badge {
      margin-left: auto;
      margin-right: 0;
      transform: scale(0.9);
    }
  }
}

.menu-footer {
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  text-align: center;
  
  .el-button {
    width: 100%;
    border-radius: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
    }
  }
}

.main-content-card {
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  min-height: calc(100vh - 150px);
  transition: all 0.3s ease;
  transform-origin: center;
  animation: fadeIn 0.5s ease-out;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  .panel-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    
    .el-icon {
      margin-right: 8px;
      font-size: 24px;
      color: #1890ff;
    }
  }
  
  .refresh-info {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #8c8c8c;
    
    .last-update {
      margin-right: 12px;
    }
  }
}

@keyframes ping {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.dashboard-header {
  margin-bottom: 20px;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.dashboard-header p {
  margin: 5px 0 0;
  color: #606266;
}

.overview-panel {
  padding: 20px;
}

.overview-panel h2 {
  margin-bottom: 20px;
}

.stats-row {
  margin-top: 20px;
  
  .stat-card {
    height: 100%;
    transition: all 0.3s ease;
    border: none;
    background: linear-gradient(145deg, #ffffff, #f5f7fa);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .stat-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .stat-header {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }

        &:hover::before {
          transform: translateX(0);
        }

        .el-icon {
          font-size: 24px;
          color: #fff;
          z-index: 1;
        }

        &.news-icon {
          background: linear-gradient(135deg, #36d1dc, #5b86e5);
        }

        &.task-icon {
          background: linear-gradient(135deg, #ff9a9e, #fad0c4);
        }

        &.user-icon {
          background: linear-gradient(135deg, #a8edea, #fed6e3);
        }

        &.system-icon {
          background: linear-gradient(135deg, #d4fc79, #96e6a1);
        }
      }

      .stat-title {
        flex: 1;

        .label {
          display: block;
          font-size: 0.875rem;
          color: var(--el-text-color-secondary);
          margin-bottom: 4px;
        }

        .el-icon {
          color: var(--el-color-primary);
          margin-left: 0.5rem;
          font-size: 14px;
        }

        .el-tag {
          margin-left: 8px;
          font-weight: 500;
        }
      }
    }

    .stat-body {
      padding: 0.5rem 0;

      .stat-main {
        display: flex;
        align-items: baseline;
        margin-bottom: 0.5rem;

        .value {
          font-size: 2rem;
          font-weight: 600;
          background: linear-gradient(to right, var(--el-text-color-primary), var(--el-text-color-regular));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }

        .unit {
          margin-left: 4px;
          font-size: 0.875rem;
          color: var(--el-text-color-secondary);
        }
      }

      .stat-trend {
        display: flex;
        align-items: center;
        font-size: 0.875rem;

        .trend-label {
          color: var(--el-text-color-secondary);
        }

        .trend-value {
          margin-left: 8px;
          display: inline-flex;
          align-items: center;
          font-weight: 500;
          
          .el-icon {
            margin-right: 4px;
            font-size: 14px;
          }

          &.up {
            color: #67c23a;
          }

          &.down {
            color: #f56c6c;
          }

          &.normal {
            color: var(--el-color-primary);
          }
        }
      }
    }

    .stat-footer {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px dashed var(--el-border-color-lighter);

      .el-progress-bar__outer {
        background-color: var(--el-fill-color-lighter);
        border-radius: 4px;
      }

      .el-progress-bar__inner {
        border-radius: 4px;
        transition: all 0.3s ease;
      }
    }
  }

  .dark-mode & {
    .stat-card {
      background: linear-gradient(145deg, #242424, #1a1a1a);

      .stat-header {
        .stat-title .label {
          color: #e0e0e0;
        }
      }

      .stat-body {
        .stat-main {
          .value {
            background: linear-gradient(to right, #ffffff, #e0e0e0);
            -webkit-background-clip: text;
          }
          .unit {
            color: #999;
          }
        }

        .stat-trend {
          .trend-label {
            color: #999;
          }
        }
      }

      .stat-footer {
        border-top-color: #333;
      }
    }
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.quick-action-space {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 20px 0;
}

.action-card {
  width: 120px;
  height: 120px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.action-icon {
  font-size: 32px;
  margin-bottom: 10px;
  color: #409EFF;
}

.action-title {
  font-size: 14px;
  color: #606266;
}

.chart-card {
  margin-bottom: 20px;
  height: 350px;
}

.chart-container {
  height: 100%;
  padding: 10px 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chart-title {
  font-weight: 600;
  color: #606266;
}

.chart-legend {
  display: flex;
  gap: 15px;
  font-size: 13px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  display: inline-block;
  width: 14px;
  height: 6px;
  border-radius: 3px;
}

.legend-color.this-week {
  background: linear-gradient(to right, #409EFF, #a0cfff);
}

.legend-color.last-week {
  background: linear-gradient(to right, #909399, #c8c9cc);
}

.chart-placeholder {
  height: 230px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;
}

.chart-mock {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 10px;
  background-image: 
    linear-gradient(rgba(236, 245, 255, 0.6) 1px, transparent 1px),
    linear-gradient(90deg, rgba(236, 245, 255, 0.6) 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: -1px -1px;
}

.chart-column {
  width: 12%;
  display: flex;
  gap: 4px;
  height: 100%;
  align-items: flex-end;
}

.chart-bar {
  flex: 1;
  position: relative;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.chart-bar.this-week {
  background: linear-gradient(to top, #409EFF, #a0cfff);
}

.chart-bar.last-week {
  background: linear-gradient(to top, #909399, #c8c9cc);
  opacity: 0.6;
}

.chart-tooltip {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  white-space: nowrap;
}

.chart-bar:hover .chart-tooltip {
  opacity: 1;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  padding-top: 10px;
  color: #909399;
  font-size: 12px;
}

.tasks-panel {
  padding: 20px;
}

.tasks-panel .panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.tasks-panel .panel-header h2 {
  margin: 0;
}

.tasks-panel .pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.task-description {
  white-space: pre-wrap;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.news-panel, .users-panel, .settings-panel {
  padding: 20px;
}

.news-panel h2, .users-panel h2, .settings-panel h2 {
  margin-bottom: 20px;
}

.news-panel p, .users-panel p, .settings-panel p {
  margin: 0;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.table-card {
  margin-bottom: 20px;
}

.urgent-row {
  background-color: rgba(245, 108, 108, 0.1);
}

.delayed-row {
  background-color: rgba(230, 162, 60, 0.1);
}

.realtime-card {
  height: 350px;
  margin-bottom: 20px;
}

.realtime-icon {
  background: linear-gradient(135deg, #6366f1, #818cf8);
}

.realtime-list {
  padding: 10px 0;
  height: 260px;
  overflow-y: auto;
}

.realtime-item {
  padding: 12px 15px;
  border-bottom: 1px solid #f0f2f5;
  transition: all 0.3s;
}

.realtime-item:hover {
  background-color: #f9fafc;
}

.realtime-item.highlight {
  border-left: 3px solid #409EFF;
  background-color: rgba(64, 158, 255, 0.05);
}

.realtime-time {
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.realtime-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.realtime-icon-small {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.realtime-icon-small.news {
  background: linear-gradient(135deg, #36a3f7, #409EFF);
}

.realtime-icon-small.user {
  background: linear-gradient(135deg, #52b35a, #67C23A);
}

.realtime-icon-small.system {
  background: linear-gradient(135deg, #888e98, #909399);
}

.realtime-icon-small.task {
  background: linear-gradient(135deg, #e6a00b, #E6A23C);
}

.realtime-text {
  font-size: 14px;
  color: #303133;
}

/* 设置面板样式 */
.settings-panel {
  padding: 20px;
}

.settings-card {
  margin-bottom: 20px;
}

.settings-header {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.update-info {
  margin-top: 20px;
}

.update-header {
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.slider-demo-value {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.task-stats-row {
  margin-bottom: 20px;
}

.task-stat-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.task-stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.task-stat-inner {
  display: flex;
  align-items: center;
}

.task-stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
}

.task-stat-icon.pending {
  background: linear-gradient(135deg, #409EFF, #64B5F6);
}

.task-stat-icon.in-progress {
  background: linear-gradient(135deg, #E6A23C, #FFB74D);
}

.task-stat-icon.completed {
  background: linear-gradient(135deg, #67C23A, #8BC34A);
}

.task-stat-icon.delayed {
  background: linear-gradient(135deg, #F56C6C, #FF7043);
}

.task-stat-content {
  flex: 1;
}

.task-stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 5px;
}

.task-stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.filter-title {
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}

.is-rotate {
  transform: rotate(180deg);
}

.active-filters {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.filter-tag {
  cursor: default;
}

.option-with-icon {
  display: flex;
  align-items: center;
}

.option-icon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.option-icon.pending {
  background-color: #409EFF;
}

.option-icon.in-progress {
  background-color: #E6A23C;
}

.option-icon.completed {
  background-color: #67C23A;
}

.option-icon.rejected {
  background-color: #909399;
}

.option-icon.delayed {
  background-color: #F56C6C;
}

.table-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.table-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.view-toggle {
  margin-left: 10px;
}

.task-title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.pending {
  background-color: #409EFF;
}

.status-dot.in_progress {
  background-color: #E6A23C;
}

.status-dot.completed {
  background-color: #67C23A;
}

.status-dot.rejected {
  background-color: #909399;
}

.status-dot.delayed {
  background-color: #F56C6C;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 5px;
}

.due-date.overdue {
  color: #F56C6C;
}

.overdue-icon {
  color: #F56C6C;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.task-cards-view {
  margin-top: 20px;
}

.task-card {
  height: 100%;
  margin-bottom: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: visible;
}

.task-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.task-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-card-status {
  width: 40px;
  height: 4px;
  border-radius: 2px;
}

.task-card-status.pending {
  background-color: #409EFF;
}

.task-card-status.in_progress {
  background-color: #E6A23C;
}

.task-card-status.completed {
  background-color: #67C23A;
}

.task-card-status.rejected {
  background-color: #909399;
}

.task-card-status.delayed {
  background-color: #F56C6C;
}

.task-card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  cursor: pointer;
  color: var(--el-color-primary);
}

.task-card-title:hover {
  text-decoration: underline;
}

.task-card-desc {
  color: var(--el-text-color-secondary);
  margin-bottom: 15px;
  min-height: 40px;
}

.task-card-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 13px;
}

.task-due-date, .task-assignee {
  display: flex;
  align-items: center;
  gap: 5px;
}

.task-due-date.overdue {
  color: #F56C6C;
}

.task-card-footer {
  display: flex;
  justify-content: center;
}

.task-overdue {
  position: relative;
}

.task-overdue::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 20px 20px 0;
  border-color: transparent #F56C6C transparent transparent;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.overview-panel {
  .overview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 24px;
      
      .panel-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        font-size: 20px;
        color: var(--el-text-color-primary);
        
        .el-icon {
          font-size: 24px;
          color: var(--el-color-primary);
        }
      }
      
      .refresh-info {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--el-text-color-secondary);
        font-size: 13px;
        
        .last-update {
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
  
  .el-divider {
    margin: 24px 0;
    
    :deep(.el-divider__text) {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--el-text-color-secondary);
      font-size: 14px;
      
      .el-icon {
        font-size: 16px;
        color: var(--el-color-primary);
      }
    }
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--el-color-primary-rgb), 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--el-color-primary-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--el-color-primary-rgb), 0);
  }
}

.welcome-panel {
  .welcome-text {
    h1 {
      background: linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0.85));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
    }
  }

  .user-avatar {
    .avatar-wrapper {
      animation: pulse 2s infinite;
    }
  }
}

.overview-panel {
  .overview-header {
    .header-left {
      .panel-title {
        background: linear-gradient(135deg, #1e293b, #334155);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
      }
    }
  }
}

.dark-mode {
  .overview-panel {
    .overview-header {
      .header-left {
        .panel-title {
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
  }
}

.stat-card {
  .stat-header {
    .stat-title {
      .label {
        background: linear-gradient(135deg, #475569, #64748b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 600;
      }
    }
  }
}

/* 添加额外的样式确保图表容器高度 */
.trend-chart-card .chart-container,
.distribution-chart-card .chart-container,
.activity-chart-card .chart-container {
  min-height: 300px;
  width: 100%;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

/* 添加图表卡片悬停效果 */
.chart-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.dark-mode .chart-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* 图表操作按钮样式 */
.chart-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 图表标题样式优化 */
.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  background: linear-gradient(90deg, var(--el-text-color-primary), var(--el-text-color-regular));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.chart-section {
  margin-bottom: 24px;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table th, .custom-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.custom-table th {
  background-color: #f8f9fa;
}

.type-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.type-tag.news_review {
  background-color: #ff7b7b;
  color: #fff;
}

.type-tag.user_feedback {
  background-color: #7bff7b;
  color: #000;
}

.type-tag.system_maintenance {
  background-color: #7b7bff;
  color: #fff;
}

.type-tag.content_update {
  background-color: #ff7bff;
  color: #fff;
}

.type-tag.other {
  background-color: #7bff7b;
  color: #000;
}

.priority-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.priority-tag.low {
  background-color: #7bff7b;
  color: #000;
}

.priority-tag.medium {
  background-color: #ff7b7b;
  color: #000;
}

.priority-tag.urgent {
  background-color: #ff7b7b;
  color: #fff;
}

.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.pending {
  background-color: #ff7b7b;
  color: #fff;
}

.status-tag.in_progress {
  background-color: #7bff7b;
  color: #000;
}

.status-tag.completed {
  background-color: #7b7bff;
  color: #fff;
}

.status-tag.rejected {
  background-color: #ff7b7b;
  color: #fff;
}

.status-tag.delayed {
  background-color: #7b7bff;
  color: #fff;
}

.task-title-text {
  font-weight: bold;
  color: var(--el-color-primary);
}

.table-actions {
  display: flex;
  justify-content: space-around;
}

/* 任务卡片容器样式 */
.task-card-container {
  margin-bottom: 20px;
  perspective: 1000px;
}

.task-card {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.task-card:hover {
  transform: translateY(-10px) rotateX(2deg) rotateY(-2deg);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.task-card-status-bar {
  height: 6px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.task-card-status-bar.pending {
  background: linear-gradient(90deg, var(--el-color-info), var(--el-color-info-light-5));
}

.task-card-status-bar.in_progress {
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-5));
}

.task-card-status-bar.completed {
  background: linear-gradient(90deg, var(--el-color-success), var(--el-color-success-light-5));
}

.task-card-status-bar.rejected {
  background: linear-gradient(90deg, var(--el-color-danger), var(--el-color-danger-light-5));
}

.task-card-status-bar.delayed {
  background: linear-gradient(90deg, var(--el-color-warning), var(--el-color-warning-light-5));
}

.task-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 15px;
}

.task-card-id {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  font-weight: 600;
}

.task-card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--el-color-primary);
  margin-bottom: 8px;
  cursor: pointer;
  transition: color 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-card-title:hover {
  color: var(--el-color-primary-light-3);
}

.task-card-desc {
  color: var(--el-text-color-secondary);
  margin-bottom: 15px;
  font-size: 13px;
  line-height: 1.5;
  height: 40px;
  overflow: hidden;
}

.task-card-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 13px;
}

.task-due-date, .task-assignee {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--el-text-color-secondary);
}

.task-due-date.overdue {
  color: var(--el-color-danger);
}

.task-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 10px;
}

.task-status-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.task-status-badge.pending {
  background-color: var(--el-color-info-light-8);
  color: var(--el-color-info-dark-2);
}

.task-status-badge.in_progress {
  background-color: var(--el-color-primary-light-8);
  color: var(--el-color-primary-dark-2);
}

.task-status-badge.completed {
  background-color: var(--el-color-success-light-8);
  color: var(--el-color-success-dark-2);
}

.task-status-badge.rejected {
  background-color: var(--el-color-danger-light-8);
  color: var(--el-color-danger-dark-2);
}

.task-status-badge.delayed {
  background-color: var(--el-color-warning-light-8);
  color: var(--el-color-warning-dark-2);
}

.task-buttons {
  display: flex;
  gap: 8px;
}

/* 任务面板样式 */
.panel-title-area {
  display: flex;
  align-items: center;
  gap: 32px;
}

.panel-stats {
  display: flex;
  gap: 24px;
}

.panel-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(145deg, var(--el-color-info-light-9), var(--el-color-info-light-8));
  padding: 8px 16px;
  border-radius: 10px;
  min-width: 80px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.panel-stat-item:hover {
  transform: translateY(-3px);
}

.panel-stat-item .stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--el-color-primary);
}

.panel-stat-item .stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* 用户管理样式 */
.users-panel {
  padding: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, var(--el-color-primary-light-8), var(--el-color-primary-light-9));
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
}

.panel-stats {
  display: flex;
  gap: 24px;

  .panel-stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 24px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    min-width: 120px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 14px;
      color: var(--el-text-color-secondary);
      font-weight: 500;
    }
  }
}

.table-card {
  margin-top: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  }

  .el-table {
    --el-table-border-color: var(--el-border-color-lighter);
    --el-table-header-bg-color: var(--el-color-primary-light-9);
    --el-table-row-hover-bg-color: var(--el-color-primary-light-9);

    th {
      font-weight: 600;
      background-color: var(--el-color-primary-light-9);
      border-bottom: 2px solid var(--el-border-color-lighter);
    }

    td {
      padding: 12px 0;
    }
  }

  .user-info-cell {
    display: flex;
    align-items: center;
    gap: 12px;

    .el-avatar {
      border: 2px solid var(--el-border-color-lighter);
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
        border-color: var(--el-color-primary);
      }
    }

    .user-info-details {
      .username {
        font-weight: 600;
        color: var(--el-color-primary);
        margin-bottom: 2px;
      }

      .email {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .table-actions {
    .el-button {
      padding: 4px 8px;
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

/* 深色模式适配 */
.dark-mode {
  .users-panel {
    .panel-header {
      background: linear-gradient(135deg, var(--el-color-primary-dark-2), var(--el-color-primary-dark-1));
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .panel-stats .panel-stat-item {
      background: rgba(30, 41, 59, 0.8);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

      .stat-value {
        background: linear-gradient(135deg, var(--el-color-primary-light-3), var(--el-color-primary-light-5));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .table-card {
      background: rgba(30, 41, 59, 0.8);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

      .el-table {
        --el-table-header-bg-color: var(--el-color-primary-dark-2);
        --el-table-row-hover-bg-color: var(--el-color-primary-dark-1);
        
        th {
          background-color: var(--el-color-primary-dark-2);
          color: var(--el-text-color-primary);
        }
      }
    }
  }
}

.panel-title-area {
  display: flex;
  align-items: center;
  gap: 32px;
}

.panel-stats {
  display: flex;
  gap: 24px;
}

.panel-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(145deg, var(--el-color-info-light-9), var(--el-color-info-light-8));
  padding: 8px 16px;
  border-radius: 10px;
  min-width: 80px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.panel-stat-item:hover {
  transform: translateY(-3px);
}

.panel-stat-item .stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--el-color-primary);
}

.panel-stat-item .stat-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.table-card {
  margin-top: 20px;
}

.table-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-toggle {
  margin-left: 16px;
}

.user-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.email {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.last-login {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.table-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 头像上传样式 */
.avatar-uploader {
  display: flex;
  justify-content: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}

/* 深色模式适配 */
.dark-mode {
  .panel-stat-item {
    background: linear-gradient(145deg, var(--el-color-info-dark-9), var(--el-color-info-dark-8));
  }

  .avatar-uploader .el-upload {
    border-color: var(--el-border-color-darker);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary-light-1);
  }

  .avatar-uploader-icon {
    color: var(--el-text-color-secondary);
  }
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);

  .el-dialog__header {
    margin: 0;
    padding: 20px 24px;
    background: linear-gradient(135deg, var(--el-color-primary-light-8), var(--el-color-primary-light-9));
    border-bottom: 1px solid var(--el-border-color-lighter);

    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .el-dialog__body {
    padding: 24px;
  }

  .el-dialog__footer {
    padding: 16px 24px;
    border-top: 1px solid var(--el-border-color-lighter);
    background: var(--el-bg-color-page);
  }

  .el-form {
    .el-form-item__label {
      font-weight: 500;
    }

    .el-input__wrapper,
    .el-textarea__wrapper {
      box-shadow: 0 0 0 1px var(--el-border-color-lighter);
      transition: all 0.3s ease;

      &:hover,
      &:focus {
        box-shadow: 0 0 0 1px var(--el-color-primary);
      }
    }

    .el-select {
      width: 100%;
    }
  }

  .avatar-uploader {
    .el-upload {
      border: 2px dashed var(--el-border-color);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--el-color-primary);
        transform: translateY(-2px);
      }

      .avatar {
        width: 120px;
        height: 120px;
        object-fit: cover;
      }

      .avatar-uploader-icon {
        width: 120px;
        height: 120px;
        font-size: 32px;
        color: var(--el-text-color-secondary);
        background: var(--el-fill-color-lighter);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        &:hover {
          color: var(--el-color-primary);
          background: var(--el-fill-color-light);
        }
      }
    }
  }
}

/* 深色模式对话框适配 */
.dark-mode {
  :deep(.el-dialog) {
    background: rgba(30, 41, 59, 0.95);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

    .el-dialog__header {
      background: linear-gradient(135deg, var(--el-color-primary-dark-2), var(--el-color-primary-dark-1));
      border-bottom-color: var(--el-border-color-darker);
    }

    .el-dialog__footer {
      background: var(--el-bg-color-overlay);
      border-top-color: var(--el-border-color-darker);
    }

    .el-form {
      .el-input__wrapper,
      .el-textarea__wrapper {
        box-shadow: 0 0 0 1px var(--el-border-color-darker);
        background: var(--el-bg-color-overlay);

        &:hover,
        &:focus {
          box-shadow: 0 0 0 1px var(--el-color-primary);
        }
      }
    }

    .avatar-uploader {
      .el-upload {
        border-color: var(--el-border-color-darker);
        background: var(--el-bg-color-overlay);

        .avatar-uploader-icon {
          background: var(--el-bg-color-overlay);
          color: var(--el-text-color-secondary);

          &:hover {
            background: var(--el-fill-color-darker);
            color: var(--el-color-primary-light-3);
          }
        }
      }
    }
  }
}

/* 全局字体优化 */
.admin-dashboard {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  
  /* 数字字体优化 */
  .number-font {
    font-family: 'DIN Alternate', 'Arial Narrow', Monaco, monospace;
    font-feature-settings: "tnum";
    font-variant-numeric: tabular-nums;
  }

  /* 标题字体优化 */
  .panel-title, h1, h2, h3, h4, h5, h6 {
    font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, sans-serif;
    letter-spacing: -0.02em;
    font-weight: 600;
    
    &.gradient-text {
      background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: titleGlow 2s ease-in-out infinite alternate;
    }
  }

  /* 数据展示优化 */
  .stat-value {
    font-family: 'DIN Alternate', 'Arial Narrow', Monaco, monospace;
    font-weight: 700;
    font-size: 28px;
    background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.5px;
  }

  /* 图表标题字体 */
  .chart-title {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  /* 表格字体优化 */
  .el-table {
    .cell {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      
      &.numeric {
        font-family: 'DIN Alternate', Monaco, monospace;
        font-feature-settings: "tnum";
      }
    }
    
    th {
      font-weight: 600;
      letter-spacing: 0.02em;
    }
  }

  /* 菜单字体优化 */
  .el-menu-item {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  /* 按钮文字优化 */
  .el-button {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  /* 标签文字优化 */
  .el-tag {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  /* 时间显示优化 */
  .time-display {
    font-family: 'DIN Alternate', Monaco, monospace;
    font-feature-settings: "tnum";
    letter-spacing: 0.5px;
  }

  /* 欢迎面板文字优化 */
  .welcome-panel {
    .welcome-text {
      h1 {
        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
        font-weight: 700;
        letter-spacing: -0.03em;
        font-size: 32px;
        background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.85));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .username {
        font-weight: 600;
        letter-spacing: 0.02em;
      }

      .current-time {
        font-family: 'DIN Alternate', Monaco, monospace;
        font-feature-settings: "tnum";
        letter-spacing: 0.5px;
      }
    }
  }

  /* 图表数值标签优化 */
  .chart-value {
    font-family: 'DIN Alternate', Monaco, monospace;
    font-feature-settings: "tnum";
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  /* 统计卡片数字优化 */
  .stat-card {
    .stat-main {
      .value {
        font-family: 'DIN Alternate', Monaco, monospace;
        font-feature-settings: "tnum";
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 0.5px;
        background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
}

/* 深色模式字体颜色适配 */
.dark-mode {
  .admin-dashboard {
    .stat-value, .chart-value {
      background: linear-gradient(90deg, var(--el-color-primary-light-3), var(--el-color-primary-light-5));
      -webkit-background-clip: text;
    }

    .gradient-text {
      background: linear-gradient(90deg, var(--el-color-primary-light-3), var(--el-color-primary-light-5));
      -webkit-background-clip: text;
    }
  }
}

/* 字体动画效果 */
@keyframes titleGlow {
  0% {
    opacity: 0.8;
    text-shadow: 0 0 10px rgba(var(--el-color-primary-rgb), 0.2);
  }
  100% {
    opacity: 1;
    text-shadow: 0 0 20px rgba(var(--el-color-primary-rgb), 0.4);
  }
}

/* 数字跳动动画 */
@keyframes numberPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.number-animate {
  animation: numberPulse 0.3s ease-out;
}

/* 字体颜色系统优化 */
.admin-dashboard {
  /* 主要文字颜色 */
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --text-disabled: #cccccc;
  
  /* 特殊文字颜色 */
  --text-link: var(--el-color-primary);
  --text-success: #67c23a;
  --text-warning: #e6a23c;
  --text-danger: #f56c6c;
  
  /* 渐变文字颜色 */
  --gradient-primary: linear-gradient(90deg, #1890ff, #36cfc9);
  --gradient-success: linear-gradient(90deg, #52c41a, #73d13d);
  --gradient-warning: linear-gradient(90deg, #faad14, #ffc53d);
  --gradient-danger: linear-gradient(90deg, #ff4d4f, #ff7875);

  /* 标题文字样式 */
  .welcome-panel {
    .welcome-text {
      h1 {
        background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.9));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .username {
        color: #ffffff;
        font-weight: 600;
        text-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }

      .current-time {
        color: rgba(255, 255, 255, 0.85);
      }
    }
  }

  /* 统计卡片文字 */
  .stat-card {
    .stat-header {
      .stat-title {
        .label {
          color: var(--text-secondary);
          font-weight: 500;
        }
      }
    }

    .stat-body {
      .stat-main {
        .value {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
        }

        .unit {
          color: var(--text-tertiary);
        }
      }

      .stat-trend {
        .trend-label {
          color: var(--text-tertiary);
        }

        .trend-value {
          &.up {
            background: var(--gradient-success);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          &.down {
            background: var(--gradient-danger);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          &.normal {
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
    }
  }

  /* 表格文字颜色 */
  .el-table {
    th {
      color: var(--text-secondary) !important;
      font-weight: 600;
    }

    td {
      color: var(--text-primary);
      
      &.highlight {
        color: var(--text-link);
      }
    }

    .task-title-cell {
      .task-title-text {
        color: var(--text-link);
        font-weight: 500;
        
        &:hover {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
  }

  /* 菜单文字颜色 */
  .admin-menu {
    .el-menu-item {
      color: var(--text-secondary);
      
      &:hover {
        color: var(--text-link);
      }
      
      &.is-active {
        color: #ffffff;
        background: var(--gradient-primary);
      }
    }
  }

  /* 图表标题文字 */
  .chart-card {
    .chart-header {
      .chart-title {
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 600;
      }
    }
  }

  /* 状态标签文字 */
  .status-tag {
    &.success {
      background: var(--gradient-success);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    &.warning {
      background: var(--gradient-warning);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    &.danger {
      background: var(--gradient-danger);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  /* 按钮文字颜色 */
  .el-button {
    &--primary {
      background: var(--gradient-primary);
      border: none;
      
      span {
        background: transparent;
        -webkit-background-clip: unset;
        -webkit-text-fill-color: #ffffff;
      }
    }
  }

  /* 实时数据文字 */
  .realtime-value {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
    text-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  }
}

/* 深色模式适配 */
.dark-mode {
  .admin-dashboard {
    /* 深色模式文字颜色 */
    --text-primary: #f0f0f0;
    --text-secondary: #b0b0b0;
    --text-tertiary: #808080;
    --text-disabled: #505050;
    
    /* 深色模式渐变色 */
    --gradient-primary: linear-gradient(90deg, #40a9ff, #5cdbd3);
    --gradient-success: linear-gradient(90deg, #73d13d, #95de64);
    --gradient-warning: linear-gradient(90deg, #ffc53d, #ffd666);
    --gradient-danger: linear-gradient(90deg, #ff7875, #ff9c9c);

    .stat-card {
      .stat-body {
        .stat-main {
          .value {
            text-shadow: 0 2px 8px rgba(64, 169, 255, 0.2);
          }
        }
      }
    }

    .el-table {
      th {
        color: var(--text-secondary) !important;
      }

      td {
        color: var(--text-primary);
      }
    }

    .realtime-value {
      text-shadow: 0 2px 8px rgba(64, 169, 255, 0.2);
    }
  }
}

/* 动态效果 */
@keyframes textShine {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.text-shine {
  background-size: 200% auto;
  animation: textShine 2s linear infinite;
}

/* 系统概览面板字体优化 */
.overview-panel {
  /* 面板标题样式 */
  .overview-header {
    .header-left {
      .panel-title {
        font-size: 24px;
        font-weight: 600;
        letter-spacing: -0.02em;
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        
        .el-icon {
          font-size: 28px;
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: iconFloat 3s ease-in-out infinite;
        }
        
        span {
          background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
      }

      .refresh-info {
        font-size: 14px;
        color: var(--text-tertiary);
        display: flex;
        align-items: center;
        gap: 8px;
        
        .last-update {
          font-family: 'DIN Alternate', Monaco, monospace;
          letter-spacing: 0.5px;
        }
        
        .el-button {
          font-size: 13px;
          font-weight: 500;
          
          .el-icon {
            font-size: 14px;
          }
        }
      }
    }
  }

  /* 数据统计卡片 */
  .stats-row {
    .stat-card {
      .stat-content {
        .stat-header {
          .stat-title {
            font-size: 15px;
            font-weight: 500;
            color: var(--text-secondary);
            margin-bottom: 4px;
            letter-spacing: 0.02em;
          }
        }

        .stat-body {
          .stat-main {
            .value {
              font-family: 'DIN Alternate', Monaco, monospace;
              font-size: 32px;
              font-weight: 700;
              background: var(--gradient-brand);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
              animation: numberPulse 0.3s ease-out;
            }

            .unit {
              font-size: 14px;
              color: var(--text-tertiary);
              margin-left: 4px;
            }
          }

          .stat-trend {
            font-size: 13px;
            font-weight: 500;
            
            .trend-label {
              color: var(--text-quaternary);
            }

            .trend-value {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              
              &.up {
                background: var(--gradient-success);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              
              &.down {
                background: var(--gradient-danger);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              
              &.normal {
                background: var(--gradient-cool);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
            }
          }
        }
      }
    }
  }

  /* 图表标题 */
  .chart-section {
    .chart-card {
      .chart-header {
        .chart-title {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: 8px;
          
          .el-icon {
            font-size: 20px;
            background: var(--gradient-brand);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          span {
            background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
    }
  }

  /* 快捷操作区域 */
  .quick-actions {
    .action-card {
      .action-icon {
        font-size: 28px;
        background: var(--gradient-cool);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 8px;
      }

      .action-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-secondary);
        transition: color 0.3s ease;
      }

      &:hover {
        .action-title {
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
  }

  /* 实时动态列表 */
  .realtime-list {
    .realtime-item {
      .realtime-time {
        font-family: 'DIN Alternate', Monaco, monospace;
        font-size: 13px;
        color: var(--text-quaternary);
        letter-spacing: 0.5px;
      }

      .realtime-content {
        font-size: 14px;
        color: var(--text-secondary);
        
        &.highlight {
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 500;
        }
      }
    }
  }
}

/* 深色模式适配 */
.dark-mode {
  .overview-panel {
    .overview-header {
      .panel-title span {
        background: linear-gradient(135deg, #f1f5f9, #cbd5e1);
        -webkit-background-clip: text;
      }
    }

    .stats-row {
      .stat-card {
        .stat-content {
          .stat-body {
            .stat-main .value {
              text-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
            }
          }
        }
      }
    }
  }
}

/* 动画效果 */
@keyframes numberPulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* 数字滚动动画 */
.number-animate {
  animation: numberPulse 0.3s ease-out;
}
</style> 