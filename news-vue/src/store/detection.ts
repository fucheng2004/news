import { defineStore } from 'pinia'
import type { NewsItem, VerificationResult } from '@/types'
import axios from 'axios'

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
    async detectNews(content: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const { data } = await axios.post<VerificationResult>('/api/detect', { content })
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
        const { data } = await axios.get<VerificationResult[]>('/api/history')
        this.results = data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取历史记录失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    setCurrentItem(item: NewsItem) {
      this.currentItem = item
    },

    clearResults() {
      this.results = []
    }
  }
})
