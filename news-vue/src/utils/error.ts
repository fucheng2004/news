import { ElMessage } from 'element-plus'

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public status: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const errorHandler = {
  handle(error: unknown) {
    console.error('Error:', error)
    
    if (error instanceof AppError) {
      ElMessage.error(error.message)
      return
    }
    
    if (error instanceof Error) {
      ElMessage.error(error.message)
      return
    }
  }
} 