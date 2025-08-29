<script setup>
  import { getArgListApi } from '@/api/system'
  import { reactive, ref } from 'vue'
  import ArgOps from './components/ArgOps.vue'

  const query = reactive({
    name: '',
    configKey: '',
    pageNo: 1,
    pageSize: 3
  })

  const argList = ref([])
  const total = ref(null)
  getArgList()

  async function getArgList() {
    const resp = await getArgListApi(query)
    argList.value = resp.list
    total.value = resp.totals
  }

  // 每页编号的显示/生成规则
  const indexMethod = (i) => {
    return i + 1 + (query.pageNo - 1) * query.pageSize
  }

  // 搜索
  const onSearch = () => {
    if (query.name || query.configKey) {
      getArgList()
    }
  }

  // 重置
  const onReset = () => {
    if (query.name || query.configKey) {
      query.name = query.configKey = ''
      getArgList()
    }
  }

  const visible = ref(false)

  const arg = ref(null)

  const onOpen = (row) => {
    visible.value = true
    arg.value = row
  }
  const onClose = () => {
    visible.value = false
  }
</script>
<script>
  export default {
    name: 'ParameterPage'
  }
</script>

<template>
  <section class="bit-app-container">
    <el-form label-position="top" :inline="true">
      <el-form-item label="参数名称">
        <el-input
          placeholder="请输入参数名称"
          v-model.trim="query.name"
        />
      </el-form-item>
      <el-form-item label="参数键名">
        <el-input
          placeholder="请输入参数键名"
          v-model.trim="query.configKey"
        />
      </el-form-item>
      <el-form-item label="操作" class="nolabel">
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
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
        :cell-style="{
          textAlign: 'center'
        }"
        :header-cell-style="{
          textAlign: 'center'
        }"
        :data="argList"
      >
        <el-table-column
          label="参数编号"
          type="index"
          :index="indexMethod"
          width="180"
        />
        <el-table-column label="参数名称" prop="name" />
        <el-table-column label="参数键名" prop="configKey" />
        <el-table-column label="参数键值" prop="value" />
        <el-table-column label="备注">
          <template #default="{ row }">
            {{ row.remark || '无' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" link @click="onOpen(row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="query.pageNo"
        v-model:page-size="query.pageSize"
        :total="total"
        :page-sizes="[2, 3, 5]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="getArgList"
        @current-change="getArgList"
      />
    </div>

    <ArgOps
      v-model="visible"
      :arg="arg"
      @close="onClose"
      @success="getArgList"
    />
  </section>
</template>

<style lang="scss" scoped></style>
