import { useUserStore } from '@/stores'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router'

// 白名单：不需要登录就可以访问的路由路径
const whiteList = ['/login', '/401']

// 全局前置守卫：每个路由再被访问之前必须经过当前函数的处理
router.beforeEach((to, from, next) => {
  // to: 要去的路由规则对象
  // from：从哪个路由规则过来的
  // next：决定是否放行/通过的函数，非常关键；只有调用了 next 函数才表示放行，否则页面展示空白（代表访问不通过）

  // 页面访问之前开启进度条
  NProgress.start()
  const userStore = useUserStore()
  // 获取用户 token
  if (userStore.token) {
    // 登录了
    if (to.path === '/login') {
      // 如果还要去登录，没有必要去了，让其去到主页默认的用户管理页面
      next('/user')
    } else {
      // 放行
      next()
    }
  } else {
    // 没有登录
    if (whiteList.includes(to.path)) {
      // 要访问的路由在白名单数组中（白名单中的路由无需登录）
      // 放行
      next()
    } else {
      // 说明当前要去的路由需要登录，让用户去登录。并且带上回跳地址（增强用户体验）
      next(`/login?redirectUrl=${to.path}`)
    }
  }
  // 判断是否存在 token
  // 1）有：放行
  // 2）没有：
  //    1）判断要去的路由是否需要登录
  //      1）不需要：放行
  //      2）需要：重新登录
})

// 全局后置守卫：关闭进度条
router.afterEach(() => {
  NProgress.done()
})
