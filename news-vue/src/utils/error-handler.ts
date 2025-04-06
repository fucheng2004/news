import { App } from 'vue'
import { ElMessage } from 'element-plus'

export function setupErrorHandler(app: App) {
  app.config.errorHandler = (err: unknown, vm, info) => {
    console.error('Vue Error:', err, info)
    ElMessage.error('操作出错，请稍后重试')
  }

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason)
    event.preventDefault()
  })

  window.onerror = function(msg, url, line, col, error) {
    console.error('Global Error:', { msg, url, line, col, error })
    return false
  }
}

export const handleApiError = (error: any) => {
  console.error('API Error:', error)
  
  if (error.response) {
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        ElMessage.error(data.message || '请求参数错误')
        break
      case 401:
        ElMessage.error('未登录或登录已过期')
        break
      case 403:
        ElMessage.error('没有操作权限')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 500:
        ElMessage.error('服务器内部错误')
        break
      default:
        ElMessage.error('操作失败，请稍后重试')
    }
  } else if (error.request) {
    ElMessage.error('网络请求失败，请检查网络连接')
  } else {
    ElMessage.error(error.message || '操作失败，请稍后重试')
  }
} 