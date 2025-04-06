import { defineStore } from 'pinia'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

interface UserInfo {
  id: string
  username: string
  avatar: string
  email: string
}

interface AuthState {
  user: UserInfo | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

interface RegisterForm {
  username: string
  email: string
  password: string
}

interface ChangePasswordForm {
  oldPassword: string
  newPassword: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false
  }),

  actions: {
    setLoginData(data: { token: string; user: any }) {
      this.token = data.token
      this.user = data.user
      this.isAuthenticated = true
      localStorage.setItem('token', data.token)
    },

    setUserInfo(user: UserInfo) {
      this.user = user
    },

    async login(username: string, password: string) {
      this.loading = true
      try {
        // 开发环境模拟登录
        if (import.meta.env.DEV) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          const mockData = {
            token: 'mock_token_' + Date.now(),
            user: {
              id: '1',
              username,
              avatar: '',
              email: 'test@example.com'
            }
          }
          this.setLoginData(mockData)
          ElMessage.success('登录成功！')
          return mockData
        }

        const response = await request.post('/api/auth/login', {
          username,
          password
        })
        this.setLoginData(response.data)
        ElMessage.success('登录成功！')
        return response.data
      } catch (error) {
        ElMessage.error('登录失败：' + (error instanceof Error ? error.message : '未知错误'))
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      ElMessage.success('已退出登录')
    },

    async register(form: RegisterForm) {
      this.loading = true
      try {
        // 开发环境模拟注册
        if (import.meta.env.DEV) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          ElMessage.success('注册成功！')
          return { success: true }
        }

        const response = await request.post('/api/auth/register', form)
        ElMessage.success('注册成功！')
        return response
      } catch (error) {
        ElMessage.error('注册失败：' + (error instanceof Error ? error.message : '未知错误'))
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProfile(updates: Partial<UserInfo>) {
      try {
        const response = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(updates)
        })
        
        if (!response.ok) throw new Error('更新失败')
        
        const updatedUser = await response.json()
        this.user = updatedUser
      } catch (error) {
        throw error
      }
    },

    async resetPassword(email: string) {
      try {
        if (import.meta.env.DEV) {
          // 开发环境模拟延迟
          await new Promise(resolve => setTimeout(resolve, 1000))
          return { message: '重置密码邮件已发送' }
        }
        
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
        
        if (!response.ok) throw new Error('密码重置请求失败')
        
        return await response.json()
      } catch (error) {
        throw error
      }
    },

    async fetchUserInfo() {
      try {
        if (import.meta.env.DEV) {
          // 开发环境模拟数据
          await new Promise(resolve => setTimeout(resolve, 500))
          const mockUser = {
            id: '1',
            username: 'test_user',
            email: 'test@example.com',
            avatar: ''
          }
          this.setUserInfo(mockUser)
          return mockUser
        }

        const response = await request.get('/api/user/info')
        this.setUserInfo(response.data)
        return response.data
      } catch (error) {
        console.error('获取用户信息失败:', error)
        this.logout()
        throw error
      }
    },

    async changePassword(form: ChangePasswordForm) {
      try {
        if (import.meta.env.DEV) {
          // 开发环境模拟延迟
          await new Promise(resolve => setTimeout(resolve, 1000))
          return { success: true }
        }
        
        const response = await request.post('/api/auth/change-password', form)
        ElMessage.success('密码修改成功！')
        return response
      } catch (error) {
        ElMessage.error('修改密码失败：' + (error instanceof Error ? error.message : '未知错误'))
        throw error
      }
    }
  }
}) 