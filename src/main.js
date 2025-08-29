/** @format */

import { createApp } from 'vue'
// 导入 ElementPlus 组件库
import ElementPlus from 'element-plus'
// 导入 ElementPlus 的中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 导入组件库样式
import 'element-plus/dist/index.css'

import App from './App.vue'
// 导入 ElementPlus 图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入 index.scss
import '@/styles/index.scss'

// 导入 pinia 实例
import pinia from '@/stores'
// 导入 router 实例
import router from '@/router'

// 导入 SvgIcon 图标组件
import SvgIcon from '@/components/SvgIcon.vue'
// 导入 ImageUpload 上传组件
import ImageUpload from '@/components/ImageUpload.vue'
// 导入插件注册图标代码
import 'virtual:svg-icons-register'

// 导入权限控制模块
import '@/permission'

const app = createApp(App)
// 全局注册图标组件
app.component(SvgIcon.name, SvgIcon)
app.component(ImageUpload.name, ImageUpload)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  // 全局注册所有图标组件
  app.component(key, component)
}
// 全局注册 ElementPlus 的所有组件
app.use(ElementPlus, {
  locale: zhCn
})
// 注册 pinia 实例
app.use(pinia)
// 注册 router 实例
app.use(router)
app.mount('#app')
