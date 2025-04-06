import { defineStore } from 'pinia'
import type { NewsItem, VerificationResult, NewsCategory } from '@/types'
import request from '@/utils/request'
import { mockVerifyResponse } from '@/mock/api'

interface DetectionState {
  newsItems: NewsItem[]
  currentItem: NewsItem | null
  results: VerificationResult[]
  isLoading: boolean
  error: string | null
}

export const useDetectionStore = defineStore('detection', {
  state: (): DetectionState => ({
    newsItems: [],
    currentItem: null,
    results: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async detectNews(params: { title: string; content: string; category: NewsCategory }) {
      this.isLoading = true
      this.error = null
      
      try {
        if (import.meta.env.DEV) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          const mockResult: VerificationResult = {
            id: Date.now().toString(),
            title: params.title,
            content: params.content,
            category: params.category,
            credibility: Math.random() * 0.5 + 0.5,
            source: '新闻检测系统',
            verifiedAt: new Date().toISOString(),
            summary: '这是一个自动生成的检测结果摘要。',
            score: Math.random() * 0.5 + 0.5,
            details: [
              {
                type: 'factCheck',
                score: Math.random() * 0.5 + 0.5,
                explanation: '基于事实核查的分析结果',
                evidence: ['来源可靠', '数据准确']
              },
              {
                type: 'sourceAnalysis',
                score: Math.random() * 0.5 + 0.5,
                explanation: '基于来源分析的结果',
                evidence: ['官方媒体', '权威来源']
              }
            ]
          }
          this.results.push(mockResult)
          return mockResult
        }
        
        const { data } = await request.post<VerificationResult>('/api/verify', {
          ...params,
          timestamp: Date.now()
        })
        this.results.push(data)
        return data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '检测失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchHistory() {
      this.isLoading = true
      this.error = null
      
      try {
        const { data } = await request.get<VerificationResult[]>('/history')
        this.results = data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取历史记录失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async detectImage(imageUrl: string) {
      this.isLoading = true
      this.error = null
      
      try {
        if (import.meta.env.DEV) {
          const mockData = mockVerifyResponse({
            type: 'image',
            url: imageUrl
          })
          this.results.push(mockData)
          return mockData
        }
        
        const { data } = await request.post<VerificationResult>('/verify/image', {
          url: imageUrl
        })
        this.results.push(data)
        return data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '图片检测失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async detectVideo(videoUrl: string) {
      this.isLoading = true
      this.error = null
      
      try {
        if (import.meta.env.DEV) {
          const mockData = mockVerifyResponse({
            type: 'video',
            url: videoUrl
          })
          this.results.push(mockData)
          return mockData
        }
        
        const { data } = await request.post<VerificationResult>('/verify/video', {
          url: videoUrl
        })
        this.results.push(data)
        return data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '视频检测失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async getHistory(params: {
      page: number;
      pageSize: number;
      startDate?: string;
      endDate?: string;
      category?: string;
      credibility?: 'high' | 'medium' | 'low';
    }) {
      this.isLoading = true;
      try {
        // 开发环境模拟数据
        if (import.meta.env.DEV) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockResults = Array.from({ length: 10 }, (_, index) => ({
            id: `${Date.now()}_${index}`,
            title: `测试新闻 ${index + 1}`,
            content: '这是一条测试新闻内容...',
            category: ['politics', 'technology', 'economy', 'society'][Math.floor(Math.random() * 4)],
            credibility: Math.random(),
            source: '测试来源',
            verifiedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            summary: '这是新闻摘要...',
            score: Math.random(),
            details: [
              {
                type: 'factCheck',
                score: Math.random(),
                explanation: '事实核查结果...',
                evidence: ['证据1', '证据2']
              }
            ]
          }));
          return {
            total: 100,
            list: mockResults
          };
        }

        const response = await request.get('/api/history', { params });
        return response.data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取历史记录失败';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteHistory(id: string) {
      try {
        if (import.meta.env.DEV) {
          await new Promise(resolve => setTimeout(resolve, 500));
          return { success: true };
        }
        await request.delete(`/api/history/${id}`);
      } catch (error) {
        throw error;
      }
    },

    async clearHistory() {
      try {
        if (import.meta.env.DEV) {
          await new Promise(resolve => setTimeout(resolve, 500));
          return { success: true };
        }
        await request.delete('/api/history');
      } catch (error) {
        throw error;
      }
    }
  }
}) 