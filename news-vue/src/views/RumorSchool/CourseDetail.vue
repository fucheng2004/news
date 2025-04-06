<template>
  <div class="course-detail">
    <div class="course-header">
      <h2>{{ course?.title }}</h2>
    </div>
    
    <div class="course-content">
      <!-- 课程内容将在这里展示 -->
      <p>课程 ID: {{ courseId }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const courseId = ref(route.params.id)
const course = ref<{title: string} | null>(null)

onMounted(async () => {
  // 这里可以根据 courseId 获取课程详情
  // const response = await fetchCourseDetail(courseId.value)
  // course.value = response.data
})
</script>

<style lang="scss" scoped>
.course-detail {
  .course-header {
    margin-bottom: 24px;
    
    h2 {
      font-size: 24px;
      color: #2c3e50;
    }
  }

  .course-content {
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  }
}
</style> 