import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores'
import router from '@/router'

// 创建 axios 实例
const instance = axios.create({
  // 基础地址
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 60000
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // config就是和此次请求相关的信息，包含请求地址，方法，参数，头等
    const userStore = useUserStore()
    const { token } = userStore
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 是否显示重新登录确认提示框
let isRelogin = false
// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 解构
    const { code, data, errMsg } = response.data
    if (code !== 200000) {
      // 统一的错误提示
      ElMessage.error(errMsg)
      // 返回一个失败态的 Promise 实例
      return Promise.reject(new Error(errMsg))
    }
    // 否则返回纯粹的 data 数据
    return data
  },
  async (error) => {
    // 所有的接口响应失败都必须先执行这里
    const { response, status } = error
    if (status === 401) {
      // token 过期
      const userStore = useUserStore()
      
      if (isRelogin) {
        // 如果已经弹出了登录框，则直接拒绝该请求
        return Promise.reject(new Error('token过期'))
      }
      
      isRelogin = true
      try {
        // 询问
        await ElMessageBox.confirm(
          '登录状态已过期,您可以继续留在当前页或重新登录',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        // 用户点击重新登录，清除token并跳转到登录页
        userStore.removeToken()
        userStore.removeUserInfo()
        // 跳转至登录页
        router.push('/login')
        return Promise.reject(new Error('token过期'))
      } catch (e) {
        // 用户点击取消按钮或关闭弹窗，清除token但保留在当前页面
        userStore.removeToken()
        userStore.removeUserInfo()
        ElMessage.info('已清除登录状态，页面功能可能受限')
        return Promise.reject(new Error('用户取消重新登录'))
      } finally {
        isRelogin = false
      }
    } else {
      const { code, errMsg } = response.data
      // 统一的错误提示
      ElMessage.error(errMsg)

      // 返回失败态的Promise实例，并携带错误信息
      return Promise.reject({
        code,
        errMsg
      })
    }
  }
)

// 导出一个自定义的请求函数
export default ({ url, method, data, params, header }) => {
  return instance({
    url, // 请求地址
    method, // 请求方式
    data, // 请求体参数
    params, // 请求路径参数
    header //
  })
}