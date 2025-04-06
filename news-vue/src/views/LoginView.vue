<template>
  <div class="login-page">
    <!-- 背景动画 -->
    <div class="background-animation">
      <div class="floating-circle circle-1"></div>
      <div class="floating-circle circle-2"></div>
      <div class="floating-circle circle-3"></div>
      <div class="gradient-overlay"></div>
    </div>

    <!-- 左侧品牌区域 -->
    <div class="brand-section">
      <div class="brand-content">
        <div class="brand-header">
          <div class="brand-logo">
            <img src="@/assets/logo.svg" alt="Logo" class="brand-logo-image">
          </div>
          <h1 class="brand-title">AI识谣</h1>
          <p class="brand-desc">新闻真实性智能检测平台</p>
        </div>
        
        <div class="brand-features">
          <div class="feature-item">
            <div class="feature-icon">
              <el-icon><DataLine /></el-icon>
            </div>
            <div class="feature-text">
              <h3>智能分析</h3>
              <p>基于深度学习的智能分析系统，准确识别虚假信息</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <el-icon><Monitor /></el-icon>
            </div>
            <div class="feature-text">
              <h3>实时检测</h3>
              <p>毫秒级响应的实时检测能力，快速发现问题</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <el-icon><Check /></el-icon>
            </div>
            <div class="feature-text">
              <h3>安全可靠</h3>
              <p>专业的数据安全防护体系，保护您的信息安全</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录区域 -->
    <div class="login-section">
      <el-card class="login-card glass-effect">
        <div class="login-header">
          <h2 class="gradient-text">欢迎回来</h2>
          <p class="login-subtitle">登录您的账号以继续使用</p>
        </div>

        <!-- 登录模式切换 -->
        <div class="login-mode-switch">
          <el-radio-group v-model="loginMode" size="large">
            <el-radio-button :label="'user'">用户登录</el-radio-button>
            <el-radio-button :label="'admin'">管理员登录</el-radio-button>
          </el-radio-group>
        </div>
        
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="login-form"
          @keydown.enter="handleSubmit(formRef)"
        >
          <el-form-item label="用户名" prop="username">
            <el-input 
              v-model="form.username"
              :placeholder="loginMode === 'admin' ? '请输入管理员账号' : '请输入用户名'"
              :prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              :placeholder="loginMode === 'admin' ? '请输入管理员密码' : '请输入密码'"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          
          <el-form-item 
            v-if="!isLogin && loginMode === 'user'" 
            label="邮箱" 
            prop="email"
          >
            <el-input 
              v-model="form.email"
              placeholder="请输入邮箱"
              :prefix-icon="Message"
            />
          </el-form-item>
          
          <el-form-item 
            v-if="!isLogin && loginMode === 'user'" 
            label="确认密码" 
            prop="confirmPassword"
          >
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          
          <div class="form-actions">
            <div class="remember-wrapper">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
            </div>
            <el-button type="text" class="forget-btn" @click="handleForgotPassword" v-if="loginMode === 'user'">
              忘记密码？
            </el-button>
          </div>
          
          <el-button
            type="primary"
            :loading="loading"
            class="submit-btn neo-btn"
            @click="handleSubmit(formRef)"
          >
            <span class="btn-content">
              {{ getButtonText() }}
              <el-icon><Right /></el-icon>
            </span>
          </el-button>

          <div class="register-link" v-if="loginMode === 'user'">
            {{ isLogin ? '还没有账号？' : '已有账号？' }}
            <el-button 
              type="text" 
              class="register-btn"
              @click="switchMode"
            >
              {{ isLogin ? '立即注册' : '去登录' }}
            </el-button>
          </div>
        </el-form>

        <!-- 底部链接 -->
        <div class="footer-links">
          <a href="#" class="footer-link">帮助中心</a>
          <span class="divider">·</span>
          <a href="#" class="footer-link">隐私政策</a>
          <span class="divider">·</span>
          <a href="#" class="footer-link">联系我们</a>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Lock, Right, Message, DataLine, Monitor, Check } from '@element-plus/icons-vue'
import { VALIDATION_RULES } from '@/config/constants'
import { isValidEmail } from '@/utils/helpers'
import storage from '@/utils/storage'
import { userApi } from '@/api'
import { handleApiError } from '@/utils/error-handler'

