/**
 * 本地存储工具
 */
const PREFIX = 'news_vue_'

/**
 * 判断当前环境是否支持localStorage
 */
const isLocalStorageSupported = (): boolean => {
  try {
    const testKey = `${PREFIX}test_storage`
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

/**
 * 获取存储键名
 * @param key 原始键名
 * @returns 添加前缀的键名
 */
const getKey = (key: string): string => `${PREFIX}${key}`

/**
 * 本地存储工具对象
 */
const storage = {
  /**
   * 存储数据
   * @param key 键
   * @param value 值
   */
  set(key: string, value: any): void {
    if (!isLocalStorageSupported()) return
    
    const storageKey = getKey(key)
    const storageValue = JSON.stringify(value)
    localStorage.setItem(storageKey, storageValue)
  },

  /**
   * 获取数据
   * @param key 键
   * @param defaultValue 默认值
   * @returns 存储的值或默认值
   */
  get<T>(key: string, defaultValue: T | null = null): T | null {
    if (!isLocalStorageSupported()) return defaultValue
    
    const storageKey = getKey(key)
    const storageValue = localStorage.getItem(storageKey)
    
    if (storageValue === null) return defaultValue
    
    try {
      return JSON.parse(storageValue) as T
    } catch (e) {
      return defaultValue
    }
  },

  /**
   * 移除数据
   * @param key 键
   */
  remove(key: string): void {
    if (!isLocalStorageSupported()) return
    
    const storageKey = getKey(key)
    localStorage.removeItem(storageKey)
  },

  /**
   * 清除所有数据
   */
  clear(): void {
    if (!isLocalStorageSupported()) return
    
    const keysToRemove: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(PREFIX)) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
  },

  /**
   * 获取所有键值对
   * @returns 键值对对象
   */
  getAll(): Record<string, any> {
    if (!isLocalStorageSupported()) return {}
    
    const result: Record<string, any> = {}
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(PREFIX)) {
        const shortKey = key.substring(PREFIX.length)
        const value = localStorage.getItem(key)
        if (value !== null) {
          try {
            result[shortKey] = JSON.parse(value)
          } catch (e) {
            result[shortKey] = value
          }
        }
      }
    }
    
    return result
  }
}

export default storage; 