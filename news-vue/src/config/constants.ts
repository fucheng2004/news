export const APP_NAME = '新闻真实性检测系统'

export const API_TIMEOUT = 10000

export const PAGE_SIZES = [10, 20, 50, 100]

export const DEFAULT_PAGE_SIZE = 20

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'application/pdf'
]

export const ANALYSIS_TYPES = {
  factCheck: '事实核查',
  sourceAnalysis: '来源分析',
  textAnalysis: '文本分析',
  imageAnalysis: '图像分析',
  videoAnalysis: '视频分析'
}

export const RESULT_TYPES = {
  true: { label: '真实', color: '#67C23A' },
  false: { label: '虚假', color: '#F56C6C' },
  unknown: { label: '待确认', color: '#E6A23C' }
}

export const CHART_COLORS = {
  primary: ['#409EFF', '#79BBFF', '#A0CFFF', '#C6E2FF', '#ECF5FF'],
  success: ['#67C23A', '#95D475', '#B3E19D', '#D1EDC4', '#F0F9EB'],
  warning: ['#E6A23C', '#F0C78A', '#F3D19E', '#F8E3C5', '#FDF6EC'],
  danger: ['#F56C6C', '#F89898', '#FAB6B6', '#FCD3D3', '#FEF0F0']
}

export const ROUTE_NAMES = {
  HOME: 'home',
  LOGIN: 'login',
  REGISTER: 'register',
  PROFILE: 'profile',
  HISTORY: 'history',
  VERIFY: 'verify',
  ABOUT: 'about'
} as const

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    CHANGE_PASSWORD: '/user/change-password'
  },
  DETECTION: {
    VERIFY: '/detection/verify',
    HISTORY: '/detection/history',
    DETAIL: '/detection/detail'
  }
} as const

export const VALIDATION_RULES = {
  USERNAME: {
    min: 3,
    max: 20,
    pattern: /^[a-zA-Z0-9_-]+$/
  },
  PASSWORD: {
    min: 3,
    max: 20,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
} as const

export const THEME = {
  colors: {
    primary: '#409EFF',
    success: '#67C23A',
    warning: '#E6A23C',
    danger: '#F56C6C',
    info: '#909399'
  },
  breakpoints: {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px'
  }
} as const 