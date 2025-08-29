<script setup>
  import { getSysUserListApi } from '@/api/system'
  import { reactive, ref } from 'vue'
  import { ROLE_MAP } from '@/constants'
  import AccountOps from './components/AccountOps.vue'

  // 表单
  const accountForm = reactive({
    phoneNumber: '',
    status: ''
  })
  // 列表
  const accountList = ref([])
  getSysUserList()
  async function getSysUserList() {
    accountList.value = await getSysUserListApi(accountForm)
  }

  // 搜索
  const onSearch = () => {
    if (accountForm.phoneNumber || accountForm.status) {
      getSysUserList()
    }
  }

  // 重置
  const onReset = () => {
    if (accountForm.phoneNumber || accountForm.status) {
      accountForm.phoneNumber = accountForm.status = ''
      getSysUserList()
    }
  }

  // 控制(新增或编辑)对话框的可见性
  const visible = ref(false)

  const sysUser = ref(null)

  // 打开对话框
  const onOpen = (row) => {
    visible.value = true
    sysUser.value = {
      ...row,
      identity: row.identity.toLowerCase()
    }
  }

  // 关闭对话框
  const onClose = () => {
    visible.value = false
  }
</script>

<script>
  export default {
    name: 'AccountPage'
  }
</script>
<template>
  <section class="bit-app-container">
    <!-- 表单 -->
    <el-form label-position="top" :inline="true">
      <el-form-item label="用户手机号">
        <el-input
          type="number"
          placeholder="请输入手机号"
          v-model="accountForm.phoneNumber"
        />
      </el-form-item>
      <el-form-item label="用户状态">
        <el-select
          placeholder="请输入用户状态"
          v-model="accountForm.status"
        >
          <el-option value="enable">启用</el-option>
          <el-option value="disable">停用</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作" class="nolabel">
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="bit-table-box">
      <el-button
        type="primary"
        plain
        class="bit-btn-add"
        @click="onOpen(null)"
      >
        新增
      </el-button>
      <el-table
        :data="accountList"
        :cell-style="{
          textAlign: 'center'
        }"
        :header-cell-style="{
          textAlign: 'center'
        }"
      >
        <el-table-column label="序号" type="index" width="120" />
        <el-table-column label="用户角色">
          <template #default="{ row }">
            {{ ROLE_MAP[row.identity.toLowerCase()] }}
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phoneNumber" />
        <el-table-column label="用户昵称" prop="nickName" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" link @click="onOpen(row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增或编辑 -->
    <AccountOps
      v-model="visible"
      :sysUser="sysUser"
      @success="getSysUserList"
      @close="onClose"
    />
  </section>
</template>
<style lang="scss" scoped></style>
