import request from '@/utils/request'
import type { NewsItem, VerificationResult } from '@/types'
import axios from 'axios'
import storage from '@/utils/storage'

// 定义质疑相关的类型
interface DisputeRequest {
  newsId: string;
  reason: string;
  contact: string;
  evidences: File[];
}

interface DisputeResponse {
  success: boolean;
  message: string;
  id?: string;
}

// 辅助函数：深度检查响应结构
const debugResponse = (prefix: string, response: any) => {
  if (!response) {
    console.log(`${prefix} 响应为空`);
    return;
  }
  
  console.log(`${prefix} 响应状态:`, response.status, response.statusText);
  console.log(`${prefix} 响应头:`, response.headers);
  
  // 分析data结构
  if (response.data) {
    console.log(`${prefix} 响应data类型:`, typeof response.data);
    if (typeof response.data === 'object') {
      console.log(`${prefix} 响应data顶层键:`, Object.keys(response.data));
      
      // 检查data.data结构
      if (response.data.data) {
        console.log(`${prefix} 响应data.data类型:`, typeof response.data.data);
        if (typeof response.data.data === 'object') {
          console.log(`${prefix} 响应data.data键:`, Object.keys(response.data.data));
        }
      }
      
      // 检查是否有令牌
      if (response.data.token) {
        console.log(`${prefix} 找到令牌，类型:`, typeof response.data.token);
        console.log(`${prefix} 令牌值(部分):`, typeof response.data.token === 'string' ? 
          `${response.data.token.substring(0, 10)}...` : '非字符串令牌');
      }
      
      // 检查嵌套结构
      if (response.data.data && response.data.data.token) {
        console.log(`${prefix} 在嵌套结构中找到令牌，类型:`, typeof response.data.data.token);
        console.log(`${prefix} 嵌套令牌值(部分):`, typeof response.data.data.token === 'string' ? 
          `${response.data.data.token.substring(0, 10)}...` : '非字符串令牌');
      }
    }
  }
}

