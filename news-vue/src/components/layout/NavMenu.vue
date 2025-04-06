<template>
  <nav class="nav-menu">
    <router-link to="/" class="nav-link home-link">
      <el-icon><HomeFilled /></el-icon>
      <span>首页</span>
    </router-link>
    <router-link to="/verify" class="nav-link verify-link">
      <el-icon><Search /></el-icon>
      <span>新闻检测</span>
    </router-link>
    <router-link to="/news" class="nav-link news-link">
      <el-icon><Document /></el-icon>
      <span>新闻中心</span>
    </router-link>
    <router-link to="/rumor-school" class="nav-link rumor-school-link">
      <el-icon><Reading /></el-icon>
      <span>辨谣学堂</span>
    </router-link>
    <router-link to="/data-platform" class="nav-link data-link">
      <el-icon><DataLine /></el-icon>
      <span>数读平台</span>
    </router-link>
    <router-link to="/about" class="nav-link about-link">
      <el-icon><InfoFilled /></el-icon>
      <span>关于我们</span>
    </router-link>
    
    <!-- 新闻管理入口，仅对管理员和编辑者显示 -->
    <router-link v-if="isAdminOrEditor" to="/news-management" class="nav-link management-link">
      <el-icon><Management /></el-icon>
      <span>新闻管理</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  HomeFilled,
  Search,
  Document,
  DataLine,
  InfoFilled,
  Reading,
  Management
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import storage from '@/utils/storage'

const userStore = useUserStore()

// 判断用户是否为管理员或编辑者
const isAdminOrEditor = computed(() => {
  // 使用storage工具判断是否为管理员
  const token = userStore.token
  const isAdmin = storage.get('isAdmin') === true
  return token && isAdmin
})
</script>

<style scoped>
.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 0 20px;
  height: 100%;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg,
      transparent,
      rgba(var(--el-color-primary-rgb), 0.1),
      transparent
    );
  }
}

.nav-link {
  text-decoration: none;
  color: var(--el-text-color-regular);
  font-weight: 500;
  font-size: 15px;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    padding: 2px;
    background: linear-gradient(135deg,
      var(--el-color-primary),
      var(--el-color-success)
    );
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    color: var(--el-color-primary);
    transform: translateY(-2px);
    
    &::before {
      opacity: 1;
    }
    
    .el-icon {
      transform: scale(1.2) rotate(5deg);
      opacity: 1;
    }
  }
  
  &.router-link-active {
    color: var(--el-color-primary);
    background: linear-gradient(135deg,
      rgba(var(--el-color-primary-rgb), 0.1),
      rgba(var(--el-color-success-rgb), 0.1)
    );
    font-weight: 600;
    
    &::before {
      opacity: 1;
    }
    
    .el-icon {
      transform: scale(1.2);
      opacity: 1;
    }
  }
}

.nav-link .el-icon {
  font-size: 18px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0.8;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* 图标颜色和效果 */
.home-link .el-icon {
  color: #1890ff;
  filter: drop-shadow(0 2px 4px rgba(24, 144, 255, 0.2));
}

.verify-link .el-icon {
  color: #722ed1;
  filter: drop-shadow(0 2px 4px rgba(114, 46, 209, 0.2));
}

.news-link .el-icon {
  color: #13c2c2;
  filter: drop-shadow(0 2px 4px rgba(19, 194, 194, 0.2));
}

.rumor-school-link .el-icon {
  color: #fa8c16;
  filter: drop-shadow(0 2px 4px rgba(250, 140, 22, 0.2));
}

.data-link .el-icon {
  color: #eb2f96;
  filter: drop-shadow(0 2px 4px rgba(235, 47, 150, 0.2));
}

.about-link .el-icon {
  color: #52c41a;
  filter: drop-shadow(0 2px 4px rgba(82, 196, 26, 0.2));
}

.management-link .el-icon {
  color: #fa8c16;
  filter: drop-shadow(0 2px 4px rgba(250, 140, 22, 0.2));
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .nav-menu {
    gap: 16px;
    padding: 0 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      display: none;
    }
    
    &::after {
      display: none;
    }
  }
  
  .nav-link {
    font-size: 14px;
    padding: 6px 12px;
    white-space: nowrap;
  }
  
  .nav-link .el-icon {
    font-size: 16px;
  }
}

/* 深色模式适配 */
:deep(.dark) {
  .nav-menu::after {
    background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
  }
  
  .nav-link {
    color: var(--el-text-color-primary);
    
    &:hover,
    &.router-link-active {
      background: rgba(255, 255, 255, 0.05);
    }
    
    &::before {
      background: linear-gradient(135deg,
        rgba(var(--el-color-primary-rgb), 0.8),
        rgba(var(--el-color-success-rgb), 0.8)
      );
    }
  }
  
  .nav-link .el-icon {
    filter: brightness(1.2) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
}
</style> 