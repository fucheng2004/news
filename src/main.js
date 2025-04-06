import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'  // 如果有全局样式

const app = createApp(App)

// 添加一些调试信息
console.log('Vue app created')

app.use(router)
console.log('Router installed')

app.mount('#app')
console.log('App mounted') 