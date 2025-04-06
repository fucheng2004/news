import { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useUserStore } from '@/stores/user'
import storage from '@/utils/storage'

// 需要登录才能访问的路由
const authRoutes = [
  '/history',
  '/profile'
]

export const setupRouterGuard = (router: Router): void => {
  router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // 设置文档标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - 新闻真实性检测平台`
    } else {
      document.title = '新闻真实性检测平台'
    }

    console.log(`[路由守卫] 路由变化: ${from.path} -> ${to.path}`);

    // 权限检查
    const userStore = useUserStore()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
    const isLoggedIn = !!userStore.token
    const isAdmin = storage.get('isAdmin') === true
    const userRole = storage.get('userRole')

    console.log(`[路由守卫] 权限检查:`, {
      requiresAuth,
      requiresAdmin,
      isLoggedIn,
      isAdmin,
      userRole,
      token: userStore.token ? '存在' : '不存在',
      username: userStore.username,
      storage: {
        token: storage.get('token') ? '存在' : '不存在',
        isAdmin: storage.get('isAdmin'),
        userRole: storage.get('userRole')
      }
    });

    // 管理员权限检查
    if (requiresAdmin) {
      console.log('[路由守卫] 需要管理员权限');
      if (!isLoggedIn) {
        console.log('[路由守卫] 用户未登录，重定向到登录页');
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        });
        return;
      }
      if (!isAdmin || userRole !== 'admin') {
        console.log('[路由守卫] 用户非管理员，重定向到登录页');
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        });
        return;
      }
      console.log('[路由守卫] 管理员权限验证通过');
    }

    // 普通用户权限检查
    if (requiresAuth && !isLoggedIn) {
      console.log('[路由守卫] 需要登录权限，但用户未登录，重定向到登录页');
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      console.log('[路由守卫] 权限检查通过，允许访问');
      next()
    }
  })

  // 路由错误处理
  router.onError((error: Error) => {
    console.error('[路由守卫] 路由错误:', error)
  })
} 