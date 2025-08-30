<script setup>
  import { useHouseStore } from '@/stores'
  import {
    HOUSE_RENT_TYPE_MAP,
    ROOM_NUM_MAP,
    POSITION_LIST_MAP,
    HOUSE_TAG_MAP,
    DEVICE_LIST_MAP
  } from '@/constants'
  import { reactive, ref } from 'vue'
  import {
    getChildrenRegionApi,
    postHouseApi,
    getHouseDetailApi
  } from '@/api/house'
  import { ElMessage } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'
  import { IMAGE_HOST } from '@/constants'
  const route = useRoute()
  const router = useRouter()
  // 房源表单对象
  const houseForm = reactive({
    title: '',
    cityId: '',
    regionId: '',
    communityName: '',
    detailAddress: '',
    rentType: '',
    rooms: '',
    floor: '',
    allFloor: '',
    area: '',
    position: '',
    userId: '',
    price: '',
    houseType: '',
    intro: '',
    tagCodes: [],
    devices: [],
    images: []
  })

  const houseRules = {
    title: [
      { required: true, message: '请输入房源名称', trigger: 'blur' },
      {
        min: 2,
        max: 30,
        message: '房源名称长度在2-30个字符之间',
        trigger: 'blur'
      }
    ],
    cityId: [
      { required: true, message: '请选择所在城市', trigger: 'change' }
    ],
    regionId: [
      { required: true, message: '请选择所在区县', trigger: 'change' }
    ],
    communityName: [
      {
        required: true,
        message: '请输入所在小区名称',
        trigger: 'blur'
      },
      {
        min: 2,
        max: 30,
        message: '小区名称长度在2-30个字符之间',
        trigger: 'blur'
      }
    ],
    detailAddress: [
      { required: true, message: '请输入详细地址', trigger: 'blur' },
      {
        min: 5,
        max: 50,
        message: '详细地址长度在5-50个字符之间',
        trigger: 'blur'
      }
    ],
    rentType: [
      { required: true, message: '请选择出租类型', trigger: 'change' }
    ],
    rooms: [
      { required: true, message: '请选择居室', trigger: 'change' }
    ],
    floor: [
      { required: true, message: '请输入所在楼层', trigger: 'blur' },
      {
        pattern: /^[1-9]\d?$/,
        message: '楼层只能由1-2位数字组成',
        trigger: 'blur'
      }
    ],
    allFloor: [
      { required: true, message: '请输入总楼层', trigger: 'blur' },
      {
        pattern: /^[1-9]\d?$/,
        message: '总楼层只能由1-2位数字组成',
        trigger: 'blur'
      }
    ],
    area: [
      { required: true, message: '请输入房屋面积', trigger: 'blur' },
      {
        pattern: /^[1-9]\d{0,2}(\.[1-9])?$/,
        message: '房屋面积由1-3位整数或小数组成',
        trigger: 'blur'
      }
    ],
    position: [
      { required: true, message: '请选择房屋朝向', trigger: 'change' }
    ],
    userId: [
      { required: true, message: '请输入房东ID', trigger: 'blur' },
      {
        pattern: /^[1-9]\d*$/,
        message: '房东ID至少是1位数字组成',
        trigger: 'blur'
      }
    ],
    price: [
      { required: true, message: '请输入房屋价格', trigger: 'blur' },
      {
        pattern: /^[1-9]\d{2,}$/,
        message: '房屋价格至少是3位整数',
        trigger: 'blur'
      }
    ],
    houseType: [
      { required: true, message: '请输入房屋类型', trigger: 'blur' }
    ],
    intro: [
      { required: true, message: '请输入房屋介绍', trigger: 'blur' }
    ]
  }

  const childrenRegion = ref([])
  // 选择城市变化时
  const onCityChange = async (cityId) => {
    if (typeof cityId !== 'number') {
      childrenRegion.value = []
      return
    }
    childrenRegion.value = await getChildrenRegionApi(cityId)
  }

  const houseStore = useHouseStore()

  const houseFormRef = ref(null)

  // 提交
  const onSubmit = () => {
    // 做校验
    houseFormRef.value.validate(async (valid) => {
      if (!valid) return
      // 判断房源标签、设备列表、图片是否有值
      const { tagCodes, devices, images } = houseForm
      if (!tagCodes.length) return ElMessage.error('请选择房源标签')
      if (!devices.length) return ElMessage.error('请选择设备列表')
      if (!images.length) return ElMessage.error('请上传房屋图片')
      // 获取城市名称
      const city = houseStore.cityList.find(
        (item) => item.id === houseForm.cityId
      )
      // 获取区县名称及经纬度
      const { name, longitude, latitude } = childrenRegion.value.find(
        (item) => item.id === houseForm.regionId
      )
      console.log(`output-city`, city)
      console.log(city.name)
      // 调用新增或编辑房源接口
      await postHouseApi({
        ...houseForm,
        headImage: images[0],
        cityName: city.name,
        regionName: name,
        longitude,
        latitude
      })

      // 成功提示
      ElMessage.success(
        route.params.houseId ? '编辑成功' : '新增成功'
      )
      // 回到房源列表页(路由返回)
      setTimeout(() => {
        router.back()
        // router.go(-1)
      }, 1000)
    })
  }

  // 获取房源详情
  getHouseDetail()

  async function getHouseDetail() {
    // 获取路由参数（houseId)
    const { houseId } = route.params
    if (!houseId) return
    // 根据 houseId 获取房源详情
    const resp = await getHouseDetailApi(houseId)

    // 根据 resp.cityId 获取当前城市的区县列表
    onCityChange(resp.cityId)

    // 根据后台响应的 resp 房源详情对象，给 houseForm 表单赋值（回显）

    Object.keys(resp).forEach((key) => {
      houseForm[key] = resp[key]
    })

    houseForm.images = resp.images.map((url) =>
      url.startsWith('http') ? url : IMAGE_HOST + url
    )
    // 单独处理 tagCodes 和 devices 数组
    houseForm.tagCodes = resp.tags.map((item) => item.tagCode)
    houseForm.devices = resp.devices.map((item) => item.deviceCode)
  }
