// 导入创建 pinia 实例的函数
import { createPinia } from 'pinia'
// 导入 pinia 状态持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 调用函数，创建实例
const pinia = createPinia()
// pinia注册该插件
pinia.use(piniaPluginPersistedstate)
// 导出 pinia 实例
export default pinia

// 导出 user 模块下的所有成员
export * from './modules/user'

// 等同于下面两行代码

// import { useUserStore } from './modules/user'
// export { useUserStore }
