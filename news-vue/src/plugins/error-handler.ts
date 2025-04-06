import { App } from 'vue'
import { errorHandler } from '@/utils/error'

export function setupErrorHandler(app: App) {
  app.config.errorHandler = (err, instance, info) => {
    console.error('Vue Error:', err)
    console.error('Component:', instance)
    console.error('Error Info:', info)
    errorHandler.handle(err)
  }

  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global Error:', {
      message,
      source,
      lineno,
      colno,
      error
    })
    errorHandler.handle(error || message)
    return true
  }

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason)
    errorHandler.handle(event.reason)
  })
} 