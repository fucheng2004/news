import { defineStore } from 'pinia'

interface AdvancedState {
  isLoading: boolean
  error: string | null
  results: any[]
}

export const useAdvancedStore = defineStore('advanced', {
  state: (): AdvancedState => ({
    isLoading: false,
    error: null,
    results: []
  }),

  actions: {
    async fetchResults() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await fetch('/api/advanced-search')
        if (!response.ok) throw new Error('获取数据失败')
        
        const data = await response.json()
        this.results = data
      } catch (err) {
        this.error = err instanceof Error ? err.message : '未知错误'
      } finally {
        this.isLoading = false
      }
    }
  }
}) 