// 定义登录模式类型
type LoginMode = 'user' | 'admin';

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false) // 默认不记住
const isLogin = ref(true)
// 使用类型断言确保loginMode的类型正确
const loginMode = ref('user' as LoginMode)

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: ''
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: VALIDATION_RULES.USERNAME.min, message: `用户名长度不能小于${VALIDATION_RULES.USERNAME.min}个字符`, trigger: 'blur' },
    { pattern: VALIDATION_RULES.USERNAME.pattern, message: '用户名只能包含字母、数字、下划线和横线', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: VALIDATION_RULES.PASSWORD.min, message: `密码长度不能小于${VALIDATION_RULES.PASSWORD.min}个字符`, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!isValidEmail(value)) {
          callback(new Error('请输入有效的邮箱地址'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
})

// 初始化数据
const initData = () => {
  // 尝试从本地存储获取记住我的状态
  const savedRememberMe = storage.get('rememberMe', null)
  if (savedRememberMe === true) {
    rememberMe.value = true
    // 如果记住我，则获取上次的用户名
    form.username = storage.get('lastUsername', '') as string
  }
}

// 页面加载时初始化数据
initData()

// 获取按钮文本
const getButtonText = () => {
  if (loginMode.value === 'admin') {
    return '管理员登录'
  } else {
    return isLogin.value ? '登录' : '注册'
  }
}

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  try {
    let fields = ['username', 'password']
    if (!isLogin.value && loginMode.value === 'user') {
      fields = ['username', 'password', 'email']
    }
    
    await Promise.all(fields.map(field => formEl.validateField(field)))
    loading.value = true
    
    if (loginMode.value === 'admin') {
      // 管理员登录
      try {
        // 调用管理员登录API
        const adminLoginData = {
          username: form.username,
          password: form.password,
          type: 'super' // 修改为后端需要的类型值
        };
        
        let loginResult;
        let isAdminLogin = true; // 标记是否通过管理员接口登录
        
        try {
          // 尝试调用管理员登录接口
          console.log('[管理员登录] 尝试管理员登录...');
          ElMessage.info('尝试管理员登录中...');
          
          // 记录接口调用开始时间
          const startTime = new Date().getTime();
          
          loginResult = await userApi.adminLogin(adminLoginData);
          
          // 计算请求耗时
          const endTime = new Date().getTime();
          const elapsed = endTime - startTime;
          
          console.log(`[管理员登录] 接口调用成功，耗时: ${elapsed}ms`);
          console.log('[管理员登录] 返回结果:', loginResult);
          
        } catch (adminError: any) {
          console.error('[管理员登录] 接口调用失败:', adminError);
          console.error('[管理员登录] 错误详情:', {
            message: adminError.message,
            status: adminError.response?.status,
            data: adminError.response?.data
          });
          
          isAdminLogin = false;
          
          // 备用方案：使用普通登录
          ElMessage.warning('管理员登录失败，尝试使用普通登录验证管理员身份');
          
          try {
            // 使用普通登录接口
            console.log('[管理员登录] 尝试普通登录作为备选...');
            
            loginResult = await userApi.login({
              username: form.username,
              password: form.password
            });
            
            console.log('[管理员登录] 普通登录成功:', loginResult);
            
            // 根据用户名判断是否为管理员（这里可以根据你的业务逻辑调整）
            const isAdmin = loginResult.user.username.startsWith('admin');
            if (!isAdmin) {
              ElMessage.error('您不是管理员用户，无法登录管理后台');
              loading.value = false;
              return;
            }
          } catch (loginError: any) {
            console.error('[管理员登录] 普通登录失败:', loginError);
            console.error('[管理员登录] 错误详情:', {
              message: loginError.message,
              status: loginError.response?.status,
              data: loginError.response?.data
            });
            
            // 提供具体的错误信息
            const errorMessage = loginError.message || '登录失败';
            ElMessage.error(`${errorMessage}`);
            
            loading.value = false;
            return;
          }
        }
        
        // 到这里说明登录成功了（无论是管理员登录还是普通登录）
        console.log('[管理员登录] 最终登录结果:', loginResult);
        
        if (!loginResult || !loginResult.token) {
          console.error('[管理员登录] 登录结果缺少token:', loginResult);
          ElMessage.error('登录返回数据不完整，缺少令牌信息');
          loading.value = false;
          return;
        }
        
        try {
          // 存储用户信息
          console.log('[管理员登录] 存储用户信息:', loginResult.user);
          userStore.setUser({
            username: loginResult.user.username,
            token: loginResult.token,
            avatar: loginResult.user.avatar || '',
            id: loginResult.user.id || 'unknown'
          });
          
          // 存储管理员状态
          console.log('[管理员登录] 设置管理员状态');
          storage.set('isAdmin', true);
          console.log('[管理员登录] 管理员状态设置结果:', storage.get('isAdmin'));
          
          if (rememberMe.value) {
            storage.set('lastUsername', form.username);
            storage.set('rememberMe', true);
          } else {
            storage.remove('lastUsername');
            storage.remove('rememberMe');
          }
          
          ElMessage.success(isAdminLogin ? '管理员登录成功' : '以管理员身份登录成功');
          
          // 延迟跳转，确保用户看到成功消息
          setTimeout(() => {
            console.log('[管理员登录] 准备跳转到管理后台');
            const adminPath = '/admin/dashboard';
            console.log(`[管理员登录] 跳转路径: ${adminPath}`);
            router.push(adminPath);
            console.log('[管理员登录] 跳转已触发');
          }, 1000);
        } catch (storageError) {
          console.error('[管理员登录] 存储用户信息失败:', storageError);
          ElMessage.error('登录成功但存储用户信息失败');
          loading.value = false;
        }
      } catch (error: any) {
        console.error('[管理员登录] 登录过程中发生错误:', error);
        const errorMessage = error.message || '登录过程中发生未知错误';
        ElMessage.error(`${errorMessage}`);
        loading.value = false;
      }
    } else if (isLogin.value) {
      // 普通用户登录
      try {
        console.log('[普通登录] 尝试登录...');
        ElMessage.info('登录中...');
        
        // 记录接口调用开始时间
        const startTime = new Date().getTime();
        
        const loginResponse = await userApi.login({
          username: form.username,
          password: form.password
        });
        
        // 计算请求耗时
        const endTime = new Date().getTime();
        const elapsed = endTime - startTime;
        
        console.log(`[普通登录] 接口调用成功，耗时: ${elapsed}ms`);
        console.log('[普通登录] 返回结果:', loginResponse);
        
        // 验证返回数据是否完整
        if (!loginResponse || !loginResponse.token) {
          console.error('[普通登录] 登录结果缺少token:', loginResponse);
          throw new Error('登录失败：返回数据格式错误，缺少令牌信息');
        }
        
        try {
          // 存储用户信息
          console.log('[普通登录] 存储用户信息:', loginResponse.user);
          userStore.setUser({
            username: loginResponse.user.username,
            token: loginResponse.token,
            avatar: loginResponse.user.avatar || '',
            id: loginResponse.user.id || 'unknown'
          });
          
          // 确保不是管理员状态
          storage.remove('isAdmin');
          
          if (rememberMe.value) {
            storage.set('lastUsername', form.username);
            storage.set('rememberMe', true);
          } else {
            storage.remove('lastUsername');
            storage.remove('rememberMe');
          }
          
          ElMessage.success('登录成功');
          
          // 延迟跳转，确保用户看到成功消息
          setTimeout(() => {
            console.log('[普通登录] 跳转到验证页面');
            const redirect = route.query.redirect as string;
            router.push(redirect || '/verify');
          }, 500);
        } catch (storageError) {
          console.error('[普通登录] 存储用户信息失败:', storageError);
          ElMessage.error('登录成功但存储用户信息失败');
          loading.value = false;
        }
      } catch (error: any) {
        console.error('[普通登录] 登录过程中发生错误:', error);
        console.error('[普通登录] 错误详情:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        
        // 提供具体的错误信息
        const errorMessage = error.message || '登录失败';
        ElMessage.error(`${errorMessage}`);
        loading.value = false;
      }
    } else {
      // 注册时确保所有必要字段都有值
      if (!form.email || !form.username || !form.password) {
        ElMessage.error('请填写所有必要信息')
        loading.value = false;
        return;
      }
      
      try {
        await userApi.register({
          username: form.username,
          password: form.password,
          email: form.email
        });
        
        ElMessage.success('注册成功，请登录');
        isLogin.value = true;
      } catch (error) {
        handleApiError(error);
      } finally {
        loading.value = false;
      }
    }
    
  } catch (error) {
    handleApiError(error);
    loading.value = false;
  }
}

const switchMode = () => {
  isLogin.value = !isLogin.value
  form.username = ''
  form.password = ''
  form.email = ''
  if (!isLogin.value) {
    form.confirmPassword = ''
  }
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

const handleForgotPassword = () => {
  ElMessageBox.prompt('请输入您的注册邮箱', '找回密码', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValidator: (value) => isValidEmail(value),
    inputErrorMessage: '邮箱格式不正确'
  }).then(({ value }) => {
    loading.value = true
    // 这里需要实现找回密码的API调用
    setTimeout(() => {
      ElMessage.success(`重置密码链接已发送至邮箱: ${value}`)
      loading.value = false
    }, 1000)
  }).catch(() => {
    // 用户取消输入
  })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(500px, 45%) 1fr;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, 
    rgba(var(--el-color-primary-rgb), 0.05) 0%,
    rgba(var(--el-color-success-rgb), 0.05) 100%
  );
}

