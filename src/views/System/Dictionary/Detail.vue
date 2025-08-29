<script setup>
  import { getDictDataListApi } from '@/api/system'
  import { reactive, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import DictDataOps from './components/DictDataOps.vue'
  const route = useRoute()

  const query = reactive({
    value: '',
    typeKey: route.query.typeKey,
    pageNo: 1,
    pageSize: 3
  })

  // 字典详情(数据)列表
  const dictDataList = ref([])
  const total = ref(null)
  getDictDataList()

  // 获取字典详情（数据列表）
  async function getDictDataList() {
    const resp = await getDictDataListApi(query)
    dictDataList.value = resp.list
    total.value = resp.totals
  }

  // 每页编号的显示规则
  const indexMethod = (i) => {
    return i + 1 + (query.pageNo - 1) * query.pageSize
  }

  // 搜索
  const onSearch = () => {
    if (query.value) {
      getDictDataList()
    }
  }

  // 重置
  const onReset = () => {
    if (query.value) {
      query.value = ''
      getDictDataList()
    }
  }

  const visible = ref(false)
  const dictData = ref(null)

  const onOpen = (row) => {
    visible.value = true
    dictData.value = row
  }

  const onClose = () => {
    visible.value = false
  }
</script>
<script>
  export default {
    name: 'DictionaryDetail'
  }
</script>
<template>
  <section class="bit-app-container">
    <el-form label-position="top" :inline="true">
      <el-form-item label="字典名称">
        <el-input
          placeholder="请输入字典名称"
          v-model.trim="query.value"
        />
      </el-form-item>
      <el-form-item label="字典标签">
        <el-input
          placeholder="请输入字典标签"
          v-model="query.typeKey"
          disabled
        />
      </el-form-item>
      <el-form-item label="操作" class="nolabel">
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="bit-table-box">
      <el-button
        class="bit-btn-add"
        type="primary"
        plain
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
        :data="dictDataList"
      >
        <el-table-column
          label="字典编号"
          type="index"
          :index="indexMethod"
          width="150"
        />
        <el-table-column label="字典标签" prop="value" />
        <el-table-column label="字典键值" prop="dataKey" />
        <el-table-column label="排序" prop="sort" />
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
        @current-change="getDictDataList"
        @size-change="getDictDataList"
      />
    </div>
    <DictDataOps
      v-model="visible"
      @success="getDictDataList"
      @close="onClose"
      :dictData="dictData"
    />
  </section>
</template>
<style lang="scss" scoped></style>
