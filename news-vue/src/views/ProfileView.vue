<template>
  <div class="profile-page">
    <div class="page-header">
      <el-button 
        text 
        @click="router.back()"
        class="back-button"
      >
        <el-icon><arrow-left /></el-icon>
        返回
      </el-button>
      <h1>个人中心</h1>
    </div>

    <el-card class="profile-card">
      <div class="profile-header">
        <el-avatar 
          :size="80"
          class="profile-avatar"
          :style="generateAvatarStyle(profileForm.username)"
        >
          {{ profileForm.username?.charAt(0)?.toUpperCase() }}
        </el-avatar>
      </div>

      <el-form 
        ref="formRef"
        :model="profileForm"
        label-width="100px"
        class="profile-form"
      >
        <el-form-item label="用户名">
          <el-input v-model="profileForm.username" disabled />
        </el-form-item>
        
        <el-form-item label="邮箱">
          <el-input v-model="profileForm.email" disabled />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleEdit">
            <el-icon><edit /></el-icon>
            编辑资料
          </el-button>
          <el-button @click="handleChangePassword">
            <el-icon><lock /></el-icon>
            修改密码
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
            placeholder="请输入当前密码"
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleSavePassword"
            :loading="loading"
          >
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="editDialogVisible"
      title="编辑个人资料"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleSaveProfile"
            :loading="loading"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { ArrowLeft, Edit, Lock } from '@element-plus/icons-vue'
import { isValidEmail } from '@/utils/helpers'

const auth = useAuthStore()
const router = useRouter()

const profileForm = reactive({
  username: '',
  email: '',
})

onMounted(async () => {
  try {
    // 如果没有用户信息，获取用户信息
    if (!auth.user) {
      await auth.fetchUserInfo()
    }
    
    // 填充表单
    if (auth.user) {
      profileForm.username = auth.user.username
      profileForm.email = auth.user.email
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
})

const handleEdit = () => {
  editForm.username = profileForm.username
  editForm.email = profileForm.email
  editDialogVisible.value = true
}

const passwordDialogVisible = ref(false)
const passwordFormRef = ref<FormInstance>()
const loading = ref(false)

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleChangePassword = () => {
  passwordDialogVisible.value = true
}

const handleSavePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    loading.value = true
    
    await auth.changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    
    passwordDialogVisible.value = false
    
    // 清空表单
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    console.error('修改密码失败:', error)
  } finally {
    loading.value = false
  }
}

const editDialogVisible = ref(false)
const editFormRef = ref<FormInstance>()

const editForm = reactive({
  username: '',
  email: '',
})

const editRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能小于3个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入邮箱'))
        } else if (!isValidEmail(value)) {
          callback(new Error('请输入正确的邮箱格式'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const handleSaveProfile = async () => {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    loading.value = true
    
    await auth.updateProfile({
      username: editForm.username,
      email: editForm.email,
    })
    
    // 更新表单显示
    profileForm.username = editForm.username
    profileForm.email = editForm.email
    
    editDialogVisible.value = false
    ElMessage.success('个人资料更新成功！')
  } catch (error) {
    console.error('更新个人资料失败:', error)
    ElMessage.error('更新失败，请重试')
  } finally {
    loading.value = false
  }
}

// 根据用户名生成固定的渐变色
const generateAvatarStyle = (username: string) => {
  // 预定义一组好看的渐变色组合
  const gradients = [
    ['#FF6B6B', '#4ECDC4'], // 红绿
    ['#45B8AC', '#009FFD'], // 青蓝
    ['#9B5DE5', '#F15BB5'], // 紫粉
    ['#00BBF9', '#00F5D4'], // 蓝青
    ['#FEE440', '#F15BB5'], // 黄粉
    ['#00F5D4', '#7209B7'], // 青紫
    ['#4361EE', '#4CC9F0'], // 深蓝浅蓝
    ['#F72585', '#7209B7']  // 粉紫
  ]
  
  if (!username) {
    // 如果没有用户名，返回默认渐变色
    return {
      background: `linear-gradient(135deg, ${gradients[0][0]} 0%, ${gradients[0][1]} 100%)`,
      border: 'none'
    }
  }
  
  // 使用用户名生成固定的索引
  const index = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length
  const [color1, color2] = gradients[index]
  
  return {
    background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
    border: 'none'  // 移除之前的边框
  }
}
</script>

<style scoped>
.profile-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.profile-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.profile-header {
  text-align: center;
  padding: 24px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 24px;
}

.profile-avatar {
  color: white;
  font-size: 32px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
  user-select: none;
}

.profile-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  padding: 0;
}

.back-button:hover {
  color: var(--el-color-primary);
}

.profile-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 0 24px 24px;
}

.el-form-item:last-child {
  margin-bottom: 0;
  text-align: center;
}

.el-button {
  margin: 0 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.el-button .el-icon {
  font-size: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 16px;
  }
  
  .page-header h1 {
    font-size: 20px;
  }
  
  .profile-form {
    padding: 0 16px 16px;
  }
}
</style> 