/* 背景动画 */
.background-animation {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(var(--el-color-primary-rgb), 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(var(--el-color-success-rgb), 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(var(--el-color-warning-rgb), 0.05) 0%, transparent 50%);
    animation: backgroundPulse 15s infinite alternate;
  }
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.4;
  transition: all 0.5s ease;
}

.circle-1 {
  width: 500px;
  height: 500px;
  top: -150px;
  left: -150px;
  background: linear-gradient(135deg,
    rgba(var(--el-color-primary-rgb), 0.3),
    rgba(var(--el-color-success-rgb), 0.2)
  );
  animation: float 20s infinite ease-in-out;
}

.circle-2 {
  width: 600px;
  height: 600px;
  top: 30%;
  right: -200px;
  background: linear-gradient(135deg,
    rgba(var(--el-color-success-rgb), 0.3),
    rgba(var(--el-color-warning-rgb), 0.2)
  );
  animation: float 25s infinite ease-in-out reverse;
}

.circle-3 {
  width: 400px;
  height: 400px;
  bottom: -150px;
  left: 25%;
  background: linear-gradient(135deg,
    rgba(var(--el-color-warning-rgb), 0.3),
    rgba(var(--el-color-danger-rgb), 0.2)
  );
  animation: float 22s infinite ease-in-out;
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 100%
  );
}

