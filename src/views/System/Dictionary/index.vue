<script setup>
  import { getDictTypeListApi } from '@/api/system'
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import DictTypeOps from './components/DictTypeOps.vue'

  const query = reactive({
    value: '',
    typeKey: '',
    pageNo: 1,
    pageSize: 3
  })
  const router = useRouter()
  getDictTypeList()

  const dictTypeList = ref([])
  const total = ref(null)

  // 获取字典类型列表
  async function getDictTypeList() {
    const resp = await getDictTypeListApi(query)
    dictTypeList.value = resp.list
    total.value = resp.totals
  }

  // 每页索引的展示规则
  const indexMethod = (i) => {
    // i: 列表中每个数据的下标，从零开始
    return i + 1 + query.pageSize * (query.pageNo - 1)
  }

  const visible = ref(false)

  const dict = ref(null)
  // 打开对话框
  const onOpen = (row) => {
    visible.value = true
    dict.value = row
  }

  // 关闭对话框
  const onClose = () => {
    visible.value = false
  }

  // 搜索
  const onSearch = () => {
    if (query.value || query.typeKey) {
      getDictTypeList()
    }
  }

  // 重置
  const onReset = () => {
    if (query.value || query.typeKey) {
      query.value = query.typeKey = ''
      getDictTypeList()
    }
  }
</script>
<script>
  export default {
    name: 'DictionaryPage'
  }
</script>

<template>
  <section class="bit-app-container">
    <el-form :inline="true" label-position="top">
      <el-form-item label="字典名称">
        <el-input
          placeholder="请输入字典名称"
          v-model.trim="query.value"
        />
      </el-form-item>
      <el-form-item label="字典类型">
        <el-input
          placeholder="请输入字典类型"
          v-model.trim="query.typeKey"
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
        :data="dictTypeList"
      >
        <el-table-column
          label="编号"
          type="index"
          width="120"
          :index="indexMethod"
        />
        <el-table-column label="字典名称" prop="value" />
        <el-table-column label="字典类型">
          <template #default="{ row }">
            <div
              class="link-type"
              @click="
                router.push(
                  '/system/dictionary/listType?typeKey=' + row.typeKey
                )
              "
            >
              {{ row.typeKey }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" />
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
        :page-sizes="[2, 3, 5, 8]"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="getDictTypeList"
        @current-change="getDictTypeList"
      />
    </div>

    <!-- 字典新增或编辑组件 -->
    <DictTypeOps
      v-model="visible"
      :dict="dict"
      @success="getDictTypeList"
      @close="onClose"
    />
  </section>
</template>

<style lang="scss" scoped></style>
