<template>
  <div class="register-page">
    <!-- 背景动画 -->
    <div class="background-animation">
      <div v-for="i in 5" :key="i" class="floating-circle"></div>
      <div class="color-waves"></div>
      <div class="gradient-overlay"></div>
    </div>

    <el-card class="register-card glass-effect">
      <template #header>
        <div class="card-header">
          <div class="logo-wrapper">
            <img src="@/assets/logo.svg" alt="Logo" class="logo-image">
          </div>
          <h2 class="gradient-text">注册账号</h2>
          <p class="subtitle">加入新闻真实性检测平台</p>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="registerForm"
        :rules="rules as Partial<Record<string, Arrayable<FormItemRule>>>"
        label-position="top"
        class="register-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="registerForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="registerForm.email"
            type="email"
            placeholder="请输入邮箱"
            :prefix-icon="Message"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
            :prefix-icon="Lock"
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
            :prefix-icon="Key"
          />
        </el-form-item>

        <div class="agreement">
          <el-checkbox v-model="agreeTerms">
            我已阅读并同意
            <el-button type="text" @click="showTerms">服务条款</el-button>
            和
            <el-button type="text" @click="showPrivacy">隐私政策</el-button>
          </el-checkbox>
        </div>
        
        <el-button
          type="primary"
          :loading="loading"
          class="submit-btn neo-btn"
          :disabled="!agreeTerms"
          @click="handleSubmit"
        >
          <span class="btn-content">
            <el-icon><CircleCheck /></el-icon>
            立即注册
          </span>
        </el-button>

        <div class="login-link">
          已有账号？
          <el-button 
            type="text" 
            class="login-btn"
            @click="handleLogin"
          >
            立即登录
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '@/api'
import type { FormInstance, FormItemRule } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  User, 
  Lock, 
  Message,
  Key,
  CircleCheck
} from '@element-plus/icons-vue'
import { Arrayable } from 'vitest'
import { handleApiError } from '@/utils/error-handler'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const agreeTerms = ref(false)

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能小于3个字符', trigger: 'blur' },
    {
      validator: async (rule: any, value: string, callback: any) => {
        if (!value) {
          callback()
          return
        }
        try {
          const { exists } = await userApi.checkUsername(value)
          if (exists) {
            callback(new Error('该用户名已被使用'))
          } else {
            callback()
          }
        } catch (error) {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
      
const handleLogin = () => {
  router.push('/login')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    await userApi.register({
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password
    })
    
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch (error: any) {
    if (error.response?.status === 500) {
      ElMessage.error(error.response.data.message || '注册失败，请稍后重试')
    } else {
      handleApiError(error)
    }
  } finally {
    loading.value = false
  }
}

const showTerms = () => {
  ElMessageBox.alert(
    '这里是服务条款的详细内容...',
    '服务条款',
    { confirmButtonText: '我知道了' }
  )
}

const showPrivacy = () => {
  ElMessageBox.alert(
    '这里是隐私政策的详细内容...',
    '隐私政策',
    { confirmButtonText: '我知道了' }
  )
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.color-waves {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 60% 30%, rgba(64, 158, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 20% 70%, rgba(103, 194, 58, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 60%, rgba(230, 162, 60, 0.1) 0%, transparent 50%);
  animation: wave 15s infinite alternate;
}

.floating-circle {
  position: absolute;
  background: linear-gradient(45deg, var(--el-color-primary-light-8), var(--el-color-success-light-8));
  border-radius: 50%;
  opacity: 0.3;
  animation: float 15s infinite linear;
}

.floating-circle:nth-child(1) { width: 300px; height: 300px; top: 10%; left: 10%; animation-delay: 0s; }
.floating-circle:nth-child(2) { width: 200px; height: 200px; top: 60%; left: 80%; animation-delay: -3s; }
.floating-circle:nth-child(3) { width: 150px; height: 150px; top: 30%; left: 60%; animation-delay: -6s; }
.floating-circle:nth-child(4) { width: 250px; height: 250px; top: 70%; left: 20%; animation-delay: -9s; }
.floating-circle:nth-child(5) { width: 180px; height: 180px; top: 40%; left: 30%; animation-delay: -12s; }

.register-card {
  width: 100%;
  max-width: 440px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.card-header {
  text-align: center;
  padding: 20px 0;
}

.logo-wrapper {
  margin-bottom: 20px;
}

.logo-image {
  width: 64px;
  height: 64px;
  animation: pulse 2s infinite;
}

.gradient-text {
  font-size: 2rem;
  background: linear-gradient(120deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.subtitle {
  color: var(--el-text-color-secondary);
  margin-top: 8px;
}

.register-form {
  padding: 20px;
}

.agreement {
  margin: 20px 0;
  color: var(--el-text-color-regular);
}

.agreement :deep(.el-checkbox__label) {
  color: var(--el-text-color-regular);
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 22px;
  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-success));
  border: none;
  margin-bottom: 20px;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-link {
  text-align: center;
  color: var(--el-text-color-secondary);
  margin-bottom: 30px;
}

.login-btn {
  font-weight: bold;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes wave {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(100px, 100px) rotate(360deg); }
}

@media (max-width: 480px) {
  .register-card {
    margin: 20px;
  }
  
  .gradient-text {
    font-size: 1.8rem;
  }
}
</style> 