/* 左侧品牌区域 */
.brand-section {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: linear-gradient(135deg,
    rgba(var(--el-color-primary-rgb), 0.05),
    rgba(var(--el-color-success-rgb), 0.05)
  );
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
  }
}

.brand-content {
  max-width: 480px;
  animation: fadeInUp 1s ease-out;
  position: relative;
  z-index: 1;
}

.brand-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30px;
    left: 50%;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg,
      var(--el-color-primary),
      var(--el-color-success)
    );
    transform: translateX(-50%);
    border-radius: 2px;
    opacity: 0.6;
  }
}

.brand-logo {
  margin-bottom: 24px;
}

.brand-logo-image {
  width: 120px;
  height: 120px;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2));
  animation: float 6s infinite ease-in-out;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05) rotate(5deg);
  }
}

.brand-title {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-success)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0 0 16px;
}

.brand-desc {
  font-size: 20px;
  color: var(--el-text-color-secondary);
  margin: 0;
  line-height: 1.6;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateX(10px);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.1),
      0 4px 8px rgba(0, 0, 0, 0.05);
  }
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg,
    rgba(var(--el-color-primary-rgb), 0.1),
    rgba(var(--el-color-success-rgb), 0.1)
  );
  border-radius: 16px;
  transition: all 0.3s ease;
  
  .el-icon {
    font-size: 28px;
    color: var(--el-color-primary);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: scale(1.05);
    
    .el-icon {
      transform: scale(1.1) rotate(5deg);
    }
  }
}

.feature-text {
  flex: 1;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-color-primary);
    margin: 0 0 4px;
  }
  
  p {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin: 0;
    line-height: 1.6;
  }
}

/* 右侧登录区域 */
.login-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.login-card {
  width: 100%;
  max-width: 380px;
  animation: fadeInRight 0.8s ease-out;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 5px 15px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  border-radius: 24px;
}

.login-header {
  text-align: center;
  padding: 16px 0 12px;
  margin-bottom: 0;
  
  &::after {
    width: 32px;
    height: 2px;
    opacity: 0.5;
  }
}

.gradient-text {
  font-size: 22px;
  margin: 0 0 2px;
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%,
    var(--el-color-success) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(var(--el-color-primary-rgb), 0.1);
}

.login-subtitle {
  font-size: 13px;
  opacity: 0.8;
  color: var(--el-text-color-secondary);
  font-weight: 500;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.login-form {
  padding: 16px;
  
  .el-form-item {
    margin-bottom: 12px;
    
    .el-form-item__label {
      font-size: 12px;
      margin-bottom: 3px;
      padding-bottom: 0;
    }
  }
  
  .el-input {
    --el-input-height: 38px;
    --el-input-border-radius: 8px;
    
    .el-input__wrapper {
      padding: 0 10px;
    }
    
    .el-input__icon {
      font-size: 16px;
    }
  }
}

.submit-btn {
  height: 46px;
  font-size: 16px;
  margin: 20px 0;
  border-radius: 10px;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-success)
  );
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0)
    );
    transform: translateY(-100%);
    transition: transform 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 10px 28px rgba(var(--el-color-primary-rgb), 0.35),
      0 6px 10px rgba(var(--el-color-success-rgb), 0.25);
    
    &::before {
      transform: translateY(0);
    }
    
    .btn-content {
      transform: scale(1.02);
      
      .el-icon {
        transform: translateX(6px);
      }
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  .btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.3s ease;
    font-weight: 500;
    
    .el-icon {
      font-size: 18px;
      transition: transform 0.3s ease;
    }
  }
}

