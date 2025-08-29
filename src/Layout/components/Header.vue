<script setup>
  import { useUserStore } from '@/stores';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { useRouter } from 'vue-router';
  import { ROLE_MAP } from '@/constants';
  const userStore = useUserStore();
  const router = useRouter();

  // 退出
  const onLogout = async () => {
    try {
      await ElMessageBox.confirm(
        '要走了么？不爱了么？',
        '友情提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      );
      // 执行退出登录 action 函数
      await userStore.logoutAction();
      // 成功提示语
      ElMessage.success('退出成功');
      // 使用nextTick确保状态更新后再跳转
      router.push('/login');
    } catch (e) {
      ElMessage.info('已取消');
    }
  };
</script>
<script>
  export default {
    name: 'Header'
  };
</script>
<template>
  <section class="header">
    <div class="user">
      <p>欢迎你</p>
      <p>
        <span class="name">
          {{
            userStore.userInfo.nickName ||
            userStore.userInfo.userName
          }}
        </span>
        ，{{ ROLE_MAP[userStore.userInfo.identity] }}
      </p>
    </div>
    <div class="line"></div>
    <div class="logout-btn" @click="onLogout">
      <svg-icon name="logout" color="#A9ABB3" size="1.7" />
      <span class="text">退出</span>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 80px;
    font-size: 14px;
    .user {
      font-weight: 600;
      .name {
        color: #0fa1fe;
      }
    }
    .line {
      width: 1.5px;
      height: 16px;
      margin: 0 21px;
      background-color: #d8d8d8;
    }
    .logout-btn {
      display: flex;
      align-items: center;
      cursor: pointer;
      .text {
        margin: 0 34px 0 12px;
        color: #a9abb3;
      }
    }
  }
</style>