import { createRouter, createWebHistory } from 'vue-router'

// 创建路由实例
const router = createRouter({
  // 路由模式：历史模式路径后面不带 #
  history: createWebHistory(),
  // 路由表规则
  routes: [
    {
      // 根路径，重定向到登录
      path: '/',
      redirect: '/login'
    },
    {
      // 登录页
      path: '/login',
      component: () => import('@/views/Login/index.vue')
    },
    {
      // 主页
      path: '/',
      component: () => import('@/Layout/index.vue'),
      // 用来配置路由嵌套
      children: [
        {
          // 用户管理
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: {
            title: '用户管理',
            icon: 'user'
          }
        },
        {
          // 系统管理
          path: '/system',
          meta: {
            title: '系统管理',
            icon: 'system'
          },
          children: [
            {
              // 平台账号管理
              path: '/system/account',
              component: () =>
                import('@/views/System/Account/index.vue'),
              meta: {
                title: '平台账号设置',
                icon: 'tree'
              }
            },
            {
              // 字典设置
              path: '/system/dictionary',
              component: () =>
                import('@/views/System/Dictionary/index.vue'),
              meta: {
                title: '字典设置',
                icon: 'table'
              }
            },
            {
              // 参数设置
              path: '/system/parameter',
              component: () =>
                import('@/views/System/Parameter/index.vue'),
              meta: {
                title: '参数设置',
                icon: 'form'
              }
            },
            {
              // 字典详情页
              path: '/system/dictionaryDetail',
              component: () =>
                import('@/views/System/Dictionary/Detail.vue'),
              hidden: true
            }
          ]
        }
      ]
    },
    {
      // 401 错误页
      path: '/401',
      component: () => import('@/views/Error/401.vue')
    },
    {
      // 404 错误页
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/Error/404.vue')
    }
  ]
})

export default router