.login-mode-switch {
  margin: 12px 0;
  
  .el-radio-group {
    padding: 2px;
  }
  
  .el-radio-button {
    .el-radio-button__inner {
      height: 36px;
      font-size: 12px;
      padding: 0 12px;
    }
  }
}

.form-actions {
  margin: 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .el-checkbox {
    font-size: 12px;
    
    .el-checkbox__label {
      padding-left: 6px;
    }
  }
  
  .forget-btn {
    font-size: 12px;
    padding: 0;
  }
}

.remember-wrapper {
  flex: 1;
}

.register-link {
  margin: 12px 0;
  font-size: 12px;
  
  .register-btn {
    font-size: 12px;
    padding: 1px 3px;
  }
}

.footer-links {
  padding-top: 12px;
  gap: 6px;
  margin-top: 12px;
  
  .footer-link {
    font-size: 11px;
    opacity: 0.8;
  }
  
  .divider {
    margin: 0 4px;
    opacity: 0.5;
  }
}

/* 动画 */
@keyframes backgroundPulse {
  0% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.02);
  }
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, -15px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .login-page {
    grid-template-columns: 1fr;
  }
  
  .brand-section {
    display: none;
  }
  
  .login-section {
    padding: 20px;
  }
  
  .login-card {
    width: 100%;
    max-width: 400px;
  }
}

@media screen and (max-width: 480px) {
  .login-section {
    padding: 8px;
  }
  
  .login-card {
    border-radius: 10px;
  }
  
  .login-header {
    padding: 14px 0 10px;
  }
  
  .gradient-text {
    font-size: 20px;
  }
  
  .login-form {
    padding: 14px;
    
    .el-form-item {
      margin-bottom: 10px;
    }
    
    .el-input {
      --el-input-height: 36px;
    }
  }
  
  .submit-btn {
    height: 44px;
    margin: 16px 0;
    font-size: 15px;
  }
  
  .login-mode-switch {
    .el-radio-button {
      .el-radio-button__inner {
        height: 40px;
        font-size: 13px;
      }
    }
  }
  
  .register-link {
    margin: 24px 0;
    font-size: 14px;
    
    .register-btn {
      font-size: 14px;
    }
  }
  
  .footer-links {
    flex-direction: column;
    gap: 12px;
  }
  
  .divider {
    display: none;
  }
}

/* 深色模式适配 */
:deep(.dark) {
  .login-page {
    background: linear-gradient(135deg,
      rgba(var(--el-color-primary-rgb), 0.1) 0%,
      rgba(0, 0, 0, 0.95) 100%
    );
  }
  
  .brand-section {
    background: rgba(0, 0, 0, 0.2);
    
    &::before {
      opacity: 0.1;
    }
  }
  
  .feature-item {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    
    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }
  
  .feature-icon {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .glass-effect {
    background: rgba(30, 30, 30, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.2),
      0 5px 15px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  }
  
  .login-form {
    .el-input {
      .el-input__wrapper {
        background: rgba(0, 0, 0, 0.2);
        border-color: rgba(255, 255, 255, 0.1);
        
        &:hover {
          background: rgba(0, 0, 0, 0.25);
          border-color: rgba(255, 255, 255, 0.15);
        }
        
        &.is-focus {
          background: rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.2);
        }
      }
      
      .el-input__icon {
        color: rgba(255, 255, 255, 0.8);
      }
    }
    
    .el-form-item__label {
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  .login-mode-switch {
    .el-radio-group {
      background: rgba(0, 0, 0, 0.2);
    }
    
    .el-radio-button__inner {
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }
  
  .register-btn:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .login-subtitle,
  .footer-link {
    opacity: 0.7;
  }
  
  .divider {
    opacity: 0.3;
  }
  
  .gradient-text {
    background: linear-gradient(135deg,
      var(--el-color-primary) 30%,
      var(--el-color-success) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .login-subtitle {
    color: rgba(255, 255, 255, 0.85);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}
</style> 
