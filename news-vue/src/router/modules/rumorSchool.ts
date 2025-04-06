import { RouteRecordRaw } from 'vue-router'

const rumorSchoolRoutes: RouteRecordRaw[] = [
  {
    path: '/rumor-school',
    name: 'RumorSchool',
    component: () => import('@/views/RumorSchool.vue'),
    meta: {
      title: '辨谣学堂',
      requiresAuth: false
    }
  },
  {
    path: '/rumor-school/course/:id',
    name: 'CourseDetail',
    component: () => import('@/views/RumorSchool/CourseDetail.vue'),
    meta: {
      title: '课程详情',
      requiresAuth: false
    }
  }
]

export default rumorSchoolRoutes 