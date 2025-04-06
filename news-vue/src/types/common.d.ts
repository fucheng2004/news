// 通用响应类型
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  success: boolean
  timestamp: string
}

// 分页请求参数
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'ascend' | 'descend'
  keyword?: string
  filters?: Record<string, any>
}

// 分页响应数据
export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasMore: boolean
}

// 用户相关类型
export interface UserInfo {
  id: number
  username: string
  email: string
  avatar?: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive' | 'banned'
  lastLoginAt: string
  createdAt: string
  updatedAt: string
  settings?: UserSettings
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'zh-CN' | 'en-US'
  notifications: boolean
  emailNotifications: boolean
}

// 检测结果相关类型
export interface AnalysisMetric {
  id: string
  name: string
  value: number
  description: string
  trend?: 'up' | 'down' | 'stable'
  previousValue?: number
  changeRate?: number
  unit?: string
  threshold?: {
    warning: number
    danger: number
  }
}

export interface AnalysisChart {
  id: string
  type: 'line' | 'pie' | 'bar' | 'radar'
  title: string
  data: any
  options?: any
  loading?: boolean
  error?: string
}

export interface DetailedAnalysis {
  id: string
  metrics: AnalysisMetric[]
  charts: AnalysisChart[]
  summary: string
  recommendations: string[]
  createdAt: string
  updatedAt: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  error?: string
}

// 文件上传相关类型
export interface UploadFile {
  uid: string
  name: string
  size: number
  type: string
  status: 'uploading' | 'done' | 'error'
  url?: string
  response?: any
  error?: string
  percent?: number
}

// 错误相关类型
export interface AppErrorOptions {
  code: string
  status?: number
  data?: any
  cause?: Error
}

export interface ErrorResponse {
  code: string
  message: string
  details?: any
  timestamp: string
  path?: string
} 