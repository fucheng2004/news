import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import type { AppErrorOptions } from '@/types/common'

// 日期格式化
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(format)
}

// 文件大小格式化
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout
  
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void => {
  let inThrottle: boolean
  
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 复制到剪贴板
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('复制成功')
    return true
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage.error('复制失败')
    return false
  }
}

// 下载文件
export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 生成唯一ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// 深度合并对象
export const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
  const result = { ...target }
  
  Object.keys(source).forEach(key => {
    const value = source[key as keyof T]
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key as keyof T] = deepMerge(
        (target[key as keyof T] as object) || {},
        value as object
      ) as T[keyof T]
    } else {
      result[key as keyof T] = value as T[keyof T]
    }
  })
  
  return result
}

// 格式化数字
export const formatNumber = (num: number, options: Intl.NumberFormatOptions = {}) => {
  return new Intl.NumberFormat('zh-CN', options).format(num)
}

// 格式化百分比
export const formatPercent = (value: number, decimals = 2) => {
  return `${(value * 100).toFixed(decimals)}%`
}

// 验证邮箱
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// 验证密码强度
export const checkPasswordStrength = (password: string): {
  score: number
  feedback: string[]
} => {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score < 3) feedback.push('密码应至少包含大小写字母和数字')
  if (password.length < 8) feedback.push('密码长度应不少于8位')

  return { score, feedback }
}

// 安全的 JSON 解析
export const safeJSONParse = <T>(str: string, fallback: T): T => {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

// 错误处理工具
export const createError = (message: string, options: AppErrorOptions) => {
  const error = new Error(message)
  Object.assign(error, options)
  return error
}

// 本地存储工具
export const storage = {
  get<T>(key: string, fallback: T): T {
    const value = localStorage.getItem(key)
    return value ? safeJSONParse(value, fallback) : fallback
  },
  
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
  },
  
  remove(key: string): void {
    localStorage.removeItem(key)
  },
  
  clear(): void {
    localStorage.clear()
  }
}

// 防抖和节流的高级版本
export const createDebounce = (options: { 
  wait: number
  leading?: boolean
  trailing?: boolean
}) => {
  return <T extends (...args: any[]) => any>(
    fn: T
  ): (this: ThisParameterType<T>, ...args: Parameters<T>) => void => {
    let timeout: NodeJS.Timeout | null = null
    let lastArgs: Parameters<T> | null = null
    
    return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
      const later = () => {
        timeout = null
        if (options.trailing && lastArgs) {
          fn.apply(this, lastArgs)
          lastArgs = null
        }
      }
      
      if (!timeout && options.leading) {
        fn.apply(this, args)
      } else {
        lastArgs = args
      }
      
      if (timeout) {
        clearTimeout(timeout)
      }
      
      timeout = setTimeout(later, options.wait)
    }
  }
} 