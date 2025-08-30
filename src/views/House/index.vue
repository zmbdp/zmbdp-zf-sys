<script setup>
  import { getHouseListApi } from '@/api/house'
  import { reactive, ref } from 'vue'
  import { HOUSE_STATUS_MAP, HOUSE_RENT_TYPE_MAP } from '@/constants'
  import { useHouseStore } from '@/stores'
  import StatusOps from './components/StatusOps.vue'
  const houseStore = useHouseStore()
  houseStore.getCityListAction()

  const query = reactive({
    houseId: '',
    title: '',
    rentType: '',
    status: '',
    cityId: '',
    communityName: '',
    pageNo: 1,
    pageSize: 5
  })

  const houseList = ref([])
  const total = ref(null)
  getHouseList()

  async function getHouseList() {
    const resp = await getHouseListApi(query)
    houseList.value = resp.list
    total.value = resp.totals
  }

  const onSearch = () => {
    if (
      query.houseId ||
      query.cityId ||
      query.communityName ||
      query.status ||
      query.rentType ||
      query.title
    ) {
      getHouseList()
    }
  }
  const onReset = () => {
    if (
      query.houseId ||
      query.cityId ||
      query.communityName ||
      query.status ||
      query.rentType ||
      query.title
    ) {
      // 先清空
      query.houseId =
        query.title =
        query.rentType =
        query.status =
        query.cityId =
        query.communityName =
          ''
      // 再请求
      getHouseList()
    }
  }

  const visible = ref(false)

  const house = ref(null)

  const onOpen = (row) => {
    visible.value = true
    house.value = row
  }
  const onClose = () => {
    visible.value = false
    house.value = null
  }
</script>
<script>
  export default {
    name: 'HousePage'
  }
</script>

<template>
  <section class="bit-app-container house-page">
    <!-- 表单 -->
    <el-form label-position="top" :inline="true">
      <el-form-item label="房源ID">
        <el-input
          placeholder="请输入房源ID"
          v-model.trim="query.houseId"
        />
      </el-form-item>
      <el-form-item label="房源名称">
        <el-input
          placeholder="请输入房源名称"
          v-model.trim="query.title"
        />
      </el-form-item>
      <el-form-item label="房源类型">
        <el-select
          placeholder="请输入房源类型"
          v-model="query.rentType"
        >
          <!-- 
            v-for 既可以循环数组，也可以循环对象
            循环对象的时候：第一个变量是值，第二是键
          -->
          <el-option
            v-for="(value, key) in HOUSE_RENT_TYPE_MAP"
            :key="key"
            :value="key"
            :label="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="房源状态">
        <el-select
          placeholder="请输入房源状态"
          v-model="query.status"
        >
          <el-option
            v-for="(value, key) in HOUSE_STATUS_MAP"
            :key="key"
            :value="key"
            :label="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所在城市">
        <el-select
          placeholder="请输入所在城市"
          v-model="query.cityId"
        >
          <el-option
            v-for="city in houseStore.cityList"
            :key="city.id"
            :value="city.id"
            :label="city.fullName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所在小区">
        <el-input
          placeholder="请输入所在小区"
          v-model.trim="query.communityName"
        />
      </el-form-item>
      <el-form-item label="操作" class="nolabel">
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="bit-table-box">
      <el-button type="primary" plain class="bit-btn-add">
        <router-link to="/house/addOrEdit" class="link">
          新增
        </router-link>
      </el-button>
      <el-table :data="houseList">
        <el-table-column label="房源ID" prop="houseId" width="150" />
        <el-table-column label="房源类型" width="120">
          <template #default="{ row }">
            {{ HOUSE_RENT_TYPE_MAP[row.rentType] }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            {{ HOUSE_STATUS_MAP[row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="房东ID" prop="userId" width="120" />
        <el-table-column
          label="所在城市"
          prop="cityName"
          width="200"
        />
        <el-table-column
          label="所在区域"
          prop="regionName"
          width="120"
        />
        <el-table-column
          label="小区名称"
          prop="communityName"
          width="240"
        />
        <el-table-column label="房源名称" prop="title" width="200" />
        <el-table-column
          label="详细地址"
          prop="detailAddress"
          width="240"
        />
        <el-table-column label="价格" prop="price" width="120" />
        <el-table-column
          label="操作"
          fixed="right"
          min-width="280"
          align="center"
        >
          <template #default="{ row }">
            <div style="display: flex">
              <el-button type="primary" link>
                <router-link
                  :to="`/house/${row.houseId}`"
                  class="link"
                >
                  查看
                </router-link>
              </el-button>
              <el-button type="primary" link>
                <router-link
                  :to="`/house/addOrEdit/${row.houseId}`"
                  class="link"
                >
                  编辑
                </router-link>
              </el-button>
              <el-button type="primary" link @click="onOpen(row)">
                状态管理
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="query.pageNo"
        v-model:page-size="query.pageSize"
        :total="total"
        background
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="getHouseList"
        @size-change="getHouseList"
      />
    </div>
    <StatusOps
      v-model="visible"
      :house="house"
      @success="getHouseList"
      @close="onClose"
    />
  </section>
</template>

<style lang="scss" scoped>
  .house-page {
    .link {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 40px;
    }
  }
</style>
