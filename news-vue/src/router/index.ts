import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/config/constants'
import HomeView from '@/views/HomeView.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import Analysis from '@/views/features/Analysis.vue'
import Detection from '@/views/features/Detection.vue'
import Layout from '@/views/features/Layout.vue'
import Realtime from '@/views/features/Realtime.vue'
import Video from '@/views/features/Video.vue'
import HistoryView from '@/views/HistoryView.vue'
import ProfileView from '@/views/ProfileView.vue'
import rumorSchoolRoutes from './modules/rumorSchool'
import RumorSchool from '@/views/RumorSchool.vue'
import CourseDetail from '@/views/CourseDetail.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import NewsManagement from '@/views/NewsManagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '/',
          name: ROUTE_NAMES.HOME,
          component: HomeView,
          meta: {
            title: '首页'
          }
        },
        {
          path: '/news',
          children: [
            {
              path: '',
              redirect: '/news/latest'
            },
            {
              path: ':category',
              name: 'news-category',
              component: () => import('@/views/news/[category].vue'),
              props: true,
              meta: {
                title: '新闻中心'
              }
            }
          ]
        },
        {
          path: '/verify',
          name: ROUTE_NAMES.VERIFY,
          component: () => import('@/views/VerifyNews.vue'),
          meta: { 
            title: '新闻检测'
          }
        },
        {
          path: '/data-platform',
          name: 'data-platform',
          component: () => import('@/views/DataPlatform.vue'),
          meta: {
            title: '数读平台'
          }
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
          meta: {
            title: '关于我们'
          }
        },
        {
          path: '/news-management',
          name: 'news-management',
          component: NewsManagement,
          meta: {
            title: '新闻管理',
            requiresAuth: true,
            requiredRoles: ['admin', 'editor']
          }
        },
        {
          path: '/features',
          name: 'Features',
          component: Layout,
          children: [
            {
              path: 'analysis',
              name: 'Analysis',
              component: Analysis,
            },
            {
              path: 'detection',
              name: 'Detection',
              component: Detection,
            },
            {
              path: 'realtime',
              name: 'Realtime',
              component: Realtime,
            },
            {
              path: 'video',
              name: 'Video',
              component: Video,
            },
          ]
        },
        {
          path: '/history',
          name: 'History',
          component: HistoryView,
          meta: {
            title: '检测历史'
          }
        },
        {
          path: '/profile',
          name: 'profile',
          component: ProfileView,
          meta: {
            requiresAuth: true,
            title: '个人中心'
          }
        }
      ]
    },
    {
      path: '/admin',
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: AdminDashboard,
          meta: {
            requiresAuth: true,
            requiresAdmin: true,
            title: '管理员后台'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView,
    },
    ...rumorSchoolRoutes,
    {
      path: '/rumor-school',
      name: 'RumorSchool',
      component: RumorSchool
    },
    {
      path: '/rumor-school/course/:id',
      name: 'CourseDetail',
      component: CourseDetail
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router 