<script setup>
  import Aside from './components/Aside.vue'
  import Header from './components/Header.vue'
</script>
<script>
  export default {
    name: 'LayoutPage'
  }
</script>
<template>
  <el-container class="layout">
    <el-aside width="208px">
      <!-- 左侧菜单栏组件 -->
      <Aside />
    </el-aside>
    <el-container class="main-container">
      <el-header>
        <!-- 右侧顶部栏组件 -->
        <Header />
      </el-header>
      <el-main>
        <!-- 右侧主体内容，二级路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<style lang="scss" scoped>
  .layout {
    width: 100vw;
    height: 100vh;
    background-color: #f7f7f7;
    .el-aside {
      overflow: auto;
      z-index: 2;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      box-shadow: 2px 0 6px rgba(0, 35, 45, 0.4);
      background-color: #fff;
    }
    .main-container {
      margin-left: 208px;
      height: 100vh;
      .el-header {
        height: 80px;
        background-color: #fff;
      }
      .el-main {
        box-sizing: border-box;
        overflow: auto;
        height: calc(100vh - 80px);
        padding: 12px 0 0 18px;
      }
    }
  }
</style>
