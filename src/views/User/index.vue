<script setup>
  import { getAppUserListApi } from '@/api/user'
  import { reactive, ref } from 'vue'
  const userForm = reactive({
    userId: '',
    phoneNumber: '',
    nickName: '',
    pageNo: 1,
    pageSize: 5
  })

  // 应用用户列表
  const appUserList = ref([])
  // 数据总条数
  const total = ref(null)
  getAppUserList()

  async function getAppUserList() {
    const resp = await getAppUserListApi(userForm)
    appUserList.value = resp.list
    total.value = resp.totals
  }

  // 搜索
  const onSearch = () => {
    if (
      userForm.userId ||
      userForm.phoneNumber ||
      userForm.nickName
    ) {
      getAppUserList()
    }
  }

  // 重置
  const onReset = () => {
    if (
      userForm.userId ||
      userForm.phoneNumber ||
      userForm.nickName
    ) {
      userForm.userId = userForm.phoneNumber = userForm.nickName = ''
      getAppUserList()
    }
  }
</script>
<script>
  export default {
    name: 'UserPage'
  }
</script>
<template>
  <section class="bit-app-container">
    <!-- 表单 -->
    <el-form :inline="true" label-position="top">
      <el-form-item label="用户ID">
        <el-input
          type="number"
          placeholder="请输入用户ID"
          v-model="userForm.userId"
        />
      </el-form-item>
      <el-form-item label="用户手机号">
        <el-input
          type="number"
          placeholder="请输入用户手机号"
          v-model="userForm.phoneNumber"
        />
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input
          placeholder="请输入用户昵称"
          v-model.trim="userForm.nickName"
        />
      </el-form-item>
      <el-form-item label="操作" class="nolabel">
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="bit-table-box">
      <!-- 表格 -->
      <el-table
        :data="appUserList"
        :cell-style="{
          textAlign: 'center'
        }"
        :header-cell-style="{
          textAlign: 'center'
        }"
      >
        <el-table-column label="用户ID" prop="userId" />
        <el-table-column label="用户头像">
          <template #default="{ row }">
            <el-avatar :size="36" :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column label="用户昵称" prop="nickName" />
        <el-table-column label="手机号">
          <template #default="{ row }">
            {{ row.phoneNumber || '无' }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
        v-model:current-page="userForm.pageNo"
        v-model:page-size="userForm.pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5, 8, 10, 20]"
        @size-change="getAppUserList"
        @current-change="getAppUserList"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
