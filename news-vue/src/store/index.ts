import { createPinia } from 'pinia'
import { useAdvancedStore } from './advanced-store'

const pinia = createPinia()

export {
  pinia,
  useAdvancedStore
} 