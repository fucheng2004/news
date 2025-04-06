import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/stores/user'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  withCredentials: false
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() }
    }
    
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果是二进制数据直接返回
    if (response.config.responseType === 'blob') {
      return res
    }
    
    // 处理业务状态码
    if (res.code === 0) {
      return res.data
    }
    
    // 处理业务错误
    ElMessage.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  error => {
    console.error('Response error:', error)
    
    if (error.response) {
      const { status } = error.response
      
      switch (status) {
        case 401:
          // 未登录或 token 过期
          const userStore = useUserStore()
          userStore.logout()
          router.push('/login')
          break
        case 403:
          ElMessage.error('没有权限')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error('网络错误')
      }
    } else {
      ElMessage.error('网络连接失败')
    }
    
    return Promise.reject(error)
  }
)

export default request 