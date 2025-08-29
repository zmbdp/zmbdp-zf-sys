<template>
  <section class="aside">
    <!-- logo图片 -->
    <div class="logo-box">
      <img
        src="@/assets/images/logo-aside.png"
        alt="logo-aside"
        width="158"
        height="30"
      />
    </div>
    <!-- 左侧菜单 -->
    <el-menu
      :default-active="route.path"
      router
      :default-openeds="['/system']"
    >
      <template v-for="item in showRoutes" :key="item.path">
        <!-- 有子菜单用 el-sub-menu 这套结构 -->
        <el-sub-menu :index="item.path" v-if="item.children">
          <template #title>
            <svg-icon :name="item.meta.icon" />
            <span class="title">{{ item.meta.title }}</span>
          </template>
          <el-menu-item
            v-for="subItem in item.children"
            :key="subItem.path"
            :index="subItem.path"
          >
            <svg-icon
              v-if="subItem.meta.icon"
              :name="subItem.meta.icon"
              :color="route.path === subItem.path ? '#0FA1FE' : ''"
            />

            <span class="title">{{ subItem.meta.title }}</span>
          </el-menu-item>
        </el-sub-menu>
        <!-- 没有子菜单，直接用 el-menu-item 这套结构 -->
        <el-menu-item :index="item.path" v-else>
          <svg-icon
            :name="item.meta.icon"
            :color="route.path === item.path ? '#0FA1FE' : ''"
          />
          <span class="title">{{ item.meta.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </section>
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router'
  import { computed } from 'vue'
  // router 是路由实例
  const router = useRouter()
  // route 是当前显示/激活 的路由规则对象（代表的某个具体的路由规则）
  const route = useRoute()

  // 计算得到需要展示的 Layout 下的所有路由规则
  const showRoutes = computed(() => {
    // 筛选得到 Layout 路由规则
    const [layoutRoute] = router.options.routes.filter(
      (route) => route.children
    )
    // 获取 Layout 路由的 children
    const layoutChildren = layoutRoute.children

    // 过去掉 layoutChildren 下 hidden 为 true 的路由(hidden为true代表隐蔽)

    // 展示的路由结果
    const newChildren = []

    for (let i = 0, length = layoutChildren.length; i < length; i++) {
      const item = layoutChildren[i]
      // 如果没有隐藏
      if (!item.hidden) {
        // 如果配置了 children ，并且 children 里有路由规则
        if (item.children && item.children.length > 0) {
          const childrenList = []
          // 遍历内层 children，做同样的处理
          for (let j = 0, len = item.children.length; j < len; j++) {
            const child = item.children[j]
            if (!child.hidden) {
              childrenList.push(child)
            }
          }
          item.children = childrenList
        }
        // 添加值结果数组
        newChildren.push(item)
      }
    }
    // 返回展示的结果作为 showRoutes 的值（计算属性内部必须有返回值）
    return newChildren
  })
</script>

<script>
  export default {
    name: 'Aside'
  }
</script>

<style lang="scss" scoped>
  .aside {
    padding-top: 26px;
    .logo-box {
      text-align: center;
    }
    .el-menu {
      margin-top: 12px;
      border-right: 0;
      ::v-deep(.el-sub-menu) {
        .el-menu-item {
          margin-left: 10px;
        }
      }
      .el-menu-item {
        height: 52px;
        border-radius: 10px;
        color: #222 !important;
        background-color: white !important;
        font-weight: 500;
        font-size: 15px;
      }
      .el-menu-item:hover {
        color: #666666 !important;
        background-color: #ebf2fc !important;
      }
      .el-menu-item.is-active {
        color: #0fa1fe !important;
        background: #fff !important;
      }
      ::v-deep(.el-sub-menu__title:hover) {
        color: #222;
        background-color: white;
        font-weight: 500;
      }
      ::v-deep(.el-sub-menu__title) {
        height: 52px;
        color: #222;
        background-color: white;
        font-weight: 500;
        font-size: 15px;
      }
      .title {
        margin-left: 6px;
      }
    }
  }
</style>
