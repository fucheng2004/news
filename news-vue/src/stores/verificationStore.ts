import { defineStore } from 'pinia'
import type { NewsItem, VerificationResult } from '@/types'
import { NewsCategory } from '@/types'

interface VerificationState {
  currentNews: NewsItem | null
  verificationResults: VerificationResult[]
  isLoading: boolean
  error: string | null
  batchProgress: number
}

export const useVerificationStore = defineStore('verification', {
  state: (): VerificationState => ({
    currentNews: null,
    verificationResults: [],
    isLoading: false,
    error: null,
    batchProgress: 0
  }),
  
  actions: {
    async verifyNews(newsContent: string, category: NewsCategory) {
      this.isLoading = true
      this.error = null
      
      try {
        const result = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ 
            content: newsContent,
            category
          })
        })
        
        if (!result.ok) {
          throw new Error(`验证失败: ${result.statusText}`)
        }
        
        const data = await result.json()
        this.verificationResults.push(data)
        return data
      } catch (err) {
        this.error = err instanceof Error ? err.message : '验证过程中发生错误'
        throw err
      } finally {
        this.isLoading = false
      }
    },
    
    async verifyBatch(newsItems: NewsItem[]) {
      this.batchProgress = 0
      const total = newsItems.length
      
      for (let i = 0; i < newsItems.length; i++) {
        await this.verifyNews(newsItems[i].content, newsItems[i].category)
        this.batchProgress = ((i + 1) / total) * 100
      }
    }
  }
}) 