// 新闻检测相关接口
export const newsApi = {
  // 文本检测
  detectText: (data: {
    title: string
    text: string
  }) => {
    return request.post<VerificationResult>('/text', data)
  },

  // 图片检测
  detectImage: (file: File) => {
    // 创建一个 FormData 对象，用来发送文件
    const formData = new FormData();
    
    // 将文件添加到 FormData 对象中，"file" 是 FastAPI 端点所期望的字段名
    formData.append("file", file);
  
    // 发送 POST 请求，将 FormData 对象包含在请求中
    return request.post<{
      sourceScore: number
      sourceEvidence: string[]
      textScore: number
      textEvidence: string[]
      credibility: number
      label: 'Real' | 'Fake'
    }>('/image', formData, {
      headers: {
        // 设置请求头，确保发送的是 multipart/form-data 格式
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 视频检测
  detectVideo: (file: File) => {
    // 创建一个 FormData 对象，用来发送文件
    const formData = new FormData();
    
    // 将文件添加到 FormData 对象中
    formData.append("file", file);
  
    // 发送 POST 请求，将 FormData 对象包含在请求中
    return request.post<{
      sourceScore: number
      sourceEvidence: string[]
      textScore: number
      textEvidence: string[]
      score: number
      label: 'Real' | 'Fake'
    }>('/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  detectDocument: (formData: FormData) => {
    return request({
      url: '/api/news/detect-document',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 获取检测历史
  getHistory: (params: {
    page: number
    pageSize: number
    startDate?: string
    endDate?: string
    category?: string
    credibility?: 'high' | 'medium' | 'low'
  }) => {
    return request.get<{
      total: number
      list: VerificationResult[]
    }>('/api/history', { params })
  },

  // 导出检测历史
  exportHistory: (params: {
    startDate?: string
    endDate?: string
    category?: string
  }) => {
    return request.get('/api/history/export', {
      params,
      responseType: 'blob'
    })
  },

  // 获取统计数据
  getStats: () => {
    return request.get<{
      total: number
      todayCount: number
      averageScore: number
      categoryStats: {
        category: string
        count: number
      }[]
    }>('/api/stats')
  },

  // 使用新的优化版本的 submitDispute 方法
  submitDispute: async (data: DisputeRequest): Promise<DisputeResponse> => {
    try {
      const formData = new FormData()
      formData.append('newsId', data.newsId)
      formData.append('reason', data.reason)
      formData.append('contact', data.contact)
      
      // 添加证据文件
      data.evidences.forEach((file: File, index: number) => {
        formData.append(`evidence_${index}`, file)
      })

      const response = await request.post<DisputeResponse>('/dispute', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return response.data
    } catch (error) {
      console.error('提交质疑失败:', error)
      throw error
    }
  }
}

// 用户相关接口
export const userApi = {
  // 登录
  login: (data: { username: string, password: string }) => { 
    return request({
      url: '/user/login',
      method: 'post',
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('【登录】响应原始数据:', response);
      console.log('【登录】响应数据:', response.data);
      
      // 调试详细结构
      debugResponse('【登录】', response);

      // 根据不同的数据结构进行处理
      let token = '';
      let user = null;

      // 尝试多种可能的数据结构，从最常见到最不常见
      // 1. 标准嵌套结构: { data: { token, user } }
      if (response.data && response.data.data) {
        const responseData = response.data.data;
        if (responseData.token) {
          token = responseData.token;
          user = responseData.user;
        }
      } 
      // 2. 直接结构: { token, user }
      else if (response.data && response.data.token) {
        token = response.data.token;
        user = response.data.user;
      }
      // 3. 结构: { data: token, user: {...} }
      else if (response.data && response.data.data && typeof response.data.data === 'string') {
        token = response.data.data;
        user = response.data.user;
      }
      // 4. 结构: { data: token }，无用户信息
      else if (response.data && response.data.data && typeof response.data.data === 'string') {
        token = response.data.data;
      }
      // 5. 字符串token
      else if (response.data && typeof response.data === 'string') {
        token = response.data;
      }

      if (!token) {
        console.error('无法从响应中找到token：', response);
        throw new Error('登录失败：无法获取令牌');
      }

      if (!user) {
        // 如果没有用户信息，生成一个基本用户对象
        user = { id: 'unknown', username: data.username, avatar: '' };
      }
      
      // 使用storage工具存储token
      storage.set('token', token);
      // 确保非管理员登录时清除管理员状态
      storage.remove('isAdmin');
      
      return {
        token,
        user: {
          id: user.id || 'unknown',
          username: user.username || data.username,
          avatar: user.avatar || ''
        }
      };
    })
    .catch(error => {
      console.error('登录失败:', error);
      if (error.response && error.response.data) {
        const errorMsg = typeof error.response.data === 'string' 
          ? error.response.data 
          : (error.response.data.message || error.response.data.error || '登录失败');
        throw new Error(errorMsg);
      }
      throw error;
    });
  },
  
  // 管理员登录
  adminLogin: (data: { username: string, password: string, type: string }) => { 
    console.log('【管理员登录】开始尝试登录:', {
      username: data.username,
      type: data.type
    });

    return request({
      url: '/admin/login',
      method: 'post',
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('【管理员登录】响应原始数据:', response);
      console.log('【管理员登录】响应数据:', response.data);
      
      // 调试详细结构
      debugResponse('【管理员登录】', response);

      // 根据不同的数据结构进行处理
      let token = '';
      let user = null;

      // 尝试多种可能的数据结构，从最常见到最不常见
      // 1. 标准嵌套结构: { data: { token, user } }
      if (response.data && response.data.data) {
        const responseData = response.data.data;
        if (responseData.token) {
          token = responseData.token;
          user = responseData.user;
        }
      }

      if (!token) {
        console.error('【管理员登录】无法从响应中找到token：', response);
        throw new Error('管理员登录失败：无法获取令牌');
      }

      if (!user) {
        // 如果没有用户信息，生成一个基本用户对象
        user = { id: 'unknown', username: data.username, avatar: '' };
      }
      
      // 使用storage工具存储token和管理员状态
      console.log('【管理员登录】设置storage:', {
        token: token ? '存在' : '不存在',
        username: user.username
      });
      
      storage.set('token', token);
      storage.set('isAdmin', true);
      storage.set('userRole', 'admin');
      
      // 验证存储是否成功
      console.log('【管理员登录】验证storage设置:', {
        token: storage.get('token') ? '存在' : '不存在',
        isAdmin: storage.get('isAdmin'),
        userRole: storage.get('userRole')
      });
      
      const result = {
        token,
        user: {
          id: user.id || 'unknown',
          username: user.username || data.username,
          avatar: user.avatar || '',
          role: 'admin'
        }
      };
      
      console.log('【管理员登录】返回结果:', result);
      return result;
    })
    .catch(error => {
      console.error('【管理员登录】失败:', error);
      // 确保错误被正确传播
      if (error.response && error.response.data) {
        const errorMsg = typeof error.response.data === 'string' 
          ? error.response.data 
          : (error.response.data.message || error.response.data.error || '管理员登录失败');
        throw new Error(errorMsg);
      }
      throw error;
    });
  },
  
  // 注册
  register: (data: {
    username: string
    password: string
    email: string
  }) => {
    return request({
      url: '/user/register',
      method: 'post',
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.data.code === 500) {
        throw new Error(res.data.message || '注册失败')
      }
      return {
        message: res.data.message
      }
    })
  },

  // 获取用户信息
  getUserInfo: () => {
    return request.get<{
      id: string
      username: string
      avatar: string
      email: string
    }>('user/info')
  },

  async checkUsername(username: string) {
    const response = await request.get(`/api/users/check-username/${username}`)
    return response.data
  }
}

// 新闻管理相关API
export const newsManagementApi = {
  // 获取新闻列表
  getNewsList: (params: {
    page: number
    pageSize: number
    status?: string
    category?: string
    keyword?: string
    startDate?: string
    endDate?: string
  }) => {
    return request<{
      total: number
      items: any[]
    }>('/api/news/list', { params })
  },

  // 获取新闻详情
  getNewsDetail: (id: number) => {
    return request<any>(`/api/news/${id}`)
  },

  // 创建新闻
  createNews: (data: any) => {
    return request.post<{id: number}>('/api/news', data)
  },

  // 更新新闻
  updateNews: (id: number, data: any) => {
    return request.put<{success: boolean}>(`/api/news/${id}`, data)
  },

  // 删除新闻
  deleteNews: (id: number) => {
    return request.delete<{success: boolean}>(`/api/news/${id}`)
  },

  // 上传新闻封面图片
  uploadCoverImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post<{url: string}>('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 批量删除新闻
  batchDeleteNews: (ids: number[]) => {
    return request.post<{success: boolean, count: number}>('/api/news/batch-delete', { ids })
  }
}

// 获取新闻分类列表
export const getNewsCategories = () => {
  return request<Array<{
    id: string
    name: string
    path: string
  }>>('/api/news/categories')
} 