</script>
<script>
  export default {
    name: 'AddOrEditPage'
  }
</script>

<template>
  <section class="bit-app-container houseAddOrEdit-page">
    <el-card>
      <template #header>
        <h2 class="title">房源信息</h2>
      </template>
      <el-form
        label-position="top"
        :model="houseForm"
        :rules="houseRules"
        hide-required-asterisk
        ref="houseFormRef"
      >
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="房源名称" prop="title">
              <el-input
                placeholder="请输入房源名称"
                v-model.trim="houseForm.title"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="所在城市" prop="cityId">
              <el-select
                placeholder="请选择所在城市"
                v-model="houseForm.cityId"
                @change="onCityChange"
                clearable
              >
                <el-option
                  v-for="item in houseStore.cityList"
                  :key="item.id"
                  :label="item.fullName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="所在区县" prop="regionId">
              <el-select
                placeholder="请选择所在区县"
                clearable
                v-model="houseForm.regionId"
              >
                <el-option
                  v-for="item in childrenRegion"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  clearable
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="小区名称" prop="communityName">
              <el-input
                placeholder="请输入小区名称"
                v-model.trim="houseForm.communityName"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="详细地址" prop="detailAddress">
              <el-input
                placeholder="请输入小区详细地址"
                v-model.trim="houseForm.detailAddress"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="房源类型" prop="rentType">
              <el-select
                placeholder="请选择房源类型"
                v-model="houseForm.rentType"
                clearable
              >
                <el-option
                  v-for="(value, key) in HOUSE_RENT_TYPE_MAP"
                  :key="key"
                  :label="value"
                  :value="key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="居室" prop="rooms">
              <el-select
                placeholder="请选择居室"
                v-model="houseForm.rooms"
                clearable
              >
                <el-option
                  v-for="(value, key) in ROOM_NUM_MAP"
                  :key="key"
                  :label="value"
                  :value="key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所在楼层" prop="floor">
              <el-input
                placeholder="请输入所在楼层"
                v-model.trim="houseForm.floor"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总楼层" prop="allFloor">
              <el-input
                placeholder="请输入总楼层"
                v-model.trim="houseForm.allFloor"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="面积" prop="area">
              <el-input
                placeholder="请输入面积"
                v-model.trim="houseForm.area"
                clearable
              >
                <template #append>㎡</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="朝向" prop="position">
              <el-select
                placeholder="请选择朝向"
                v-model="houseForm.position"
                clearable
              >
                <el-option
                  v-for="(value, key) in POSITION_LIST_MAP"
                  :key="key"
                  :label="value"
                  :value="key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="房东ID" prop="userId">
              <el-input
                placeholder="请输入房东ID"
                v-model.trim="houseForm.userId"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="价格" prop="price">
              <el-input
                placeholder="请输入价格"
                v-model.trim="houseForm.price"
                clearable
              >
                <template #append>元/月</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="户型" prop="houseType">
              <el-input
                placeholder="请输入户型"
                v-model.trim="houseForm.houseType"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="房源介绍" prop="intro">
              <el-input
                v-model.trim="houseForm.intro"
                clearable
                placeholder="请输入房源介绍"
                style="width: 100%"
                type="textarea"
                :rows="4"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <template #header>
        <h2 class="title">房源标签</h2>
      </template>
      <el-checkbox-group v-model="houseForm.tagCodes">
        <el-checkbox
          v-for="(value, key) in HOUSE_TAG_MAP"
          :key="key"
          :label="value"
          :value="key"
        />
      </el-checkbox-group>
    </el-card>
    <el-card>
      <template #header>
        <h2 class="title">房源设备列表</h2>
      </template>
      <el-checkbox-group v-model="houseForm.devices">
        <el-checkbox
          v-for="(value, key) in DEVICE_LIST_MAP"
          :key="key"
          :label="value"
          :value="key"
        />
      </el-checkbox-group>
    </el-card>
    <el-card>
      <template #header>
        <h2 class="title">房屋图片</h2>
      </template>
      <!-- 使用图片上传组件 -->
      <image-upload
        v-model="houseForm.images"
        :fileSize="5"
        :fileType="['png', 'jpg', 'jpeg']"
        :limit="5"
      />
    </el-card>
    <div class="btn-box">
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .houseAddOrEdit-page {
    padding-bottom: 60px;
    .el-card {
      padding: 10px 5px;
      margin-bottom: 15px;

      .title {
        font-size: 17px;
        color: #222;
        font-weight: 600;
      }
      ::v-deep(.el-form-item) {
        .el-form-item__label {
          color: #222;
          font-weight: 600;
        }
      }
    }

    .btn-box {
      z-index: 99;
      display: flex;
      align-items: center;
      position: fixed;
      left: 226px;
      bottom: 0;
      width: 100%;
      height: 80px;
      padding: 0 20px;
      border-top: 10px solid #f7f7f7;
      background-color: #fff;
    }
  }
</style>
