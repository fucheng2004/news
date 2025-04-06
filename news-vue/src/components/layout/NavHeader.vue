<template>
  <header class="nav-header">
    <div class="header-content">
      <div class="logo" @click="router.push('/')">
        <div class="logo-container">
          <div class="logo-mark">
            <div class="logo-ring outer"></div>
            <div class="logo-ring inner"></div>
            <div class="logo-circle">
              <div class="logo-check"></div>
              <div class="logo-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div class="logo-glow"></div>
            <div class="logo-sparkles">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <span class="logo-text">AI识谣</span>
      </div>
      
      <nav-menu class="nav-menu" />

      <div class="header-actions">
        <el-button-group>
          <el-button v-if="!isLoggedIn" type="primary" @click="handleLogin">
            登录
          </el-button>
          <el-button v-if="!isLoggedIn" @click="handleRegister">
            注册
          </el-button>
          <el-dropdown v-else>
            <el-avatar :size="32" :src="userAvatar">
              {{ userInitials }}
            </el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToProfile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item v-if="isAdmin" @click="goToAdmin">
                  <el-icon><Monitor /></el-icon>管理员后台
                </el-dropdown-item>
                <el-dropdown-item v-if="isDev" divided @click="toggleAdminStatus">
                  <el-icon><Setting /></el-icon>{{ isAdmin ? '取消管理员' : '设为管理员' }}
                </el-dropdown-item>
                <el-dropdown-item @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-button-group>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { User, SwitchButton, Setting, Monitor } from '@element-plus/icons-vue'
import NavMenu from './NavMenu.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const isLoggedIn = computed(() => !!userStore.token)
const userAvatar = computed(() => userStore.avatar || '')
const userInitials = computed(() => {
  const name = userStore.username || ''
  return name.charAt(0).toUpperCase()
})

const handleLogin = () => router.push('/login')
const handleRegister = () => router.push('/register')
const goToProfile = () => router.push('/profile')
const goToAdmin = () => router.push('/admin/dashboard')
const handleLogout = () => userStore.logout()

// 开发环境标志
const isDev = import.meta.env.DEV

// 是否为管理员
const isAdmin = ref(localStorage.getItem('isAdmin') === 'true')

// 切换管理员状态（仅用于开发测试）
const toggleAdminStatus = () => {
  isAdmin.value = !isAdmin.value
  localStorage.setItem('isAdmin', isAdmin.value.toString())
  ElMessage.success(`您已${isAdmin.value ? '切换为' : '取消'}管理员身份`)
}
</script>

<style scoped>
.nav-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 4px 20px rgba(0, 0, 0, 0.02);
  z-index: 100;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg,
      rgba(var(--el-color-primary-rgb), 0.02),
      rgba(var(--el-color-success-rgb), 0.02)
    );
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      transparent,
      rgba(var(--el-color-primary-rgb), 0.1),
      transparent
    );
  }
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  &:hover {
    transform: scale(1.02);
    
    .logo-container {
      transform: rotate(-5deg);
      box-shadow: 
        0 8px 28px rgba(var(--el-color-primary-rgb), 0.3),
        0 4px 10px rgba(var(--el-color-success-rgb), 0.2),
        inset 0 2px 8px rgba(255, 255, 255, 0.25);
    }
    
    .logo-mark {
      transform: rotate(-50deg);
    }
    
    .logo-ring {
      &.outer {
        transform: scale(1.1);
        opacity: 0.2;
      }
      
      &.inner {
        transform: scale(0.9);
        opacity: 0.4;
      }
    }
  }
}

.logo-container {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg,
    var(--el-color-primary) 0%,
    var(--el-color-primary-light-3) 50%,
    var(--el-color-primary-light-5) 100%
  );
  box-shadow: 
    0 6px 20px rgba(var(--el-color-primary-rgb), 0.25),
    0 2px 8px rgba(var(--el-color-primary-rgb), 0.15),
    inset 0 2px 6px rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(135deg,
    var(--el-color-primary),
    var(--el-color-success)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .el-button-group {
    display: flex;
    gap: 8px;
  }
  
  .el-button {
    height: 36px;
    padding: 0 20px;
    border-radius: 10px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:not(.is-disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.2);
    }
    
    &.el-button--primary {
      background: linear-gradient(135deg,
        var(--el-color-primary),
        var(--el-color-primary-light-3)
      );
      border: none;
      
      &:hover {
        background: linear-gradient(135deg,
          var(--el-color-primary-light-3),
          var(--el-color-primary)
        );
      }
    }
  }
  
  .el-avatar {
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
      border-color: var(--el-color-primary);
      box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.2);
    }
  }
}

.el-dropdown-menu {
  border: none;
  padding: 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.05);
  
  .el-dropdown-menu__item {
    padding: 10px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    .el-icon {
      margin-right: 8px;
      font-size: 16px;
    }
    
    &:hover {
      background: linear-gradient(135deg,
        rgba(var(--el-color-primary-rgb), 0.1),
        rgba(var(--el-color-success-rgb), 0.1)
      );
      color: var(--el-color-primary);
    }
    
    &.is-disabled {
      opacity: 0.5;
    }
  }
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .nav-header {
    height: 56px;
  }
  
  .header-content {
    padding: 0 16px;
  }
  
  .logo-container {
    width: 36px;
    height: 36px;
  }
  
  .logo-text {
    display: none;
  }
  
  .header-actions {
    .el-button {
      padding: 0 16px;
      height: 32px;
    }
  }
}

/* 深色模式适配 */
:deep(.dark) {
  .nav-header {
    background: rgba(30, 30, 30, 0.95);
    box-shadow: 
      0 1px 3px rgba(0, 0, 0, 0.2),
      0 4px 20px rgba(0, 0, 0, 0.1);
    
    &::before {
      background: linear-gradient(90deg,
        rgba(var(--el-color-primary-rgb), 0.05),
        rgba(var(--el-color-success-rgb), 0.05)
      );
    }
  }
  
  .logo-container {
    background: linear-gradient(135deg,
      var(--el-color-primary-dark-2) 0%,
      var(--el-color-primary) 50%,
      var(--el-color-primary-light-3) 100%
    );
    box-shadow: 
      0 6px 20px rgba(0, 0, 0, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 2px 6px rgba(255, 255, 255, 0.1);
  }
  
  .el-dropdown-menu {
    background: rgba(30, 30, 30, 0.98);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.2),
      0 2px 6px rgba(0, 0, 0, 0.1);
    
    .el-dropdown-menu__item {
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }
  
  .header-actions {
    .el-button:not(.is-disabled):hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .el-avatar:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }
}
</style> 