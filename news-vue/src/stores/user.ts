import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi } from '@/api'
import storage from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const token = ref(storage.get('token', ''))
  const username = ref(storage.get('username', ''))
  const avatar = ref(storage.get('avatar', ''))
  const id = ref(storage.get('userId', ''))

  const setUser = (user: {
    token: string
    username: string
    avatar?: string
    id: string
  }) => {
    token.value = user.token
    username.value = user.username
    avatar.value = user.avatar || ''
    id.value = user.id

    // 保存到本地存储
    storage.set('token', user.token)
    storage.set('username', user.username)
    storage.set('avatar', user.avatar || '')
    storage.set('userId', user.id)
  }

  const logout = () => {
    token.value = ''
    username.value = ''
    avatar.value = ''
    id.value = ''

    // 清除本地存储
    storage.remove('token')
    storage.remove('username')
    storage.remove('avatar')
    storage.remove('userId')
    // 清除管理员标志
    storage.remove('isAdmin')
  }

  return {
    token,
    username,
    avatar,
    id,
    setUser,
    logout
  }
}) 